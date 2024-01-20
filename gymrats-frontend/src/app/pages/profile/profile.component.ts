import { Component, OnInit } from '@angular/core';
import { IProgram, ProgramService } from 'src/app/services/program.service';
import { IUser, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: IUser | null = null;
  programs: IProgram[] = [];
  constructor(
    private userSrv: UserService,
    private programSrv: ProgramService
  ) {}
  ngOnInit(): void {
    this.user = this.userSrv.user;
    this.programs = this.programSrv.programs;
  }
}
