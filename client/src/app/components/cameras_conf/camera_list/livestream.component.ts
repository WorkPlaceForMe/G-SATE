import { Component, OnInit, OnDestroy } from '@angular/core';
import { FacesService } from '../../../services/faces.service';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-livestream',
  templateUrl: './livestream.component.html',
  styleUrls: ['./livestream.component.scss'],
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

  relations: any = [];
  dateMessage: string;
  cams: any = [];
  algos: any = [];
  rois: any = [];
  date: any;
  heatmap: Boolean = false;
  constructor(private facesService: FacesService) { }

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


  deleteCamera(cam: any) {
    if (confirm('Do you want to delete this camera?')) {
      this.facesService.deleteCamera(cam.id, cam).subscribe(
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
            if (this.relations[e]['camera_id'] == cam.id) {
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

}
