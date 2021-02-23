import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { AnnotationsService } from '../../../services/annotations.service';
import { PageEvent } from '@angular/material/paginator';
import { ip } from '../../../models/IpServer'

@Component({
  selector: 'app-unwanted-vehicle',
  templateUrl: './unwanted-vehicle.component.html',
  styleUrls: ['./unwanted-vehicle.component.css']
})
export class UnwantedVehicleComponent implements OnInit {

  width:number;
height:number;
valueImage:number;
images: any =[];
picture:string;
annWidth:number;
annHeight:number;
info: any = {};
noImages:boolean = false;
pred:boolean = false;
pages:number;
total:number;
pos:number;
noPages:boolean = true;
length = 100;
pageSize = 10;
pageSizeOptions: number[] = [5, 10, 25, 100];

loading:boolean = true;

  constructor(private act:ActivatedRoute, sanitizer: DomSanitizer, private annotationsServ: AnnotationsService) { 
    
    const string = this.act.snapshot.params.choose.split(' ').join('_');

    this.annotationsServ.getImages(string,'class').subscribe(
      res=>{
          this.loading = false;
          this.images = res;
          if(this.images.length == 0){
            this.noImages = true;
          }else{
          var newstring = parseInt(this.act.snapshot.params.imageNum, 10);
          this.total = this.images[this.images.length - 1]['total'];
          this.images.pop();
          this.valueImage = newstring;
          for(let i = 0; i < this.images.length; i++){
            if(this.images[i].name.includes('.jpg')){
              this.images[i].name = this.images[i].name.replace('.jpg', '');
              this.images[i].format = '.jpg';
            }else if(this.images[i].name.includes('.png')){
              this.images[i].name = this.images[i].name.replace('.png', '');
              this.images[i].format = '.png';
            }else if(this.images[i].name.includes('.jpeg')){
              this.images[i].name = this.images[i].name.replace('.jpeg', '');
              this.images[i].format = '.jpeg';
            }else if(this.images[i].name.includes('.JPG')){
              this.images[i].name = this.images[i].name.replace('.JPG', '');
              this.images[i].format = '.JPG';
            }else if(this.images[i].name.includes('.PNG')){
              this.images[i].name = this.images[i].name.replace('.PNG', '');
              this.images[i].format = '.PNG';
            }
          }
          this.images.sort(function(a,b){return a.name - b.name});
          if(this.images.length > 702){
            this.noPages = false;
          }
          for(let i = 0; i < this.images.length; i++){
            this.images[i].name = this.images[i].name + this.images[i].format;
            this.images[i].safeLink = sanitizer.bypassSecurityTrustUrl("http://"+ ip +":6503/classifications/" + string + '/' + this.images[i].name);
            
            //"assets/classifications/"+ string + '/' +
            const size = 60;
            if(this.images[i].width > this.images[i].height){
              this.images[i].showWidth = size;
              this.images[i].showHeight = this.images[i].height*size/this.images[i].width;
            }else if(this.images[i].width < this.images[i].height){
              this.images[i].showHeight = size;
              this.images[i].showWidth = this.images[i].width*size/this.images[i].height;
            }else if (this.images[i].width == this.images[i].height){
              this.images[i].showWidth = size;
              this.images[i].showHeight = size;
            }
            this.images[i].info = this.images[i].name.split('_');
            this.images[i].status = true;
          }

          if(this.act.snapshot.routeConfig.path.includes('prediction')){
            this.pred = true;
            for(let e = 0; e < this.images.length; e++){
              this.images[e].info = ['rickshaw_nagpur', Math.floor((Math.random()*100) + 1)];
              this.images[e].status = false;
            }
            //this is from the algorithm, thats why is fixed as this.         
          }
          console.log(this.images)
        }
      },
      err => console.log(err)
    )
  }

  pageEvent: PageEvent;


  ngOnInit() {
    if(window.innerWidth >= 1200){
      this.innerWidth = 890;
    }else if(window.innerWidth < 1200 && window.innerWidth >= 992){
      this.innerWidth = 755;
    }else if(window.innerWidth < 992 && window.innerWidth >= 768){
      this.innerWidth = 544;
    }
    this.innerHeight = window.innerHeight;
  }

  setMyStyle(){
    let styles = {
      'top': this.pos + 'px',
    };
    return styles;
  }

  public innerWidth: number;
  public innerHeight: number;


  // check this tomorrow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    if(window.innerWidth >= 1200){
      this.innerWidth = 890;
    }else if(window.innerWidth < 1200 && window.innerWidth >= 992){
      this.innerWidth = 755;
    }else if(window.innerWidth < 992 && window.innerWidth >= 768){
      this.innerWidth = 544;
    }
  }

  newStyle(){
    let other = {
      'height':  this.innerHeight - 170  + 'px',
      'width' :  this.innerWidth +'px',
    };
    return other;
  }

  choose(event){
    const string = this.act.snapshot.params.choose.split(' ').join('_');
    this.annotationsServ.moveImage(string,this.images[this.valueImage].name,event).subscribe(
      res=>{
        console.log(res);
      }, err => console.log(err)
    )
  }

  @HostListener('window:scroll', ['$event']) onScrollEvent(event){
     this.pos = event.path[1].scrollY;   
  }


}
