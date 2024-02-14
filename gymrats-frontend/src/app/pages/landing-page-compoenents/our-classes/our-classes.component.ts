import { Component } from '@angular/core';
import { IProgram, ProgramService } from 'src/app/services/program.service';

@Component({
  selector: 'app-our-classes',
  templateUrl: './our-classes.component.html',
  styleUrls: ['./our-classes.component.scss'],
})
export class OurClassesComponent {
  activeTab = 0;
  programms: IProgram[] | null = null;

  constructor(private programmService: ProgramService) {
    this.programmService.programs$.subscribe((data) => {
      this.programms = data;
    });
  }
  setActiveTab(tab: number) {
    this.activeTab = tab;
  }
}
