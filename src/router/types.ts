interface IUser {
  id?: string;
  username: string;
  age: number;
  hobbies: string[];
}

type RouteCallback = (body: IUser, ids: Record<string, string>) => void;

export type Route = Record<string, RouteCallback>;

export type MethodType = 'get' | 'post' | 'put' | 'delete';

export type Routes = Record<MethodType, Route>;