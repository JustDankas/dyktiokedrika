import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AppointmentsService } from 'src/app/services/appointments.service';
import {
  IProgram,
  ISlot,
  ProgramService,
} from 'src/app/services/program.service';
import Swal from 'sweetalert2';

interface IprogramAppointment extends Omit<ISlot, ISlot['id']> {
  title: string;
  slot_id: number;
  program_id: number;
  trainer_id: number;
  max_size: number;
  description: string;
  price: number;
  type: string;
  is_group: boolean;
  image: string;
  trainer_name: string;
  trainer_surname: string;
  trainer_image: string;
  trainer_about: string;
}

@Component({
  selector: 'app-program-appointment',
  templateUrl: './program-appointment.component.html',
  styleUrls: ['./program-appointment.component.scss'],
})
export class ProgramAppointmentComponent {
  readonly days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  program$ = new BehaviorSubject<IprogramAppointment | null>(null);
  slotId!: number;
  constructor(
    private programService: ProgramService,
    private activeRouter: ActivatedRoute,
    private router: Router
  ) {
    activeRouter.queryParams.subscribe((params) => {
      const { slot_id } = params;
      if (slot_id) {
        programService
          .getProgramAndSlotBySlotId(slot_id)
          .subscribe((data: any) => {
            this.program$.next(data);
            this.slotId = slot_id;
          });
      } else {
        router.navigate(['/']);
      }
    });
  }

  makeAppointment() {
    this.programService.createAppointment(this.slotId).subscribe({
      next: (next) => {
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        Swal.fire({
          title: 'There seems to be an error',
          text: 'Something went wrong',
          icon: 'error',
          confirmButtonText: 'Ok',
          iconColor: 'rgb(215 74 74)',
        });
      },
    });
  }
  getDay(date: Date) {
    return (new Date(date).getDay() - 1) % 7;
  }
}
