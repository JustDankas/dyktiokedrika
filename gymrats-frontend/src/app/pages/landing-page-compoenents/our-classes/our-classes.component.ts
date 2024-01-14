import { Component } from '@angular/core';

@Component({
  selector: 'app-our-classes',
  templateUrl: './our-classes.component.html',
  styleUrls: ['./our-classes.component.scss'],
})
export class OurClassesComponent {
  activeTab = 'tab-1';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
