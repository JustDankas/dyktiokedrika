export interface IUser {
  id?: number;
  name: string;
  surname: string;
  email: string;
  username: string;
  password: string;
  image: string;
  registration_date: string;
  role: "admin" | "user" | "trainer" | "notAssigned";
  // specialization?: string;
}

export interface ILoginRequest {
  username: IUser["username"];
  password: IUser["password"];
}
