import { Injectable } from '@angular/core';

enum Role {
  user,
  trainer,
  admin,
}
interface IUser {
  id: number;
  name: string;
  surname: string;
  email: string;
  username: string;
  image: string;
  registration_date: string;
  role: Role;
}

type ILoginForm = Partial<{
  nameControl: string | null;
  emailControl: string | null;
  passwordControl: string | null;
}>;

type IRegisterForm = Partial<{
  nameControl: string | null;
  surnameControl: string | null;
  emailControl: string | null;
  usernameControl: string | null;
  passwordControl: string | null;
  countryControl: string | null;
  cityControl: string | null;
  streetControl: string | null;
}>;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: IUser | null = {
    id: 1,
    name: 'Dungeon',
    surname: 'Master',
    email: 'sex@example.com',
    username: 'makemecum',
    image:
      'https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg',
    registration_date: new Date().toISOString(),
    role: Role['user'],
  };
  constructor() {}

  login({ nameControl, emailControl, passwordControl }: ILoginForm) {
    console.log('Login', nameControl, emailControl, passwordControl);
  }

  register({
    nameControl,
    surnameControl,
    emailControl,
    usernameControl,
    passwordControl,
    countryControl,
    cityControl,
    streetControl,
  }: IRegisterForm) {
    console.log(
      'register',
      nameControl,
      surnameControl,
      emailControl,
      usernameControl,
      passwordControl,
      countryControl,
      cityControl,
      streetControl
    );
  }
}
