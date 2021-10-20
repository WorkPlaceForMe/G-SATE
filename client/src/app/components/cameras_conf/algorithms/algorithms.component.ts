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
import { DatePipe } from "@angular/common";
import { Relation } from "src/app/models/Relation";
import { ActivatedRoute, Router, RoutesRecognized } from "@angular/router";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Camera } from "src/app/models/Camera";
import { Roi } from "src/app/models/Roi";
import { ip } from "src/app/models/IpServer";

@Component({
  selector: "app-algorithms",
  templateUrl: "./algorithms.component.html",
  styleUrls: ["./algorithms.component.scss"],
})
export class AlgorithmsComponent implements OnInit {
  @Input() private src: string;
  @Output() private created = new EventEmitter();
  @ViewChild("polygon", { static: false }) private polygon: ElementRef;

  public innerWidth: any;
  public innerHeight: any;

  link: SafeResourceUrl;
  previousUrl: string;
  width: number;
  height: number;
  resRelation: number;
  camera: Camera;
  polygons = [];
  perimeter = [];
  relations: any = [];
  algos: any = [];
  Aalgos: any = [];
  Balgos: any = [];
  Calgos: any = [];
  Dalgos: any = [];
  colour: string = "";
  video_url: string = "";
  fill: string = "";
  roi: Roi = {
    id: "",
    coords: "",
    camera_id: "",
  };
  rois: any = [];
  complete = false;
  param = this.activatedRoute.snapshot.params.uuid;
  actA: number;
  actB: number;
  actC: number;
  climb: any = {};
  loiteringTime: any = {};
  speed: any = {};
  unwanted: any = {};
  dac: any = {};
  quantity: any = {};
  showL: boolean;
  showS: boolean;
  showU0: boolean;
  showU1: boolean;
  showU2: boolean;
  spin: boolean = false;
  res_width: number;
  res_height: number;
  roiIds: any = [];
  private canvas;
  private ctx;
  constructor(
    private rd: Renderer2,
    private facesService: FacesService,
    private activatedRoute: ActivatedRoute,
    sanitizer: DomSanitizer,
    private colo: ColorsService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    // this.router.events
    // .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
    // .subscribe((events: RoutesRecognized[]) => {
    //   console.log('previous url', events[0].urlAfterRedirects);
    //   console.log('current url', events[1].urlAfterRedirects);
    // });

    const params = this.activatedRoute.snapshot.params;
    this.facesService.getAlgos().subscribe(
      (res) => {
        this.algos = res;
        console.log("this.algos - ", this.algos);
        for (let i = 0; i < this.algos.length; i++) {
          this.algos[i].conf = 95;

          if (this.algos[i]["available"] == 1) {
            if (false) {
              this.Calgos.push(this.algos[i]);
            } else if (this.algos[i]["id"] == 1) {
              this.Balgos.push(this.algos[i]);
            } else if (
              this.algos[i]["id"] == 0 ||
              this.algos[i]["id"] == 2 ||
              this.algos[i]["id"] == 16 ||
              this.algos[i]["id"] == 17
            ) {
              this.Aalgos.push(this.algos[i]);
            } else if (this.algos[i]["custom_trained"] == 1) {
              this.Dalgos.push(this.algos[i]);
            }
          }
        }
        this.getRelationsData();
      },
      (err) => console.error(err)
    );
    this.facesService.getCamera(params.uuid).subscribe(
      (res) => {
        this.camera = res;
        console.log("this.camera - ", this.camera);
        this.res_width = this.camera.cam_width;
        this.res_height = this.camera.cam_height;
        this.resRelation = this.res_height / this.res_width;
        if (window.innerWidth >= 1200) {
          this.width = 525;
          this.height = this.width * this.resRelation;
        } else if (window.innerWidth < 1200 && window.innerWidth >= 992) {
          this.width = 435;
          this.height = this.width * this.resRelation;
        } else if (window.innerWidth < 992 && window.innerWidth >= 768) {
          this.width = 315;
          this.height = this.width * this.resRelation;
        } else if (window.innerWidth < 768 && window.innerWidth >= 576) {
          this.width = 485;
          this.height = this.width * this.resRelation;
        }
        this.re_draw(true);

        this.link = sanitizer.bypassSecurityTrustStyle(
          "url(http://" + ip + ":4200" + this.camera.heatmap_pic + ")"
        );

        this.video_url = "http://" + ip + ":4200" + this.camera.rtsp_out;
      },
      (err) => console.error(err)
    );
  }

