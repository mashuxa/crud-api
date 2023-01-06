import { config } from "dotenv";
import { createServer } from "http";
import requestHandler from "./requestHandler";

config();

const hostname = process.env.HOST;
const port = Number(process.env.PORT);
const server = createServer(requestHandler);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});