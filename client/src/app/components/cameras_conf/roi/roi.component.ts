import { v4 as uuidv4 } from "uuid";
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  HostListener,
} from "@angular/core";
import { FacesService } from "../../../services/faces.service";
import { ColorsService } from "../../../services/colors";
import { Algorithm } from "src/app/models/Algorithm";
import { Relation } from "src/app/models/Relation";
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Camera } from "src/app/models/Camera";
import { Roi } from "src/app/models/Roi";
import { DatePipe } from "@angular/common";
import { ip } from "src/app/models/IpServer";

@Component({
  selector: "app-roi",
  templateUrl: "./roi.component.html",
  styleUrls: ["./roi.component.css"],
})
export class ROIComponent implements OnInit {
  @Input() private src: string;
  @Output() private created = new EventEmitter();
  @ViewChild("polygon", { static: true }) private polygon: ElementRef;

  link: SafeResourceUrl;
  x: number;
  y: number;
  width: number;
  height: number;
  resRelation: number;
  res_width: number;
  res_height: number;
  camera: Camera;
  polygons = [];
  perimeter = [];
  relations: any = [];
  algos: any = [];
  colour: string = "";
  fill: string = "";
  parking: any = {};
  wrong: any = {};
  wrong0: any = {};
  atrCache: any;
  roi: Roi = {
    id: "",
    coords: "",
    camera_id: "",
  };
  rois: any = [];
  complete = false;
  param: string = this.activatedRoute.snapshot.params.uuid;
  id: number = this.activatedRoute.snapshot.params.id;
  selected: number;
  different: boolean = false;
  public showMyMessage = false;
  public showMyMessage1 = false;
  public showMyMessage2 = false;
  public showMyMessage3 = false;
  public showMyMessage4 = false;
  private canvas;
  private ctx;
  algorithm: Algorithm;
  relation: Relation = {
    camera_id: "",
    algo_id: 0,
    roi_id: null,
    atributes: null,
    id: null,
  };

  public innerWidth: any;
  public innerHeight: any;
  constructor(
    private rd: Renderer2,
    private facesService: FacesService,
    private activatedRoute: ActivatedRoute,
    sanitizer: DomSanitizer,
    private colo: ColorsService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    //  debugger;
    const params = this.activatedRoute.snapshot.params;
    this.wrong["dir"] = "beggining";
    this.wrong["of"] = this.polygons.length + 1;
    this.facesService.getCamera(params.uuid).subscribe(
      (res) => {
        this.camera = res;
        this.res_width = this.camera.cam_width;
        this.res_height = this.camera.cam_height;
        this.resRelation = this.res_height / this.res_width;
        if (window.innerWidth >= 1200) {
          this.width = 1044;
          this.height = this.width * this.resRelation;
        } else if (window.innerWidth < 1200 && window.innerWidth >= 992) {
          this.width = 864;
          this.height = this.width * this.resRelation;
        } else if (window.innerWidth < 992 && window.innerWidth >= 768) {
          this.width = 624;
          this.height = this.width * this.resRelation;
        } else if (window.innerWidth < 768 && window.innerWidth >= 576) {
          this.width = 444;
          this.height = this.width * this.resRelation;
        }
        this.facesService.getRelations(params.uuid).subscribe(
          (res) => {
            this.relations = res;
            for (let u = 0; u < this.relations.length; u++) {
              if (this.relations[u]["algo_id"] == 13) {
                this.algos[13].activated = true;
              }
              if (
                this.relations[u]["roi_id"] != null &&
                this.relations[u]["algo_id"] == params.id
              ) {
                this.relations[u]["roi_id"] = JSON.parse(
                  this.relations[u]["roi_id"]
                );
                for (let l = 0; l < this.relations[u]["roi_id"].length; l++) {
                  //these parameters is to scalate it according to RoI resolution
                  this.relations[u]["roi_id"][l]["x"] =
                    (this.relations[u]["roi_id"][l]["x"] * this.width) /
                    this.res_width;
                  this.relations[u]["roi_id"][l]["y"] =
                    (this.relations[u]["roi_id"][l]["y"] * this.height) /
                    this.res_height;
                }
                if (this.relations[u]["atributes"] != null) {
                  this.relations[u]["roi_id"].push(
                    JSON.parse(this.relations[u]["atributes"])
                  );
                }
                this.relations[u]["roi_id"].push(this.relations[u]["algo_id"]);
                this.polygons.push(this.relations[u]["roi_id"]);
                console.log(this.relations[u]["roi_id"]);
              }
            }
            if (this.polygons != null) {
              this.re_draw(true);
            }
          },
          (err) => console.error(err)
        );
        this.link = sanitizer.bypassSecurityTrustStyle(
          "url(" + "http://" + ip + ":4200" + this.camera.heatmap_pic + ")"
          // "url(" + this.camera.heatmap_pic + ")"
        );
      },
      (err) => console.error(err)
    );
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    if (window.innerWidth >= 1200) {
      // if(this.width != 1044){
      //   this.scale();
      // }
      this.width = 1044;
      this.height = this.width * this.resRelation;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.re_draw(true);
    } else if (window.innerWidth < 1200 && window.innerWidth >= 992) {
      // if(this.width != 864){
      //   this.scale();
      // }
      this.width = 864;
      this.height = this.width * this.resRelation;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.re_draw(true);
    } else if (window.innerWidth < 992 && window.innerWidth >= 768) {
      // if(this.width != 624){
      //   this.scale();
      // }
      this.width = 624;
      this.height = this.width * this.resRelation;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.re_draw(true);
    } else if (window.innerWidth < 768 && window.innerWidth >= 576) {
      // if(this.width != 444){
      //   this.scale();
      // }
      this.width = 444;
      this.height = this.width * this.resRelation;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.re_draw(true);
    }
  }

