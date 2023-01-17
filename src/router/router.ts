import { RequestListener } from "http";
import { validate as uuidValidate } from 'uuid';
import { getRequestBody, getEndpointIds, isMatchEndpoint, removeLastSlash } from "../utils/routerUtils/routerUtils";
import { Route, Routes, MethodType } from "./types";
import usersApi from "../usersApi/usersApi";
import { messages } from "../constants";

export const ENDPOINT = '/api/users';
export const ENDPOINT_WITH_ID = `${ENDPOINT}/:userId`;
const routes: Routes = {
  get: {
    [ENDPOINT]: usersApi.getUsers,
    [ENDPOINT_WITH_ID]: usersApi.getUserById,
  },
  post: {
    [ENDPOINT]: usersApi.postUser,
  },
  put: {
    [ENDPOINT_WITH_ID]: usersApi.putUserById,
  },
  delete: {
    [ENDPOINT_WITH_ID]: usersApi.deleteUserById,
  },
};

export const requestListener: RequestListener = async (request, response) => {
  const endpoints: Route = routes[request.method?.toLowerCase() as MethodType] || {};
  const url = removeLastSlash(request.url);
  const [rout, callback] = Object.entries(endpoints).find(([endpoint]) => url && isMatchEndpoint(endpoint, url)) || [];

  response.setHeader('Content-Type', 'application/json');

  if (rout && callback) {
    try {
      const { userId } = getEndpointIds(rout, url);

      if (userId && !uuidValidate(userId)) {
        response.statusCode = 400;
        response.end(JSON.stringify(messages.incorrectUuid));
      } else {
        const requestBody = await getRequestBody(request);
        const { status, data } = callback(userId, requestBody);
        response.statusCode = status;
        response.end(JSON.stringify(data));
      }
    } catch (e) {
      response.statusCode = 500;
      response.end(JSON.stringify(messages.serverError));
    }
  } else {
    response.statusCode = 404;
    response.end(JSON.stringify(messages.incorrectEndpoint));
  }
};
