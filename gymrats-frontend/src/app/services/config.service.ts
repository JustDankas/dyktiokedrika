import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  url = 'http://localhost:8000/';

  constructor() {}
}
