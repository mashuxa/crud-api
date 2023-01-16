import { messages } from "../../constants";
import { IUser } from "../../usersApi/types";

export const getNotFoundMessage = (userId: string) => messages.userNotFound.replace('{userId}', userId);

export const validateBody = (body: IUser): boolean => {
  const isValidTypeOfUsername = typeof body.username === 'string';
  const isValidTypeOfAge = typeof body.age === 'number';
  const isValidTypeOfHobbies = Array.isArray(body.hobbies);
  const isValidTypeOfHobbiesContent = isValidTypeOfHobbies && body.hobbies.every((value) => typeof value === 'string');

  return isValidTypeOfUsername && isValidTypeOfAge && isValidTypeOfHobbies && isValidTypeOfHobbiesContent;
};

