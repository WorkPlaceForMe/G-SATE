import { Component, OnInit, HostBinding } from '@angular/core';
import { Camera } from 'src/app/models/Camera';
import { FacesService } from '../../../services/faces.service';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-vid',
  templateUrl: './vid.component.html',
  styleUrls: ['./vid.component.scss']
})
export class VidComponent implements OnInit {
  // @HostBinding('class') classes ='row';

  camera: Camera = {
    id: '',
    name: '',
    rtsp_in: '',
    stored_vid: ''
  };

  edit : boolean = false;

  constructor(private facesService: FacesService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    if(params.uuid){
      this.facesService.getCamera(params.uuid)
      .subscribe(
        res =>{
          console.log(res);
          this.camera = res;
          this.edit = true;
        },
        err => console.error(err)
      )
    }
  }

  saveCamera(){
   this.camera.id = uuid();
   this.camera.stored_vid = 'No';
    if(this.camera.name != ''){
    this.facesService.saveCamera(this.camera)
    .subscribe(
      res=>{
        console.log(res);
        this.facesService.doOneImage(this.camera.id).subscribe(
          res => {
            console.log(res)
            this.router.navigate(['/cameras/algorithms/'+this.camera.id]);
          },
          err => {
            console.log(err)
          this.router.navigate(['/cameras/algorithms/'+this.camera.id]);
          }
        )
      },
      err => console.error(err)
    )
  };
}

updateCamera(){
  this.facesService.doOneImage(this.camera.id).subscribe(
    res => console.log(res),
    err => console.log(err)
  )
  this.facesService.updateCamera(this.camera.id, this.camera)
  .subscribe(
  res => {
    console.log(res);
    this.router.navigate(['/camerasList']);
  },
  err => console.log(err)
);
}
}
