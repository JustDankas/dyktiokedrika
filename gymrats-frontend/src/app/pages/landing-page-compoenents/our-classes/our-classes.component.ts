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
  isLoading = true;
  constructor(private programmService: ProgramService) {
    this.programmService.programs$.subscribe((data) => {
      this.programms = data;
      if (this.programms) {
        this.isLoading = false;
      }
    });
  }
  setActiveTab(tab: number) {
    this.activeTab = tab;
  }
}
