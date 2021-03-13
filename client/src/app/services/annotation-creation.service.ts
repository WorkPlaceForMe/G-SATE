import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnnotationCreationService {
  datasetName: string;
  contactName: string;
  emailAddress: string;
  date: any;
  model:any;
  models: any = [];
  version:any;
  versions: any = [];
  constructor(
  ) {
  }

}
