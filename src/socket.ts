import { Server, Socket } from "socket.io";
import logger from "./utils/logger";
import { nanoid } from "nanoid";
import Room from "../types/room";
import moment from "moment";

const EVENTS = {
	connection: "connection",
	CLIENT: {
		CREATE_ROOM: "CREATE_ROOM",
		SEND_MESSAGE: "SEND_MESSAGE",
		JOIN_ROOM: "JOIN_ROOM",
	},
	SERVER: {
		ROOMS: "ROOMS",
		JOINED_ROOM: "JOINED_ROOM",
		ROOM_MESSAGE: "ROOM_MESSAGE",
	},
};

const rooms: Record<string, Room> = {};

function socket({ io }: { io: Server }) {
	logger.info("Sockets enabled");

	io.on(EVENTS.connection, (socket: Socket) => {
		logger.info(`User connected: ${socket.id}`);

		socket.emit(EVENTS.SERVER.ROOMS, rooms);

		/**
		 * User Creates New Chat Room
		 */
		socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
			console.log({ roomName });
			// create a new chat room
			const roomId = nanoid();
			rooms[roomId] = {
				roomName: roomName,
			};
			socket.join(roomId);
			// broadcast an event to notify a new room has been created
			socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);
			// emit event back to the room creator with a list of all chat rooms
			socket.emit(EVENTS.SERVER.ROOMS, rooms);
			// emit event back to the room creator to notify chat room joined
			socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
		});

		/**
		 * User Sends Message to Chat Room
		 */
		socket.on(EVENTS.CLIENT.SEND_MESSAGE, ({ roomId, message, username }) => {
			socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
				message,
				username,
				time: moment().format("h:mm a"),
			});
		});

		/**
		 * User Joins a Chat Room
		 */
		socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
			socket.join(roomId);
			socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
		});
	});

	// const botName = "Chat Bot";

	// // User joined room
	// socket.on("joinRoom", ({ username, room }) => {
	// 	const user: User = userJoin(socket.id, username, room);

	// 	socket.join(user.room);

	// 	// Welcome current user
	// 	socket.emit("message", formatMessage(botName, "Welcome to the chat!"));

	// 	// Broadcast when user connects
	// 	socket.broadcast
	// 		.to(user.room)
	// 		.emit(
	// 			"message",
	// 			formatMessage(botName, `${user.username} user has joined the chat`)
	// 		);

	// 	// Send users and room info
	// 	io.to(user.room).emit("roomUsers", {
	// 		room: user.room,
	// 		users: getRoomUsers(user.room),
	// 	});
	// });

	// // Listen for chat message
	// socket.on("chatMessage", (message) => {
	// 	const user = getCurrentUser(socket.id);
	// 	io.to(user.room).emit("message", formatMessage(user.username, message));
	// });

	// // User disconnects
	// socket.on("disconnect", () => {
	// 	const user: User = userLeaves(socket.id);
	// 	if (user) {
	// 		io.to(user.room).emit(
	// 			"message",
	// 			formatMessage(botName, `${user.username} has left the chat`)
	// 		);
	// 		// Send users and room info
	// 		io.to(user.room).emit("roomUsers", {
	// 			room: user.room,
	// 			users: getRoomUsers(user.room),
	// 		});
	// 	}
	// });
}

export default socket;
