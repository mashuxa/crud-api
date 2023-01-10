import { config } from "dotenv";
import { createServer } from "http";
import { requestListener } from "./router/router";

config();

const host = process.env.HOST;
const port = Number(process.env.PORT);
const server = createServer(requestListener);

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});
