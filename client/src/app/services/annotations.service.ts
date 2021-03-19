import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ip } from '../models/IpServer';
import { Customer } from '../models/Customer';


@Injectable({
  providedIn: 'root'
})
export class AnnotationsService {
  datasetName: string;
  contactName: string;
  emailAddress: string;
  date: any;
  model:any;
  models: any = [];
  version:any;
  versions: any = [];
  API_URL = 'http://'+ ip +':3300/api';

  getImages(where:string,info:string){
    return this.http.get(`${this.API_URL}/getImages/${where}/${info}`);
  }

  getDatasets(which:string){
    return this.http.get(`${this.API_URL}/getFolders/${which}`);
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
    return this.http.post(`${this.API_URL}/cortarFrames/`, conf);
  }

  moveImage(path:string, name:string, dec:boolean){
    return this.http.get(`${this.API_URL}/classify/${path}/${name}/${dec}`);
  }

  getModels() {
    return this.http.get(`${this.API_URL}/annotations/models`);
  }

  saveCustomerDetails(conf: Customer) {
    return this.http.post(`${this.API_URL}/annotations/confirmed`, conf);
  }
  constructor(private http: HttpClient) { }
}