  scale() {
    for (let u = 0; u < this.polygons.length; u++) {
      for (let l = 0; l < this.polygons[u].length - 2; l++) {
        //these parameters is to scalate it according to RoI resolution
        this.polygons[u][l]["x"] =
          (this.polygons[u][l]["x"] * this.width) / this.res_width;
        this.polygons[u][l]["y"] =
          (this.polygons[u][l]["y"] * this.height) / this.res_height;
      }
    }
  }

  ngOnInit() {
    this.wrong["of"] = 1;
    this.setBcg();
    this.complete = false;
    this.start(false);
    this.facesService.getAlgos().subscribe(
      (res) => {
        this.algos = res;
        for (let i = 0; i < this.algos.length; i++) {
          if (this.algos[i]["id"] == this.id) {
            this.algorithm = this.algos[i];
          }
        }
        if (this.id == 4 || this.id == 8) {
          this.different = true;
        }
      },
      (err) => console.error(err)
    );
  }

  private static line_intersects(p0, p1, p2, p3) {
    let s1_x, s1_y, s2_x, s2_y;
    s1_x = p1["x"] - p0["x"];
    s1_y = p1["y"] - p0["y"];
    s2_x = p3["x"] - p2["x"];
    s2_y = p3["y"] - p2["y"];

    let s, t;
    s =
      (-s1_y * (p0["x"] - p2["x"]) + s1_x * (p0["y"] - p2["y"])) /
      (-s2_x * s1_y + s1_x * s2_y);
    t =
      (s2_x * (p0["y"] - p2["y"]) - s2_y * (p0["x"] - p2["x"])) /
      (-s2_x * s1_y + s1_x * s2_y);

    return s >= 0 && s <= 1 && t >= 0 && t <= 1;
    // No collision
  }

  private point(x, y, ind) {
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "white";
    if (this.perimeter.length == 1 || ind == true) {
      this.ctx.fillRect(x - 3, y - 3, 6, 6);
    } else {
      this.ctx.fillRect(x - 2, y - 2, 4, 4);
    }
    this.ctx.moveTo(x, y);
  }

