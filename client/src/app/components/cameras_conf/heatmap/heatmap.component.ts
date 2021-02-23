import { AfterViewInit, Component, ChangeDetectionStrategy, HostListener, OnInit } from '@angular/core';
import { FacesService } from '../../../services/faces.service';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ActivatedRoute, Router } from '@angular/router';
import { Camera } from 'src/app/models/Camera';

declare const h337: any;

@Component({
selector: 'app-heatmap',
templateUrl: './heatmap.component.html',
styleUrls: ['./heatmap.component.css'],
changeDetection: ChangeDetectionStrategy.OnPush
})

export class HeatmapComponent implements AfterViewInit, OnInit {

  constructor(private activatedRoute: ActivatedRoute, private facesService: FacesService, public datepipe: DatePipe, private router: Router, sanitizer: DomSanitizer) { 
  }

  public innerWidth: any;
  public innerHeight: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(window.innerWidth >= 1200){
      this.heatmap_size.width = 1050;
      this.heatmap_size.height = this.heatmap_size.width*this.size.height/this.size.width;
    }else if(window.innerWidth < 1200 && window.innerWidth >= 992){
      this.heatmap_size.width = 870;
      this.heatmap_size.height = this.heatmap_size.width*this.size.height/this.size.width;
    }else if(window.innerWidth < 992 && window.innerWidth >= 768){
      this.heatmap_size.width = 624;
      this.heatmap_size.height = this.heatmap_size.width*this.size.height/this.size.width;
    }else if(window.innerWidth < 768 && window.innerWidth >= 576){
      this.heatmap_size.width = 444;
      this.heatmap_size.height = this.heatmap_size.width*this.size.height/this.size.width;
    }else if(window.innerWidth < 576){
      this.heatmap_size.width = window.innerWidth - 110;
      this.heatmap_size.height = this.heatmap_size.width*this.size.height/this.size.width;
    }
  }
  
  ngOnInit(){
    const params = this.activatedRoute.snapshot.params;
    this.facesService.getCamera(params.uuid).subscribe(
      res =>{
        this.camera = res;
        this.size.width = this.camera.cam_width;
        this.size.height = this.camera.cam_height;
        if(window.innerWidth >= 1200){
          this.heatmap_size.width = 1050;
          this.heatmap_size.height = this.heatmap_size.width*this.size.height/this.size.width;
        }else if(window.innerWidth < 1200 && window.innerWidth >= 992){
          this.heatmap_size.width = 870;
          this.heatmap_size.height = this.heatmap_size.width*this.size.height/this.size.width;
        }else if(window.innerWidth < 992 && window.innerWidth >= 768){
          this.heatmap_size.width = 624;
          this.heatmap_size.height = this.heatmap_size.width*this.size.height/this.size.width;
        }else if(window.innerWidth < 768 && window.innerWidth >= 576){
          this.heatmap_size.width = 444;
          this.heatmap_size.height = this.heatmap_size.width*this.size.height/this.size.width;
        }else if(window.innerWidth < 576){
          this.heatmap_size.width = window.innerWidth - 110;
          this.heatmap_size.height = this.heatmap_size.width*this.size.height/this.size.width;
        }
         },
      err => console.error(err)
    );
  }

  id:string = this.activatedRoute.snapshot.params.uuid;
  public date_now = new Date(Date.now());
  now = this.date_now.toString();
  public dateTime: Date;
  public max = new Date(this.now);
  
  camera: Camera;
  dates: any[];
  size: any={
    width: 0,
    height: 0
  }
  heatmap_size: any={
    width: window.innerWidth - 250,
    height: 768/2
  }
  date: any ={
    start: '',
    end: '',
    dwell: 2,
    size: 0,
    value: 0
  }


  public onChange1(event1): void {
  this.date.dwell = event1.target.value;
}
public onChange2(event2): void {
  this.date.zone = event2.target.value;
}
  zones: any =[]; 
  Hms: any = [];
  Datas: any = [];

  ngAfterViewInit() {
  }

  getHms(start:string, end:string){
    if(this.date.dwell<=1){
      const camera_id = this.activatedRoute.snapshot.params.uuid;
      this.facesService.getdwell1(this.datepipe.transform(start, 'yyyy-M-dd HH:mm'), this.datepipe.transform(end, 'yyyy-M-dd HH:mm'),this.date.dwell, camera_id).subscribe(
        res => {
          this.Hms = res;
          this.date.size = this.Hms.length;
          this.date.value = 280*80000/this.Hms.length;
          if(this.date.value >= 400){
            this.date.value = 400;
          }
          for(var i = 0; i < this.date.size; i++){
            this.Datas[i] = {x: (this.Hms[i].x / (this.size.width/this.heatmap_size.width)), y: (this.Hms[i].y / (this.size.height/this.heatmap_size.height)), value: this.date.value};
          }
          const heatmap = h337.create({
            container: window.document.querySelector('#testNotSameName'),
            radius: 50,
            maxOpacity: 0.6,
            blur: 1,
          });
          heatmap.setData({
            max: this.Datas.length,
            min: 1,
            data: this.Datas
        });
        },
        err => console.error(err)
      );
    }else{
      const camera_id = this.activatedRoute.snapshot.params.uuid;
      this.facesService.gethm1(this.datepipe.transform(start, 'yyyy-M-dd HH:mm'), this.datepipe.transform(end, 'yyyy-M-dd HH:mm'), camera_id).subscribe(
        res => {
          this.Hms = res;
          this.date.size = this.Hms.length;
          this.date.value = 280*80000/this.Hms.length;
          if(this.date.value >= 400){
            this.date.value = 400;
          }
          for(var i = 0; i < this.date.size; i++){
            this.Datas[i] = {x: (this.Hms[i].x / (this.size.width/this.heatmap_size.width)), y: (this.Hms[i].y / (this.size.height/this.heatmap_size.height)), value: this.date.value};
          }
          const heatmap = h337.create({
            container: window.document.querySelector('#testNotSameName'),
            radius: 50,
            maxOpacity: 0.6,
            blur: 1,
          });
          heatmap.setData({
            max: this.Datas.length,
            min: 1,
            data: this.Datas
        });
        },
        err => console.error(err)
      );
    }
  }

  getAll(){
    const camera_id = this.activatedRoute.snapshot.params.uuid;
    this.facesService.getallhm1(camera_id).subscribe(
      res => {
        this.Hms = res;
        this.date.size = this.Hms.length;
        this.date.value = 280*80000/this.Hms.length;
        if(this.date.value >= 400){
          this.date.value = 400;
        }
        for(var i = 0; i < this.date.size; i++){
          this.Datas[i] = {x: (this.Hms[i].x / (this.size.width/this.heatmap_size.width)), y: (this.Hms[i].y / (this.size.height/this.heatmap_size.height)), value: this.date.value};
        }
        console.log(this.Datas)
        const heatmap = h337.create({
          container: window.document.querySelector('#testNotSameName'),
          radius: 50,
          maxOpacity: 0.6,
          blur: 1,
        });
          heatmap.setData({
            max: this.Datas.length,
            min: 1,
            data: this.Datas
        });
      },
      err => console.error(err)
    );
  }
}
