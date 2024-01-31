import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  loading$ = new BehaviorSubject(false);
  constructor() {}

  toggleLoading() {
    this.loading$.next(!this.loading$.getValue());
  }
}
