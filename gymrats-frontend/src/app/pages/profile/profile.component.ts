import { Component, OnInit } from '@angular/core';
import { IProgram, ProgramService } from 'src/app/services/program.service';
import { IUser, UserService } from 'src/app/services/user.service';

interface IProgramAppointment extends IProgram {
  appointment_id: number;
  cancelled: boolean;
  cancelled_on: Date;
  day: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  programs: IProgramAppointment[] = [];
  appointmentDays: number[] = [];
  user$;
  readonly defaultDescription = 'User has no description';
  constructor(
    private userSrv: UserService,
    private programSrv: ProgramService
  ) {
    this.user$ = userSrv.user$;
    programSrv.getAllAppointmentsWithPrograms().subscribe((data: any) => {
      this.programs = data;
      console.log(data);
      this.appointmentDays = data.map((a: any) => {
        const date = new Date(a.start);
        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        ).getTime();
      });
    });
  }
  ngOnInit(): void {
    // this.programs = this.programSrv.programs;
  }
}
