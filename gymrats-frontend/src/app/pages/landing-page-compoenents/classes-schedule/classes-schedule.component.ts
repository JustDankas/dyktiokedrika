import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { IProgram, ProgramService } from 'src/app/services/program.service';

interface IClassPrograms extends IProgram {
  dummies: number[];
}

@Component({
  selector: 'app-classes-schedule',
  templateUrl: './classes-schedule.component.html',
  styleUrls: ['./classes-schedule.component.scss'],
})
export class ClassesScheduleComponent {
  readonly days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  selectedDay$ = new BehaviorSubject(0);
  programs$;
  programs: IClassPrograms[] = [];
  // filteredPrograms$ = new BehaviorSubject<IProgram[]>([]);
  constructor(private programService: ProgramService, private router: Router) {
    this.programs$ = programService.programs$.subscribe((programs) => {
      programs.forEach((program) => {
        //@ts-ignore
        program['dummies'] = [];
      });
      this.programs = programs as IClassPrograms[];
      this.findMaxSlots(0);
    });

    // this.selectedDay$.subscribe((next) => {
    //   const filterByDay = this.programs.filter(program =>{
    //     return program.
    //   })
    //   this.filteredPrograms$.next()
    // });
  }

  private findMaxSlots(selectedDay: number) {
    let max = 0;
    this.programs.forEach((program) => {
      let tmp = 0;
      program.slots.forEach((slot) => {
        if (slot.day === selectedDay) tmp++;
      });
      if (tmp > max) max = tmp;
    });
    this.programs.forEach((program) => {
      let tmp = 0;
      program.slots.forEach((slot) => {
        if (slot.day === selectedDay) tmp++;
      });

      program['dummies'] = Array(max - tmp).fill(0);
    });
    console.log(max);
  }

  changeSelectedDay(selectedDay: number) {
    this.findMaxSlots(selectedDay);
    this.selectedDay$.next(selectedDay);
  }
}
