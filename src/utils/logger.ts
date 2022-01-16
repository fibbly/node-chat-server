import logger from "pino";
import moment from "moment";

const Logger = logger({
	prettifier: true,
	transport: {
		target: "pino-pretty",
	},
	base: {
		pid: false,
	},
	timestamp: () => `,"time":"${moment().format()}"`,
});

export default Logger;
