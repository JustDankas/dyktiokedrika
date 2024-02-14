import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AnnouncementService,
  IAnnouncement,
} from 'src/app/services/announcement.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-announcement-edit-modal',
  templateUrl: './announcement-edit-modal.component.html',
  styleUrls: ['./announcement-edit-modal.component.scss'],
})
export class AnnouncementEditModalComponent {
  @Input() announcement: IAnnouncement | null = null;
  announcementCopy: IAnnouncement | null = null;
  constructor(
    private modal: NgbActiveModal,
    private announcementService: AnnouncementService
  ) {}
  closeModal() {
    if (
      JSON.stringify(this.announcement) ===
      JSON.stringify(this.announcementCopy)
    ) {
      this.modal.dismiss();
    } else {
      Swal.fire({
        title: 'Cancel changes?',
        text: 'You changes will be lost!',
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonColor: 'rgb(215 53 53)',
      }).then((result) => {
        if (result.isDismissed) {
          this.modal.dismiss();
        } else if (result.isConfirmed) {
          this.saveChanges();
        }
      });
    }
  }
  saveChanges() {
    this.announcementService
      .updateAnnouncement(this.announcementCopy)
      .subscribe(
        (res) => {
          console.log(res);
          // this.modal.dismiss();
          Swal.fire('Announcement saved successfully!', '', 'success').then(
            () => {
              window.location.reload();
            }
          );
        },
        (err) => {
          console.log(err);
          Swal.fire('Something went wrong!', '', 'error');
        }
      );
  }
}
