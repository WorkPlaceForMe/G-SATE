import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Camera } from 'src/app/models/Camera';
import { FacesService } from '../../../services/faces.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ip } from "../../../models/IpServer"
import JSMpeg from 'jsmpeg-player';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit {

  live: Camera ={
    id:'',
    name:'',
    rtsp_in: '',
    rtsp_out: '',
    cam_height: 0,
    cam_width: 0
  };
  link: SafeResourceUrl;
  ffmpege:any
  resp:any;  
ports:any = [];
message:boolean = false;


//add starting server for ngOnit

  constructor(private facesService: FacesService, private router: Router, private activatedRoute: ActivatedRoute,sanitizer: DomSanitizer) { 
    this.link = sanitizer.bypassSecurityTrustResourceUrl(this.live.rtsp_out);
    const params = this.activatedRoute.snapshot.params;
    // this.facesService.getPorts().subscribe(
    //   res=> {
    //     this.ports = res
    //     console.log(this.ports)
    //     for(let a =0; a < this.ports.length; a ++){
    //       if(this.ports[a].used == 0){
    //         listen = this.ports[a].in;            
    //         a = this.ports.length;
    //       }else if(a == this.ports.length - 1){
    //         console.log('hola')
    //         this.message = true;
    //       }
    //     }
    //   },
    //   err => console.log(err)
    // )

    this.facesService.startwsstream().subscribe(
      res => {
        this.resp = res;
        console.log(res)
      },
      err => console.log(err)
    )


    this.facesService.getCamera(params.id).subscribe(
      res =>{
        this.live =res;
        console.log(this.live)
        // const rtsp = this.live.rtsp_in.split('/').join(' ');
        // this.facesService.feedstream(rtsp).subscribe(
        //   (res:number) => {
            
        //     console.log(res)
        //   // this.ffmpeg_obj_response = res;
        //   },
        // err => console.error(err)
        // );
        if(window.innerWidth >= 1200){
          this.width = 835;
          // this.width = 1280;
          this.height = this.width*this.live.cam_height/this.live.cam_width;
          // this.height = 720;
          // console.log(this.height)
          if(this.height >= 480){
            this.height = 480;
            this.width = this.height*this.live.cam_width/this.live.cam_height;
        }
        }else if(window.innerWidth < 1200 && window.innerWidth >= 992){
          this.width = 684;
          this.height = this.width*this.live.cam_height/this.live.cam_width;
          if(this.height >= 480){
            this.height = 480;
            this.width = this.height*this.live.cam_width/this.live.cam_height;
        }
        }else if(window.innerWidth < 992 && window.innerWidth >= 768){
          this.width = 490;
          this.height = this.width*this.live.cam_height/this.live.cam_width;
          if(this.height >= 480){
            this.height = 480;
            this.width = this.height*this.live.cam_width/this.live.cam_height;
        }
        }else if(window.innerWidth < 768 && window.innerWidth >= 576){
          this.width = 420;
          this.height = this.width*this.live.cam_height/this.live.cam_width;
          if(this.height >= 480){
            this.height = 480;
            this.width = this.height*this.live.cam_width/this.live.cam_height;
        }
        }else if(window.innerWidth < 576){
          this.width = window.innerWidth - 140;
          this.height = this.width*this.live.cam_height/this.live.cam_width;
          if(this.height >= 480){
            this.height = 480;
            this.width = this.height*this.live.cam_width/this.live.cam_height;
        }
        }

      },
      err => console.error(err)
    );



  }
  
@ViewChild('streaming', {static: false}) streamingcanvas1: ElementRef; 
@ViewChild('streaming2', {static: false}) streamingcanvas2: ElementRef; 

where(num){
if(num == 0 && this.message == false){
  return '#home'
}else if (num == 0 && this.message == true){
  return '#noLink'
}else if(num == 1 && this.message == true){
  return '#noLink'
}else if(num == 1 && this.message == false){
  return '#profile'
}
}

ngAfterViewInit() {
}

resize(){
  let styles = {
    "height": this.height,
    "width": this.width
  };
  return styles;
}

width:number;
height:number;
otro_cual:number = 2;
nose: number = 0;

  ngOnInit() {
   
  }

  canvas(port,which){
    let hola;
    if(which == 0){
    hola = this.streamingcanvas1.nativeElement
    } else if(which == 1){
      hola = this.streamingcanvas2.nativeElement
    }
    let player = new JSMpeg.Player('ws://' + ip + ':'+ port +'/yoursecret', {
      canvas: hola,
      autoplay: true,
      audio: false,
      loop: true,
      responsive: false
  })
  }




  changeView(cual:number){
    if(this.resp == 'ports full'){
this.nose = 2;
    }else {
      if(this.otro_cual != cual){
        if(this.ffmpege != undefined){
          this.killIt(this.ffmpege,false);
        }
        let rtsp;
        this.otro_cual = cual;
        if(cual == 0){
          this.nose = 1;
          rtsp = this.live.rtsp_in.split('/').join(' ');
        }else if(cual == 1){
          this.nose = 3;
          rtsp = this.live.rtsp_out.split('/').join(' ');
        }
        this.facesService.feedstream(rtsp,this.resp.portL).subscribe(
          res => {
            this.ffmpege = res;
            console.log(res)
              this.canvas(this.resp.portW,cual);
          },
        err => console.error(err)
        );
      }
    }   
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    console.log(this.width + "x" + this.height)
    if(window.innerWidth >= 1200){
      this.width = 835;
      this.height = this.width*this.live.cam_height/this.live.cam_width;
      if(this.height >= 480){
        this.height = 480;
        this.width = this.height*this.live.cam_width/this.live.cam_height;
    }
    }else if(window.innerWidth < 1200 && window.innerWidth >= 992){
      this.width = 684;
      this.height = this.width*this.live.cam_height/this.live.cam_width;
      if(this.height >= 480){
        this.height = 480;
        this.width = this.height*this.live.cam_width/this.live.cam_height;
    }
    }else if(window.innerWidth < 992 && window.innerWidth >= 768){
      this.width = 490;
      this.height = this.width*this.live.cam_height/this.live.cam_width;
      if(this.height >= 480){
        this.height = 480;
        this.width = this.height*this.live.cam_width/this.live.cam_height;
    }
    }else if(window.innerWidth < 768 && window.innerWidth >= 576){
      this.width = 420;
      this.height = this.width*this.live.cam_height/this.live.cam_width;
      if(this.height >= 480){
        this.height = 480;
        this.width = this.height*this.live.cam_width/this.live.cam_height;
    }
    }else if(window.innerWidth < 576){
      this.width = window.innerWidth - 140;
      this.height = this.width*this.live.cam_height/this.live.cam_width;
      if(this.height >= 480){
        this.height = 480;
        this.width = this.height*this.live.cam_width/this.live.cam_height;
    }
    }
  }

  killIt(pid,server){
    if(this.resp != undefined){
      this.facesService.killwsstreamws(pid,this.resp.portW,server).subscribe(
        res => {
          console.log(res)
        },
        err => console.error(err)
      );
    }else {
      console.log('hola')
    }
  }

  ngOnDestroy(){
    // this.facesService.killwsstreamffmpeg(this.ffmpeg_obj_response.feedstream_pid , this.ffmpeg_obj_response.number_port_use).subscribe(
    //   res => {
    //     console.log('websocket streaming killed the feeding process:'+this.ffmpeg_obj_response.ffmpeg_pid+'at port:'+this.ffmpeg_obj_response.number_port_use);
    //   },
    //   err => console.error(err)
    // )
    if(this.resp == 'ports full'){

    }else{
      this.killIt(this.resp.pid,true)
    }
  }

}
