import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AnnotationsService } from "../../../services/annotations.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { FacesService } from "src/app/services/faces.service";
import JSMpeg from "@cycjimmy/jsmpeg-player";
import { ip } from "src/app/models/IpServer";
import { Location } from "@angular/common";

import * as jQuery from 'jquery'

@Component({
  selector: "app-speeding-vehicle",
  templateUrl: "./speeding-vehicle.component.html",
  styleUrls: ["./speeding-vehicle.component.scss"],
})
export class SpeedingVehicleComponent implements OnInit {
  availableTimeStart: string[] = [];
  availableTimeFinish: string[] = [];
  conf: any = {
    ss: 0,
    t: 0,
    fps: 1,
    name: "",
    stream: "",
    datasetName: "",
  };
  title: string;
  start: any;
  finish: any;
  maxTime: any;
  act: boolean = false;
  stored_vid: boolean = false;
  liveFeed: boolean = false;
  flag: boolean = true;
  isValidTime: boolean = true;
  timeValidityMessage: string;
  cameras: any;
  cam_name: any;
  rtsp_in: any;
  player: any;
  waitingTime: any;
  datasetName: string;
  link: SafeResourceUrl;
  picturesNumber: number;

  @ViewChild("streaming", { static: false }) streamingcanvas: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private annotationservice: AnnotationsService,
    private router: Router,
    sanitizer: DomSanitizer,
    private facesservices: FacesService,
    private _location: Location
  ) {
    this.link = sanitizer.bypassSecurityTrustStyle(
      "url(" +
        "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov" +
        ")"
    );
  }

  ngOnInit() {
    this.cam_name = this.activatedRoute.snapshot.params.cam_name;
    this.getCameraList();
    this.title =
      this.cam_name + " at " + this.activatedRoute.snapshot.params.date;

    // Select2
    jQuery('.createDatasetSelect2').select2({
      placeholder: "Enter Dataset Name",
      tags: true
    })
      .on('select2:selecting', (e: any) => {
        // console.log('Selecting: ', e.params.args.data);
        // if (e.params.args.data.text == e.params.args.data.id) {
        //   this.datasetName = e.params.args.data.text
        // } else {
        //   this.datasetName = {
        //     name: e.params.args.data.text,
        //     id: e.params.args.data.id
        //   };
        // }

        this.datasetName = e.params.args.data.text;


        this.detect();
      });
  }

  ngOnDestroy() {
    this.destroy();
  }

  calculate() {
    this.picturesNumber =
      (parseInt(this.finish.split(":")[0]) * 3600 +
        parseInt(this.finish.split(":")[1]) * 60 +
        parseInt(this.finish.split(":")[2]) -
        (parseInt(this.start.split(":")[0]) * 3600 +
          parseInt(this.start.split(":")[1]) * 60 +
          parseInt(this.start.split(":")[2]))) *
      this.conf.fps;
  }

  destroy() {
    if (this.player != undefined) {
      this.player.destroy();
      this.player = null;
      let cam = this.cameras.filter(
        (element) => element.name === this.cam_name
      );
      this.rtsp_in = cam[0].rtsp_in;
      let data = {
        camera_name: cam[0].name,
        rtsp_in: cam[0].rtsp_in,
        id: cam[0].id,
      };
      this.facesservices.stopWsStream(data).subscribe(
        (res) => {},
        (err) => console.error(err)
      );
    }
  }

  getCameraList() {
    this.facesservices.getCameras().subscribe(
      (res) => {
        this.cameras = res;
        this.loadLiveCam();
      },
      (err) => console.log(err)
    );
  }

  loadLiveCam() {
    let cam = this.cameras.filter((element) => element.name === this.cam_name);
    console.log("selected file - ", cam[0]);
    if (cam[0].stored_vid === "Yes") {
      this.stored_vid = true;
      this.start = "00:00:00";
      this.finish = cam[0].vid_length;
      this.maxTime = this.finish;
      this.rtsp_in = "http://" + ip + ":4200" + cam[0].rtsp_out;
      this.availableTimeStart = this.generateTimeRange(this.start, this.finish);
      this.availableTimeFinish = this.generateTimeRange(
        this.start,
        this.maxTime
      );
      this.waitingTime =
        this.computeSeconds(this.finish) - this.computeSeconds(this.start);
      this.calculate();
    } else {
      this.start = "00:00:00";
      this.finish = "24:00:00";
      this.maxTime = this.finish;
      this.availableTimeStart = this.generateTimeRange(this.start, this.finish);
      this.availableTimeFinish = this.generateTimeRange(
        this.start,
        this.finish
      );
      this.finish = "00:00:00";
      this.liveFeed = true;
      this.rtsp_in = cam[0].rtsp_in;
      this.calculate();
      let data = {
        camera_name: cam[0].name,
        rtsp_in: cam[0].rtsp_in,
        id: cam[0].id,
      };
      this.facesservices.startWsStream(data).subscribe(
        (res) => {
          this.player = new JSMpeg.Player(
            `ws://${res["my_ip"]}:${res["port"]}`,
            {
              canvas: this.streamingcanvas.nativeElement,
              autoplay: true,
              audio: false,
              loop: true,
            }
          );
        },
        (err) => console.error(err)
      );
    }
    console.log("this.rtsp_in - ", this.rtsp_in);
    console.log("this.availableTimeStart - ", this.availableTimeStart);
    console.log("this.availableTimeFinish - ", this.availableTimeFinish);
  }

  goBack() {
    this._location.back();
  }

  change(i, t) {
    // const time = i.split(':');
    // time[0] = +time[0];
    // time[1] = +time[1];
    // time[2] = +time[2];
    this.calculate();
    // Manual Input
    let hours;
    let mins;
    let secs;
    if (t == "s") {
      if (this.start.indexOf(":") == 0) {
        //Hours input is cleared
        setTimeout(() => {
          this.start = "00" + this.start;
        }, 300);
      } else if (
        this.start.lastIndexOf(":") == this.start.indexOf(":") + 1 ||
        this.start.indexOf(":") == 3 ||
        this.start.indexOf(":") == 4
      ) {
        //Minutes input is cleared or first colon deleted
        hours = this.start.substring(0, 2);
        secs = this.start.substring(this.start.lastIndexOf(":") + 1);
        setTimeout(() => {
          this.start = hours + ":00:" + secs;
        }, 200);
      } else if (
        this.start.length >= 5 &&
        this.start.length <= 7 &&
        this.start.lastIndexOf(":") <= 2
      ) {
        // Seconds is cleared or last colon deleted
        hours = this.start.substring(0, 2);
        mins = this.start.substring(
          this.start.indexOf(":") + 1,
          this.start.indexOf(":") + 3
        );
        this.start = new String(hours + ":" + mins + ":00");
      }
      // this.ss = +time[0] * 60 * 60 + +time[1] * 60 + +time[2];
    } else if (t == "f") {
      if (this.finish.indexOf(":") == 0) {
        //Hours input is cleared
        setTimeout(() => {
          this.finish = "00" + this.finish;
        }, 300);
        console.log("Error here");
      } else if (
        this.finish.lastIndexOf(":") == this.finish.indexOf(":") + 1 ||
        this.finish.indexOf(":") == 3 ||
        this.finish.indexOf(":") == 4
      ) {
        //Minutes input is cleared or first colon deleted
        hours = this.finish.substring(0, 2);
        secs = this.finish.substring(this.start.lastIndexOf(":") + 1);
        setTimeout(() => {
          this.finish = hours + ":00:" + secs;
        }, 200);
      } else if (
        this.finish.length >= 5 &&
        this.finish.length <= 7 &&
        this.finish.lastIndexOf(":") <= 2
      ) {
        // Seconds is cleared or last colon deleted
        hours = this.finish.substring(0, 2);
        mins = this.finish.substring(
          this.finish.indexOf(":") + 1,
          this.finish.indexOf(":") + 3
        );
        this.finish = new String(hours + ":" + mins + ":00");
      }
      // this.t = +time[0] * 60 * 60 + +time[1] * 60 + +time[2];
    }
    this.waitingTime =
      this.computeSeconds(this.finish) - this.computeSeconds(this.start);
    if (
      this.start != undefined &&
      this.finish != undefined &&
      this.computeSeconds(this.start) < this.computeSeconds(this.finish)
    ) {
      //this.act = true;
      this.flag = true;
    } else {
      this.flag = false;
    }

    // Dropdown Selection
    this.availableTimeStart = this.generateTimeRange(this.start, this.finish);
    this.availableTimeFinish = this.generateTimeRange(this.start, this.maxTime);
  }

  detect() {
    if (this.datasetName != undefined) {
      if (
        this.datasetName == "" ||
        this.datasetName == undefined ||
        this.datasetName == null
      ) {
        this.act = false;
      } else {
        this.act = true;
      }
    }
  }

  send() {
    let cam = this.cameras.filter((element) => element.name === this.cam_name);
    /* this.conf.ss = (this.ss === undefined) ? this.start : this.ss;
    this.t = (this.t === undefined) ? this.finish : this.t; */
    this.conf.cam_id = cam[0].id;
    this.conf.t =
      this.computeSeconds(this.finish) - this.computeSeconds(this.start);
    this.conf.name = this.cam_name;
    this.conf.datasetName = this.datasetName;
    this.conf.stream = cam[0].rtsp_in;
    this.router.navigate(["/annotations"]);
    this.annotationservice.cutVideo(this.conf).subscribe(
      (res) => {
        this.router.navigate(["/annotations"]);
      },
      (err) => console.log(err)
    );
  }

  computeSeconds(timeString: string) {
    let indexOfFirstColon: number = timeString.indexOf(":");
    let indexOfLastColon: number = timeString.lastIndexOf(":");
    let hours: number = +timeString.substring(0, indexOfFirstColon);
    let minutes: number = +timeString.substring(
      indexOfFirstColon + 1,
      indexOfLastColon
    );
    let seconds: number = +timeString.substring(indexOfLastColon + 1);
    let totalTime: number = hours * 3600 + minutes * 60 + seconds;

    return totalTime;
  }

  generateTimeRange(min, max) {
    min = this.computeSeconds(min);
    max = this.computeSeconds(max);
    let hours: any = 0;
    let minutes: any = 0;
    let seconds: any;
    const timeRange = [];
    for (let i = min; i <= max; i++) {
      seconds = i % 60;
      minutes = Math.floor((i % 3600) / 60);
      hours = Math.floor(i / 3600);
      if (seconds < 10) seconds = "0" + seconds;
      if (minutes < 10) minutes = "0" + minutes;
      if (hours < 10) hours = "0" + hours;
      timeRange.push(`${hours}:${minutes}:${seconds}`);
    }
    return timeRange;
  }

  refreshTime() {
    this.calculate();
    this.availableTimeFinish = this.generateTimeRange(this.start, this.maxTime);
    this.availableTimeStart = this.generateTimeRange("00:00:00", this.finish);
    this.waitingTime =
      this.computeSeconds(this.finish) - this.computeSeconds(this.start);
  }

  checkValidTime(inputTime: string) {
    let validTime = /^[0-9]{2}:[0-9]{2}:[0-9]{2}$/;
    if (inputTime.length != 8) {
      this.timeValidityMessage = "Time format invalid.";
      this.isValidTime = false;
    } else if (inputTime.match(validTime)) {
      this.isValidTime = true;
    } else {
      this.isValidTime = false;
    }
  }
}
