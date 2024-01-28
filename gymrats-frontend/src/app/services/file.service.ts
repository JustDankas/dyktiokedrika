import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor() {}

  blobToB64(data: any) {
    // console.log(data);
    return String.fromCharCode(...data);
  }
}
