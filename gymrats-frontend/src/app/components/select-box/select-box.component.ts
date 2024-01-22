import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.scss'],
})
export class SelectBoxComponent implements AfterViewInit {
  // @ViewChild("search") search: ElementRef<HTMLInputElement>;
  @ViewChild('countryList', { static: true })
  countryList!: ElementRef<HTMLUListElement>;
  constructor() {}
  ngAfterViewInit(): void {}

  onFocus() {
    this.countryList.nativeElement.classList.remove('hidden');
  }
  onBlur() {
    this.countryList.nativeElement.classList.add('hidden');
  }
}
