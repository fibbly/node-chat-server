import { Server, Socket } from "socket.io";
import logger from "./utils/logger";
import {
	userJoin,
	getCurrentUser,
	userLeaves,
	getRoomUsers,
} from "./utils/users";
import User from "../types/user";
import formatMessage from "./utils/messages";

const EVENTS = {
	connection: "connection",
	CLIENT: {
		CREATE_ROOM: "CREATE_ROOM",
	},
};

function socket({ io }: { io: Server }) {
	logger.info("Sockets enabled");

	io.on(EVENTS.connection, (socket: Socket) => {
		logger.info(`User connected: ${socket.id}`);
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
