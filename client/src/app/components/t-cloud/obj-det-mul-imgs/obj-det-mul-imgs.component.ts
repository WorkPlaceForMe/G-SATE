import { Component, OnInit, ViewChild, ElementRef, Renderer2, HostListener, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { FacesService } from '../../../services/faces.service';
import { AnnotationsService } from '../../../services/annotations.service';
import { PagerService } from '../../../services/pager.service';
import { ip } from '../../../models/IpServer'

const baseURL = 'http://ec2-54-152-186-179.compute-1.amazonaws.com';
@Component({
  selector: 'app-obj-det-mul-imgs',
  templateUrl: './obj-det-mul-imgs.component.html',
  styleUrls: ['./obj-det-mul-imgs.component.css']
})
export class ObjDetMulImgsComponent implements OnInit {

  constructor(private rd: Renderer2, private activatedRoute: ActivatedRoute, sanitizer: DomSanitizer, private facesService: FacesService, private annotationsServ: AnnotationsService, private router: Router,
              private pagerService: PagerService) {

    /* const string = this.activatedRoute.snapshot.params.folder.split(' ').join('_');
    this.valueImage = parseInt(this.activatedRoute.snapshot.params.image, 10);
    this.data = this.router.getCurrentNavigation().extras.state.data;
    this.annotationsServ.getImages(string, 'data').subscribe(
      res => {
        this.images = res;
        this.total = this.images[this.images.length - 1]['total'];
        this.images.pop();
        for (let i = 0; i < this.images.length; i++) {
          if (this.images[i].name.includes('.jpg')) {
            this.images[i].name = this.images[i].name.replace('.jpg', '');
            this.images[i].format = '.jpg';
          } else if (this.images[i].name.includes('.png')) {
            this.images[i].name = this.images[i].name.replace('.png', '');
            this.images[i].format = '.png';
          } else if (this.images[i].name.includes('.jpeg')) {
            this.images[i].name = this.images[i].name.replace('.jpeg', '');
            this.images[i].format = '.jpeg';
          } else if (this.images[i].name.includes('.JPG')) {
            this.images[i].name = this.images[i].name.replace('.JPG', '');
            this.images[i].format = '.JPG';
          } if (this.images[i].name.includes('.PNG')) {
            this.images[i].name = this.images[i].name.replace('.PNG', '');
            this.images[i].format = '.PNG';
          }
        }
        this.images.sort(function (a, b) { return a.name - b.name });
        for (let i = 0; i < this.images.length; i++) {
          this.images[i].name = this.images[i].name + this.images[i].format;
        }
        this.picture = string + '/' + this.images[this.valueImage].name; */
        /* if (this.images[this.valueImage].width)
        this.annWidth = 719;//1600;//this.images[this.valueImage].width;
        this.annHeight = 487;//1080;//this.images[this.valueImage].height;
        let rect = this.canvas.getBoundingClientRect();
        let res_width = 719//this.camera.cam_width;
        let res_height = 487//this.camera.cam_height;
        let resRelation = res_height / res_width;
        this.width = rect.width;
        console.log(this.width, rect.width)
        this.height = this.width*resRelation;
        console.log(this.height, rect.height) */
        /* if (window.innerWidth >= 1200) {
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
        } */
        //this.link = sanitizer.bypassSecurityTrustStyle('url(' + baseURL + this.data.image + ')');
        //this.link = sanitizer.bypassSecurityTrustStyle("url(http://"+ ip +":6503/datasets/"+ this.picture +")");
        //this.getAnn();
        //this.setPage(1);
      /* },
      err => console.log(err)
    ) */
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

  pager: any = {};

  // paged items
  pagedItems: any[];
  items = [];
  pageOfItems: Array<any>;
  data: any;
  initPage: number = 0;
  pages: number;
  total: number;
  width: number;
  height: number;
  annWidth: number;
  annHeight: number;
  objDet: boolean = false;
  spin: boolean = false;
  card: any = {
    width: 0,
    height: 0
  }

  link: SafeResourceUrl;
  multiple: boolean = true;
  showMyMessage: boolean = false;
  clearAct: boolean = false;
  valueImage: number;
  fakeValueImage: number;
  picture: string;
  labelsMessage: boolean = true;
  datasetFlag: boolean = false;

  inf: any = {};
  deviceInfo = null;

  newLabel: string = null;

  images: any = [];

  labels: any = [];
  annObj = {};
  labelsObj = {};


  @ViewChildren('polygon') polygon: QueryList<ElementRef>;
  private canvas;
  private ctx;

  ngAfterViewInit() {
    this.polygon.forEach((c, index) => {
      this.canvas = this.rd.selectRootElement(c["nativeElement"]);
      this.ctx = this.canvas.getContext("2d");
      let rect = this.canvas.getBoundingClientRect();
      this.data[index].res_width = this.data[index].width;
      this.data[index].res_height = this.data[index].height;
      this.data[index].width = rect.width;
      let resRelation = this.data[index].res_height / this.data[index].res_width;
      this.data[index].height = this.data[index].width*resRelation;
    });
  }

  setContext (ind) {
    setTimeout(() => {
      this.polygon.forEach((c) => {
        let index = ind;
        this.canvas = this.rd.selectRootElement(c["nativeElement"]);
        this.ctx = this.canvas.getContext("2d");
        let rect = this.canvas.getBoundingClientRect();
        this.data[index].res_width = this.data[index].width;
        this.data[index].res_height = this.data[index].height;
        this.data[index].width = rect.width;
        let resRelation = this.data[index].res_height / this.data[index].res_width;
        this.data[index].height = this.data[index].width*resRelation;
        ++ind;
    });
    }, 1000);
  }

  ngOnInit() {
    this.processDataset();
    this.activatedRoute.params
    if (this.activatedRoute.snapshot.params.method == 'dataset') {
      this.multiple = true;
    } else if (JSON.stringify(this.activatedRoute.snapshot.routeConfig).includes('objectDetection')) {
      this.multiple = true;
      this.objDet = true;
    } else {
      this.label = this.activatedRoute.snapshot.params.method;
    }
  }

  processDataset() {
    this.spin = true;
    let data = {
      name: this.activatedRoute.snapshot.params.folder
    }
    this.annotationsServ.processDataset(data).subscribe(res => {
      this.data = res;
      this.spin = false;
      this.datasetFlag = true;
      this.setPage(1);
    })
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
        return;
    }
    if(page > 1) {
      this.setContext(this.pager.endIndex + 1);
    } else {
      this.setContext(0);
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.data.length, page);

    // get current page of items
    this.pagedItems = this.data.slice(this.pager.startIndex, this.pager.endIndex + 1);
    
}

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }

  getAnn(i) {
    /* let a, b;
    if (this.picture.includes('.jpg')) {
      a = this.picture.replace('.jpg', '');
    } else if (this.picture.includes('.png')) {
      a = this.picture.replace('.png', '');
    } else if (this.picture.includes('.jpeg')) {
      a = this.picture.replace('.jpeg', '');
    } else if (this.picture.includes('.JPG')) {
      a = this.picture.replace('.JPG', '');
    } else if (this.picture.includes('.PNG')) {
      a = this.picture.replace('.PNG', '');
    }
    a = a.split('/').join(' '); */
    /* this.annotationsServ.getAnn(a).subscribe(
      res=>{
        if(res != "it doesn't exists this annotation"){
        this.annotations = res;
        this.annotations = JSON.parse(this.annotations);
        this.annotations.pop();
        this.cacheAnnot = this.annotations;
        this.re_draw();
        }else {
          console.log(res);
        }
      },
      err => console.log(err)
    ) */
    if (this.annObj.hasOwnProperty(this.data[i].id)) {
      this.annotations = this.annObj[this.data[i].id];
      this.cacheAnnot = this.annotations;
    } else {
      this.annotations = [];
      for (let itm in this.data[i].results) {
        if (Array.isArray(this.data[i].results[itm])) {
          this.data[i].results[itm].forEach(element => {
            let obj1 = {
              x: element.boundingBox.left * this.data[i].width / this.data[i].res_width,
              y: element.boundingBox.top * this.data[i].height / this.data[i].res_height
            };
            this.ann.push(obj1);
            let obj2 = {
              x: element.boundingBox.width * this.data[i].width / this.data[i].res_width,
              y: element.boundingBox.height * this.data[i].height / this.data[i].res_height
            };
            this.ann.push(obj2);
            let obj3 = {
              label: element.class
            };
            this.ann.push(obj3);
            this.annotations.push(this.ann);
            this.ann = [];
          })
        }
      }

      this.annObj[this.data[i].id] = this.annotations;
      this.cacheAnnot = this.annotations;
    }

    this.re_draw();
  }

  getLabels(i) {
    /* this.annotationsServ.readLabels().subscribe(
      res=>{
        this.labels = res;
        this.labels = this.labels.split('\r\n')
        this.labels.pop();
      },
      err => console.log(err)
    ) */
    if (this.labelsObj.hasOwnProperty(this.data[i].id)) {
      this.labels = this.labelsObj[this.data[i].id];
      this.cacheAnnot = this.labels;
    } else {
      this.labels = [];
      for (let itm in this.data[i].results) {
        if (Array.isArray(this.data[i].results[itm])) {
          this.data[i].results[itm].forEach(element => {
            this.labels.push(element.class);
          })
        }
      }

      this.labelsObj[this.data[i].id] = this.labels;
    }
    /* for (let itm in this.data[i].results) {
      if (Array.isArray(this.data[i].results[itm])) {
        this.data[i].results[itm].forEach(element => {
          this.labels.push(element.class);
        })
      }
    } */
  }

  next() {
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

  updateLabel() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let e = 0; e < this.annotations.length; e++) {
      if (e == this.id) {
        this.annotations[e].pop();
        this.annotations[e].push({ label: this.label });
      }
    }
    this.re_draw();
    this.on = false;
    this.id = undefined;
  }

  get(i) {
    this.on = true;
    this.clearAct = true;
    this.id = i;
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
      this.ctx.fillRect(this.annotations[e][0]['x'], this.annotations[e][0]['y'], 4, 4);
      this.ctx.fillRect(this.annotations[e][0]['x'] + this.annotations[e][1]['x'], this.annotations[e][0]['y'], 4, 4);
      this.ctx.fillRect(this.annotations[e][0]['x'], this.annotations[e][0]['y'] + this.annotations[e][1]['y'], 4, 4);
      this.ctx.strokeRect(this.annotations[e][0]['x'], this.annotations[e][0]['y'], this.annotations[e][1]['x'], this.annotations[e][1]['y']);
      this.ctx.fillRect(this.annotations[e][0]['x'] + this.annotations[e][1]['x'], this.annotations[e][0]['y'] + this.annotations[e][1]['y'], 4, 4);
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

  count: number = 0;

  id: number;
  on: boolean = false;
  coords = [];
  annotations: any = [];
  ann: any = [];
  cacheAnnot: any = [];
  label: string;

  noMess() {
    this.showMyMessage = false;
  }

  annotate(event, i) {
    this.canvas = this.rd.selectRootElement(event.target);
    this.ctx = this.canvas.getContext("2d");
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
          this.ctx.fillRect(this.coords[0]['x'] - 2, this.coords[0]['y'] - 2, 4, 4);
          this.ctx.fillRect(this.coords[0]['x'] - 2, y - 2, 4, 4);
          this.ctx.fillRect(x - 2, this.coords[0]['y'] - 2, 4, 4);
          this.ctx.strokeStyle = 'lime';
          this.ctx.strokeRect(this.coords[0]['x'], this.coords[0]['y'], x - this.coords[0]['x'], y - this.coords[0]['y']);
          this.ctx.fillRect(x - 2, y - 2, 4, 4);
          x = x - this.coords[0].x;
          y = y - this.coords[0].y;
          this.coords.push({ 'x': x, 'y': y });
          this.coords.push({ 'label': this.label })
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
          this.annotations.push(this.coords);
          this.annObj[this.data[i].id] = this.annotations;
          this.annotations = this.annObj[this.data[i].id];
          this.labels.push(this.label);
          this.labelsObj[this.data[i].id] = this.labels;
          this.labels = this.labelsObj[this.data[i].id];
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
                this.annObj[this.data[i].id] = this.annotations;
                this.annotations = this.annObj[this.data[i].id];
                this.labels.push(this.label);
                this.labelsObj[this.data[i].id] = this.labels;
                this.labels = this.labelsObj[this.data[i].id];
                this.ctx.strokeStyle = 'yellow';
                this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
                this.ctx.fillRect(this.annotations[e][0]['x'], this.annotations[e][0]['y'], this.annotations[e][1]['x'] - this.annotations[e][0]['x'], this.annotations[e][1]['y'] - this.annotations[e][0]['y']);
              }
              this.ctx.fillRect(this.annotations[e][0]['x'], this.annotations[e][0]['y'], 4, 4);
              this.ctx.fillRect(this.annotations[e][0]['x'] + this.annotations[e][1]['x'], this.annotations[e][0]['y'], 4, 4);
              this.ctx.fillRect(this.annotations[e][0]['x'], this.annotations[e][0]['y'] + this.annotations[e][1]['y'], 4, 4);
              this.ctx.strokeRect(this.annotations[e][0]['x'], this.annotations[e][0]['y'], this.annotations[e][1]['x'], this.annotations[e][1]['y']);
              this.ctx.fillRect(this.annotations[e][0]['x'] + this.annotations[e][1]['x'], this.annotations[e][0]['y'] + this.annotations[e][1]['y'], 4, 4);
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
      /* this.ctx.fillRect(this.annotations[e][0]['x']-2,this.annotations[e][0]['y']-2,4,4);
      this.ctx.fillRect(this.annotations[e][0]['x']-2,this.annotations[e][1]['y']-2,4,4);
      this.ctx.fillRect(this.annotations[e][1]['x']-2,this.annotations[e][0]['y']-2,4,4);    
      this.ctx.strokeRect(this.annotations[e][0]['x'],this.annotations[e][0]['y'],this.annotations[e][1]['x'] - this.annotations[e][0]['x'],this.annotations[e][1]['y'] - this.annotations[e][0]['y']);
      this.ctx.fillRect(this.annotations[e][1]['x']-2,this.annotations[e][1]['y']-2,4,4); */
      this.ctx.fillRect(this.annotations[e][0]['x'], this.annotations[e][0]['y'], 4, 4);
      this.ctx.fillRect(this.annotations[e][0]['x'] + this.annotations[e][1]['x'], this.annotations[e][0]['y'], 4, 4);
      this.ctx.fillRect(this.annotations[e][0]['x'], this.annotations[e][0]['y'] + this.annotations[e][1]['y'], 4, 4);
      this.ctx.strokeRect(this.annotations[e][0]['x'], this.annotations[e][0]['y'], this.annotations[e][1]['x'], this.annotations[e][1]['y']);
      this.ctx.fillRect(this.annotations[e][0]['x'] + this.annotations[e][1]['x'], this.annotations[e][0]['y'] + this.annotations[e][1]['y'], 4, 4);
      this.ctx.lineWidth = 2.5;
      this.ctx.stroke();
      //return;
    }
  }

  getImgAnnotations(i) {
    this.canvas = this.rd.selectRootElement(`canvas#jPolygon${i}.card-img-top.img-fluid`);
    this.ctx = this.canvas.getContext("2d");
    this.labelsMessage = false;
    //this.getLabels();
    this.getAnn(i);
    this.getLabels(i)
    this.re_draw();
  }

  addLabel() {
    /* this.annotationsServ.writeLabel(this.newLabel).subscribe(
      res => {
        console.log(res)
        this.newLabel = null;
        this.getLabels();
      },
      err => console.log(err)
    ) */
    this.labels.push(this.newLabel);
    this.newLabel = null;
  }

}

