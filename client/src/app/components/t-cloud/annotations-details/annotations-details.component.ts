import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  constructor(private router: Router,  private datepipe: DatePipe) { }

  ngOnInit() {
  }

  train() {
    this.router.navigate(['/annotations' ]);
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
