import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
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
  countryListEl!: ElementRef<HTMLUListElement>;
  @Input() countries: ICountry[] = [];
  filteredCountries: ICountry[] = [];
  filter: string = '';
  @Output() countryChanged = new EventEmitter<string>();
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
    this.filter = (filter.target as HTMLInputElement).value;
    this.filteredCountries = this.countries.filter((c) =>
      new RegExp((filter.target as HTMLInputElement).value, 'ig').test(
        c.country
      )
    );
  }

  onFocus() {
    this.countryListEl.nativeElement.classList.remove('hidden');
  }
  closeMenu() {
    this.countryListEl.nativeElement.classList.add('hidden');
  }
  changeCountry(ev: Event) {
    const { value } = ev.target as HTMLInputElement;
    this.filter = value;
    this.filteredCountries = this.countries.filter((c) =>
      new RegExp(value, 'ig').test(c.country)
    );
    this.countryChanged.emit(value);
  }
}
