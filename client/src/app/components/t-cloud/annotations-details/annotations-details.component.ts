import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnnotationsService } from '../../../services/annotations.service';

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
  data: any;
  model: string;
  models: any = [];
  version: number;
  versions: any = [];
  public date_now = new Date(Date.now()).toString();
  public max = new Date(this.date_now);
  constructor(
    private router: Router,
    private annotationsServ: AnnotationsService,
  ) {
    this.data = this.router.getCurrentNavigation().extras.state.data;
    this.annotationsServ.getModels().subscribe(
      res => {
        this.models = res;
      },
      err => console.log(err)
    )

  }

  ngOnInit() {
    debugger;
    // this.datasetName = this.activatedRoute.snapshot.params.folder;
    this.datasetName = this.data.datasetName;
  }

  isFormFilled() {
    let isContactFilled: boolean = this.contactName !== undefined && this.contactName !== "";
    let isEmailFilled: boolean = this.emailAddress !== undefined && this.emailAddress !== "" && this.ValidateEmail(this.emailAddress);
    let isDateTimeFilled: boolean = this.date !== undefined;
    let isModelFilled: boolean = this.model !== undefined;
    let isVersionFilled: boolean = this.version !== undefined;
    return (isContactFilled && isDateTimeFilled && isEmailFilled && isModelFilled && isVersionFilled);
  }

  ValidateEmail(mail) {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
      return (true)
    }
    return (false)
  }

  train() {
    this.annotationsServ.datasetName = this.datasetName;
    this.annotationsServ.contactName = this.contactName;
    this.annotationsServ.emailAddress = this.emailAddress;
    this.annotationsServ.date = this.date;
    this.annotationsServ.version = this.version;
    this.annotationsServ.model = this.model;
    console.log('this.annotationsServ - ', this.annotationsServ);
    console.log('this.data - ', this.data);
    // this.router.navigate(['/annotations/confirm'], { state: { data: this.data } });
  }

}
