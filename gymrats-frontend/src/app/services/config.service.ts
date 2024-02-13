import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  /**
   * Value is http://localhost:8000/ for development
   * Value is http://83.212.75.182:8420/ for production
   */
  url = 'http://localhost:8000/';

  constructor() {
    if (isDevMode()) {
      this.url = 'http://localhost:8000/';
    } else {
      this.url = 'http://83.212.75.182:8420/';
    }
  }
}
