import { IUser } from "./user";

export interface ILoginRequest {
  username: IUser["username"];
  password: IUser["password"];
}
