import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent {
  // user: IUser | null = null;
  user$;
  form = new FormGroup({
    image: new FormControl<File | string>('', Validators.required),
  });
  constructor(private userSrv: UserService) {
    this.user$ = userSrv.user$;
  }

  onFileChange(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    // this.form.patchValue({
    //   image: file,
    // });
    if (!file) {
      return;
    }
    this.userSrv.changePfp(file);
  }
}
