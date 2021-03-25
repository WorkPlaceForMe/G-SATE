import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ip } from '../models/IpServer';


@Injectable({
  providedIn: 'root'
})
export class CameraService {

  API_URL = 'http://'+ ip +':3300/api';

  uploadVideo(video:any){
    return this.http.post(`${this.API_URL}/uploadVideo`, video);
  }
  constructor(private http: HttpClient) { }
}
