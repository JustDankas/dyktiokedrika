import { Component } from '@angular/core';
import {
  AnnouncementService,
  IAnnouncement,
} from 'src/app/services/announcement.service';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss'],
})
export class AnnouncementsComponent {
  images = [
    'assets/gym-background.jpg',
    'assets/gym-background.jpg',
    'assets/gym-background.jpg',
  ];
  announcements: IAnnouncement[] | null = [];
  constructor(annoucementService: AnnouncementService) {
    annoucementService.announcements$.subscribe((next) => {
      this.announcements = next;
      console.log(this.announcements);
    });
  }
}
