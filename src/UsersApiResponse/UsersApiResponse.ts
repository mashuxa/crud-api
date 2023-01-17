import { IUser } from "../usersApi/types";

type DataType = IUser | IUser[] | string

class UsersApiResponse {
  status: number;
  data?: DataType;

  constructor(status: number, data?: DataType) {
    this.status = status;
    this.data = data;
  }
}

export default UsersApiResponse;