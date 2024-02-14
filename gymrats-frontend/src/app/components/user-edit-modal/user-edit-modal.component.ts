import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IUser, UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-edit-modal',
  templateUrl: './user-edit-modal.component.html',
  styleUrls: ['./user-edit-modal.component.scss'],
})
export class UserEditModalComponent {
  @Input() user: IUser | any = null;
  userCopy: any = null;
  constructor(
    private modal: NgbActiveModal,
    private userService: UserService
  ) {}

  saveChanges() {
    this.userService.updateUser(this.userCopy).subscribe(
      () => {
        // this.modal.dismiss();
        Swal.fire('Announcement saved successfully!', '', 'success').then(
          () => {
            window.location.reload();
          }
        );
        window.location.reload();
      },
      (err) => {
        Swal.fire('Something went wrong!', '', 'error');
      }
    );
  }

  closeModal() {
    if (JSON.stringify(this.user) === JSON.stringify(this.userCopy)) {
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
}
