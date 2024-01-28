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

export interface ISlot {
  id: number;
  program_id: number;
  seats_available: number;
  start: string;
  end: string;
}
export interface ITrainer {
  name: string;
  surname: string;
}
export interface IProgram {
  id: number;
  trainer_id: number;
  trainer_name: string;
  trainer_surname: string;
  title: string;
  image: string;
  description: string;
  type: string;
  price: number;
  is_group: boolean;
  max_size: number;
  slots: ISlot[];
}

@Injectable({
  providedIn: 'root',
})
export class ProgramService {
  private _programs$ = new BehaviorSubject<IProgram[]>([]);
  programs$ = this._programs$.asObservable();
  editingProgram$ = new BehaviorSubject(-1);
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
    let blob: string;
    const reader = new FileReader();
    reader.readAsDataURL(data.image);
    reader.onload = () => {
      blob = reader.result as string;
      data.image = blob;
      this.http
        .post(this.configSrv.url + this.programUrl + 'create_program', data, {
          withCredentials: true,
        })
        .subscribe((data) => {
          console.log(data);
        });
    };
  }

  getPrograms() {
    this.http
      .get(this.configSrv.url + this.programUrl + 'view_all_programs', {
        withCredentials: true,
      })
      .subscribe((data: any) => {
        console.log(data);
        this._programs$.next(data);
      });
  }

  setEditingProgram(id: number) {
    this.editingProgram$.next(id);
  }

  addProgramSlot(data: any) {
    this.http
      .post(
        this.configSrv.url + this.programUrl + 'create_slot',
        {
          ...data,
          program_id: this.editingProgram$.getValue(),
        },
        { withCredentials: true }
      )
      .subscribe((data) => {
        console.log(data);
      });
  }

  deleteProgram(id: number) {
    this.http
      .delete(
        this.configSrv.url + this.programUrl + 'delete_program' + '?id=' + id,
        { withCredentials: true }
      )
      .subscribe((data) => {
        window.location.reload();
      });
  }

  deleteSlot(id: number) {
    this.http
      .delete(
        this.configSrv.url + this.programUrl + 'delete_slot' + '?id=' + id,
        { withCredentials: true }
      )
      .subscribe((data) => {
        window.location.reload();
      });
  }
}
