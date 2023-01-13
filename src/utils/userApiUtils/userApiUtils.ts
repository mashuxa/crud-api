import { messages } from "../../constants";

export const getNotFoundMessage = (userId: string) => messages.userNotFound.replace('{userId}', userId);

