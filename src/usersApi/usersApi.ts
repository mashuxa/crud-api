import { v4 as uuidv4 } from 'uuid';
import { IUser } from "./types";
import { messages } from "../constants";
import UsersApiResponse from "../UsersApiResponse/UsersApiResponse";
import { getNotFoundMessage } from "../utils/userApiUtils/userApiUtils";

const requiredFields = ['username', 'age', 'hobbies'];
let db: Map<string, IUser> = new Map();

process.on('message', (data: Map<string, IUser>) => {
  db = new Map(Object.entries(data));
});

const requiredFieldsResponse =  new UsersApiResponse(400, messages.requiredFields);

const updateDB = (): void => {
  process.send && process.send(Object.fromEntries(db.entries()));
};

class UsersApi {
  getUsers = (): UsersApiResponse => new UsersApiResponse(200, [...db.values()]);

  getUserById = (userId: string): UsersApiResponse => {
    const user = db.get(userId);

    return user ? new UsersApiResponse(200, user) : new UsersApiResponse(404, getNotFoundMessage(userId));
  };

  postUser = (userId: string, userData: IUser | undefined): UsersApiResponse => {
    if (!userData) {
      return requiredFieldsResponse;
    }

    const isValidUserData = requiredFields.every((field) => field in userData);

    if (isValidUserData) {
      const id = uuidv4();
      const user = { id, ...userData };

      db.set(id, user);
      updateDB();

      return new UsersApiResponse(201, user);
    } else {
      return requiredFieldsResponse;
    }
  };

  putUserById = (userId: string, userData: IUser | undefined): UsersApiResponse => {
    const user = db.get(userId);

    if (!userData) {
      return new UsersApiResponse(400, messages.requiredFields);
    }

    if (user) {
      const updatedUserData = { ...user, ...userData };

      db.set(userId, updatedUserData);
      updateDB();

      return new UsersApiResponse(200, updatedUserData);
    } else {
      return new UsersApiResponse(404, getNotFoundMessage(userId));
    }
  };

  deleteUserById = (userId: string): UsersApiResponse => {
    const user = db.get(userId);

    if (user) {
      db.delete(userId);
      updateDB();

      return new UsersApiResponse(204);
    } else {
      return new UsersApiResponse(404, getNotFoundMessage(userId));
    }
  };
}

export default new UsersApi();