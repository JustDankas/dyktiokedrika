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
  isLoading = true;
  constructor(annoucementService: AnnouncementService) {
    annoucementService.announcements$.subscribe((next) => {
      this.announcements = next;
      if (this.announcements) {
        this.isLoading = false;
      }
    });
  }
}
