import { Component } from '@angular/core';
import { IUser, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent {
  selectedTab = 'users';
  isLoading = true;
  admins: IUser[] = [];
  trainers: IUser[] = [];
  users: IUser[] = [];
  notAssignedUsers: IUser[] = [];
  constructor(userService: UserService) {
    userService.getAllUsers().subscribe((users: any) => {
      console.log(users);
      users.forEach((user: IUser) => {
        if (user['role'] == 'admin') this.admins.push(user);
        if (user['role'] == 'trainer') this.trainers.push(user);
        if (user['role'] == 'user') this.users.push(user);
        if (user['role'] == 'notAssigned') this.notAssignedUsers.push(user);
      });
      this.isLoading = false;
    });
  }
}
