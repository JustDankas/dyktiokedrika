import { Component, Input } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ProgramService } from 'src/app/services/program.service';

@Component({
  selector: 'app-time-slots',
  templateUrl: './time-slots.component.html',
  styleUrls: ['./time-slots.component.scss'],
})
export class TimeSlotsComponent {
  readonly defaultDate = new Date();
  editingProgram$;
  form = new FormGroup({
    start: new FormControl<string | null>(null, Validators.required),
    end: new FormControl<string | null>(null, Validators.required),
    day: new FormControl<Date | null>(null, Validators.required),
  });

  constructor(private programService: ProgramService) {
    this.editingProgram$ = programService.editingProgram$;
    this.form
      .get('end')
      ?.addValidators(this.validTimeSlotValidator(this.form.get('start')));
    this.form.get('day')?.addValidators(this.dateValidator());
  }

  onSubmit() {
    this.programService.addProgramSlot(this.form.value);
  }

  private dateValidator(): ValidatorFn {
    return (control: AbstractControl<Date | null>): ValidationErrors | null => {
      if (control.value) {
        if (new Date(control.value).getTime() > Date.now()) {
          return null;
        }
      }
      return {
        pastDate: {
          value: 'Date must not be in the past',
        },
      };
    };
  }

  private validTimeSlotValidator(
    start: AbstractControl<string | null> | null
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!start || !start.value || !control.value)
        return {
          validTimeSlot: {
            value: 'End time must be greater than start time',
          },
        };
      const [start_hh, start_mm] = start.value.split(':');
      const [end_hh, end_mm] = control.value.split(':');
      if (end_hh > start_hh) {
        return null;
      } else if (end_hh == start_hh && end_mm > start_mm) {
        return null;
      }

      return {
        validTimeSlot: {
          value: 'End time must be greater than start time',
        },
      };
    };
  }
}
