import { Component } from '@angular/core';
import {
  AnnouncementService,
  IAnnouncement,
} from 'src/app/services/announcement.service';

@Component({
  selector: 'app-admin-announcements',
  templateUrl: './admin-announcements.component.html',
  styleUrls: ['./admin-announcements.component.scss'],
})
export class AdminAnnouncementsComponent {
  announcements: IAnnouncement[] | null = [];
  constructor(annoucementService: AnnouncementService) {
    annoucementService.announcements$.subscribe((next) => {
      this.announcements = next;
    });
  }
}
