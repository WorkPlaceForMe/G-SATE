import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-videos-details',
  templateUrl: './videos-details.component.html',
  styleUrls: ['./videos-details.component.css']
})
export class VideosDetailsComponent implements OnInit {
  video = {
    name : "",
    description : "",
    samplingRate : 0
  }
  samplingRates: number[] = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
  constructor(private router: Router) { }

  ngOnInit() {
  }
  isFormFilled() {
    return ( this.video.name != "" && this.video.description !="" && this.video.samplingRate);
  }
  confirm() {
    console.log( this.video.name)
    console.log( this.video.samplingRate)
    console.log( this.video.description)
    // this.router.navigate(['/annotations/confirm' ]);
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

  //  send(){
  //   this.annotationsService.saveCustomerDetails(this.customerData).subscribe(
  //     res=>{
  //       console.log(res)
  //       this.router.navigate(['/camerasList'])
  //     },
  //     err => console.log(err)
  //   )
    // }
}