  private draw(end) {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "white";
    this.ctx.lineCap = "circle";
    this.ctx.beginPath();
    for (let i = 0; i < this.perimeter.length; i++) {
      if (i == 0) {
        this.ctx.moveTo(this.perimeter[i]["x"], this.perimeter[i]["y"]);
        end || this.point(this.perimeter[i]["x"], this.perimeter[i]["y"], true);
      } else {
        this.ctx.lineTo(this.perimeter[i]["x"], this.perimeter[i]["y"]);
        end ||
          this.point(this.perimeter[i]["x"], this.perimeter[i]["y"], false);
      }
    }
    if (end) {
      this.ctx.lineTo(this.perimeter[0]["x"], this.perimeter[0]["y"]);
      this.ctx.closePath();
      var rgb = this.colo.ran_col(this.id, this.algos.length);
      this.colour = "rgba(" + rgb + ",1)";
      if (this.id == 8) {
        this.ctx.font = "40px Georgia";
        this.getMid(this.perimeter, false);
        this.ctx.fillStyle = this.colour;
        this.ctx.fillText(this.polygons.length, this.x, this.y);
      }
      this.ctx.fillStyle = this.fill + "0.3)";
      this.ctx.fill();
      this.ctx.strokeStyle = this.colour;
      for (let i = 0; i < this.perimeter.length; i++) {
        this.ctx.fillStyle = this.colour;
        this.ctx.fillRect(
          this.perimeter[i]["x"] - 2,
          this.perimeter[i]["y"] - 2,
          4,
          4
        );
      }
      this.complete = false;
      this.created.emit(this.perimeter);
    }
    this.ctx.stroke();
  }

  private check_intersect(x, y) {
    if (this.perimeter.length < 4) {
      return false;
    }
    let p0 = [];
    let p1 = [];
    let p2 = [];
    let p3 = [];

    p2["x"] = this.perimeter[this.perimeter.length - 1]["x"];
    p2["y"] = this.perimeter[this.perimeter.length - 1]["y"];
    p3["x"] = x;
    p3["y"] = y;

    for (let i = 0; i < this.perimeter.length - 1; i++) {
      p0["x"] = this.perimeter[i]["x"];
      p0["y"] = this.perimeter[i]["y"];
      p1["x"] = this.perimeter[i + 1]["x"];
      p1["y"] = this.perimeter[i + 1]["y"];
      if (p1["x"] == p2["x"] && p1["y"] == p2["y"]) {
        continue;
      }
      if (p0["x"] == p3["x"] && p0["y"] == p3["y"]) {
        continue;
      }
      if (ROIComponent.line_intersects(p0, p1, p2, p3) == true) {
        return true;
      }
    }
    return false;
  }

  point_it(event) {
    if (this.complete) {
      this.created.emit("already created");
      return false;
    }
    let rect, x, y;
    //  || event.which === 3 || event.button === 2
    if (event.ctrlKey) {
      if (this.perimeter.length == 2) {
        this.created.emit("at least 3 points required");
        return false;
      }
      x = this.perimeter[0]["x"];
      y = this.perimeter[0]["y"];
      if (this.check_intersect(x, y)) {
        this.created.emit("line intersecrion");
        return false;
      }
      this.draw(true);
      event.preventDefault();
      return false;
    } else {
      if (this.id == 4 && this.selected != undefined) {
        this.selected = undefined;
        this.parking = {};
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.re_draw(true);
      }
      rect = this.canvas.getBoundingClientRect();

      // x = event.clientX - rect.left;
      // y = event.clientY - rect.top;
      (x =
        ((event.clientX - rect.left) / (rect.right - rect.left)) *
        this.canvas.width),
        (y =
          ((event.clientY - rect.top) / (rect.bottom - rect.top)) *
          this.canvas.height);
      // x = event.clientX;
      // y = event.clientY;
      if (
        this.perimeter.length > 0 &&
        x == this.perimeter[this.perimeter.length - 1]["x"] &&
        y == this.perimeter[this.perimeter.length - 1]["y"]
      ) {
        // same point - double click
        return false;
      }
      if (
        this.perimeter.length > 2 &&
        x > this.perimeter[0]["x"] - 3 &&
        x < this.perimeter[0]["x"] + 3 &&
        y > this.perimeter[0]["y"] - 3 &&
        y < this.perimeter[0]["y"] + 3
      ) {
        if (this.id == 8) {
          this.close_wrong();
          return false;
        } else if (this.id == 4) {
          this.close_park();
          return false;
        } else {
          this.close();
          return false;
        }
      }
      if (this.check_intersect(x, y)) {
        this.created.emit("line intersection");
        return false;
      }
      this.perimeter.push({ x: x, y: y });

      this.draw(false);
      return false;
    }
  }

