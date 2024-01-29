import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CountriesService, ICountry } from 'src/app/services/countries.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss'],
})
export class RegisterModalComponent implements OnInit {
  registerForm = new FormGroup({
    nameControl: new FormControl('', Validators.required),
    surnameControl: new FormControl('', Validators.required),
    emailControl: new FormControl('', [Validators.required, Validators.email]),
    usernameControl: new FormControl('', [Validators.required]),
    passwordControl: new FormControl('', [Validators.required]),
    countryControl: new FormControl('undefined', Validators.required),
    cityControl: new FormControl('undefined', Validators.required),
    streetControl: new FormControl('', [Validators.required]),
  });

  isStep1 = true;

  countries: ICountry[] = [];
  cities: string[] = [];
  selectedCountry: string | null = null;
  user$;
  constructor(
    private countriesSrv: CountriesService,
    private userSrv: UserService,
    private router: Router
  ) {
    this.user$ = this.userSrv.user$;
  }
  ngOnInit(): void {
    this.countriesSrv.getCountries().subscribe((res) => {
      this.countries = res.data;
    });
    this.registerForm.get('countryControl')?.valueChanges.subscribe((v) => {
      if (v == null) {
        this.cities = [];
      }
      //@ts-ignore
      this.cities = this.countries.find((c) => c.country === v)?.cities || [];
    });
  }

  // Step 1
  get nameControl() {
    return this.registerForm?.get('nameControl');
  }
  get surnameControl() {
    return this.registerForm?.get('surnameControl');
  }
  get emailControl() {
    return this.registerForm?.get('emailControl');
  }
  get usernameControl() {
    return this.registerForm?.get('usernameControl');
  }
  get passwordControl() {
    return this.registerForm?.get('passwordControl');
  }
  // Step 2
  get countryControl() {
    return this.registerForm?.get('countryControl');
  }
  get cityControl() {
    return this.registerForm?.get('cityControl');
  }
  get streetControl() {
    return this.registerForm?.get('streetControl');
  }

  countryChange(country: string) {
    this.countryControl?.setValue(country);
  }

  onSubmit() {
    // this.userSrv.register(this.registerForm.value);
    this.userSrv.register(this.registerForm.value);
  }

  next() {
    if (!this.isStep1) return;
    this.isStep1 = false;
    const carouselNext = document.getElementById('carousel-next');
    carouselNext?.click();
  }
  prev() {
    if (this.isStep1) return;
    this.isStep1 = true;
    const carouselPrev = document.getElementById('carousel-prev');
    carouselPrev?.click();
  }

  // getFlagEmoji(countryCode: string) {
  //   const codePoints = countryCode
  //     .toUpperCase()
  //     .split('')
  //     .map((char) => 127397 + char.charCodeAt(0));
  //   return String.fromCodePoint(...codePoints);
  // }
}
