import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'warning' | 'danger' | 'info';

export interface IToast {
  message: string;
  type: ToastType;
}

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
