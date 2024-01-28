import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IUser } from './user.service';
import { BehaviorSubject } from 'rxjs';

export type ProgramTypes =
  | 'pilates'
  | 'weights'
  | 'fitness'
  | 'advanced'
  | 'yoga';

export interface ITrainer {
  name: string;
  surname: string;
}
export interface IProgram {
  id: number;
  trainer: ITrainer;
  title: string;
  image: string;
  description: string;
  type: string;
  price: number;
  is_group: boolean;
  max_size: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProgramService {
  private _programs$ = new BehaviorSubject<IProgram[]>([]);
  programs$ = this._programs$.asObservable();
  private programUrl = 'program/';
  constructor(private configSrv: ConfigService, private http: HttpClient) {
    this.getPrograms();
  }

  getTrainers() {
    return this.http.post<IUser[]>(
      this.configSrv.url + 'user/view/users_by_requested_role',
      { role: 'trainer' }
    );
  }

  createProgram(data: any) {
    console.log(data);
    let blob: string;
    const reader = new FileReader();
    reader.readAsDataURL(data.image);
    reader.onload = () => {
      blob = (reader.result as string).replace(/^data\:image.*base64\,/, '');
      data.image = blob;
      console.log(blob);
      this.http
        .post(this.configSrv.url + this.programUrl + 'create_program', data)
        .subscribe((res) => {
          console.log(res);
        });
    };
  }

  getPrograms() {
    this.http
      .get(this.configSrv.url + this.programUrl + 'view_all_programs')
      .subscribe((data: any) => {
        console.log(data);
        for (let program of data) {
          const bd = new Uint8Array(program.image.data);
          const b64 = btoa(String.fromCharCode(...program.image.data));
          console.log(b64);
          program.image = `data:image/jpg;base64,${b64}`;
          // const uint8Array = new Uint8Array(program.image.data);
          // let binaryString = '';
          // for (let tmp of uint8Array) {
          //   binaryString += String.fromCharCode(tmp);
          // }
          // program.image = btoa(binaryString);
          // console.log(
          //   btoa(
          //     String.fromCharCode.apply(null, new Uint8Array(data.image.data))
          //   )
          // );
        }
        this._programs$.next(data);
      });
  }
}
