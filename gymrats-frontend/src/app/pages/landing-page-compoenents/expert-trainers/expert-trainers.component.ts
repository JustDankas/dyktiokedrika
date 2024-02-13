import { Component } from '@angular/core';
import { ProgramService } from 'src/app/services/program.service';
import { IUser } from 'src/app/services/user.service';

@Component({
  selector: 'app-expert-trainers',
  templateUrl: './expert-trainers.component.html',
  styleUrls: ['./expert-trainers.component.scss'],
})
export class ExpertTrainersComponent {
  trainers!: IUser[];
  constructor(private programService: ProgramService) {
    programService.getTrainers().subscribe((data: any) => {
      this.trainers = data;
    });
  }
}
