import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  url = 'http://localhost:8000/';

  constructor() {
    if (isDevMode()) {
      console.log('first');
      this.url = 'http://localhost:8000/';
    } else {
      console.log('second');
      this.url = 'http://83.212.75.182:8420/';
    }
  }
}