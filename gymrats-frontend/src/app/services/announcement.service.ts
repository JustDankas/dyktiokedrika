import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { ConfigService } from './config.service';
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
  constructor(private http: HttpClient, private configSrv: ConfigService) {
    this.getAnnouncements();
  }
  getAnnouncements(limit?: number) {
    const params: any = {};
    if (limit) {
      params['limit'] = limit;
    }
    return this.http.get<IAnnouncement[]>(
      this.configSrv.url + 'announcement/view_all_announcements',
      { withCredentials: true, params }
    );
  }
  createAnnouncement(announcement: IAnnouncement | null) {
    return this.http.post(
      this.configSrv.url + 'announcement/create_announcement',
      { ...announcement },
      { withCredentials: true }
    );
  }
  updateAnnouncement(announcement: IAnnouncement | null) {
    return this.http.put(
      this.configSrv.url + 'announcement/update_announcement',
      { ...announcement },
      { withCredentials: true }
    );
  }
  deleteAnnouncement(announcementId: number) {
    return this.http.delete(
      this.configSrv.url + 'announcement/delete_announcement',
      {
        withCredentials: true,
        body: {
          id: announcementId,
        },
      }
    );
  }
}