  private start(with_draw: boolean) {
    // this.src = 'assets/heatmap_picture.png';
    const img = new Image();
    // img.src = this.src;
    img.onload = () => {
      this.ctx = this.canvas.getContext("2d");
      // this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      if (with_draw == true) {
        this.draw(false);
      }
    };
  }

  private setBcg() {
    this.canvas = this.rd.selectRootElement(this.polygon["nativeElement"]);
    this.ctx = this.canvas.getContext("2d");
  }

  close_park() {
    if (
      this.parking.car == true ||
      this.parking.truck == true ||
      this.parking.two_wheeler == true
    ) {
      if (
        this.parking.time != undefined &&
        this.parking.rangeB != undefined &&
        this.parking.rangeE != undefined
      ) {
        if (this.selected != undefined) {
          for (let e = 0; e < this.polygons.length; e++) {
            if (this.selected == e) {
              this.polygons[e][this.polygons[e].length - 2] = JSON.stringify(
                this.parking
              );
            }
          }
          this.selected = undefined;
          this.showMyMessage = false;
        } else if (this.selected == undefined) {
          this.close();
        }
      } else {
        this.showMyMessage1 = false;
        this.showMyMessage2 = true;
        setTimeout(() => {
          this.showMyMessage2 = false;
        }, 5000);
      }
    } else {
      this.showMyMessage1 = true;
      setTimeout(() => {
        this.showMyMessage1 = false;
      }, 5000);
    }
  }

  addPair() {
    this.showMyMessage3 = false;
    if (this.isOdd(this.polygons.length) == 1 || this.polygons.length == 0) {
      this.showMyMessage3 = true;
      setTimeout(() => {
        this.showMyMessage3 = false;
      }, 5000);
    } else {
      this.complete = false;
      this.wrong["dir"] = "beggining";
      this.wrong["of"] = this.polygons.length + 1;
    }
  }

  getMid(pol, which) {
    this.x = 0;
    this.y = 0;
    let sumX = 0,
      sumY = 0,
      res;
    for (let i = 0; i < pol.length; i++) {
      if (typeof pol[i]["x"] == "number" && typeof pol[i]["y"] == "number") {
        sumX = pol[i]["x"] + sumX;
        sumY = pol[i]["y"] + sumY;
      }
    }
    if (which == true) {
      sumX = sumX / (pol.length - 2);
      sumY = sumY / (pol.length - 2);
    } else if (which == false) {
      sumX = sumX / (pol.length - 2);
      sumY = sumY / (pol.length - 2);
    }
    this.x = sumX;
    this.y = sumY;
    res = sumX + "," + sumY;
    return res;
  }

  close_wrong() {
    // if(this.isOdd(this.polygons.length) == 0){
    //   this.wrong['of'] = this.polygons.length + 1;
    // } else if(this.isOdd(this.polygons.length) == 1){
    //   this.wrong['of'] = this.polygons.length - 1;
    //   }
    this.close();
    if (this.isOdd(this.polygons.length) == 0) {
      this.complete = true;
    }
    if (this.isOdd(this.polygons.length) == 1) {
      this.wrong["dir"] = "end";
      this.wrong["of"] = this.polygons.length - 1;
    }
  }

  close() {
    if (this.perimeter.length > 2) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.re_draw(true);
      if (this.id == 8) {
        this.perimeter.push(JSON.stringify(this.wrong));
        this.wrong = {};
      }
      if (this.id == 4) {
        this.perimeter.push(JSON.stringify(this.parking));
        this.parking = {};
      }
      this.perimeter.push(this.id);
      this.polygons.push(this.perimeter);
      var rgb = this.colo.ran_col(this.id, this.algos.length);
      this.colour = "rgba(" + rgb + ",1)";
      this.fill = "rgba(" + rgb + ",0.3)";
      // if(this.id == 8){
      //   this.ctx.font = '40px Georgia';
      //   this.getMid(this.perimeter);
      //   this.ctx.fillText(this.polygons.length,this.x,this.y);
      // }
      this.draw(true);
      this.perimeter = [];
      this.showMyMessage = false;
    } else {
      this.showMyMessage = true;
      setTimeout(() => {
        this.showMyMessage = false;
      }, 5000);
    }
  }

  undo() {
    this.perimeter.pop();
    this.complete = false;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.draw(false);
    this.re_draw(true);
  }

  clear_canvas() {
    this.perimeter = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.re_draw(true);
  }

  remove_last() {
    if (this.perimeter.length == 0) {
      this.polygons.pop();
      if (this.id == 8 && this.isOdd(this.polygons.length) == 1) {
        this.wrong["of"] = this.polygons.length - 1;
        this.wrong["dir"] = "end";
      } else if (this.id == 8 && this.isOdd(this.polygons.length) == 0) {
        this.wrong["of"] = this.polygons.length + 1;
        this.wrong["dir"] = "beggining";
      }
      this.complete = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.re_draw(true);
    } else {
      this.perimeter = [];
      this.complete = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.re_draw(true);
    }
  }

  re_draw(end: boolean) {
    let pred_colour, pred_fill;
    for (let e = 0; e < this.polygons.length; e++) {
      for (let u = 0; u < this.algos.length; u++) {
        if (this.polygons[e][this.polygons[e].length - 1] == u) {
          var rgb = this.colo.ran_col(u, this.algos.length);
          pred_colour = "rgba(" + rgb + ",1)";
          pred_fill = "rgba(" + rgb + ",0.3)";
        }
      }
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = "yellow";
      this.ctx.lineCap = "circle";
      this.ctx.beginPath();
      for (let i = 0; i < this.polygons[e].length; i++) {
        if (i == 0) {
          this.ctx.moveTo(this.polygons[e][i]["x"], this.polygons[e][i]["y"]);
          end ||
            this.point(
              this.polygons[e][i]["x"],
              this.polygons[e][i]["y"],
              false
            );
          this.ctx.fillStyle = pred_colour;
          this.ctx.fillRect(
            this.polygons[e][i]["x"] - 2,
            this.polygons[e][i]["y"] - 2,
            4,
            4
          );
        } else {
          this.ctx.lineTo(this.polygons[e][i]["x"], this.polygons[e][i]["y"]);
          end ||
            this.point(
              this.polygons[e][i]["x"],
              this.polygons[e][i]["y"],
              false
            );
          this.ctx.fillStyle = pred_colour;
          this.ctx.fillRect(
            this.polygons[e][i]["x"] - 2,
            this.polygons[e][i]["y"] - 2,
            4,
            4
          );
        }
      }
      if (end) {
        this.ctx.lineTo(this.polygons[e][0]["x"], this.polygons[e][0]["y"]);
        this.ctx.closePath();
        if (this.id == 8) {
          this.ctx.font = "40px Georgia";
          this.getMid(this.polygons[e], true);
          this.ctx.strokeStyle = pred_colour;
          this.ctx.fillText(e + 1, this.x, this.y);
        }
        this.ctx.fillStyle = pred_fill;
        this.ctx.fill();
        this.ctx.strokeStyle = pred_colour;
        this.created.emit(this.perimeter);
      }
      this.ctx.stroke();
    }
  }

  info() {
    console.log(this.polygons, this.relations, this.perimeter, this.wrong);
  }

  isOdd(num) {
    return num % 2;
  }

  comparator(a, b) {
    if (a[a.length - 1] < b[b.length - 1]) return -1;
    if (a[a.length - 1] > b[b.length - 1]) return 1;
    return 0;
  }

  get(t) {
    let pred_colour, pred_fill;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let e = 0; e < this.polygons.length; e++) {
      for (let u = 0; u < this.algos.length; u++) {
        if (this.polygons[e][this.polygons[e].length - 1] == u) {
          var rgb = this.colo.ran_col(u, this.algos.length);
          pred_colour = "rgba(" + rgb + ",1)";
          pred_fill = "rgba(" + rgb + ",0.3)";
        }
      }
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      if (t == e) {
        this.parking = JSON.parse(
          this.polygons[e][this.polygons[e].length - 2]
        );
        this.selected = t;
        this.perimeter = [];
        pred_colour = "yellow";
        pred_fill = "rgba(255, 255, 255, 0.3)";
      }
      for (let i = 0; i < this.polygons[e].length; i++) {
        if (i == 0) {
          this.ctx.moveTo(this.polygons[e][i]["x"], this.polygons[e][i]["y"]);
          this.ctx.fillStyle = pred_colour;
          this.ctx.fillRect(
            this.polygons[e][i]["x"] - 2,
            this.polygons[e][i]["y"] - 2,
            4,
            4
          );
        } else {
          this.ctx.lineTo(this.polygons[e][i]["x"], this.polygons[e][i]["y"]);
          this.ctx.fillStyle = pred_colour;
          this.ctx.fillRect(
            this.polygons[e][i]["x"] - 2,
            this.polygons[e][i]["y"] - 2,
            4,
            4
          );
        }
      }
      this.ctx.lineTo(this.polygons[e][0]["x"], this.polygons[e][0]["y"]);
      this.ctx.closePath();
      this.ctx.fillStyle = pred_fill;
      this.ctx.fill();
      this.ctx.strokeStyle = pred_colour;
      this.created.emit(this.perimeter);

      this.ctx.stroke();
    }
  }

  get_dir(i) {
    for (let t = 0; t < this.polygons.length; t++) {
      if (t == i) {
        this.wrong0 = JSON.parse(this.polygons[t][this.polygons[t].length - 2]);
        this.selected = i;
        this.wrong0["id"] = i;
      }
    }
  }

  saveWrong() {
    if (this.polygons.length >= 2) {
      if (this.isOdd(this.polygons.length) == 0) {
        this.save();
      } else {
        this.showMyMessage4 = true;
        setTimeout(() => {
          this.showMyMessage4 = false;
        }, 5000);
      }
    } else {
      this.showMyMessage4 = true;
      setTimeout(() => {
        this.showMyMessage4 = false;
      }, 5000);
    }
  }

  save() {
    let string, a;
    const params = this.activatedRoute.snapshot.params;

    if (this.relations.length != 0) {
      if (this.rois.length != 0) {
        for (let u = 0; u < this.relations.length; u++) {
          //check for all relations from before if they are still in the new array, if not, they are deleted from the database
          let h = false;
          for (let t = 0; t < this.polygons.length; t++) {
            if (this.relations[u]["algo_id"] != params.id) {
              h = true;
            }
            if (
              JSON.stringify(this.relations[u]["roi_id"]) ==
              JSON.stringify(this.polygons[t])
            ) {
              h = true;
            }
          }

          if (h == false) {
            // this.facesService.deleteRoi(this.rois[n]['id']).subscribe(
            //   res =>{
            //     console.log(res);
            //   },
            //   err => console.log(err)
            // )
            // for(let u = 0; u < this.relations.length; u++){
            this.facesService.deleteRelation(this.relations[u]["id"]).subscribe(
              (res) => {
                console.log(res);
                this.facesService.getRelations(params.uuid).subscribe(
                  (res) => {
                    this.relations = res;
                    for (let u = 0; u < this.relations.length; u++) {
                      if (this.relations[u]["roi_id"] != null) {
                        this.relations[u]["roi_id"] = JSON.parse(
                          this.relations[u]["roi_id"]
                        );
                        this.relations[u]["roi_id"].push(
                          this.relations[u]["algo_id"]
                        );
                        this.polygons.push(this.relations[u]["roi_id"]);
                      }
                    }
                  },
                  (err) => console.error(err)
                );
              },
              (err) => console.log(err)
            );
            // }
            // this.facesService.getRoi(params.uuid).subscribe(
            //   res =>{
            //     this.rois =res;
            //     for(let u = 0; u < this.relations.length; u++){
            //       if(this.relations[u]['roi_id'] != null && this.rois[n]['id'] == this.relations[u]['roi_id']){
            //         this.rois[n]['coords'] = JSON.parse(this.rois[n]['coords']);
            //         this.rois[n]['coords'].push(this.relations[u]['algo_id']);
            //         this.polygons.push(this.rois[n]['coords']);
            //        }
            //     }
            //   },
            //   err => console.error(err)
            // );
          }
        }
      }
      if (this.polygons.length != 0) {
        for (let e = 0; e < this.relations.length; e++) {
          if (
            this.relations[e]["algo_id"] == this.id &&
            this.relations[e]["roi_id"] == null
          ) {
            //delete relation that doesn't have a RoI associated meaning that now this algorithm won't be applyed to all the screen
            if (this.relations[e]["atributes"] != null) {
              this.atrCache = this.relations[e]["atributes"];
            }
            this.facesService.deleteRelation(this.relations[e]["id"]).subscribe(
              (res) => {
                console.log(res);
              },
              (err) => console.log(err)
            );
          }
          if (this.id == 4 || this.id == 8) {
            //check if there is an update in the atributes of an existing area
            // for(let i = 0; i < this.rois.length; i++){
            // if(this.relations[e]['roi_id'] == this.rois[i]['id']){
            for (let u = 0; u < this.polygons.length; u++) {
              if (
                JSON.stringify(this.relations[e]["roi_id"]) ==
                  JSON.stringify(this.polygons[u]) &&
                JSON.parse(this.relations[e]["atributes"]) !=
                  this.polygons[u][this.polygons[u].length - 2]
              ) {
                this.relation.atributes = JSON.stringify(
                  this.polygons[u][this.polygons[u].length - 2]
                );
                this.facesService
                  .updateRelation(this.relations[e]["id"], this.relation)
                  .subscribe(
                    (res) => {
                      console.log(res);
                    },
                    (err) => console.log(err)
                  );
              }
            }
            // }
            // }
          }
        }
      }
    }
    for (let e = 0; e < this.polygons.length; e++) {
      if (this.relations.length == 0) {
        this.polygons[e].pop();

        let atr = null;
        if (this.id == 4 || this.id == 8) {
          atr = JSON.stringify(this.polygons[e][this.polygons[e].length - 1]);
          this.polygons[e].pop();
        }
        for (let l = 0; l < this.polygons[e].length; l++) {
          //these parameters is to scalate it according to RoI resolution
          this.polygons[e][l]["x"] =
            (this.polygons[e][l]["x"] * this.res_width) / this.width;
          this.polygons[e][l]["y"] =
            (this.polygons[e][l]["y"] * this.res_height) / this.height;
        }
        string = JSON.stringify(this.polygons[e]);
        this.relation.roi_id = string;
        this.relation.atributes = atr;
        if (atr == null && this.atrCache != null) {
          this.relation.atributes = this.atrCache;
        }
        this.relation.algo_id = this.id;
        this.relation.camera_id = params.uuid;
        this.relation.id = uuidv4();
        this.facesService.saveRelation(this.relation).subscribe(
          (res) => {
            console.log(res);
          },
          (err) => console.error(err)
        );
        this.facesService.getRelations(params.uuid).subscribe(
          (res) => {
            this.relations = res;
            for (let u = 0; u < this.relations.length; u++) {
              if (this.relations[u]["roi_id"] != null) {
                this.relations[u]["roi_id"] = JSON.parse(
                  this.relations[u]["roi_id"]
                );
                this.relations[u]["roi_id"].push(this.relations[u]["algo_id"]);
                this.polygons.push(this.relations[u]["roi_id"]);
              }
            }
          },
          (err) => console.error(err)
        );
      } else if (this.relations.length != 0) {
        //check the relations to see if there is a RoI in the current array already saved on the database
        a = false;
        for (let u = 0; u < this.relations.length; u++) {
          if (this.relations[u]["algo_id"] == this.id) {
            if (
              JSON.stringify(this.polygons[e]) ==
              JSON.stringify(this.relations[u]["roi_id"])
            ) {
              a = true;
            }
          }
        }
        if (a == false) {
          //if is not found the RoI, it saves it on the database
          this.polygons[e].pop();

          let atr = null;
          if (this.id == 4 || this.id == 8) {
            atr = JSON.stringify(this.polygons[e][this.polygons[e].length - 1]);
            this.polygons[e].pop();
          }
          for (let l = 0; l < this.polygons[e].length; l++) {
            //these parameters is to scalate it according to RoI resolution
            this.polygons[e][l]["x"] =
              (this.polygons[e][l]["x"] * this.res_width) / this.width;
            this.polygons[e][l]["y"] =
              (this.polygons[e][l]["y"] * this.res_height) / this.height;
          }

          string = JSON.stringify(this.polygons[e]);
          this.relation.roi_id = string;
          this.relation.atributes = atr;
          if (atr == null && this.atrCache != null) {
            this.relation.atributes = this.atrCache;
          }
          this.relation.algo_id = this.id;
          this.relation.camera_id = params.uuid;
          this.relation.id = uuidv4();
          this.facesService.saveRelation(this.relation).subscribe(
            (res) => {
              console.log(res);
            },
            (err) => console.error(err)
          );
          this.facesService.getRelations(params.uuid).subscribe(
            (res) => {
              this.relations = res;
              for (let u = 0; u < this.relations.length; u++) {
                if (this.relations[u]["roi_id"] != null) {
                  this.relations[u]["roi_id"] = JSON.parse(
                    this.relations[u]["roi_id"]
                  );
                  this.relations[u]["roi_id"].push(
                    this.relations[u]["algo_id"]
                  );
                  this.polygons.push(this.relations[u]["roi_id"]);
                }
              }
            },
            (err) => console.error(err)
          );
        }
      }
    }
  }
}
