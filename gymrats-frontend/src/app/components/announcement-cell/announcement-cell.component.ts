import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AnnouncementService,
  IAnnouncement,
} from 'src/app/services/announcement.service';
import Swal from 'sweetalert2';
import { AnnouncementEditModalComponent } from '../announcement-edit-modal/announcement-edit-modal.component';

@Component({
  selector: 'app-announcement-cell',
  templateUrl: './announcement-cell.component.html',
  styleUrls: ['./announcement-cell.component.scss'],
})
export class AnnouncementCellComponent {
  @Input() announcement: IAnnouncement | null = null;
  constructor(
    private announcementService: AnnouncementService,
    private modal: NgbModal
  ) {}
  editAnnouncement() {
    const editModal = this.modal.open(AnnouncementEditModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });
    editModal.componentInstance.announcement = this.announcement;
    editModal.componentInstance.announcementCopy = { ...this.announcement };
  }
  deleteAnnouncement() {
    Swal.fire({
      title: 'Do you want to delete this Announcement?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      iconColor: 'rgb(215 74 74)',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: 'rgb(215 74 74)',
      denyButtonText: `Cancel`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.announcementService
          .deleteAnnouncement(this.announcement!.id)
          .subscribe(
            (res) => {
              console.log(res);
              Swal.fire('Announcement deleted!', '', 'success').then(() => {
                window.location.reload();
              });
            },
            (err) => {
              console.log(err);
              Swal.fire('Something went wrong', '', 'error');
            }
          );
      }
    });
  }
}
