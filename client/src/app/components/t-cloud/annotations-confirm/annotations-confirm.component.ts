import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { AnnotationsService } from '../../../services/annotations.service';
import { v4 as uuid } from 'uuid';
import { Customer } from 'src/app/models/Customer';

@Component({
  selector: 'app-annotations-confirm',
  templateUrl: './annotations-confirm.component.html',
  styleUrls: ['./annotations-confirm.component.css']
})
export class AnnotationsConfirmComponent implements OnInit {
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
  folder: string;

  constructor(private annotationsService: AnnotationsService, private router: Router, private route: ActivatedRoute, private http: HttpClient) {
    this.customerData.data = this.router.getCurrentNavigation().extras.state.data;
  }

  ngOnInit() {
    console.log('this.annotationsService - ', this.annotationsService);
    this.route.params.subscribe((params: Params) => {
      this.folder = params['dataName'];
    });
    this.customerData.datasetName = this.annotationsService.datasetName;
    this.customerData.contactName = this.annotationsService.contactName;
    this.customerData.emailAddress = this.annotationsService.emailAddress;
    this.customerData.date = this.annotationsService.date;
    this.customerData.version = this.annotationsService.version;
    this.customerData.model = this.annotationsService.model;
  }

  back() {
    this.router.navigate(['/annotations/' + 'object' + '/' + 'miguel' + '/0' + '/details']);
    // this.router.navigate(['/annotations/' + 'dataset' + '/' + 'object' + '/0' + '/details']);
  }

  send() {
    this.customerData.id = uuid();
    console.log('Req - ', JSON.stringify(this.customerData));
    this.annotationsService.saveCustomerDetails(this.customerData).subscribe(
      (res) => {
        console.log('Response - ', JSON.stringify(res));
        this.router.navigate(['/annotations']);
      },
      err => console.log(err)
    )

  }

  // send() {
  //   this.customerData.id = uuid();
  //   console.log('Req - ', JSON.stringify(this.customerData));
  //   this.annotationsService.saveObjectDetectionDetails(this.customerData).subscribe(
  //     (res) => {
  //       console.log('Response - ', JSON.stringify(res));
  //       this.router.navigate(['/annotations']);
  //     },
  //     err => console.log(err)
  //   )

  // }

}
