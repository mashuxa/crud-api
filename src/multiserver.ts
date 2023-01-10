import { config } from "dotenv";
import { createServer, request as httpRequest } from "http";
import cluster from "cluster";
import { cpus } from "os";
import { IUser } from "./userService/types";

config();

const host = process.env.HOST;
const port = Number(process.env.PORT);
const numCpus = cpus().length;
export const db: Map<string, IUser> = new Map();

if (cluster.isPrimary) {
  cluster.setupPrimary({ exec: './src/server.ts' });

  for (let i = 1; i <= numCpus; i++) {
    cluster.fork({ HOST: host, PORT: port + i });
  }

  cluster.on('exit', (worker, code) => {
    console.log(`Worker ${worker.id} finished. Exit code: ${code}`);
  });

  let i = 1;
  const server = createServer(async (request, response) => {
    const options = {
      hostname: host,
      port: port + i,
      path: request.url,
      method: request.method,
      headers: request.headers,
    };
    const requestToChildProcess = httpRequest(options, (responseFromChildProcess) => {
      response.statusCode = responseFromChildProcess.statusCode || 500;
      responseFromChildProcess.on('data', chunk => {
        response.write(chunk);
      });
      responseFromChildProcess.on('end', () => {
        response.end();
      });
    });

    request.on("data", chunk => {
      requestToChildProcess.write(chunk);
    });
    request.on("end", () => {
      requestToChildProcess.end();
    });

    i === numCpus ? i = 1 : i++;
  });

  server.listen(port, host, () => {
    console.log(`Multi server running at http://${host}:${port}/`);
  });
}
