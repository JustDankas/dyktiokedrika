import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProgramService, ProgramTypes } from 'src/app/services/program.service';
import { IUser } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-programs',
  templateUrl: './admin-programs.component.html',
  styleUrls: ['./admin-programs.component.scss'],
})
export class AdminProgramsComponent {
  trainers: IUser[] = [];
  readonly days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  programs$;
  isGroup: boolean = false;
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
    this.programService.createProgram(this.programForm.value);
  }

  constructor(private programService: ProgramService) {
    programService.getTrainers().subscribe((trainers) => {
      this.trainers = trainers;
    });
    this.programs$ = programService.programs$;
  }

  onFileChange(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.programForm.patchValue({
      image: file,
    });
  }

  setEditingProgram(id: number) {
    this.programService.setEditingProgram(id);
  }

  deleteProgram(id: number) {
    Swal.fire({
      title: 'Do you want to delete this sector?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      iconColor: 'rgb(215 74 74)',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: 'rgb(215 74 74)',
      denyButtonText: `Cancel`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.programService.deleteProgram(id);
      }
    });
  }

  deleteSlot(id: number) {
    Swal.fire({
      title: 'Do you want to delete this slot?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      iconColor: 'rgb(215 74 74)',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: 'rgb(215 74 74)',
      denyButtonText: `Cancel`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.programService.deleteSlot(id);
      }
    });
  }
  onGroupChanged(ev: Event) {
    const target = ev.target as HTMLInputElement;
    if (!target.checked) {
      this.programForm.get('max_size')?.setValue(1);
      this.isGroup = false;
    } else {
      this.isGroup = true;
    }
  }
  onMaxSizeChanged() {
    if (!this.isGroup) {
      this.programForm.get('max_size')?.setValue(1);
    }
  }
}
