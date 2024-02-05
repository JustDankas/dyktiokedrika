import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export interface IAnnouncement {
  id: number;
  title: string;
  text: string;
  created_at: string;
  image: string;
}
@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  private _announcements$ = new BehaviorSubject<IAnnouncement[] | null>(null);
  announcements$ = this._announcements$.asObservable();
  constructor(private http: HttpClient) {
    this.getAnnouncements();
  }
  getAnnouncements() {
    this.http
      .get<IAnnouncement[]>(
        'http://localhost:8000/announcement/view_all_announcements',
        { withCredentials: true }
      )
      .subscribe((data) => {
        console.log(data);
        this._announcements$.next(data);
      });
  }
}
