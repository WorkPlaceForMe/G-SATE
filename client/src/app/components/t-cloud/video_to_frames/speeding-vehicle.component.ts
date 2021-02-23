import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnotationsService } from '../../../services/annotations.service';

@Component({
  selector: 'app-speeding-vehicle',
  templateUrl: './speeding-vehicle.component.html',
  styleUrls: ['./speeding-vehicle.component.css']
})
export class SpeedingVehicleComponent implements OnInit {

conf: any = {
  ss: 0,
  t: 0,
  fps: 1,
  name: ''
};
ss:number;
t:number;
title:string;
start:any;
finish:any;
act:boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private annotationservice: AnnotationsService, 
    private router: Router
    ) { }

  ngOnInit(){
    this.title = this.activatedRoute.snapshot.params.cam_name + ' at ' + this.activatedRoute.snapshot.params.date;
  }

  change(i,t){
    if(i.length == 5){
    i = i + ':00'
    }
    const time = i.split(':');
    time[0] = +time[0];
    time[1] = +time[1];
    time[2] = +time[2];
    if(t == 's'){
      if(this.start.length == 5){
        this.start = this.start + ':00'
      }
        this.ss = time[0]*60*60 + time[1]*60 +time[2];
      }else if( t == 'f'){
        if(this.finish.length == 5){
          this.finish = this.finish + ':00'
        }
      this.t = time[0]*60*60 + time[1]*60 +time[2];
    }
    if(this.start != undefined && this.finish != undefined){
      this.act = true;
    }
  }

  send(){
    this.conf.name = this.title;
    this.conf.ss = this.ss;
    this.conf.t = this.t - this.ss;

    //test no real code
    this.conf.name = 'video.mov'
    //end of test

    this.annotationservice.cutVideo(this.conf).subscribe(
      res=>{
        console.log(res)
        this.router.navigate(['/annotations'])
      },
      err => console.log(err)
    )
    console.log(this.conf)
  }

}
