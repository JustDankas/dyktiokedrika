import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IUser } from './user.service';
import { BehaviorSubject } from 'rxjs';
import { FileService } from './file.service';

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
}

@Injectable({
  providedIn: 'root',
})
export class ProgramService {
  private _programs$ = new BehaviorSubject<IProgram[]>([]);
  programs$ = this._programs$.asObservable();
  editingProgram$ = new BehaviorSubject(-1);
  private programUrl = 'program/';
  constructor(
    private configSrv: ConfigService,
    private http: HttpClient,
    private fileService: FileService
  ) {
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
        .post(this.configSrv.url + this.programUrl + 'create_program', data)
        .subscribe((data) => {
          console.log(data);
        });
    };
  }

  getPrograms() {
    this.http
      .get(this.configSrv.url + this.programUrl + 'view_all_programs')
      .subscribe((data: any) => {
        for (let program of data) {
          program.image = this.fileService.blobToB64(program.image.data);
        }
        this._programs$.next(data);
      });
  }

  setEditingProgram(id: number) {
    this.editingProgram$.next(id);
  }

  addProgramSlot(data: any) {
    this.http.post(this.configSrv.url + this.programUrl + '', {
      ...data,
      program_id: this.editingProgram$.getValue(),
    });
  }
}
