import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProgramService } from 'src/app/services/program.service';

@Component({
  selector: 'app-time-slots',
  templateUrl: './time-slots.component.html',
  styleUrls: ['./time-slots.component.scss'],
})
export class TimeSlotsComponent {
  editingProgram$;
  form = new FormGroup({
    start: new FormControl<Date | null>(null, Validators.required),
    end: new FormControl<Date | null>(null, Validators.required),
  });

  constructor(private programService: ProgramService) {
    this.editingProgram$ = programService.editingProgram$;
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
