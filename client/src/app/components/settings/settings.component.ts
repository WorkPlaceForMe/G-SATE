import { Component, OnInit, OnDestroy } from '@angular/core';
import { FacesService } from '../../services/faces.service';
import { AppComponent } from '../../app.component';
import { ip } from 'src/app/models/IpServer';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {

  rels:any = [];
  cameras: any = [];
  list:any = [];
  check:any;

  constructor(private facesService: FacesService, public appcomponent: AppComponent) { }
isRunning1: boolean = false;
started: number = 0;
  ngOnInit() {
    this.getStatus();
this.check = setInterval(()=>{
  this.getStatus();
},3000)
    this.getAlgo(0);
  }


  ngOnDestroy(){
    clearInterval(this.check);
  }

  getStatus(){
    this.facesService.status(0).subscribe(
      (res:number)=> {
        this.started = res
      },
      err => console.log(err)
    )
  }

  getAlgo(idAlgo){
    this.facesService.getAllRelations().subscribe(
      res => {
        this.rels = res
        this.facesService.getCameras().subscribe(
          res=> {
              this.cameras = res;
              for(var b in this.rels){
                for(var a in this.cameras){
                  if(this.cameras[a].id == this.rels[b].camera_id && this.rels[b].algo_id == idAlgo){
                    this.list.push({"rtsp":this.cameras[a].rtsp_in,"id":this.cameras[a].id});
                  }
                }
              }
          },
          err => console.log(err)
        )
      },
      err => console.log(err)
    )
  }


myFunction1(){
  // this.appcomponent.myFunction();
  this.isRunning1 = this.appcomponent.isRunning;
}

  send(){
if(confirm('Do you want to send the users information and the images to the algorithm? This is a slow process so is not recomended to be done every time.')){
    this.facesService.signal().subscribe(
      res => {
        console.log('sent');
      },
      err => console.error(err)
    );
    }
    }
  sto1(){
    this.facesService.status(1).subscribe(
      (res:number)=> {
        this.started = res
        this.facesService.stopfr().subscribe(
          res => {
            console.log('stoped');
          },
          err => console.error(err)
        );
      },
      err => console.log(err)
    )

    }
  st1(){
    this.facesService.status(1).subscribe(
      (res:number)=> {
        this.started = res
        for(var a in this.list){
          var rtsp = {
            rtsp_out: "http://" + ip + ":8090/stream" + a + ".mjpeg"
          }
          this.facesService.updtCams(this.list[a].id,rtsp).subscribe(
            res => console.log(res),
            err => console.log(err)
          )
        }
        if(this.list[0].rtsp == '/dev/video0'){
          this.facesService.stwb().subscribe(
            res=>console.log(res),
            err=>console.log(err)
          )
        }else{
          this.facesService.startfr(this.list).subscribe(
            res => {
              console.log('started');
            },
            err => console.error(err)
          );
        }
      },
      err => console.log(err)
    )
    }

}
