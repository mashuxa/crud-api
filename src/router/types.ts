import { IUser } from "../usersApi/types";
import UsersApiResponse from "../UsersApiResponse/UsersApiResponse";

export type RouteCallback = (userId: string, body: IUser) => UsersApiResponse;

export type Route = Record<string, RouteCallback>;

export type MethodType = 'get' | 'post' | 'put' | 'delete';

export type Routes = Record<MethodType, Route>;