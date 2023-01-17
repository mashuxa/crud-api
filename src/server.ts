import { config } from "dotenv";
import { createServer as createHttpServer, request as httpRequest, Server } from "http";
import cluster, { Worker } from "cluster";
import { cpus } from "os";
import { requestListener } from "./router/router";

config();

const host = process.env.HOST;
const port = Number(process.env.PORT);
const isMultiMode = process.env.build === 'multi';

const createServer = (): Server => {
  if (cluster.isPrimary && isMultiMode) {
    const numCpus = cpus().length;
    const workers: Worker[] = [];

    for (let i = 1; i <= numCpus; i++) {
      const childWorker = cluster.fork({ HOST: host, PORT: port + i });

      workers.push(childWorker);
      childWorker.on('message', (data) => {
        workers.forEach((worker) => worker.send(data));
      });
    }

    cluster.on('exit', (worker, code) => {
      console.log(`Worker ${worker.id} finished. Exit code: ${code}`);
    });

    let i = 1;
    const server = createHttpServer(async (request, response) => {
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

    return server;
  } else {
    const server = createHttpServer(requestListener);

    server.listen(port, host, () => {
      console.log(`Server running at http://${host}:${port}/`);
    });

    return server;
  }
};

const server = createServer();

export default server;
