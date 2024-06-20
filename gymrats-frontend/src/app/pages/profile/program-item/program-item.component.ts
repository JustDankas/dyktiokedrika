import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProgramService } from 'src/app/services/program.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-program-item',
  templateUrl: './program-item.component.html',
  styleUrls: ['./program-item.component.scss'],
})
export class ProgramItemComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() image = '';
  @Input() cancelled = false;
  @Input() id!: number;
  @Input() price: number = 0;
  @Input() isGroup: boolean = false;
  @Input() type: string = 'No Type';

  constructor(private programService: ProgramService) {}

  onClick() {
    this.programService.cancelAppointment(this.id).subscribe({
      next: (next) => {
        console.log(next);
      },
      error: (err) => {
        console.error(err.error);
        Swal.fire({
          title: 'There seems to be an error',
          text: err.error,
          icon: 'error',
          confirmButtonText: 'Ok',
          iconColor: 'rgb(215 74 74)',
        });
      },
    });
  }
}
