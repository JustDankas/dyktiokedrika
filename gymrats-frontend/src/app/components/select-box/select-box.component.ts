import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CountriesService, ICountry } from 'src/app/services/countries.service';

@Component({
  selector: 'app-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.scss'],
})
export class SelectBoxComponent implements AfterViewInit, OnChanges {
  // @ViewChild("search") search: ElementRef<HTMLInputElement>;
  @ViewChild('countryList', { static: true })
  countryList!: ElementRef<HTMLUListElement>;
  @Input() countries: ICountry[] = [];
  filteredCountries: ICountry[] = [];
  constructor() {
    this.filteredCountries = this.countries;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['countries']) {
      this.filteredCountries = this.countries;
    }
  }
  ngAfterViewInit(): void {}

  onFilterInput(filter: Event) {
    this.filteredCountries = this.countries.filter((c) =>
      new RegExp((filter.target as HTMLInputElement).value, 'ig').test(
        c.country
      )
    );
  }

  onFocus() {
    this.countryList.nativeElement.classList.remove('hidden');
  }
  onBlur() {
    this.countryList.nativeElement.classList.add('hidden');
  }
}
