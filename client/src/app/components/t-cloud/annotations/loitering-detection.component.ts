import { Component, OnInit, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { FacesService } from '../../../services/faces.service';
import { AnnotationsService } from '../../../services/annotations.service';
import { vistaIP } from '../../../models/VistaServer';
import { ip } from '../../../models/IpServer'

//const baseURL = 'http://ec2-54-152-186-179.compute-1.amazonaws.com';
const baseURL = vistaIP;
@Component({
  selector: 'app-loitering-detection',
  templateUrl: './loitering-detection.component.html',
  styleUrls: ['./loitering-detection.component.css']
})
export class LoiteringDetectionComponent implements OnInit {

  data: any;
  initPage: number = 0;
  pages: number;
  total: number;
  width: number;
  height: number;
  annWidth: number;
  annHeight: number;
  selectedID: any = "";
  objDet: boolean = false;
  card: any = {
    width: 0,
    height: 0
  }

  link: SafeResourceUrl;
  multiple: boolean = true;
  showMyMessage: boolean = false;
  clearAct: boolean = false;
  flag: boolean = false;
  spinflag: boolean = false;
  valueImage: number;
  fakeValueImage: number;
  picture: string;
  inf: any = {};
  deviceInfo = null;

  newLabel: string = null;
  images: any = [];
  labels: any = [];
  annotationsCount: number = 0;

  count: number = 0;
  annCount: number = 0;
  fixedSize: number = 0;

  id: number;
  on: boolean = false;
  coords = [];
  annotations: any = [];
  ann: any = [];
  cacheAnnot: any = [];
  label: string;

  constructor(private rd: Renderer2, private activatedRoute: ActivatedRoute, sanitizer: DomSanitizer, private facesService: FacesService, private annotationsServ: AnnotationsService, private router: Router) {

    const string = this.activatedRoute.snapshot.params.folder.split(' ').join('_');
    this.valueImage = parseInt(this.activatedRoute.snapshot.params.image, 10);
    this.data = JSON.parse(this.router.getCurrentNavigation().extras.state.data);
    this.link = sanitizer.bypassSecurityTrustStyle('url(' + baseURL + this.data.image + ')');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth >= 1200) {
      this.width = 835;
      this.height = this.width * this.annHeight / this.annWidth;
      if (this.height >= 480) {
        this.height = 480;
        this.width = this.height * this.annWidth / this.annHeight;
      }
    } else if (window.innerWidth < 1200 && window.innerWidth >= 992) {
      this.width = 684;
      this.height = this.width * this.annHeight / this.annWidth;
      if (this.height >= 480) {
        this.height = 480;
        this.width = this.height * this.annWidth / this.annHeight;
      }
    } else if (window.innerWidth < 992 && window.innerWidth >= 768) {
      this.width = 490;
      this.height = this.width * this.annHeight / this.annWidth;
      if (this.height >= 480) {
        this.height = 480;
        this.width = this.height * this.annWidth / this.annHeight;
      }
    } else if (window.innerWidth < 768 && window.innerWidth >= 576) {
      this.width = 420;
      this.height = this.width * this.annHeight / this.annWidth;
      if (this.height >= 480) {
        this.height = 480;
        this.width = this.height * this.annWidth / this.annHeight;
      }
    } else if (window.innerWidth < 576) {
      this.width = window.innerWidth - 140;
      this.height = this.width * this.annHeight / this.annWidth;
      if (this.height >= 480) {
        this.height = 480;
        this.width = this.height * this.annWidth / this.annHeight;
      }
    }
  }


  @ViewChild('polygon', { static: true }) private polygon: ElementRef;
  private canvas;
  private ctx;

  ngOnInit() {
    this.canvas = this.rd.selectRootElement(this.polygon["nativeElement"]);
    this.ctx = this.canvas.getContext("2d");
    this.getAnn();
    this.activatedRoute.params
    if (this.activatedRoute.snapshot.params.method == 'multiple') {
      this.multiple = true;
    } else if (JSON.stringify(this.activatedRoute.snapshot.routeConfig).includes('objectDetection')) {
      this.multiple = true;
      this.objDet = true;
    } else {
      this.label = this.activatedRoute.snapshot.params.method;
    }
    this.getLabels();
  }

  ngAfterViewChecked() {
    if(this.annotationsCount === 0) {
      setTimeout(() => {
        this.re_draw();
      }, 3000);
    }
    ++this.annotationsCount;
  }

  getAnn() {
    for (let itm in this.data.results) {
      if (Array.isArray(this.data.results[itm])) {
        this.data.results[itm].forEach(element => {
          let obj1 = {
            x: element.boundingBox.left,
            y: element.boundingBox.top
          };
          this.ann.push(obj1);
          let obj2 = {
            x: element.boundingBox.width,
            y: element.boundingBox.height
          };
          this.ann.push(obj2);
          let obj3 = {
            general_detection: 'No'
          }
          this.ann.push(obj3);
          let obj4 = {
            label: element.class
          };
          this.ann.push(obj4);
          this.annotations.push(this.ann);
          this.ann = [];
        })
      }
    }
    console.log('this.annotations - ', this.annotations);
    this.cacheAnnot = this.annotations;
    if(this.annCount === 0) {
      this.fixedSize = this.annotations.length;
      ++this.annCount;
    } 
    this.re_draw();
  }

  getLabels() {
    for (let itm in this.data.results) {
      if (Array.isArray(this.data.results[itm])) {
        this.data.results[itm].forEach(element => {
          this.labels.push(element.class);
        })
      }
    }
  }

  next() {
    this.router.navigate(['/annotations/' + 'object' + '/' + 'image' + '/0' + '/details'], { state: { data: this.data }} );
    if (this.valueImage < this.total - 1) {
      this.valueImage++;
      if (JSON.stringify(this.cacheAnnot) != JSON.stringify(this.annotations)) {
        this.send();
      } else {
        this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/annotations/' + this.activatedRoute.snapshot.params.method + '/' + this.activatedRoute.snapshot.params.folder + '/' + this.valueImage]);
        });
      }
    } else if (this.valueImage == this.total - 1) {
      if (JSON.stringify(this.cacheAnnot) != JSON.stringify(this.annotations)) {
        this.send();
      } else {
        this.router.navigateByUrl('/annotations');
      }
    }
  }
  
  send() {
    this.annotations.push({ 'width': this.annWidth, 'height': this.annHeight });
    this.annotationsServ.writeAnn(this.picture.split('/').join(' '), this.annotations).subscribe(
      res => {
        if (this.valueImage < this.total - 1) {
          this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/annotations/' + this.activatedRoute.snapshot.params.method + '/' + this.activatedRoute.snapshot.params.folder + '/' + this.valueImage]);
          });
        } else if (this.valueImage == this.total - 1) {
          this.router.navigateByUrl('/annotations');
        }
      },
      err => {
        console.log(err);
      }
    )
  }

  prev() {
    if (this.valueImage > 0) {
      this.valueImage--;
      if (JSON.stringify(this.cacheAnnot) != JSON.stringify(this.annotations)) {
        this.send();
      } else {
        this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/annotations/' + this.activatedRoute.snapshot.params.method + '/' + this.activatedRoute.snapshot.params.folder + '/' + this.valueImage]);
        });
      }
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.annotations.splice(this.id, 1);
    this.re_draw();
    this.on = false;
    this.id = undefined;
    this.clearAct = false;
  }
  openlebelModal(id) {
    this.newLabel = this.annotations[id][3].label;
  }
  updateLabel() {
    if (this.newLabel) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (let e = 0; e < this.annotations.length; e++) {
        if (e == this.id) {
          this.annotations[e].pop();
          this.annotations[e].push({label: this.newLabel});
        }
      }
      this.re_draw();
      this.on = false;
      this.id = undefined;
      this.selectedID = undefined;
    }
  }

  get(i) {
    this.on = true;
    this.clearAct = true;
    this.id = i;
    this.selectedID = i;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let e = 0; e < this.annotations.length; e++) {
      this.ctx.fillStyle = "lime";
      this.ctx.strokeStyle = 'lime';
      if (i == e) {
        this.label = this.annotations[e][2].label;
        this.ctx.fillStyle = "yellow";
        this.ctx.strokeStyle = 'yellow';
        //this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        //this.ctx.fillRect(this.annotations[e][0]['x'], this.annotations[e][0]['y'], this.annotations[e][1]['x'] - this.annotations[e][0]['x'], this.annotations[e][1]['y'] - this.annotations[e][0]['y']);
      }
      /* this.ctx.fillRect(this.annotations[e][0]['x']-2,this.annotations[e][0]['y']-2,4,4);
      this.ctx.fillRect(this.annotations[e][0]['x']-2,this.annotations[e][1]['y']-2,4,4);
      this.ctx.fillRect(this.annotations[e][1]['x']-2,this.annotations[e][0]['y']-2,4,4);    
      this.ctx.strokeRect(this.annotations[e][0]['x'],this.annotations[e][0]['y'],this.annotations[e][1]['x'] - this.annotations[e][0]['x'],this.annotations[e][1]['y'] - this.annotations[e][0]['y']);
      this.ctx.fillRect(this.annotations[e][1]['x']-2,this.annotations[e][1]['y']-2,4,4); */
      if(this.annotations[e][2]['general_detection'] == 'Yes') {
        this.ctx.fillRect(this.annotations[e][0]['x'],this.annotations[e][0]['y'],4,4);
        this.ctx.fillRect(this.annotations[e][0]['x']-2,this.annotations[e][1]['y']-3,4,4);
        this.ctx.fillRect(this.annotations[e][1]['x'],this.annotations[e][0]['y'],4,4);    
        this.ctx.strokeRect(this.annotations[e][0]['x'],this.annotations[e][0]['y'],this.annotations[e][1]['x'] - this.annotations[e][0]['x'],this.annotations[e][1]['y'] - this.annotations[e][0]['y']);
        this.ctx.fillRect(this.annotations[e][1]['x']-3,this.annotations[e][1]['y']-3,4,4);
      } else {
        this.ctx.fillRect(this.annotations[e][0]['x']-2, this.annotations[e][0]['y']-2, 4, 4);
        this.ctx.fillRect(this.annotations[e][0]['x'] + this.annotations[e][1]['x']-4, this.annotations[e][0]['y']-2, 4, 4);
        this.ctx.fillRect(this.annotations[e][0]['x']-2, this.annotations[e][0]['y'] + this.annotations[e][1]['y']-4, 4, 4);
        this.ctx.strokeRect(this.annotations[e][0]['x'], this.annotations[e][0]['y'], this.annotations[e][1]['x'], this.annotations[e][1]['y']);
        this.ctx.fillRect(this.annotations[e][0]['x'] + this.annotations[e][1]['x']-3, this.annotations[e][0]['y'] + this.annotations[e][1]['y']-3, 4, 4);
      }
      this.ctx.lineWidth = 2.5;
      this.ctx.stroke();
    }
  }

  info() {
    console.log(this.annotations, this.cacheAnnot);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e) {
    let x, y, rect;
    // console.log(e.clientX+','+e.clientY, this.click);
    rect = this.canvas.getBoundingClientRect();
    x = e.clientX - rect.left - 3;
    y = e.clientY - rect.top - 3;
    if (this.count == 1) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.re_draw();
      this.ctx.fillStyle = 'white';
      this.ctx.strokeStyle = 'white';
      this.ctx.fillRect(this.coords[0]['x'] - 2, this.coords[0]['y'] - 2, 4, 4);
      this.ctx.fillRect(this.coords[0]['x'] - 2, y - 2, 4, 4);
      this.ctx.fillRect(x - 2, this.coords[0]['y'] - 2, 4, 4);
      this.ctx.strokeRect(this.coords[0]['x'], this.coords[0]['y'], x - this.coords[0]['x'], y - this.coords[0]['y']);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      this.ctx.fillRect(this.coords[0]['x'], this.coords[0]['y'], x - this.coords[0]['x'], y - this.coords[0]['y']);
      this.ctx.fillRect(x - 2, y - 2, 4, 4);
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }
  }

  noMess() {
    this.showMyMessage = false;
  }

  annotate(event) {
    let x, y, rect;
    if (this.objDet == false) {
      if (this.label != undefined) {
        this.count++;
        this.showMyMessage = false;
        this.on = false;
        this.id = undefined;
        if (this.count == 1) {
          this.ctx.beginPath();
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.re_draw();
          rect = this.canvas.getBoundingClientRect();
          x = event.clientX - rect.left;
          y = event.clientY - rect.top;
          this.coords.push({ 'x': x, 'y': y });
          this.ctx.moveTo(x, y);
          this.ctx.fillStyle = "white";
          this.ctx.fillRect(x - 2, y - 2, 4, 4);
        }
        else if (this.count == 2) {
          this.count = 0;
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          // console.log(event.button) // types of clicks
          rect = this.canvas.getBoundingClientRect();
          x = event.clientX - rect.left;
          y = event.clientY - rect.top;
          this.ctx.fillStyle = "lime";
          this.ctx.strokeStyle = 'lime';
          this.ctx.fillRect(this.coords[0]['x'], this.coords[0]['y'], 4, 4);
          this.ctx.fillRect(this.coords[0]['x'], y - 2, 4, 4);
          this.ctx.fillRect(x - 2, this.coords[0]['y'] - 2, 4, 4);
          this.ctx.strokeRect(this.coords[0]['x'], this.coords[0]['y'], x - this.coords[0]['x'], y - this.coords[0]['y']);
          this.ctx.fillRect(x - 2, y - 2, 4, 4);
          x = x - this.coords[0].x;
          y = y - this.coords[0].y;
          this.coords.push({ 'x': x, 'y': y });
          this.coords.push({'general_detection': 'No'});
          this.coords.push({ 'label': this.label });
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
          this.annotations.push(this.coords);
          this.re_draw();
          this.coords = [];
        }
      } else {
        this.showMyMessage = true;
        setTimeout(() => {
          this.showMyMessage = false
        }, 5000)
      }
    } else {
      if (this.label != undefined) {
        let inX, endX, inY, endY;
        rect = this.canvas.getBoundingClientRect();
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
        for (let i = 0; i < this.annotations.length; i++) {
          if (this.annotations[i][0].x < this.annotations[i][1].x) {
            inX = this.annotations[i][0].x;
            endX = this.annotations[i][1].x;
          } else {
            inX = this.annotations[i][1].x;
            endX = this.annotations[i][0].x;
          }
          if (this.annotations[i][0].y < this.annotations[i][1].y) {
            inY = this.annotations[i][0].y;
            endY = this.annotations[i][1].y;
          } else {
            inY = this.annotations[i][1].y;
            endY = this.annotations[i][0].y;
          }
          if (x >= inX && x <= endX && y >= inY && y <= endY) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let e = 0; e < this.annotations.length; e++) {
              this.ctx.fillStyle = "lime";
              this.ctx.strokeStyle = 'lime';
              if (i == e) {
                this.annotations[e][2].label = this.label;
                this.ctx.strokeStyle = 'yellow';
                this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
                this.ctx.fillRect(this.annotations[e][0]['x'], this.annotations[e][0]['y'], this.annotations[e][1]['x'] - this.annotations[e][0]['x'], this.annotations[e][1]['y'] - this.annotations[e][0]['y']);
              }
              this.ctx.fillRect(this.annotations[e][0]['x']-2,this.annotations[e][0]['y']-2,4,4);
              this.ctx.fillRect(this.annotations[e][0]['x']-2,this.annotations[e][1]['y']-2,4,4);
              this.ctx.fillRect(this.annotations[e][1]['x']-2,this.annotations[e][0]['y']-2,4,4);    
              this.ctx.strokeRect(this.annotations[e][0]['x'],this.annotations[e][0]['y'],this.annotations[e][1]['x'] - this.annotations[e][0]['x'],this.annotations[e][1]['y'] - this.annotations[e][0]['y']);
              this.ctx.fillRect(this.annotations[e][1]['x']-2,this.annotations[e][1]['y']-2,4,4);
              /* this.ctx.fillRect(this.annotations[e][0]['x'], this.annotations[e][0]['y'], 4, 4);
              this.ctx.fillRect(this.annotations[e][0]['x'] + this.annotations[e][1]['x'], this.annotations[e][0]['y'], 4, 4);
              this.ctx.fillRect(this.annotations[e][0]['x'], this.annotations[e][0]['y'] + this.annotations[e][1]['y'], 4, 4);
              this.ctx.strokeRect(this.annotations[e][0]['x'], this.annotations[e][0]['y'], this.annotations[e][1]['x'], this.annotations[e][1]['y']);
              this.ctx.fillRect(this.annotations[e][0]['x'] + this.annotations[e][1]['x'], this.annotations[e][0]['y'] + this.annotations[e][1]['y'], 4, 4); */
              this.ctx.lineWidth = 2;
              this.ctx.stroke();
            }
          }
        }
      } else {
        this.showMyMessage = true;
        setTimeout(() => {
          this.showMyMessage = false
        }, 5000)
      }
    }
  }

  re_draw() {
    for (let e = 0; e < this.annotations.length; e++) {
      this.ctx.fillStyle = "lime";
      this.ctx.strokeStyle = 'lime';
      if(this.annotations[e][2]['general_detection'] == 'Yes') {
        this.ctx.fillRect(this.annotations[e][0]['x'],this.annotations[e][0]['y'],4,4);
        this.ctx.fillRect(this.annotations[e][0]['x']-2,this.annotations[e][1]['y']-3,4,4);
        this.ctx.fillRect(this.annotations[e][1]['x'],this.annotations[e][0]['y'],4,4);    
        this.ctx.strokeRect(this.annotations[e][0]['x'],this.annotations[e][0]['y'],this.annotations[e][1]['x'] - this.annotations[e][0]['x'],this.annotations[e][1]['y'] - this.annotations[e][0]['y']);
        this.ctx.fillRect(this.annotations[e][1]['x']-3,this.annotations[e][1]['y']-3,4,4);
      } else {
        this.ctx.fillRect(this.annotations[e][0]['x']-2, this.annotations[e][0]['y']-2, 4, 4);
        this.ctx.fillRect(this.annotations[e][0]['x'] + this.annotations[e][1]['x']-4, this.annotations[e][0]['y']-2, 4, 4);
        this.ctx.fillRect(this.annotations[e][0]['x']-2, this.annotations[e][0]['y'] + this.annotations[e][1]['y']-4, 4, 4);
        this.ctx.strokeRect(this.annotations[e][0]['x'], this.annotations[e][0]['y'], this.annotations[e][1]['x'], this.annotations[e][1]['y']);
        this.ctx.fillRect(this.annotations[e][0]['x'] + this.annotations[e][1]['x']-3, this.annotations[e][0]['y'] + this.annotations[e][1]['y']-3, 4, 4);
      }
      /* this.ctx.fillRect(this.annotations[e][0]['x']-2,this.annotations[e][0]['y']-2,4,4);
      this.ctx.fillRect(this.annotations[e][0]['x']-2,this.annotations[e][1]['y']-2,4,4);
      this.ctx.fillRect(this.annotations[e][1]['x']-2,this.annotations[e][0]['y']-2,4,4);    
      this.ctx.strokeRect(this.annotations[e][0]['x'],this.annotations[e][0]['y'],this.annotations[e][1]['x'] - this.annotations[e][0]['x'],this.annotations[e][1]['y'] - this.annotations[e][0]['y']);
      this.ctx.fillRect(this.annotations[e][1]['x']-2,this.annotations[e][1]['y']-2,4,4); */
      this.ctx.lineWidth = 2.5;
      this.ctx.stroke();
      //return;
    }
  }
  activeButton(event) {
    let clickedElement = event.target || event.srcElement;

    if (clickedElement.nodeName === "BUTTON") {
      let isCertainButtonAlreadyActive = document.querySelector(
        ".button-active"
      );
      // if a Button already has Class: .active
      if (isCertainButtonAlreadyActive) {
        isCertainButtonAlreadyActive.classList.remove("button-active");
      }

      clickedElement.className += " button-active";
    }
  }
  generalDetection(event) {
    this.activeButton(event);
    this.selectedID = "";
    this.flag = true;
    this.spinflag = true;
    let body = {
      details: this.data,
      img: baseURL + this.data.image,
      singleImage : true
    };
    if(this.annCount > 1) {
      this.annotations.splice(this.fixedSize, this.annotations.length);
    }
    this.annotationsServ.generalDetection(body).subscribe(res => {
      this.flag = false;
      this.spinflag = false;
      alert(`${res.length} objects detected.`);
      res.forEach(element => {
        this.annotations.push(element);
        ++this.annCount;
      });
      this.re_draw();
    });
  }

  addLabel() {
    this.labels.push(this.newLabel);
    this.newLabel = null;
  }

}
