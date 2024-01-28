import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { FileService } from './file.service';

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
  // user: IUser | null = {
  //   id: 1,
  //   name: 'Mixalhs',
  //   surname: 'Fillipakhs',
  //   email: 'sex@example.com',
  //   username: 'makemecum',
  //   image:
  //     'https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg',
  //   registration_date: new Date().toISOString(),
  //   role: Role[Role.user],
  //   country: 'Greece',
  //   city: 'Athens',
  //   street: 'Some Street 11',
  //   description: '',
  //   // 'Το Lorem Ipsum είναι απλά ένα κείμενο χωρίς νόημα για τους επαγγελματίες της τυπογραφίας και στοιχειοθεσίας. Το Lorem Ipsum είναι το επαγγελματικό πρότυπο όσον αφορά το κείμενο χωρίς νόημα, από τον 15ο αιώνα, όταν ένας ανώνυμος τυπογράφος πήρε ένα δοκίμιο και ανακάτεψε τις λέξεις για να δημιουργήσει ένα δείγμα βιβλίου. Όχι μόνο επιβίωσε πέντε αιώνες, αλλά κυριάρχησε στην ηλεκτρονική στοιχειοθεσία, παραμένοντας με κάθε τρόπο αναλλοίωτο',
  // };

  private _user$ = new BehaviorSubject<IUser | null>(null);
  user$ = this._user$.asObservable();
  constructor(
    private http: HttpClient,
    private configSrv: ConfigService,
    private cookieService: CookieService,
    private router: Router,
    private fileService: FileService
  ) {
    this.loginFromToken();
  }

  loginFromToken() {
    this.http
      .get(this.configSrv.url + 'user/auth', {
        withCredentials: true,
      })
      .subscribe((data: any) => {
        //@ts-ignore
        data.image = this.fileService.blobToB64(data.image.data);
        //@ts-ignore
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
    this.http
      .post(this.configSrv.url + 'user/login', body, {
        withCredentials: true,
      })
      .subscribe((data) => {
        console.log(data);
        //@ts-ignore
        this._user$.next(data);
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
        console.log(data);
        window.location.reload();
      });
  }

  logout() {
    this._user$.next(null);
    this.cookieService.delete('auth', '/');
    this.router.navigate(['/']);
  }

  changePfp(file: File) {
    let blob: string;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      blob = reader.result as string;
      this.http
        .patch(this.configSrv.url + 'user/' + 'update_pfp', {
          image: blob,
          id: this._user$.getValue()?.id,
        })
        .subscribe((data) => {
          console.log(data);
        });
    };
  }
}
