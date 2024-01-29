import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent {
  user$;
  loginForm = new FormGroup({
    nameControl: new FormControl('', Validators.required),
    // emailControl: new FormControl('', [Validators.required, Validators.email]),
    passwordControl: new FormControl('', [Validators.required]),
  });

  private userSrv: UserService;

  constructor(userSrv: UserService) {
    this.userSrv = userSrv;
    this.user$ = userSrv.user$;
  }

  onSubmit() {
    // console.log(this.loginForm);

    this.userSrv.login(this.loginForm.value);
  }

  get nameControl() {
    return this.loginForm.get('nameControl');
  }
  // get emailControl() {
  //   return this.loginForm.get('emailControl');
  // }
  get passwordControl() {
    return this.loginForm.get('passwordControl');
  }
}
