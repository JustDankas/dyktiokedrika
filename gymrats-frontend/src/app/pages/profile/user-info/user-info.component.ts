import { Component } from '@angular/core';
import { IUser, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent {
  user: IUser | null = null;
  constructor(private userSrv: UserService) {}
  ngOnInit(): void {
    this.user = this.userSrv.user;
  }
}
