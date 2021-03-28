import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Params, Router,ActivatedRoute } from '@angular/router';
import { AnnotationsService} from '../../../services/annotations.service';
import { v4 as uuid } from 'uuid';
import { Customer } from 'src/app/models/Customer';

@Component({
  selector: 'app-object-confirm',
  templateUrl: './object-detection-confirm.component.html',
  styleUrls: ['./object-detection-confirm.component.css']
})
export class ObjectDetectionConfirmComponent implements OnInit {
  // customerData: Customer = {
  //   id : '',
  //   datasetName : null,
  //   contactName: null,
  //   emailAddress: null,
  //   date: null,
  //   model: null,
  //   version: null
  // };
  customerData:Customer = {
       id : '',
    datasetName : null,
    contactName: null,
    emailAddress: null,
    date: null,
    model: null,
    version: null,
    data: null
  }
  folder: string;

  constructor(private annotationsService:AnnotationsService, private router:Router, private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.route.params.subscribe((params:Params)=>{
      this.folder = params['dataName'];
    });
    this.customerData.datasetName = this.annotationsService.datasetName ;
    this.customerData.contactName = this.annotationsService.contactName ;
    this.customerData.emailAddress = this.annotationsService.emailAddress;
    this.customerData.date = this.annotationsService.date;
    this.customerData.version = this.annotationsService.version;
    this.customerData.model = this.annotationsService.model;
  }

  back() {
    this.router.navigate(['/annotations/' + 'dataset' + '/' + 'object' + '/0' + '/details']);
  }

  send(){
    this.customerData.id = uuid();

    this.annotationsService.saveObjectDetectionDetails(this.customerData).subscribe(
      res=>{
        this.router.navigate(['/camerasList'])
      },
      err => console.log(err)
    )

    }
   
}
