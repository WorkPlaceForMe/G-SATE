import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ip } from '../models/IpServer';
import { vistaIP } from '../models/VistaServer';


@Injectable({
  providedIn: 'root'
})
export class AnnotationsService {

  API_URL = 'http://'+ ip +':3300/api';
  VISTA_API_URL = vistaIP;

  getImages(where:string,info:string){
    return this.http.get(`${this.API_URL}/getImages/${where}/${info}`);
  }

  getDatasets(which:string){
    return this.http.get(`${this.API_URL}/datasets/${which}`);
  }

  getOperation(id: number) {
    return this.http.get(`${this.API_URL}/api/v1/operation/${id}`);
  }

  readLabels(){
    return this.http.get(`${this.API_URL}/readLabels`);
  }

  writeLabel(label:string){
    return this.http.get(`${this.API_URL}/writeLabel/${label}`);
  }

  writeAnn(path:string, annotation:any){
    return this.http.post(`${this.API_URL}/createAnn/${path}`, annotation);
  }

  getAnn(path:string){
    return this.http.get(`${this.API_URL}/readAnn/${path}`);
  }

  cutVideo(conf: any){
    return this.http.post(`${this.API_URL}/datasets/cortarFrames/`, conf);
  }

  moveImage(path:string, name:string, dec:boolean){
    return this.http.get(`${this.API_URL}/classify/${path}/${name}/${dec}`);
  }

  createDataset(data:any){
    return this.http.post(`${this.API_URL}/dataset/create/`, data);
  }

  processDataset(data:any) {
    return this.http.post(`${this.API_URL}/datasets/process/`, data);
  }

  searchImages(keyword:any) {
    return this.http.get(`${this.API_URL}/search/${keyword}`);
  }
  constructor(private http: HttpClient) { }
}