  relation: Relation = {
    camera_id: "",
    algo_id: 0,
    roi_id: null,
    atributes: null,
    id: null,
  };

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    // this.width = window.innerWidth - 600;
    if (window.innerWidth >= 1200) {
      this.width = 525;
      this.height = this.width * this.resRelation;
    } else if (window.innerWidth < 1200 && window.innerWidth >= 992) {
      this.width = 435;
      this.height = this.width * this.resRelation;
    } else if (window.innerWidth < 992 && window.innerWidth >= 768) {
      this.width = 315;
      this.height = this.width * this.resRelation;
    } else if (window.innerWidth < 768 && window.innerWidth >= 576) {
      this.width = 485;
      this.height = this.width * this.resRelation;
    }
  }

  ngOnInit() {
    this.setBcg();
    this.complete = true;
  }

  getNbOccur(boolean: boolean, arr) {
    var occurs = 0;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]["activated"] == boolean) occurs++;
    }
    return occurs;
  }

  checkTime(input) {
    if (input == undefined || input == "") {
      this.showL = true;
    } else if (input != undefined) {
      this.showL = false;
    }
  }

  checkTimeRangeS(input0, input1) {
    if (
      input0 == undefined ||
      input0 == "" ||
      input1 == undefined ||
      input1 == ""
    ) {
      this.showS = true;
    } else if (input0 != undefined && input1 != undefined) {
      this.showS = false;
    }
  }

  checkTimeRangeU0(input0, input1) {
    if (
      input0 == undefined ||
      input0 == "" ||
      input1 == undefined ||
      input1 == ""
    ) {
      this.showU0 = true;
    } else if (input0 != undefined && input1 != undefined) {
      this.showU0 = false;
    }
  }

  checkTimeRangeU1(input0, input1) {
    if (
      input0 == undefined ||
      input0 == "" ||
      input1 == undefined ||
      input1 == ""
    ) {
      this.showU1 = true;
    } else if (input0 != undefined && input1 != undefined) {
      this.showU1 = false;
    }
  }

  checkTimeRangeU2(input0, input1) {
    if (
      input0 == undefined ||
      input0 == "" ||
      input1 == undefined ||
      input1 == ""
    ) {
      this.showU2 = true;
    } else if (input0 != undefined && input1 != undefined) {
      this.showU2 = false;
    }
  }

  resetTimeUc() {
    this.unwanted["car.rangeB"] = 0;
    this.unwanted["car.rangeE"] = 0;
  }

  resetTimeUt() {
    this.unwanted["truck.rangeB"] = 0;
    this.unwanted["truck.rangeE"] = 0;
  }

  resetTimeUtwo() {
    this.unwanted["two_wheeler.rangeB"] = 0;
    this.unwanted["two_wheeler.rangeE"] = 0;
  }

  resetTimeS() {
    this.speed["rangeB"] = "";
    this.speed["rangeE"] = "";
  }

  resetTime() {
    this.loiteringTime = "";
  }

  private setBcg() {
    // this.src = 'assets/heatmap_picture.png';
    if (this.polygon) {
      this.canvas = this.rd.selectRootElement(this.polygon["nativeElement"]);
      this.ctx = this.canvas.getContext("2d");
    }
    // let bcg = new Image();
    // bcg.src = this.src;
    // bcg.onload = () => {
    //   this.ctx.drawImage(bcg, 0, 0, this.canvas.width, this.canvas.height)
    // };
  }

  comparator(a, b) {
    if (a[a.length - 1] < b[b.length - 1]) return -1;
    if (a[a.length - 1] > b[b.length - 1]) return 1;
    return 0;
  }

  public onChange(algorithm) {
    if (algorithm.activated == false) {
      for (const rel of this.relations) {
        if (
          String(rel["algo_id"]) === String(algorithm.id) &&
          this.roiIds.includes(rel["id"])
        ) {
          this.roiIds = this.roiIds.filter((e) => e != rel["id"]);
        }
      }

      for (let i = 0; i < this.polygons.length; i++) {
        if (this.polygons[i][this.polygons[i].length - 1] == algorithm.id) {
          this.polygons[i].push(1);
        } else {
          this.polygons[i].push(0);
        }
      }
      this.polygons.sort(this.comparator);
      for (let i = 0; i < this.polygons.length; i++) {
        if (this.polygons[i][this.polygons[i].length - 1] == 1) {
          this.polygons.pop();
          i--;
        }
      }
      for (let i = 0; i < this.polygons.length; i++) {
        this.polygons[i].pop();
      }

      this.perimeter = [];
      this.complete = true;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.re_draw(true);
    } else if (algorithm.activated == true) {
      this.complete = true;
      this.getRelationsData();
    }

    this.actA = this.getNbOccur(true, this.Aalgos);
    this.actB = this.getNbOccur(true, this.Balgos);
    this.actC = this.getNbOccur(true, this.Calgos);
  }

  public getRelationsData() {
    const params = this.activatedRoute.snapshot.params;
    this.facesService.getRelations(params.uuid).subscribe(
      (res) => {
        this.relations = res;
        for (let i = 0; i < this.algos.length; i++) {
          for (let e = 0; e < this.relations.length; e++) {
            if (this.algos[i].id == this.relations[e]["algo_id"]) {
              this.algos[i].activated = true;

              if (
                this.relations[e]["atributes"] != null &&
                JSON.parse(this.relations[e]["atributes"])[0].conf
              ) {
                this.algos[i].conf = JSON.parse(
                  this.relations[e]["atributes"]
                )[0].conf;
              }
            }
            if (this.relations[e]["atributes"] != null) {
              if (this.relations[e]["algo_id"] == 1) {
                this.climb = JSON.parse(this.relations[e]["atributes"]);
              } else if (this.relations[e]["algo_id"] == 7) {
                this.unwanted = JSON.parse(this.relations[e]["atributes"]);
              } else if (this.relations[e]["algo_id"] == 5) {
                this.speed = JSON.parse(this.relations[e]["atributes"]);
              } else if (this.relations[e]["algo_id"] == 2) {
                this.loiteringTime = JSON.parse(this.relations[e]["atributes"]);
              } else if (this.relations[e]["algo_id"] == 3) {
                this.dac = JSON.parse(this.relations[e]["atributes"]);
              } else if (this.relations[e]["algo_id"] == 12) {
                this.quantity = JSON.parse(this.relations[e]["atributes"]);
              }
            }
          }
          if (this.algos[i].activated == undefined) {
            this.algos[i].activated = false;
          }
        }

        for (let u = 0; u < this.relations.length; u++) {
          this.relations[u]["roi_id"] = JSON.parse(this.relations[u]["roi_id"]);

          if (this.relations[u]["roi_id"] != null) {
            for (let l = 0; l < this.relations[u]["roi_id"].length; l++) {
              //these parameters is to scalate it according to RoI resolution
              this.relations[u]["roi_id"][l]["x"] =
                (this.relations[u]["roi_id"][l]["x"] * this.width) /
                this.res_width;
              this.relations[u]["roi_id"][l]["y"] =
                (this.relations[u]["roi_id"][l]["y"] * this.height) /
                this.res_height;
            }

            this.relations[u]["roi_id"].push(this.relations[u]["algo_id"]);

            if (!this.roiIds.includes(this.relations[u]["id"])) {
              this.polygons.push(this.relations[u]["roi_id"]);
              this.roiIds.push(this.relations[u]["id"]);
            }
          }

          if (u === this.relations.length - 1 && this.polygons != null) {
            this.re_draw(true);
          }
        }

        // if (this.polygons != null && this.polygon) {
        //   // condition added for re_draw
        //   this.re_draw(true);
        // }
        this.actA = this.getNbOccur(true, this.Aalgos);
        this.actB = this.getNbOccur(true, this.Balgos);
        this.actC = this.getNbOccur(true, this.Calgos);
      },
      (err) => console.error(err)
    );
  }

  public showMyMessage = false;

  re_draw(end: boolean) {
    this.setBcg();
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
          end;
          this.ctx.fillStyle = pred_colour;
          this.ctx.fillRect(
            this.polygons[e][i]["x"] - 2,
            this.polygons[e][i]["y"] - 2,
            4,
            4
          );
        } else {
          this.ctx.lineTo(this.polygons[e][i]["x"], this.polygons[e][i]["y"]);
          end;
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
        this.ctx.fillStyle = pred_fill;
        this.ctx.fill();
        this.ctx.strokeStyle = pred_colour;
        this.created.emit(this.perimeter);
      }
      this.ctx.stroke();
    }
  }

  info() {
    // console.log(this.quantity);
    console.log(this.polygons, this.relations, this.algos, this.camera);
  }

  saveAndBack() {
    this.spin = true;
    this.save();
    // setTimeout(() => {
    //   this.spin = false;
    //   // this.router.navigateByUrl("/camerasList");
    // }, 5000);
  }

  // need to update the save with the new format

  save() {
    let string, a;
    const params = this.activatedRoute.snapshot.params;
    if (this.relations.length != 0) {
      if (this.rois.length != 0) {
        for (let n = 0; n < this.relations.length; n++) {
          let h = false;
          for (let t = 0; t < this.polygons.length; t++) {
            if (
              JSON.stringify(this.relations[n]["roi_id"]) ==
              JSON.stringify(this.polygons[t])
            ) {
              h = true;
            }
          }
          if (h == false) {
            this.facesService.deleteRelation(this.relations[n]["id"]).subscribe(
              (res) => {
                console.log(res);
              },
              (err) => console.log(err)
            );
            this.facesService.getRelations(params.uuid).subscribe(
              (res) => {
                this.relations = res;
                for (let u = 0; u < this.relations.length; u++) {
                  this.relations[n]["roi_id"] = JSON.parse(
                    this.relations[n]["roi_id"]
                  );
                  this.relations[n]["roi_id"].push(
                    this.relations[u]["algo_id"]
                  );
                  this.polygons.push(this.relations[n]["roi_id"]);
                }
              },
              (err) => console.error(err)
            );
          }
        }
      }
    }
    for (let i = 0; i < this.algos.length; i++) {
      let alone = false;
      for (let e = 0; e < this.relations.length; e++) {}
      if (this.polygons.length != 0) {
        for (let c = 0; c < this.polygons.length; c++) {
          if (
            this.polygons[c][this.polygons[c].length - 1] == this.algos[i].id
          ) {
            alone = true;
          }
        }
      }

      if (this.algos[i].activated == true && this.polygons.length == 0) {
        if (this.relations.length == 0) {
          this.relation.atributes = null;
          if (this.algos[i].id == 1) {
            this.relation.atributes = JSON.stringify(this.climb);
          } else if (this.algos[i].id == 7) {
            this.relation.atributes = JSON.stringify(this.unwanted);
          } else if (this.algos[i].id == 5) {
            this.relation.atributes = JSON.stringify(this.speed);
          } else if (this.algos[i].id == 2) {
            this.relation.atributes = JSON.stringify(this.loiteringTime);
          } else if (this.algos[i].id == 3) {
            this.relation.atributes = JSON.stringify(this.dac);
          } else if (this.algos[i].id == 12) {
            this.relation.atributes = JSON.stringify(this.quantity);
          }
          this.relation.algo_id = this.algos[i].id;
          this.relation.camera_id = params.uuid;
          this.relation.id = uuidv4();
          this.relation.atributes =
            '[{"fps": 1, "conf": ' +
            this.algos[i].conf +
            ', "save": true, "time": 0}]';
          let time = new Date();
          this.relation.createdAt = this.datePipe.transform(
            time,
            "yyyy-M-dd HH:mm:ss"
          );
          this.relation.updatedAt = this.datePipe.transform(
            time,
            "yyyy-M-dd HH:mm:ss"
          );
          let id = uuidv4();
          this.relation.id_account = id;
          this.relation.id_branch = id;
          this.facesService.saveRelation(this.relation).subscribe(
            (res) => {
              console.log(res);
              this.facesService.getRelations(params.uuid).subscribe(
                (res) => {
                  this.relations = res;
                },
                (err) => console.error(err)
              );
            },
            (err) => console.error(err)
          );
        } else if (this.relations.length != 0) {
          a = false;
          for (let u = 0; u < this.relations.length; u++) {
            if (this.relations[u]["algo_id"] == this.algos[i].id) {
              a = true;
            }
          }
          if (a == false) {
            this.relation.roi_id = null;
            this.relation.atributes = null;
            if (this.algos[i].id == 1) {
              this.relation.atributes = JSON.stringify(this.climb);
            } else if (this.algos[i].id == 7) {
              this.relation.atributes = JSON.stringify(this.unwanted);
            } else if (this.algos[i].id == 5) {
              this.relation.atributes = JSON.stringify(this.speed);
            } else if (this.algos[i].id == 2) {
              this.relation.atributes = JSON.stringify(this.loiteringTime);
            } else if (this.algos[i].id == 3) {
              this.relation.atributes = JSON.stringify(this.dac);
            } else if (this.algos[i].id == 12) {
              this.relation.atributes = JSON.stringify(this.quantity);
            }
            this.relation.algo_id = this.algos[i].id;
            this.relation.camera_id = params.uuid;
            this.relation.id = uuidv4();
            this.relation.atributes =
              '[{"fps": 1, "conf": ' +
              this.algos[i].conf +
              ', "save": true, "time": 0}]';
            let time = new Date();
            this.relation.createdAt = this.datePipe.transform(
              time,
              "yyyy-M-dd HH:mm:ss"
            );
            this.relation.updatedAt = this.datePipe.transform(
              time,
              "yyyy-M-dd HH:mm:ss"
            );
            let id = uuidv4();
            this.relation.id_account = id;
            this.relation.id_branch = id;
            this.facesService.saveRelation(this.relation).subscribe(
              (res) => {
                console.log(res);
                this.facesService.getRelations(params.uuid).subscribe(
                  (res) => {
                    this.relations = res;
                  },
                  (err) => console.error(err)
                );
              },
              (err) => console.error(err)
            );
          } else {
            for (
              let relIndex = 0;
              relIndex < this.relations.length;
              relIndex++
            ) {
              if (this.relations[relIndex].algo_id == this.algos[i].id) {
                this.relation.atributes =
                  '[{"fps": 1, "conf": ' +
                  this.algos[i].conf +
                  ', "save": true, "time": 0}]';

                this.facesService
                  .updateRelation(this.relations[relIndex].id, this.relation)
                  .subscribe(
                    (res) => {
                      console.log("relation updated", res);
                    },
                    (err) => console.log(err)
                  );
              }
            }

            console.log(this.algos[i].name, "Algo needs to be updated");
          }
        }
      } else if (
        this.algos[i].activated == false &&
        this.polygons.length == 0
      ) {
        for (let u = 0; u < this.relations.length; u++) {
          if (this.relations[u]["algo_id"] == this.algos[i].id) {
            this.facesService.deleteRelation(this.relations[u]["id"]).subscribe(
              (res) => {
                console.log(res);
              },
              (err) => console.log(err)
            );
          }
        }
      } else if (this.algos[i].activated == true && alone == false) {
        if (this.relations.length == 0) {
          this.relation.algo_id = this.algos[i].id;
          this.relation.camera_id = params.uuid;
          this.relation.atributes = null;
          if (this.algos[i].id == 1) {
            this.relation.atributes = JSON.stringify(this.climb);
          } else if (this.algos[i].id == 7) {
            this.relation.atributes = JSON.stringify(this.unwanted);
          } else if (this.algos[i].id == 5) {
            this.relation.atributes = JSON.stringify(this.speed);
          } else if (this.algos[i].id == 2) {
            this.relation.atributes = JSON.stringify(this.loiteringTime);
          } else if (this.algos[i].id == 3) {
            this.relation.atributes = JSON.stringify(this.dac);
          } else if (this.algos[i].id == 12) {
            this.relation.atributes = JSON.stringify(this.quantity);
          }
          this.relation.id = uuidv4();
          this.relation.atributes =
            '[{"fps": 1, "conf": ' +
            this.algos[i].conf +
            ', "save": true, "time": 0}]';
          let time = new Date();
          this.relation.createdAt = this.datePipe.transform(
            time,
            "yyyy-M-dd HH:mm:ss"
          );
          this.relation.updatedAt = this.datePipe.transform(
            time,
            "yyyy-M-dd HH:mm:ss"
          );
          let id = uuidv4();
          this.relation.id_account = id;
          this.relation.id_branch = id;
          this.facesService.saveRelation(this.relation).subscribe(
            (res) => {
              console.log(res);
            },
            (err) => console.error(err)
          );
          this.facesService.getRelations(params.uuid).subscribe(
            (res) => {
              this.relations = res;
            },
            (err) => console.error(err)
          );
        } else if (this.relations.length != 0) {
          a = 0;
          for (let u = 0; u < this.relations.length; u++) {
            if (this.relations[u]["algo_id"] == this.algos[i].id) {
              a++;
            }
          }
        }
        if (a == 0) {
          this.relation.atributes = null;
          if (this.algos[i].id == 1) {
            this.relation.atributes = JSON.stringify(this.climb);
          } else if (this.algos[i].id == 7) {
            this.relation.atributes = JSON.stringify(this.unwanted);
          } else if (this.algos[i].id == 5) {
            this.relation.atributes = JSON.stringify(this.speed);
          } else if (this.algos[i].id == 2) {
            this.relation.atributes = JSON.stringify(this.loiteringTime);
          } else if (this.algos[i].id == 3) {
            this.relation.atributes = JSON.stringify(this.dac);
          } else if (this.algos[i].id == 12) {
            this.relation.atributes = JSON.stringify(this.quantity);
          }
          this.relation.roi_id = null;
          this.relation.algo_id = this.algos[i].id;
          this.relation.camera_id = params.uuid;
          this.relation.id = uuidv4();
          this.relation.atributes =
            '[{"fps": 1, "conf": ' +
            this.algos[i].conf +
            ', "save": true, "time": 0}]';
          let time = new Date();
          this.relation.createdAt = this.datePipe.transform(
            time,
            "yyyy-M-dd HH:mm:ss"
          );
          this.relation.updatedAt = this.datePipe.transform(
            time,
            "yyyy-M-dd HH:mm:ss"
          );
          let id = uuidv4();
          this.relation.id_account = id;
          this.relation.id_branch = id;
          this.facesService.saveRelation(this.relation).subscribe(
            (res) => {
              console.log(res);
            },
            (err) => console.error(err)
          );
          this.facesService.getRelations(params.uuid).subscribe(
            (res) => {
              this.relations = res;
            },
            (err) => console.error(err)
          );
        } else if (a > 1) {
          for (let e = 0; e < this.relations.length; e++) {
            if (
              this.relations[e]["algo_id"] == this.algos[i].id &&
              this.relations[e]["roi_id"] != null
            ) {
              this.facesService
                .deleteRelation(this.relations[e]["id"])
                .subscribe(
                  (res) => {
                    console.log(res);
                  },
                  (err) => console.log(err)
                );
              this.facesService.getRelations(params.uuid).subscribe(
                (res) => {
                  this.relations = res;
                },
                (err) => console.error(err)
              );
            }
          }
        }
      } else {
        for (let e = 0; e < this.polygons.length; e++) {
          a = false;
          if (
            this.algos[i].activated == true &&
            this.polygons[e][this.polygons[e].length - 1] == this.algos[i].id
          ) {
            if (this.relations.length == 0) {
              this.polygons[e].pop();
              string = JSON.stringify(this.polygons[e]);
              this.relation.algo_id = this.algos[i].id;
              this.relation.camera_id = params.uuid;
              this.relation.roi_id = string;
              this.relation.id = uuidv4();
              this.relation.atributes =
                '[{"fps": 1, "conf": ' +
                this.algos[i].conf +
                ', "save": true, "time": 0}]';
              let time = new Date();
              this.relation.createdAt = this.datePipe.transform(
                time,
                "yyyy-M-dd HH:mm:ss"
              );
              this.relation.updatedAt = this.datePipe.transform(
                time,
                "yyyy-M-dd HH:mm:ss"
              );
              let id = uuidv4();
              this.relation.id_account = id;
              this.relation.id_branch = id;
              this.facesService.saveRelation(this.relation).subscribe(
                (res) => {
                  console.log(res);
                },
                (err) => console.error(err)
              );
              this.facesService.getRelations(params.uuid).subscribe(
                (res) => {
                  this.relations = res;
                },
                (err) => console.error(err)
              );
            } else if (this.relations.length != 0) {
              for (let u = 0; u < this.relations.length; u++) {
                if (this.relations[u]["algo_id"] == this.algos[i].id) {
                  if (
                    JSON.stringify(this.polygons[e]) ==
                    JSON.stringify(this.relations[u]["roi_id"])
                  ) {
                    a = true;
                  }
                }
              }
              if (a == false) {
                this.polygons[e].pop();
                string = JSON.stringify(this.polygons[e]);
                this.relation.algo_id = this.algos[i].id;
                this.relation.camera_id = params.uuid;
                this.relation.roi_id = string;
                this.relation.id = uuidv4();
                this.relation.atributes =
                  '[{"fps": 1, "conf": ' +
                  this.algos[i].conf +
                  ', "save": true, "time": 0}]';
                let time = new Date();
                this.relation.createdAt = this.datePipe.transform(
                  time,
                  "yyyy-M-dd HH:mm:ss"
                );
                this.relation.updatedAt = this.datePipe.transform(
                  time,
                  "yyyy-M-dd HH:mm:ss"
                );
                let id = uuidv4();
                this.relation.id_account = id;
                this.relation.id_branch = id;
                this.facesService.saveRelation(this.relation).subscribe(
                  (res) => {
                    console.log(res);
                  },
                  (err) => console.error(err)
                );
                this.facesService.getRelations(params.uuid).subscribe(
                  (res) => {
                    this.relations = res;
                  },
                  (err) => console.error(err)
                );
              }
            }
          } else if (this.algos[i].activated == false) {
            for (let u = 0; u < this.relations.length; u++) {
              if (this.relations[u]["algo_id"] == this.algos[i].id) {
                this.facesService
                  .deleteRelation(this.relations[u]["id"])
                  .subscribe(
                    (res) => {
                      console.log(res);
                    },
                    (err) => console.log(err)
                  );
              }
            }
          }
        }
      }
    }
    this.uploadVideoToVista();
  }

  uploadVideoToVista() {
    this.facesService
      .uploadVideoToVista({ video_url: this.video_url })
      .subscribe(
        (res) => {
          console.log("success - ", res);
          setTimeout(() => {
            this.spin = false;
            this.router.navigateByUrl("/camerasList");
          }, 5000);
        },
        (err) => {
          this.spin = false;
          alert("Error happened while uploading this video to VISTA");
          console.error("Error - ", err);
        }
      );
  }
}
