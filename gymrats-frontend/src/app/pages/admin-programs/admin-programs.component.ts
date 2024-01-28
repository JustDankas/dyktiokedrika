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
  programs$;
  programForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    type: new FormControl<ProgramTypes>('pilates'),
    price: new FormControl<number>(0),
    is_group: new FormControl(false),
    max_size: new FormControl(1),
    image: new FormControl<File | string>('', Validators.required),
    trainer_id: new FormControl('undefined', Validators.pattern('[0-9]*')),
  });

  onSubmit() {
    // console.log(this.programForm.value);
    // console.log(this.programForm.get('image')?.value);
    this.programService.createProgram(this.programForm.value);
  }
  showValidity() {
    console.log(this.programForm);
  }

  constructor(private programService: ProgramService) {
    programService.getTrainers().subscribe((trainers) => {
      console.log(trainers);
      this.trainers = trainers;
    });
    this.programs$ = programService.programs$;
  }

  onFileChange(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    console.log(file);
    this.programForm.patchValue({
      image: file,
    });
  }
}
