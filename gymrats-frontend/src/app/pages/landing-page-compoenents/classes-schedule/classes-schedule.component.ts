import { Component } from '@angular/core';
import { tap } from 'rxjs';
import { ProgramService } from 'src/app/services/program.service';

@Component({
  selector: 'app-classes-schedule',
  templateUrl: './classes-schedule.component.html',
  styleUrls: ['./classes-schedule.component.scss'],
})
export class ClassesScheduleComponent {
  programs$;
  constructor(private programService: ProgramService) {
    this.programs$ = programService.programs$.pipe(tap((programs) => {}));
  }
}
