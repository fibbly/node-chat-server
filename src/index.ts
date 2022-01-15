import path from "path";
import express, { Application, Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import config from "config";
import { version } from "../package.json";
import formatMessage from "./utils/messages";
import {
	userJoin,
	getCurrentUser,
	userLeaves,
	getRoomUsers,
} from "./utils/users";
import User from "../types/user";

const port: number = config.get<number>("port");
const host: string = config.get<string>("host");
const corsOrigin: string = config.get<string>("corsOrigin");

const app: Application = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
	cors: {
		origin: corsOrigin,
		credentials: true,
	},
});

app.use(express.static(path.join(__dirname, "public")));

const botName = "Chat Bot";

// Client connection
io.on("connection", (socket: Socket) => {
	// User joined room
	socket.on("joinRoom", ({ username, room }) => {
		const user: User = userJoin(socket.id, username, room);

		socket.join(user.room);

		// Welcome current user
		socket.emit("message", formatMessage(botName, "Welcome to the chat!"));

		// Broadcast when user connects
		socket.broadcast
			.to(user.room)
			.emit(
				"message",
				formatMessage(botName, `${user.username} user has joined the chat`)
			);

		// Send users and room info
		io.to(user.room).emit("roomUsers", {
			room: user.room,
			users: getRoomUsers(user.room),
		});
	});

	// Listen for chat message
	socket.on("chatMessage", (message) => {
		const user = getCurrentUser(socket.id);
		io.to(user.room).emit("message", formatMessage(user.username, message));
	});

	// User disconnects
	socket.on("disconnect", () => {
		const user: User = userLeaves(socket.id);
		if (user) {
			io.to(user.room).emit(
				"message",
				formatMessage(botName, `${user.username} has left the chat`)
			);
			// Send users and room info
			io.to(user.room).emit("roomUsers", {
				room: user.room,
				users: getRoomUsers(user.room),
			});
		}
	});
});

httpServer.listen(port, host, () => {
	console.log(`🚀 Server version ${version} listening on port: ${port} 🚀`);
	console.log(`http://${host}:${port}`);
});
