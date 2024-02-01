import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { LoaderService } from './loader.service';

export type Role = 'notAssigned' | 'admin' | 'trainer' | 'user';
export interface IUser {
  id: number;
  name: string;
  surname: string;
  email: string;
  username: string;
  image: string;
  registration_date: string;
  role: Role;
  country: string;
  city: string;
  street: string;
  about: string;
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
  private _user$ = new BehaviorSubject<IUser | null>(null);
  user$ = this._user$.asObservable();
  constructor(
    private http: HttpClient,
    private configSrv: ConfigService,
    private cookieService: CookieService,
    private router: Router,
    private loaderService: LoaderService
  ) {
    this.loginFromToken();
  }

  loginFromToken() {
    this.http
      .get(this.configSrv.url + 'user/auth', {
        withCredentials: true,
      })
      .subscribe((data: any) => {
        this._user$.next(data);
      });
  }

  getPermission() {
    return this.http.get(this.configSrv.url + 'user/auth', {
      withCredentials: true,
    });
  }

  login({ nameControl, passwordControl }: ILoginForm) {
    const body = {
      username: nameControl,
      password: passwordControl,
    };
    this.loaderService.toggleLoading();
    this.http
      .post(this.configSrv.url + 'user/login', body, {
        withCredentials: true,
      })
      .subscribe((data: any) => {
        this.loaderService.toggleLoading();
        // this._user$.next(data);
        window.location.reload();
      });
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

    this.http
      .post(this.configSrv.url + 'user/register', body)
      .subscribe((data) => {
        window.location.reload();
      });
  }

  logout() {
    this._user$.next(null);
    this.cookieService.delete('auth', '/');
    if (this.router.url === '/') {
      window.location.reload();
    } else {
      this.router.navigate(['/']);
    }
  }

  changePfp(file: File) {
    let blob: string;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      blob = reader.result as string;
      this.loaderService.toggleLoading();

      this.http
        .patch(this.configSrv.url + 'user/' + 'update_pfp', {
          image: blob,
          id: this._user$.getValue()?.id,
        })
        .subscribe((data) => {
          this.loaderService.toggleLoading();
          window.location.reload();
        });
    };
  }

  updatePfp(data: any) {
    this.http
      .patch(
        this.configSrv.url + 'user/' + 'update_pfp_info',
        { ...data, userId: this._user$.getValue()?.id },
        {
          withCredentials: true,
        }
      )
      .subscribe((data) => {
        window.location.reload();
      });
  }
}
