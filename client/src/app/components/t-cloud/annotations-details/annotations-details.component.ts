import { DatePipe } from '@angular/common';
import { stringify } from '@angular/compiler/src/util';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnnotationCreationService} from '../../../services/annotation-creation.service';

@Component({
  selector: 'app-annotations-details',
  templateUrl: './annotations-details.component.html',
  styleUrls: ['./annotations-details.component.css']
})
export class AnnotationsDetailsComponent implements OnInit {
  datasetName: string;
  contactName: string;
  emailAddress: string;
  date: any;
  model:any;
  models: any = [];
  version:any;
  versions: any = [];
  public date_now = new Date(Date.now()).toString();
  public max = new Date(this.date_now);
  constructor(private router: Router,  private datepipe: DatePipe, private annotationData:AnnotationCreationService) { }

  ngOnInit() {
  }

  isFormFilled() {
    let isContactFilled:boolean = this.contactName!==undefined && this.contactName!=="";
    let isEmailFilled:boolean = this.emailAddress!==undefined && this.emailAddress!=="" && this.ValidateEmail(this.emailAddress);
    let isDateTimeFilled:boolean = this.date!==undefined;
    let isModelFilled:boolean = this.model!==undefined;
    let isVersionFilled:boolean = this.version!==undefined;
    return (isContactFilled && isDateTimeFilled && isEmailFilled && isModelFilled && isVersionFilled);
  }

  ValidateEmail(mail) {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail))
      {
        return (true)
      }
        return (false)
  }
  train() {
    this.annotationData.datasetName = this.datasetName;
    this.annotationData.contactName = this.contactName;
    this.annotationData.emailAddress= this.emailAddress;
    this.annotationData.date = this.date;
    this.annotationData.version = this.version;
    this.annotationData.model = this.model;
    this.router.navigate(['/annotations/confirm' ]);
    // if (this.valueImage < this.total - 1) {
    //   this.valueImage++;
    //   if (JSON.stringify(this.cacheAnnot) != JSON.stringify(this.annotations)) {
    //     this.send();
    //   } else {
    //     this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
    //       this.router.navigate(['/annotations/' + this.activatedRoute.snapshot.params.method + '/' + this.activatedRoute.snapshot.params.folder + '/' + this.valueImage]);
    //     });
    //   }
    // } else if (this.valueImage == this.total - 1) {
    //   if (JSON.stringify(this.cacheAnnot) != JSON.stringify(this.annotations)) {
    //     this.send();
    //   } else {
    //     this.router.navigateByUrl('/annotations');
    //   }
    // }
  }
}
