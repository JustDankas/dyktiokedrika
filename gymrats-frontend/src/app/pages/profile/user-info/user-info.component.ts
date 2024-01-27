import { Component } from '@angular/core';
import { IUser, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent {
  // user: IUser | null = null;
  user$;
  constructor(private userSrv: UserService) {
    this.user$ = userSrv.user$;
  }
}
