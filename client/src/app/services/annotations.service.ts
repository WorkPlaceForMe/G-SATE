import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ip } from '../models/IpServer';
import { Customer } from '../models/Customer';
import { vistaIP } from '../models/VistaServer';


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
  API_URL = 'http://'+ ip +':3000/api';
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

  getModels() {
    return this.http.get(`${this.API_URL}/annotations/models`);
  }

  saveCustomerDetails(conf: Customer) {
    return this.http.post(`${this.API_URL}/annotations/confirmed`, conf);
  }
  
  saveObjectDetectionDetails(conf: Customer) {
    return this.http.post(`${this.API_URL}/annotations/object-detection/confirmed`, conf);
  }

  createDataset(data:any){
    return this.http.post(`${this.API_URL}/datasets/image/search/create`, data);
  }

  processDataset(data:any) {
    return this.http.post(`${this.API_URL}/datasets/process/`, data);
  }

  generalDetection(data:any) {
    return this.http.post(`${this.API_URL}/general/object/detection`, data);
  }

  deleteDataset(datasetID:string) {
    return this.http.delete(`${this.API_URL}/datasets/${datasetID}`);
  }

  searchImages(keyword:any) {
    return this.http.get(`${this.API_URL}/search/${keyword}`);
  }
  constructor(private http: HttpClient) { }
}
