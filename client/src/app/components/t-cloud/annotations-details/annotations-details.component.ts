import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnnotationsService } from '../../../services/annotations.service';
import { Customer } from 'src/app/models/Customer';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-annotations-details',
  templateUrl: './annotations-details.component.html',
  styleUrls: ['./annotations-details.component.css']
})
export class AnnotationsDetailsComponent implements OnInit {
  payloadType: string;
  datasetName: string;
  contactName: string;
  emailAddress: string;
  date: any;
  data: any;
  model: string;
  models: any = [];
  versions: any = [];
  customerData: Customer = {
    id: '',
    datasetName: null,
    contactName: null,
    emailAddress: null,
    date: null,
    model: null,
    version: null,
    data: null
  }
  public date_now = new Date(Date.now()).toString();
  public min = new Date(this.date_now);
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
    this.datasetName = this.data.datasetName;
    this.payloadType = this.data.payloadType;
    delete this.data['datasetName'];
    delete this.data['payloadType'];
  }

  isFormFilled() {
    let isContactFilled: boolean = this.contactName !== undefined && this.contactName !== "";
    let isEmailFilled: boolean = this.emailAddress !== undefined && this.emailAddress !== "" && this.ValidateEmail(this.emailAddress);
    let isDateTimeFilled: boolean = this.date !== undefined;
    let isModelFilled: boolean = this.model !== undefined;
    return (isContactFilled && isDateTimeFilled && isEmailFilled && isModelFilled);
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
    this.annotationsServ.date = new Date(this.date).toUTCString();
    this.annotationsServ.model = this.model;
    console.log('this.annotationsServ - ', this.annotationsServ);
    console.log('this.data - ', this.data);
    console.log('this.payloadType - ', this.payloadType);
    this.prepareCustomerData();
    if (this.payloadType === 'image') {
      this.sendSingleImageAnnotations();
    } else {
      this.datasetAnnotations();
    }
    // this.router.navigate(['/annotations/confirm'], { state: { data: this.data } });
    // this.router.navigate(['/annotations/objectDetection/confirm'], { state: { data: this.data } });
  }

  prepareCustomerData() {
    this.customerData.data = this.data;
    this.customerData.datasetName = this.annotationsServ.datasetName;
    this.customerData.contactName = this.annotationsServ.contactName;
    this.customerData.emailAddress = this.annotationsServ.emailAddress;
    this.customerData.date = this.annotationsServ.date;
    this.customerData.version = this.annotationsServ.version;
    this.customerData.model = this.annotationsServ.model;
    this.customerData.id = uuid();
  }

  sendSingleImageAnnotations() {
    console.log('sendSingleImageAnnotations Req - ', JSON.stringify(this.customerData));
    this.annotationsServ.saveCustomerDetails(this.customerData).subscribe(
      (res) => {
        console.log('sendSingleImageAnnotations Response - ', JSON.stringify(res));
        this.sendPayloadToTrain(res);
      },
      err => console.log(err)
    )
  }

  datasetAnnotations() {
    console.log('datasetAnnotations Req - ', JSON.stringify(this.customerData));
    this.annotationsServ.saveObjectDetectionDetails(this.customerData).subscribe(
      (res) => {
        console.log('datasetAnnotations Response - ', JSON.stringify(res));
        this.sendPayloadToTrain(res);
      },
      err => console.log(err)
    )
  }

  sendPayloadToTrain(data) {
    this.annotationsServ.trainScript(data).subscribe(
      (res: any) => {
        console.log('sendPayloadToTrain Response - ', res);
        var now = moment(res.date).format('DD/MM/YYYY h:mm A');
        alert('Your training has been saved. It will start on ' + now);
        this.router.navigate(['/annotations']);
      },
      err => console.log(err)
    )
  }

}
