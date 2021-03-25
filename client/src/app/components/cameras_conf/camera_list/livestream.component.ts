import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FacesService } from '../../../services/faces.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploader} from 'ng2-file-upload/ng2-file-upload';
import { AnnotationsService } from '../../../services/annotations.service';
import { ip } from 'src/app/models/IpServer';

const URL = 'http://' + ip + ':3300/api/upload/videos';

@Component({
  selector: 'app-livestream',
  templateUrl: './livestream.component.html',
  styleUrls: ['./livestream.component.css'],
  animations: [
    trigger('flyInOut', [
      transition('void => *', [
        style({ transform: 'translateX(100%)' }),
        animate(400)
      ])
    ])
  ]
})
export class LivestreamComponent implements OnInit, OnDestroy {
  uploadFileNames: Array<string> = [];

  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'video' });

  fileName: string = '';
  uploadName: string;
  public showMyMessage2 = true;
  public showMyMessage3 = false;
  public showMyMessage4 = false;
  public badFile = true;
  datasetsNames: any = [];
  classNames: any = [];

  relations: any = [];
  dateMessage: string;
  cams: any = [];
  algos: any = [];
  rois: any = [];
  date: any;
  heatmap: Boolean = false;
  constructor(private facesService: FacesService, private annotationsServ: AnnotationsService) { }

  ngOnDestroy() {
    if (this.date) {
      clearInterval(this.date);
    }
  }

  ngOnInit() {
    let currentDate = new Date();
    this.dateMessage = currentDate.toDateString() + ' ' + currentDate.toLocaleTimeString();
    this.date = setInterval(() => {
      let currentDate = new Date();
      this.dateMessage = currentDate.toDateString() + ' ' + currentDate.toLocaleTimeString();
    }, 1000);

    // this.myFunction();

    this.facesService.getCameras().subscribe(
      res => {
        this.cams = res;
        this.facesService.getAllRelations().subscribe(
          res => {
            this.relations = res;
            this.facesService.getAlgos().subscribe(
              res => {
                this.algos = res;
                for (let i = 0; i < this.algos.length; i++) {
                  if (this.algos[i]['name'] == 'Heatmap' && this.algos[i]['available'] == 1) {
                    this.heatmap = true;
                  }
                }
                for (let u = 0; u < this.algos.length; u++) {
                  for (let i = 0; i < this.cams.length; i++) {
                    for (let e = 0; e < this.relations.length; e++) {
                      if (this.algos[u]['name'] == 'Heatmap' && this.algos[u]['id'] == this.relations[e]['algo_id'] && this.relations[e]['camera_id'] == this.cams[i]['id']) {
                        this.cams[i].hm = true;
                      }
                    }
                  }
                }
              },
              err => console.error(err)
            );
          },
          err => console.error(err)
        );
      },
      err => console.error(err)
    );
  }

  // async myFunction(){
  //   try {
  //     await this.review
  //     this.facesService.getAllHmRelations().subscribe(
  //       res => {
  //         this.relations = res;
  //         console.log(this.cams);
  //         for(let i = 0; i < this.cams.length; i++){
  //           for(let e = 0; e < this.relations.length; e++){
  //           if(this.cams[i]['id'] == this.relations[e]['camera_id']){
  //             this.cams[i].hm = true;
  //             }
  //           }
  //         }
  //       },
  //       err => console.error(err)
  //     );
  //   }
  //   catch (err) {
  //     return "error:" + err
  //   }
  // }

  getCameras() {
    this.facesService.getCameras().subscribe(
      res => {
        this.cams = res;
      },
      err => console.error(err)
    );
  }


  deleteCamera(id: string) {
    if (confirm('Do you want to delete this camera?')) {
      this.facesService.deleteCamera(id).subscribe(
        res => {
          console.log(res);
          this.getCameras();
        },
        err => console.log(err)
      )
      this.facesService.getAllRelations().subscribe(
        res => {
          this.relations = res;
          for (let e = 0; e < this.relations.length; e++) {
            if (this.relations[e]['camera_id'] == id) {
              this.facesService.deleteRelation(this.relations[e]['id']).subscribe(
                res => {
                  console.log(res);
                },
                err => console.log(err)
              )
            }
          }
        },
        err => console.error(err)
      );
    }
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
    this.showMyMessage4 = false;
    this.showMyMessage3 = true;
  }

  showInfo(event) {
    this.fileName = event.target.files[0].name;
    console.log('filename........', this.fileName);
    if (this.fileName.includes('.jpg') || this.fileName.includes('.png')) {
      this.badFile = false;
      console.log(this.badFile)
    } else {
      this.badFile = true;
    }
  }

}
