import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class FrService {

  ip: string;
  API_URL: string = 'http://' + this.ip + ':8080/api/v1';


  faceRetrieval(req: any, ip) {
    return this.http.post(`${this.API_URL}/retrieval/base64_image`, req);
  }

  delFaceGroup(group: any, ip) {
    return this.http.post(`${this.API_URL}/group/delete`, group);
  }

  listFace(query: any, ip) {
    return this.http.post(`${this.API_URL}/group/query`, query);
  }

  updateFace(face: any, ip) {
    return this.http.post(`${this.API_URL}/face/update`, face);
  }

  queryFace(del: any, ip) {
    return this.http.post(`${this.API_URL}/face/query`, del);
  }

  deleteFace(del: any, ip) {
    return this.http.post(`${this.API_URL}/face/delete`, del);
  }

  faceInsert(face: any, ip) {
    return this.http.post(`${this.API_URL}/face/insert`, face);
  }



  constructor(private http: HttpClient) { }
}
