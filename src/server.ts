import { config } from "dotenv";
import { createServer } from "http";
import { requestListener } from "./router/router";

config();

const hostname = process.env.HOST;
const port = Number(process.env.PORT);
const server = createServer(requestListener);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
