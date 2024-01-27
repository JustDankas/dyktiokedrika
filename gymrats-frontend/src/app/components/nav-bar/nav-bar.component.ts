import { Component } from '@angular/core';
import { CountriesService, ICountry } from 'src/app/services/countries.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  user$;
  constructor(private userSrv: UserService) {
    this.user$ = userSrv.user$;
  }

  logout() {
    this.userSrv.logout();
  }
}
