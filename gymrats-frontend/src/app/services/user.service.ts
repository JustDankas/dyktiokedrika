import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

export enum Role {
  user,
  trainer,
  admin,
}
export interface IUser {
  id: number;
  name: string;
  surname: string;
  email: string;
  username: string;
  image: string;
  registration_date: string;
  role: string;
  country: string;
  city: string;
  street: string;
}

type ILoginForm = Partial<{
  nameControl: string | null;
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
    name: 'Mixalhs',
    surname: 'Fillipakhs',
    email: 'sex@example.com',
    username: 'makemecum',
    image:
      'https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg',
    registration_date: new Date().toISOString(),
    role: Role[Role.user],
    country: 'Greece',
    city: 'Athens',
    street: 'Some Street 11',
  };
  constructor(private http: HttpClient, private configSrv: ConfigService) {
    this.loginFromToken();
  }

  loginFromToken() {
    console.log(document.cookie);
    const token = document.cookie.split(';').find((c) => /auth=.+/.test(c));
    if (token) {
      console.log(token.split('=')[1]);
      this.http
        .post(
          this.configSrv.url + 'user/auth',
          { token: token.split('=')[1] },
          {
            headers: {
              credentials: 'include',
            },
          }
        )
        .subscribe((data) => console.log(data));
    }
  }

  login({ nameControl, passwordControl }: ILoginForm) {
    const body = {
      username: nameControl,
      password: passwordControl,
    };
    return this.http.post(this.configSrv.url + 'user/login', body);
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
    const body = {
      name: nameControl,
      surname: surnameControl,
      email: emailControl,
      username: usernameControl,
      password: passwordControl,
      country: countryControl,
      city: cityControl,
      street: streetControl,
      role: 'notAssigned',
      image: null,
      registration_date: new Date().toISOString(),
    };
    // console.log(body);
    return this.http.post(this.configSrv.url + 'user/register', body);
  }
}
