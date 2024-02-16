import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
  announcements$ = new BehaviorSubject<IAnnouncement[]>([]);
  isLoading = true;
  constructor(annoucementService: AnnouncementService) {
    annoucementService.getAnnouncements(10).subscribe((next) => {
      this.announcements$.next(next);
      this.isLoading = false;
    });
  }
}
