import express, { Application } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import config from "config";
import { version } from "../package.json";
import logger from "./utils/logger";
import socket from "./socket";

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

app.get("/", (_, res) =>
	res.send(`Server is up and running version ${version}!`)
);

httpServer.listen(port, host, () => {
	logger.info(`🚀 Server version ${version} listening on port: ${port} 🚀`);
	logger.info(`http://${host}:${port}`);
	socket({ io });
});
