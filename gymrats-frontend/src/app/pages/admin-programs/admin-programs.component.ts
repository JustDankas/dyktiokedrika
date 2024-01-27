import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProgramService } from 'src/app/services/program.service';
import { ProgramTypes } from 'src/app/services/program.service';
import { IUser } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-programs',
  templateUrl: './admin-programs.component.html',
  styleUrls: ['./admin-programs.component.scss'],
})
export class AdminProgramsComponent {
  trainers: IUser[] = [];
  programForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    type: new FormControl<ProgramTypes>('pilates'),
    price: new FormControl<number>(0),
    is_group: new FormControl(false),
    max_size: new FormControl(1),
    image: new FormControl('', Validators.required),
    trainer_id: new FormControl('undefined'),
  });

  constructor(private programService: ProgramService) {
    programService.getTrainers().subscribe((trainers) => {
      console.log(trainers);
      this.trainers = trainers;
    });
  }
}
