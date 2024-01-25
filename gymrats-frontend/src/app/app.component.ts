import { Component, OnInit } from '@angular/core';
import { CountriesService } from './services/countries.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'gymrats-frontend';
  constructor(private countriesSrc: CountriesService) {}
  ngOnInit(): void {
    // this.countriesSrc.initiate();
  }
}
