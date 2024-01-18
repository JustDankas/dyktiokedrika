import { Injectable } from '@angular/core';

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
