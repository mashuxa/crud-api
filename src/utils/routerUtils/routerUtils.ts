import { IncomingMessage } from "http";
import { IUser } from "../../usersApi/types";

const ANY_PATH_SYMBOL = '[^/]+';
const URL_PARAM_REGEXP = new RegExp(`:${ANY_PATH_SYMBOL}`, 'gm');

export const removeLastSlash = (url = ''): string => url.endsWith('/') ? url.slice(0, -1) : url;

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

export const getRequestBody = async (request: IncomingMessage): Promise<IUser | undefined> => {
  const buffers = [];

  for await (const chunk of request) {
    buffers.push(chunk);
  }

  const data = Buffer.concat(buffers).toString();

  if (data) {
    return JSON.parse(data);
  }
};