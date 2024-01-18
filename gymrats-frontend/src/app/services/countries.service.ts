import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
export interface ICountry {
  iso2: string;
  iso3: string;
  country: string;
  cities: string[];
}
@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private countries: ICountry[] = [];
  constructor(private http: HttpClient) {}

  // getCountries() {
  //   return this.countries;
  // }

  getCountries() {
    return this.http.get<{ data: ICountry[]; error: boolean }>(
      'https://countriesnow.space/api/v0.1/countries'
    );
  }

  getCities(country: string) {
    return this.countries.find((c) => c.country === country)?.cities || null;
  }

  // initiate() {
  //   this.http
  //     .get<{ data: ICountry[]; error: boolean }>(
  //       'https://countriesnow.space/api/v0.1/countries'
  //     )
  //     .subscribe((res) => {
  //       console.log(res);
  //       this.countries = res.data;
  //     });
  // }
}
