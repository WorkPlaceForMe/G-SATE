import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnnotationCreationService} from '../../../services/annotation-creation.service';

@Component({
  selector: 'app-annotations-confirm',
  templateUrl: './annotations-confirm.component.html',
  styleUrls: ['./annotations-confirm.component.css']
})
export class AnnotationsConfirmComponent implements OnInit {
  datasetName: string;
  contactName: string;
  emailAddress: string;
  date: any;
  model:any;
  version:any;
  constructor(private annotationData:AnnotationCreationService, private router:Router) { }

  ngOnInit() {
    this.datasetName = this.annotationData.datasetName ;
    this.contactName = this.annotationData.contactName ;
    this.emailAddress = this.annotationData.emailAddress;
    this.date = this.annotationData.date;
    this.version = this.annotationData.version;
    this.model = this.annotationData.model;
  }

  back() {
    this.router.navigate(['/annotations/' + 'object' + '/' + 'miguel' + '/0' + '/details']);
  }
   


}
