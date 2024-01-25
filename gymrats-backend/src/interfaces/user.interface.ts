import { IUser } from "../models/user";

export interface ICreateUser extends IUser {
  country: string;
  city: string;
  street: string;
}
