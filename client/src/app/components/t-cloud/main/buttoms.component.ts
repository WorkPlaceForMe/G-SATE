import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AnnotationsService } from '../../../services/annotations.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploader, FileLikeObject } from 'ng2-file-upload/ng2-file-upload';
import { ip } from '../../../models/IpServer';
import { FacesService } from '../../../services/faces.service';
import { DatePipe } from '@angular/common';

const URL = 'http://' + ip + ':3300/api/upZip';

@Component({
  selector: 'app-buttoms',
  templateUrl: './buttoms.component.html',
  styleUrls: ['./buttoms.component.css']
})
export class ButtomsComponent implements OnInit {

  constructor(private router: Router, private annotationsServ: AnnotationsService, private facesservices: FacesService, private datepipe: DatePipe) { }

  uploadFileNames: Array<string> = [];

  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: 'zip'
  });

  fileName: string = '';
  uploadName: string;
  datasetsNames: any = [];
  classNames: any = [];
  datasetName: string = null;
  public showMyMessage2 = false;
  public showMyMessage3 = false;
  public showMyMessage4 = false;
  public showMyWatch = false;
  public showClass = false;
  public badFile = true;
  public open = false;
  choosenDataset: string;
  choosenClass: string;
  cameras: any = [];
  camera: any;
  date: any;
  response: any = [];

  public date_now = new Date(Date.now()).toString();
  public max = new Date(this.date_now);


  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => {
      console.log('uploaind zip...........');
      file.withCredentials = false;
      const newStuff = this.datasetName.split(' ').join('_');
      this.uploadName = newStuff + '.zip';
      // this.fileName += file.file.name + ",";
      file.file.name = this.uploadName;
      // this.uploadFileNames.push(this.uploadName);
      // console.log(this.uploadFileNames);
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log("Uploaded:", status, response, headers);
    };
    this.uploader.onProgressItem = (progress: any) => {
      console.log(progress['progress']);
      if (progress['progress'] == 100) {
        this.showMyMessage3 = undefined;
        this.showMyMessage4 = true;
      }
    };
    this.getDsets('data')
    this.getDsets('class')

    this.getLabels();

    this.facesservices.getCameras().subscribe(
      res => {
        console.log('cameras..........', res);
        this.cameras = res;
      },
      err => console.log(err)
    )
  }

  getDsets(thing: string) {
    this.annotationsServ.getDatasets(thing).subscribe(
      res => {
        if (thing == 'data') {
          this.datasetsNames = res;
          for (let i = 0; i < this.datasetsNames.length; i++) {
            this.datasetsNames[i]['open'] = false;
            this.datasetsNames[i]['name'] = this.datasetsNames[i]['name'].split('_').join(' ');
          }
        } else if (thing == 'class') {
          this.classNames = res;
          for (let i = 0; i < this.classNames.length; i++) {
            this.classNames[i]['open'] = false;
            this.classNames[i]['name'] = this.classNames[i]['name'].split('_').join(' ');
          }
        }
      },
      err => console.log(err)
    )
  }

  getLabels() {
    this.annotationsServ.readLabels().subscribe(
      res => {
        this.labels = res;
        this.labels = this.labels.split('\r\n')
        this.labels.pop();
      },
      err => console.log(err)
    )
  }

  addLabel() {
    this.annotationsServ.writeLabel(this.newLabel).subscribe(
      res => {
        console.log(res)
        this.newLabel = null;
        this.getLabels();
      },
      err => console.log(err)
    )
  }

  go() {
    this.showMyMessage = true;
  }

  annotate() {
    let res1 = {
      "id": 1,
      "image": "https://ec2-54-152-186-179.compute-1.amazonaws.com/media/perumal/NiceKitchen_EJifGKG.png",
      "results": {
        "Object": [
          {
            "confidence": 0.999828,
            "class": "person",
            "boundingBox": {
              "top": 182,
              "left": 370,
              "width": 92,
              "height": 141
            },
            "objectId": "0"
          },
          {
            "confidence": 0.998606,
            "class": "microwave",
            "boundingBox": {
              "top": 147,
              "left": 207,
              "width": 111,
              "height": 53
            },
            "objectId": "1"
          },
          {
            "confidence": 0.99456,
            "class": "chair",
            "boundingBox": {
              "top": 298,
              "left": 68,
              "width": 96,
              "height": 165
            },
            "objectId": "2"
          },
          {
            "confidence": 0.994081,
            "class": "refrigerator",
            "boundingBox": {
              "top": 168,
              "left": 464,
              "width": 129,
              "height": 262
            },
            "objectId": "3"
          },
          {
            "confidence": 0.989482,
            "class": "bowl",
            "boundingBox": {
              "top": 309,
              "left": 414,
              "width": 60,
              "height": 34
            },
            "objectId": "4"
          },
          {
            "confidence": 0.988201,
            "class": "oven",
            "boundingBox": {
              "top": 250,
              "left": 194,
              "width": 125,
              "height": 102
            },
            "objectId": "5"
          }
        ]
      }
    }
    let res2 = {
      "id": 2,
      "image": "https://ec2-54-152-186-179.compute-1.amazonaws.com/media/perumal/cup_MNUNepE.jpg",
      "results": {
        "Object": [
          {
            "confidence": 0.999044,
            "class": "cup",
            "boundingBox": {
              "top": 178,
              "left": 91,
              "width": 220,
              "height": 187
            },
            "objectId": "0"
          }
        ]
      }
    }
    let res3 = {
      "id": 3,
      "image": "https://ec2-54-152-186-179.compute-1.amazonaws.com/media/perumal/face_j9JL7eU.jpg",
      "results": {
        "Object": [
          {
            "confidence": 0.995537,
            "class": "person",
            "boundingBox": {
              "top": 10,
              "left": 160,
              "width": 453,
              "height": 453
            },
            "objectId": "0"
          }
        ]
      }
    }
    this.response.push(res1);
    this.response.push(res2);
    this.response.push(res3);
    this.router.navigate(['/annotations/multiple/' + 'object' + '/' + 'miguel' + '/0'], { state: { data: this.response } });
  }

  @ViewChild('zip', { static: true }) myInputVariable: ElementRef;

  check() {
    // for(let i = 0; i < this.datasetsNames.length; i++){
    //   if(this.fileName == this.datasetsNames[i]){
    //     this.fileName = '!' + this.fileName;
    //   }
    // }
    this.uploader.uploadAll();
    this.myInputVariable.nativeElement.value = null;
    this.fileName = '';
    setTimeout(() => {
      this.getDsets('data');
    }, 2000);
    this.showMyMessage4 = false;
    this.showMyMessage3 = true;
  }

  watch() {
    this.date = this.datepipe.transform(this.date, 'yyyy-M-dd')
    if (this.camera != undefined && this.date != undefined) {
      this.showMyWatch = true;
    }
  }

  detect() {
    this.showMyMessage2 = true;
    if (this.datasetName == '') {
      this.showMyMessage2 = false;
    }
  }

  info() {
    console.log(this.datasetsNames)
  }

  showInfo(event) {
    this.fileName = event.target.files[0].name;
    if (this.fileName.includes('.zip')) {
      this.badFile = false;
    } else {
      this.badFile = true;
    }
  }

  change(e) {
    for (let i = 0; i < this.datasetsNames.length; i++) {
      if (e == i) {
        this.datasetsNames[i]['open'] = true;
        this.choosenDataset = this.datasetsNames[i]['name'];
      } else {
        this.datasetsNames[i]['open'] = false;
      }
    }
  }

  change1(e) {
    for (let i = 0; i < this.classNames.length; i++) {
      if (e == i) {
        this.classNames[i]['open'] = true;
        this.choosenClass = this.classNames[i]['name'];
      } else {
        this.classNames[i]['open'] = false;
      }
    }
    if (this.choosenClass != undefined) {
      this.showClass = true;
    }
  }

  realGo() {
    if (this.label != undefined) {
      this.router.navigate(['/annotations/' + this.label + '/' + this.choosenDataset + '/0']);
    }
  }

  showMyMessage: boolean = false;
  newLabel: string;

  label: string;
  labels: any = [];

}
