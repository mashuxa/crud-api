import { getEndpointIds, isMatchEndpoint } from "../utils/routerUtils/routerUtils";
import { Route, Routes, MethodType } from "./types";
import { RequestListener } from "http";

const UUID_REGEXP = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/gm;
const ENDPOINT = '/api/users';
const ENDPOINT_WITH_ID = `${ENDPOINT}/:userId`;
const routes: Routes = {
  get: {
    [ENDPOINT]: console.log,
    [ENDPOINT_WITH_ID]: console.log,
  },
  post: {
    [ENDPOINT]: console.log,
  },
  put: {
    [ENDPOINT_WITH_ID]: console.log,
  },
  delete: {
    [ENDPOINT_WITH_ID]: console.log,
  },
};

export const requestListener: RequestListener = async (request, response) => {
    const endpoints: Route = routes[request.method?.toLowerCase() as MethodType] || {};
    const [rout, callback] = Object.entries(endpoints).find(([endpoint]) => request.url && isMatchEndpoint(endpoint, request.url)) || [];

    response.setHeader('Content-Type', 'application/json');

    if (rout && callback && request.url) {
      try {
        const ids = getEndpointIds(rout, request.url);
        const buffers = [];

        if (!UUID_REGEXP.test(ids.userId)) {
          response.statusCode = 400;
          response.end('Incorrect uuid');

          return;
        }

        for await (const chunk of request) {
          buffers.push(chunk);
        }

        const data = JSON.parse(Buffer.concat(buffers).toString());

        callback(data, ids);
        response.statusCode = 200;
        response.end('Success');
``
      } catch (e) {
        response.statusCode = 500;
        response.end('Server error');
      }
    } else {
      response.statusCode = 404;
      response.end('Incorrect endpoint');
    }
};
