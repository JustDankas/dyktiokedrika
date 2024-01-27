import { Component, OnInit } from '@angular/core';
import { IProgram, ProgramService } from 'src/app/services/program.service';
import { IUser, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  programs: IProgram[] = [];
  user$;
  readonly defaultDescription = 'User has no description';
  constructor(
    private userSrv: UserService,
    private programSrv: ProgramService
  ) {
    this.user$ = userSrv.user$;
  }
  ngOnInit(): void {
    this.programs = this.programSrv.programs;
  }
}
