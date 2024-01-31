import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import {
  IProgram,
  ProgramService,
  ProgramTypes,
} from 'src/app/services/program.service';
import { IUser } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-program',
  templateUrl: './edit-program.component.html',
  styleUrls: ['./edit-program.component.scss'],
})
export class EditProgramComponent {
  trainers: IUser[] = [];
  private id!: number;
  editingProgram$!: BehaviorSubject<number>;
  programForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    type: new FormControl<ProgramTypes>('pilates'),
    price: new FormControl<number>(0),
    is_group: new FormControl(false),
    max_size: new FormControl(1),
    image: new FormControl<File | string>(''),
    trainer_id: new FormControl('undefined', Validators.pattern('[0-9]*')),
  });

  constructor(private programService: ProgramService) {
    programService.getTrainers().subscribe((trainers) => {
      this.trainers = trainers;
    });
    programService.editingProgram$.subscribe((next) => {
      if (next > 0) {
        programService.getProgramById(next).subscribe((data: any) => {
          for (let key in data) {
            const value = data[key];
            if (key !== 'id' && key !== 'image') {
              this.programForm.get(key)?.setValue(value);
            }
          }
          this.id = data['id'];
        });
      }
    });
  }

  onFileChange(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.programForm.patchValue({
      image: file,
    });
  }

  onSubmit() {
    this.programService.editProgram({ ...this.programForm.value, id: this.id });
  }
}
