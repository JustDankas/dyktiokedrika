import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { IUser, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent {
  userForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(255),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(255),
    ]),
    about: new FormControl(''),
    password: new FormControl('', [
      Validators.required,
      Validators.maxLength(2000),
    ]),
  });

  constructor(private userService: UserService) {
    userService.user$.subscribe((user) => {
      this.usernameControl?.setValue(user?.username ?? '');
      this.emailControl?.setValue(user?.email ?? '');
      this.aboutControl?.setValue(user?.about ?? '');
    });
  }

  get usernameControl() {
    return this.userForm.get('username');
  }
  get emailControl() {
    return this.userForm.get('email');
  }
  get passwordControl() {
    return this.userForm.get('password');
  }
  get aboutControl() {
    return this.userForm.get('about');
  }

  onSubmit() {
    this.userService.updatePfp(this.userForm.value);
  }
}
