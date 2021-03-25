import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnotationsService } from '../../../services/annotations.service';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { FacesService } from 'src/app/services/faces.service';
import JSMpeg from '@cycjimmy/jsmpeg-player';

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
    name: '',
    stream: ''
  };
  ss: number;
  t: number;
  title: string;
  start: any;
  finish: any;
  act: boolean = false;
  cameras: any;
  cam_name: any;
  rtsp_in: any;
  player: any;
  link: SafeResourceUrl;

  @ViewChild('streaming', {static: false}) streamingcanvas: ElementRef;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private annotationservice: AnnotationsService,
    private router: Router,
    sanitizer: DomSanitizer,
    private facesservices: FacesService
  ) {
    this.link = sanitizer.bypassSecurityTrustStyle('url(' + 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov' + ')');
  }

  ngOnInit() {
    this.cam_name = this.activatedRoute.snapshot.params.cam_name;
    this.getCameraList();
    this.title = this.cam_name + ' at ' + this.activatedRoute.snapshot.params.date;
  }

  ngOnDestroy(){
    this.destroy();
  }

  destroy(){
    if(this.player != undefined){
      this.player.destroy();
      this.player = null;
      let cam = this.cameras.filter(element => element.name === this.cam_name);
      this.rtsp_in = cam[0].rtsp_in;
      let data = {
        camera_name: cam[0].name,
        rtsp_in: cam[0].rtsp_in,
        id: cam[0].id
      };
      this.facesservices.stopWsStream(data).subscribe(
        res =>{
        },
        err=> console.error(err)
      )
    }
  }

  getCameraList() {
    this.facesservices.getCameras().subscribe(
      res => {
        this.cameras = res;
        this.loadLiveCam();
      },
      err => console.log(err)
    )
  }

  loadLiveCam() {
    let cam = this.cameras.filter(element => element.name === this.cam_name);
    this.rtsp_in = cam[0].rtsp_in;
    let data = {
      camera_name: cam[0].name,
      rtsp_in: cam[0].rtsp_in,
      id: cam[0].id
    };
    this.facesservices.startWsStream(data).subscribe(
      res =>{
        this.player = new JSMpeg.Player(`ws://${res['my_ip']}:${res['port']}`, {
          canvas: this.streamingcanvas.nativeElement, autoplay: true, audio: false, loop: true
        })
      },
      err=> console.error(err)
    )
  }

  change(i, t) {
    if (i.length == 5) {
      i = i + ':00'
    }
    const time = i.split(':');
    time[0] = +time[0];
    time[1] = +time[1];
    time[2] = +time[2];
    if (t == 's') {
      if (this.start.length == 5) {
        this.start = this.start + ':00'
      }
      this.ss = time[0] * 60 * 60 + time[1] * 60 + time[2];
    } else if (t == 'f') {
      if (this.finish.length == 5) {
        this.finish = this.finish + ':00'
      }
      this.t = time[0] * 60 * 60 + time[1] * 60 + time[2];
    }
    if (this.start != undefined && this.finish != undefined) {
      this.act = true;
    }
  }

  send() {
    let cam = this.cameras.filter(element => element.name === this.cam_name);
    this.conf.ss = this.ss;
    this.conf.cam_id = cam[0].id;
    this.conf.t = this.t - this.ss;
    this.conf.name = this.cam_name;
    this.conf.stream = this.rtsp_in;
    console.log('>>>>>>>>>>>', this.conf);
    this.router.navigate(['/annotations'])
    /* this.annotationservice.cutVideo(this.conf).subscribe(
      res => {
        this.router.navigate(['/annotations'])
      },
      err => console.log(err)
    ) */
  }

}
