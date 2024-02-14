import { Component, Input, ViewChild } from '@angular/core';
import { IUser, UserService } from 'src/app/services/user.service';
import { UserEditModalComponent } from '../user-edit-modal/user-edit-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-cell',
  templateUrl: './user-cell.component.html',
  styleUrls: ['./user-cell.component.scss'],
})
export class UserCellComponent {
  // @ViewChild('userEditModal') userEditModal: UserEditModalComponent | undefined;
  @Input() user: IUser | undefined;
  constructor(private modal: NgbModal, private userService: UserService) {}

  editUser() {
    if (this.user) {
      const editUserModal = this.modal.open(UserEditModalComponent, {
        centered: true,
        size: 'lg',
        backdrop: 'static',
      });
      editUserModal.componentInstance.user = this.user;
      editUserModal.componentInstance.userCopy = { ...this.user };
    }
  }
  deleteUser() {
    Swal.fire({
      title: 'Do you want to delete this user?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      iconColor: 'rgb(215 53 53)',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: 'rgb(215 53 53)',
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        if (this.user) {
          this.userService.deleteUser(this.user.id).subscribe(
            (res) => {
              console.log(res);
              Swal.fire('User deleted!', '', 'success').then(() => {
                window.location.reload();
              });
            },
            (err) => {
              console.log(err);
              Swal.fire('Something whent wrong', '', 'error');
            }
          );
        }
      }
    });
  }
}
