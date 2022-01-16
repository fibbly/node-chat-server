import ServerConfig from "../types/config";

const ServerConfig: ServerConfig = {
	corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
	port: Number(process.env.PORT) || 8080,
	host: process.env.HOST || "localhost",
};

export default ServerConfig;
