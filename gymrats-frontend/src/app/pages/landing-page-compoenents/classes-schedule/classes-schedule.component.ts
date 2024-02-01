import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IProgram, ProgramService } from 'src/app/services/program.service';
import { IUser, UserService } from 'src/app/services/user.service';

interface IClassPrograms extends IProgram {
  dummies: number[];
}

enum DaysEnum {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
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
  filteredPrograms$ = new BehaviorSubject<IClassPrograms[]>([]);
  user$!: Observable<IUser | null>;
  constructor(
    private programService: ProgramService,
    private userService: UserService,
    private router: Router
  ) {
    this.user$ = userService.user$;
    this.programs$ = programService.programs$.subscribe((programs) => {
      programs.forEach((program) => {
        //@ts-ignore
        program['dummies'] = [];
      });
      this.programs = programs as IClassPrograms[];
      this.findMaxSlots(DaysEnum.Monday);
    });
  }

  private findMaxSlots(selectedDay: number) {
    let _programs = this.programs.slice();
    let max = 0;
    _programs.forEach((program) => {
      let tmp = 0;
      program.slots.forEach((slot) => {
        if (this.isSlotThisWeek(slot.start, selectedDay)) tmp++;
      });
      if (tmp > max) max = tmp;
    });
    _programs.forEach((program) => {
      let tmp = 0;
      program.slots.forEach((slot) => {
        if (this.isSlotThisWeek(slot.start, selectedDay)) tmp++;
      });
      program['dummies'] = Array(max - tmp).fill(0);
    });
    this.filteredPrograms$.next(_programs);
  }

  changeSelectedDay(selectedDay: number) {
    this.selectedDay$.next(selectedDay);
    this.findMaxSlots(selectedDay);
  }

  isSlotThisWeek(date: Date, selectedDay?: number) {
    const dateDate = new Date(date);
    const dateYear = dateDate.getFullYear();

    const currDate = new Date().getDate();
    const sundayDate = currDate + 6 - ((new Date().getDay() - 1) % 7);
    const mondayDate = currDate - ((new Date().getDay() - 1) % 7);
    const start = new Date(dateYear, new Date().getMonth(), mondayDate);
    const end = new Date(dateYear, new Date().getMonth(), sundayDate);

    const day = selectedDay ?? this.selectedDay$.getValue();
    if (
      start.getTime() <= dateDate.getTime() &&
      end.getTime() >= dateDate.getTime() &&
      (dateDate.getDay() - 1) % 7 === day
    ) {
      return true;
    }
    return false;
  }
}
