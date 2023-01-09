import { ServerResponse } from "http";
import { IUser } from "../userService/types";

export type RouteCallback = (response: ServerResponse, userId: string, body: IUser) => void;

export type Route = Record<string, RouteCallback>;

export type MethodType = 'get' | 'post' | 'put' | 'delete';

export type Routes = Record<MethodType, Route>;