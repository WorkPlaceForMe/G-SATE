import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ip, tarinScriptIP } from '../models/IpServer';
import { Customer } from '../models/Customer';
import { vistaIP } from '../models/VistaServer';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AnnotationsService {
  datasetName: string;
  emailAddress: string;
  date: any;
  model: any;
  overfit_mode: any;
  models: any = [];
  version: any;
  versions: any = [];
  API_URL = 'http://' + ip + ':3000/api';
  TRAINING_SCRIPT_URL = 'http://' + tarinScriptIP + ':8080';
  VISTA_API_URL = vistaIP;

  getImages(where: string, info: string) {
    return this.http.get(`${this.API_URL}/getImages/${where}/${info}`);
  }

  getUnAnnDatasets(which: string) {
    return this.http.get(`${this.API_URL}/datasets/unannotated/${which}`);
  }

  getAnnDatasets(which: string) {
    return this.http.get(`${this.API_URL}/datasets/annotated/${which}`);
  }

  getOperation(id: number) {
    return this.http.get(`${this.API_URL}/api/v1/operation/${id}`);
  }

  readLabels() {
    return this.http.get(`${this.API_URL}/readLabels`);
  }

  writeLabel(label: string) {
    return this.http.get(`${this.API_URL}/writeLabel/${label}`);
  }

  writeAnn(path: string, annotation: any) {
    return this.http.post(`${this.API_URL}/createAnn/${path}`, annotation);
  }

  getAnn(path: string) {
    return this.http.get(`${this.API_URL}/readAnn/${path}`);
  }

  cutVideo(conf: any) {
    return this.http.post(`${this.API_URL}/datasets/cortarFrames/`, conf);
  }

  moveImage(path: string, name: string, dec: boolean) {
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

  trainScript(data: any) {
    return this.http.post(`${this.TRAINING_SCRIPT_URL}/preprocess`, data);
  }

  getTestList() {
    return this.http.get(`${this.TRAINING_SCRIPT_URL}/trainingID`);
  }

  getGraph(data) {
    return this.http.get(`${this.TRAINING_SCRIPT_URL}/trainingData?training_id=` + data.dataset_id + `&dataset_name=` + data.dataset_name );
  }

  createDataset(data: any) {
    return this.http.post(`${this.API_URL}/datasets/image/search/create`, data);
  }

  processDatasetWithOutVista(data: any) {
    return this.http.post<any[]>(`${this.API_URL}/datasets/process-without-vista`, data);
  }

  processVistaSingle(data: any) {
    return this.http.post(`${this.API_URL}/datasets/process/vista/single`, data);
  }

  processDataset(data: any) {
    return this.http.post<any[]>(`${this.API_URL}/datasets/process/`, data).pipe(catchError(this.handleError));
  }

  generalDetection(data: any) {
    return this.http.post<any[]>(`${this.API_URL}/general/object/detection`, data);
  }

  getPPEDetection(data: any) {
    return this.http.post<any[]>(`${this.API_URL}/ppe/detection/object/detection`, data);
  }

  deleteDataset(snippet_id: string, type: string, name: any) {
    return this.http.delete(`${this.API_URL}/datasets/${name}/${snippet_id}/${type}`);
  }

  searchImages(keyword: any, count: number) {
    return this.http.get(`${this.API_URL}/search/${keyword}/${count}`);
  }
  constructor(private http: HttpClient) { }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // console.log(errorMessage);
    return throwError(errorMessage);
  }
}
