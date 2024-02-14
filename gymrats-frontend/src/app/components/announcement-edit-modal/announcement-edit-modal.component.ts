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
  @Input() announcement: IAnnouncement | null = {
    id: -1,
    title: '',
    text: '',
    image: './assets/default-profile.png',
    created_at: '',
  };
  announcementCopy: IAnnouncement | null = {
    id: -1,
    title: '',
    text: '',
    image: './assets/default-profile.png',
    created_at: '',
  };

  buttonDisabled = false;
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
  changeImage(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const base64String = e.target.result;
        if (this.announcementCopy?.image)
          this.announcementCopy.image = base64String;

        // Now you can use the base64String as needed, e.g., send it to the server, display it in an image tag, etc.
      };

      reader.readAsDataURL(file);
    }
  }
  saveChanges() {
    if (this.announcementCopy?.id == -1) {
      this.buttonDisabled = true;
      this.announcementService
        .createAnnouncement(this.announcementCopy)
        .subscribe(
          (res: any) => {
            console.log(res);
            // this.modal.dismiss();
            Swal.fire('Announcement saved successfully!', '', 'success').then(
              () => {
                window.location.reload();
              }
            );
          },
          (err: any) => {
            console.log(err);
            this.buttonDisabled = true;
            Swal.fire('Something went wrong!', '', 'error');
          }
        );
    } else {
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
}
