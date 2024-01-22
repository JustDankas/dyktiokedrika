import { Component } from '@angular/core';
import { CountriesService, ICountry } from 'src/app/services/countries.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  countries: ICountry[] = [];
  constructor(private countriesSrv: CountriesService) {
    this.countriesSrv.getCountries().subscribe((res) => {
      this.countries = res.data;
    });
  }
}
