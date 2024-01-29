import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IUser } from './user.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
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
  day: number;
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
  constructor(
    private configSrv: ConfigService,
    private http: HttpClient,
    private router: Router
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
        .post(this.configSrv.url + this.programUrl + 'create_program', data, {
          withCredentials: true,
        })
        .subscribe((data) => {
          window.location.reload();
        });
    };
  }

  getPrograms() {
    this.http
      .get(this.configSrv.url + this.programUrl + 'view_all_programs', {
        withCredentials: true,
      })
      .subscribe((data: any) => {
        this._programs$.next(data);
      });
  }

  getProgramAndSlotBySlotId(slotId: string) {
    return this.http.get(
      this.configSrv.url + this.programUrl + 'get_program_slot_trainer',
      {
        withCredentials: true,
        params: {
          slotId,
        },
      }
    );
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
        window.location.reload();
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
  createAppointment(slot_id: number) {
    this.http
      .post(
        this.configSrv.url + this.programUrl + 'create_appointment',
        {
          slot_id,
        },
        { withCredentials: true }
      )
      .subscribe((data) => {
        // console.log(data);
        this.router.navigate(['/profile']);
      });
  }

  cancelAppointment(id: number) {
    this.http
      .patch(
        this.configSrv.url + this.programUrl + 'cancel_appointment',
        {
          id,
        },
        {
          withCredentials: true,
        }
      )
      .subscribe((data) => {
        window.location.reload();
      });
  }

  getAllAppointmentsWithPrograms() {
    return this.http.get(
      this.configSrv.url +
        this.programUrl +
        'get_all_appointments_with_programs',
      {
        withCredentials: true,
      }
    );
  }
}
