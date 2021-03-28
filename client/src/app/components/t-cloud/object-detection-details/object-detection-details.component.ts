import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AnnotationsService} from '../../../services/annotations.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-object-detection-details',
  templateUrl: './object-detection-details.component.html',
  styleUrls: ['./object-detection-details.component.css']
})
export class ObjectDetectionDetailsComponent implements OnInit {
  datasetName: string;
  contactName: string;
  emailAddress: string;
  date: any;
  model:string;
  models: any = [];
  version:number;
  versions: any = [];
  public date_now = new Date(Date.now()).toString();
  public max = new Date(this.date_now);
  constructor(private router: Router,  private datepipe: DatePipe, private annotationsServ:AnnotationsService, private http: HttpClient, private activatedRoute:ActivatedRoute) {
    this.annotationsServ.getModels().subscribe(
      res => {
        this.models= res;
        console.log(this.models);
      },
      err => console.log(err)
    )

   }

  ngOnInit() {
    this.datasetName = this.activatedRoute.snapshot.params.folder;
    this.contactName = this.annotationsServ.contactName ;
    this.emailAddress = this.annotationsServ.emailAddress;
    this.date = this.annotationsServ.date;
    this.version = this.annotationsServ.version;
    this.model = this.annotationsServ.model;
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
    this.annotationsServ.datasetName = this.datasetName;
    this.annotationsServ.contactName = this.contactName;
    this.annotationsServ.emailAddress= this.emailAddress;
    this.annotationsServ.date = this.date;
    this.annotationsServ.version = this.version;
    this.annotationsServ.model = this.model;
    this.router.navigate(['/annotations/objectDetection/confirm' ]);
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
