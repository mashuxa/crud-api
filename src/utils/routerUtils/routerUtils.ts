import { IncomingMessage } from "http";
import { IUser } from "../../userService/types";

const ANY_PATH_SYMBOL = '[^/]+';
const URL_PARAM_REGEXP = new RegExp(`:${ANY_PATH_SYMBOL}`, 'gm');

export const isMatchEndpoint = (endpoint: string, url: string): boolean => {
  const endpointRegExpString = endpoint.replace(URL_PARAM_REGEXP, ANY_PATH_SYMBOL);
  const endpointRegExp = new RegExp(`^${endpointRegExpString}$`, 'gm');

  return endpointRegExp.test(url);
};

export const getEndpointIds = (endpoint: string, url: string): Record<string, string> => {
  const endpointArray = endpoint.split('/');
  const urlArray = url.split('/');

  return endpointArray.reduce((acc, value, index) => value.startsWith(':') ?
    { ...acc, [value.substring(1)]: urlArray[index]} : acc, {});
};

export const getRequestBody = async (request: IncomingMessage): Promise<IUser> => {
  const buffers = [];

  for await (const chunk of request) {
    buffers.push(chunk);
  }

  return JSON.parse(Buffer.concat(buffers).toString());
};