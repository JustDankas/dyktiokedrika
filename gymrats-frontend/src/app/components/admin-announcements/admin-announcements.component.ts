import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AnnouncementService,
  IAnnouncement,
} from 'src/app/services/announcement.service';
import { AnnouncementEditModalComponent } from '../announcement-edit-modal/announcement-edit-modal.component';

@Component({
  selector: 'app-admin-announcements',
  templateUrl: './admin-announcements.component.html',
  styleUrls: ['./admin-announcements.component.scss'],
})
export class AdminAnnouncementsComponent {
  announcements: IAnnouncement[] | null = [];
  isLoading = true;
  constructor(
    annoucementService: AnnouncementService,
    private modal: NgbModal
  ) {
    annoucementService.getAnnouncements().subscribe((next) => {
      this.announcements = next;
      if (this.announcements) {
        this.isLoading = false;
      }
    });
  }

  createAnnouncement() {
    this.modal.open(AnnouncementEditModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });
  }
}
