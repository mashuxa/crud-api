import { RequestListener } from "http";
import { validate as uuidValidate } from 'uuid';
import { getEndpointIds, isMatchEndpoint } from "../utils/routerUtils/routerUtils";
import { Route, Routes, MethodType } from "./types";
import { getUsers, getUserById, postUser, putUserById, deleteUserById } from "../userService/userService";
import { messages } from "../constants";

export const ENDPOINT = '/api/users';
export const ENDPOINT_WITH_ID = `${ENDPOINT}/:userId`;
const routes: Routes = {
  get: {
    [ENDPOINT]: getUsers,
    [ENDPOINT_WITH_ID]: getUserById,
  },
  post: {
    [ENDPOINT]: postUser,
  },
  put: {
    [ENDPOINT_WITH_ID]: putUserById,
  },
  delete: {
    [ENDPOINT_WITH_ID]: deleteUserById,
  },
};

export const requestListener: RequestListener = async (request, response) => {
    const endpoints: Route = routes[request.method?.toLowerCase() as MethodType] || {};
    const [rout, callback] = Object.entries(endpoints).find(([endpoint]) => request.url && isMatchEndpoint(endpoint, request.url)) || [];

    response.setHeader('Content-Type', 'application/json');

    if (rout && callback && request.url) {
      try {
        const { userId } = getEndpointIds(rout, request.url);
        const buffers = [];

        if (userId && !uuidValidate(userId)) {
          response.statusCode = 400;
          response.end(messages.incorrectUuid);

          return;
        }

        for await (const chunk of request) {
          buffers.push(chunk);
        }

        const data = JSON.parse(Buffer.concat(buffers).toString());

        callback(response, userId, data);
      } catch (e) {
        response.statusCode = 500;
        response.end(messages.serverError);
      }
    } else {
      response.statusCode = 404;
      response.end(messages.incorrectEndpoint);
    }
};
