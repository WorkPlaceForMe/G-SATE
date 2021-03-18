import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Params, Router,ActivatedRoute } from '@angular/router';
import { AnnotationsService} from '../../../services/annotations.service';


@Component({
  selector: 'app-annotations-confirm',
  templateUrl: './annotations-confirm.component.html',
  styleUrls: ['./annotations-confirm.component.css']
})
export class AnnotationsConfirmComponent implements OnInit {
   private url = 'localhost:3300/api/annotations/';
  folder: string;
  datasetName: string;
  contactName: string;
  emailAddress: string;
  date: any;
  model:any;
  version:any;
  constructor(private annotationData:AnnotationsService, private router:Router, private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.route.params.subscribe((params:Params)=>{
      this.folder = params['dataName'];
      console.log(this.folder);
    });
    this.fetchPosts();
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

  onConfirmed(postData: {title:string;content:string}) {
    this.http.post(this.url+'/annotations/confirmed',postData).subscribe(responseData=> {
      console.log(responseData);
    });
  }

  private fetchPosts() {
    this.http.get('/annotations/' + 'object' + '/' + 'miguel' + '/0' + '/details').subscribe(posts=>{
      console.log(posts);
    });
  }
   


}
