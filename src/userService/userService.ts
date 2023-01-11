import { v4 as uuidv4 } from 'uuid';
import { IUser } from "./types";
import { ServerResponse } from "http";
import { messages } from "../constants";

const requiredFields = ['username', 'age', 'hobbies'];
let db: Map<string, IUser> = new Map();

process.on('message', (data: Map<string, IUser>) => {
  db = new Map(Object.entries(data));
});

const answerWithData = (response: ServerResponse, statusCode: number, data: IUser | IUser[] | string): void => {
  response.statusCode = statusCode;
  response.end(JSON.stringify(data));
  process.send && process.send(Object.fromEntries(db.entries()));
}

const answerWithNotFound = (response: ServerResponse, userId: string): void => {
  answerWithData(response, 404, messages.userNotFound.replace('{userId}', userId));
};

export const getUsers = (response: ServerResponse) => {
  answerWithData(response, 200, [...db.values()]);
};

export const getUserById = (response: ServerResponse, userId: string): void => {
  const user = db.get(userId);

  if (user) {
    answerWithData(response, 200, user);
  } else {
    answerWithNotFound(response, userId);
  }
};

export const postUser = (response: ServerResponse, userId: string, userData: IUser): void => {
  const isValidUserData = requiredFields.every((field) => field in userData);

  if (isValidUserData) {
    const id = uuidv4();
    const user = { id, ...userData };

    db.set(id, user);
    answerWithData(response, 201, user);

  } else {
    answerWithData(response, 400, messages.requiredFields);
  }
};

export const putUserById = (response: ServerResponse, userId: string, userData: IUser): void => {
  const user = db.get(userId);

  if (user) {
    const updatedUserData = { ...user, ...userData };

    db.set(userId, updatedUserData);
    answerWithData(response, 200, updatedUserData);
  } else {
    answerWithNotFound(response, userId);
  }
};

export const deleteUserById = (response: ServerResponse, userId: string): void => {
  const user = db.get(userId);

  if (user) {
    db.delete(userId);
    answerWithData(response, 204, user);
  } else {
    answerWithNotFound(response, userId);
  }
};

