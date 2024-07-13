const db_connect = require("./db/connection")
const app = require("./app");
const http = require("http");
const httpServer = http.createServer(app);
const config = require("./config/index");

db_connect &&
httpServer.listen(config.db_port, async () => {
	console.log("Server is listening to port: ", config.db_port);
});






