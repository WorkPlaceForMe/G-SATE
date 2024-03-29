import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  HostListener,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { FacesService } from "../../../services/faces.service";
import { AnnotationsService } from "../../../services/annotations.service";
import { PagerService } from "../../../services/pager.service";
import { ip } from "../../../models/IpServer";
import { vistaIP } from "src/app/models/VistaServer";
import { Location } from "@angular/common";

const baseURL = vistaIP;
@Component({
  selector: "app-multiple-image-detection",
  templateUrl: "./multiple-image-detection.component.html",
  styleUrls: ["./multiple-image-detection.component.scss"],
})
export class MultipleImageDetectionComponent implements OnInit {
  pager: any = {};

  // paged items
  pagedItems: any[];
  items = [];
  pageOfItems: Array<any>;
  data: any = [];
  initPage: number = 0;
  pages: number;
  total: number;
  width: number;
  height: number;
  selectedID: any = "";
  elasticSearchKeyWord: any = "";
  selectedImageIndex: any;
  annWidth: number;
  annHeight: number;
  objDet: boolean = false;
  generalDetSpin: boolean = false;
  spin: boolean = false;
  card: any = {
    width: 0,
    height: 0,
  };

  link: SafeResourceUrl;
  multiple: boolean = true;
  showMyMessage: boolean = false;
  clearAct: boolean = false;
  valueImage: number;
  gotoPageNo: number;
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

  count: number = 0;

  id: number;
  on: boolean = false;
  coords = [];
  annotations: any = [];
  ann: any = [];
  cacheAnnot: any = [];
  label: string;
  imageUrlArray: any = [];

  isChecked: boolean = false;
  checkedArray: any = [];
  currentPage: any;

  @ViewChildren("polygon") polygon: QueryList<ElementRef>;
  private canvas;
  private ctx;
  method: any;
  folder: any;
  detectionOriginType: any;

  constructor(
    private rd: Renderer2,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private facesService: FacesService,
    private annotationsServ: AnnotationsService,
    private router: Router,
    private pagerService: PagerService,
    private _location: Location
  ) {
    this.method = this.activatedRoute.snapshot.params.method;
    this.folder = this.activatedRoute.snapshot.params.folder;
    this.detectionOriginType = this.activatedRoute.snapshot.params.image;
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    if (window.innerWidth >= 1200) {
      this.width = 835;
      this.height = (this.width * this.annHeight) / this.annWidth;
      if (this.height >= 480) {
        this.height = 480;
        this.width = (this.height * this.annWidth) / this.annHeight;
      }
    } else if (window.innerWidth < 1200 && window.innerWidth >= 992) {
      this.width = 684;
      this.height = (this.width * this.annHeight) / this.annWidth;
      if (this.height >= 480) {
        this.height = 480;
        this.width = (this.height * this.annWidth) / this.annHeight;
      }
    } else if (window.innerWidth < 992 && window.innerWidth >= 768) {
      this.width = 490;
      this.height = (this.width * this.annHeight) / this.annWidth;
      if (this.height >= 480) {
        this.height = 480;
        this.width = (this.height * this.annWidth) / this.annHeight;
      }
    } else if (window.innerWidth < 768 && window.innerWidth >= 576) {
      this.width = 420;
      this.height = (this.width * this.annHeight) / this.annWidth;
      if (this.height >= 480) {
        this.height = 480;
        this.width = (this.height * this.annWidth) / this.annHeight;
      }
    } else if (window.innerWidth < 576) {
      this.width = window.innerWidth - 140;
      this.height = (this.width * this.annHeight) / this.annWidth;
      if (this.height >= 480) {
        this.height = 480;
        this.width = (this.height * this.annWidth) / this.annHeight;
      }
    }
  }

  checked(event: any, id: number) {
    let checkbox = event.target;
    this.checkedArray[id] = checkbox.checked;
    let obj;
    for (const imageData of this.data) {
      if (imageData.id === id) {
        obj = {
          url: imageData.image,
          id,
          event,
        };
      }
    }

    if (this.checkedArray[id]) {
      this.imageUrlArray.push(obj);
    } else if (!this.checkedArray[id]) {
      console.log("else");
      this.imageUrlArray = this.imageUrlArray.filter(
        (element) => element.id != id
      );
    }

    console.log(this.imageUrlArray);
  }

  getVistaBatchResponse() {
    this.spin = true;
    const imagePathsArray = [];
    for (const imageData of this.imageUrlArray) {
      imagePathsArray.push(imageData.url);
    }
    const data = {
      image_paths: imagePathsArray,
    };
    console.log(data);

    this.annotationsServ.processVistaBulk(data).subscribe(
      async (res: any) => {
        console.log(res);
        const finalOutput = [];
        for (const data of imagePathsArray) {
          const imageFullName = data.split(".jpg")[0].split("/").pop();
          console.log(imageFullName);
          const resIndex = res.findIndex((obj) =>
            obj.image.includes(imageFullName)
          );

          const imageIndex = this.imageUrlArray.findIndex((obj) =>
            obj.url.includes(imageFullName)
          );
          if (resIndex !== -1 && imageIndex !== -1) {
            const responseData = {
              id: this.imageUrlArray[imageIndex].id,
              event: this.imageUrlArray[imageIndex].event,
              image_url: this.imageUrlArray[imageIndex].url,
              vista_response: res[resIndex],
            };
            finalOutput.push(responseData);
          }
        }
        console.log("finalOutput - ", finalOutput);
        for (const data of finalOutput) {
          await this.drawVistaBatchResponseBoxes(data);
        }
        this.spin = false;
        this.imageUrlArray = [];
        // this.checkedArray = [];
      },
      (error) => {
        this.spin = false;
        console.log(error);
      }
    );
  }

  async drawVistaBatchResponseBoxes(batchResponse) {
    this.activeButton(batchResponse.event);
    this.selectedID = "";
    this.canvas = this.rd.selectRootElement(
      `canvas#jPolygon${batchResponse.id}.card-img-top.img-fluid`
    );
    this.ctx = this.canvas.getContext("2d");
    this.labelsMessage = false;
    const response = batchResponse;
    this.spin = false;
    if (!response) {
      alert("Zero detections happened.");
    } else {
      const convertedResponse = await this.convertVistaResponseToXY(
        response.vista_response.results,
        response.id,
        "Vista API"
      );
      convertedResponse.forEach((element) => {
        this.data[batchResponse.id]["results"].push(element);
      });
      this.annObj[this.data[batchResponse.id].id] = {
        image: this.data[batchResponse.id].image,
        width: this.data[batchResponse.id].res_width,
        height: this.data[batchResponse.id].res_height,
        canvas_width: this.data[batchResponse.id].width,
        canvas_height: this.data[batchResponse.id].height,
        results: this.data[batchResponse.id]["results"],
        fixedSize: this.data[batchResponse.id]["results"].length,
        annotationType: this.data[batchResponse.id].annotationType,
      };
      this.cacheAnnot = this.data[batchResponse.id]["results"];
      this.getAnn(batchResponse.id);
      this.getLabels(batchResponse.id);
      this.data[batchResponse.id]["vistaResponseReceived"] = true;
    }
  }

  getBackground(image) {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit Fired - ", this.polygon);
    this.polygon.forEach((c, index) => {
      this.canvas = this.rd.selectRootElement(c["nativeElement"]);
      this.ctx = this.canvas.getContext("2d");
      let rect = this.canvas.getBoundingClientRect();
      this.data[index].res_width = this.data[index].width;
      this.data[index].res_height = this.data[index].height;
      this.data[index].width = rect.width;
      let resRelation =
        this.data[index].res_height / this.data[index].res_width;
      this.data[index].height = this.data[index].width * resRelation;
    });
  }

  onChange(event: any, itemId: number) {
    console.log(event, itemId);
    if (event) {
      for (const item of this.data) {
        item["annotationType"] =
          item.id === itemId ? "Partial" : item.annotationType;
      }
    } else {
      for (const item of this.data) {
        item["annotationType"] = item.id === itemId ? "" : item.annotationType;
      }
    }
    console.log("dataItems -", this.data);
  }

  setPage(page: number) {
    this.currentPage = page;
    this.annotations = [];
    this.labels = [];
    this.labelsMessage = true;
    this.label = "object";
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.data.length, page);

    // get current page of items
    this.pagedItems = this.data.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );

    if (this.pageOfItems && this.pageOfItems.length > 0) {
      for (let i = 0; i < this.pageOfItems.length; i++) {
        this.checkedArray[i] = false;
      }
    }

    if (page > 1) {
      this.setContext(this.pager.startIndex, (result) => {
        this.test();
      });
    } else {
      this.setContext(0, (result) => {
        this.test();
      });
    }
  }

  test() {
    this.spin = true;
    console.log("this.pager - ", this.pager);
    console.log("this.pagedItems - ", this.pagedItems);
    this.asyncForEachAnaliticsAPI()
      .then((result) => {
        setTimeout(() => {
          this.getAnayticsImgAnnotations(() => {
            console.log("this.data - ", this.data);
            this.spin = false;
          });
        }, 5000);
      })
      .catch((err) => {
        this.spin = false;
        console.log("error - ", err);
      });
  }

  async setContext(ind, setContextCallback) {
    console.log("setContext Fired - ", ind, this.polygon);
    await setTimeout(() => {
      if (this.polygon.length > 0) {
        this.polygon.forEach((c, indexPos, array) => {
          let index = ind;
          this.canvas = this.rd.selectRootElement(c["nativeElement"]);
          this.ctx = this.canvas.getContext("2d");
          let rect = this.canvas.getBoundingClientRect();
          this.data[index].res_width = this.data[index].width;
          this.data[index].res_height = this.data[index].height;
          this.data[index].width = rect.width;
          let resRelation =
            this.data[index].res_height / this.data[index].res_width;
          this.data[index].height = this.data[index].width * resRelation;
          if (indexPos === array.length - 1) {
            setContextCallback();
            return;
          }
          ++ind;
        });
      } else {
        setContextCallback("error");
      }
    }, 2000);
  }

  ngOnInit() {
    console.log("ngOnInit called");
    console.log(this.detectionOriginType);

    if (this.detectionOriginType === "vista") {
      this.processDatasetWithOutVista();
    } else if (this.detectionOriginType === "elastic-search") {
      this.elasticSearchKeyWord = this.folder;
      this.getElasticSearchDate();
    } else {
      this.processDataset();
    }

    if (this.method == "dataset") {
      this.multiple = true;
    } else if (
      JSON.stringify(this.activatedRoute.snapshot.routeConfig).includes(
        "objectDetection"
      )
    ) {
      this.multiple = true;
      this.objDet = true;
    } else {
      this.label = this.method;
    }
  }

  validateWhite(event: number) {
    let max;
    if (event > this.pager.totalPages) {
      max = this.pager.totalPages;
    } else if (event < 0) {
      max = 0;
    } else {
      max = event;
    }
    setTimeout(() => {
      this.gotoPageNo = max;
    });
  }

  processDataset() {
    this.spin = true;
    let data = {
      name: this.folder,
      method: this.detectionOriginType,
    };
    this.annotationsServ.processDataset(data).subscribe(
      async (res) => {
        if (res.length == 0) {
          alert("Zero detections happened.");
          this.router.navigate(["/annotations"]);
        } else {
          this.spin = false;
          this.data = res;
          this.datasetFlag = true;
          this.data.map((value, index) => {
            value["source_result"] = JSON.stringify(value.results);
            value["annotationType"] = "";
            this.annObj[value.id] = {
              image: value.image,
              width: value.width,
              height: value.height,
              canvas_width: "",
              canvas_height: "",
              results: value["results"],
              source_result: value["source_result"],
              fixedSize: value.length,
              annotationType: value.annotationType,
            };
          });
          this.setPage(1);
        }
      },
      (error) => {
        alert(
          `There is an error processing your request. Please retry operation once or contact system administrator.`
        );
        this.router.navigate(["/annotations"]);
      }
    );
  }

  asyncForEachAnaliticsAPI() {
    return new Promise<void>((resolve, reject) => {
      this.data.map(async (value, index) => {
        if (!Array.isArray(value.results)) {
          if (!value.res_width && !value.res_height) {
            const dumWidth = this.data[0].width;
            const dumHeight = this.data[0].height;
            const dumResWidth = this.data[0].res_width;
            const dumResHeight = this.data[0].res_height;
            value.res_width = dumResWidth;
            value.res_height = dumResHeight;
            value.width = dumWidth;
            value.height = dumHeight;
          }
          // if (!value["source_result"]) {
          if (this.detectionOriginType === "elastic-search") {
            value["image"] =
              value["detection_method"] == "Analytics API"
                ? "http://" + ip + ":4200" + value.image
                : vistaIP + value.image;
          } else {
            value["image"] = "http://" + ip + ":4200" + value.image;
          }

          const source =
            value["detection_method"] == "Analytics API"
              ? "Analytics API"
              : "Vista API";

          const convertedResponse = await this.convertVistaResponseToXY(
            value.results,
            index,
            source
          );
          value["results"] = convertedResponse;
          this.annObj[value.id] = {
            image: value.image,
            width: value.res_width,
            height: value.res_height,
            canvas_width: value.width,
            canvas_height: value.height,
            results: value["results"],
            source_result: value["source_result"],
            fixedSize: value.length,
            annotationType: value.annotationType,
          };
          // }
        }
        if (index == this.pagedItems.length - 1) {
          resolve();
          return;
        }
      });
    });
  }

  processDatasetWithOutVista() {
    this.spin = true;
    let data = {
      name: this.folder,
      method: this.detectionOriginType,
    };
    console.log("req data -> ", data);
    this.annotationsServ.processDatasetWithOutVista(data).subscribe(
      (res) => {
        console.log("Vista response - ", res);
        this.spin = false;
        if (res.length == 0) {
          alert("Zero detections happened.");
          this.router.navigate(["/annotations"]);
        } else {
          res.forEach((value, index) => {
            value["image"] = "http://" + ip + ":4200" + value.image;
            value["id"] = index;
            value["results"] = [];
            value["annotationType"] = "";
          });
          console.log("processDatasetWithOutVista -> ", res);
          this.data = res;
          this.datasetFlag = true;
          this.setPage(1);
        }
      },
      (error) => {
        this.spin = false;
        alert(
          `There is an error processing your request. Please retry operation once or contact system administrator.`
        );
        this.router.navigate(["/annotations"]);
      }
    );
  }

  getElasticSearchDate() {
    this.spin = true;
    this.annotationsServ
      .getElasticSearchResults(this.elasticSearchKeyWord)
      .subscribe(
        (res: any) => {
          console.log(
            "elasticSearchData - ",
            res.analytics_processing[0],
            res.vista_processing[0]
          );
          let dumArray = [];
          if (res.analytics_processing.length > 0) {
            res.analytics_processing.forEach((value, index) => {
              value["checked"] = true;
              value["detection_method"] = "Analytics API";
              dumArray.push(value);
            });
            res.vista_processing.forEach((value, index) => {
              value["checked"] = true;
              value["detection_method"] = "Vista API";
              dumArray.push(value);
            });
            this.data = dumArray;
            this.datasetFlag = true;
            this.data.map((value, index) => {
              value["source_result"] = JSON.stringify(value.results);
              value["annotationType"] = "";
              this.annObj[value.id] = {
                image: value.image,
                width: value.width,
                height: value.height,
                canvas_width: "",
                canvas_height: "",
                results: value["results"],
                source_result: value["source_result"],
                fixedSize: value.length,
                annotationType: value.annotationType,
              };
            });
            this.setPage(1);
          } else {
            alert(
              "No result found with the searched query. Please try again with other words."
            );
            this._location.back();
          }
        },
        (error) => {
          this.spin = false;
          alert(
            `There is an error processing your request. Please retry operation once or contact system administrator.`
          );
        }
      );
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }

  getAnn(i) {
    this.selectedImageIndex = i;
    this.re_draw();
  }

  getLabels(i) {
    this.labels = [];
    if (this.labelsObj.hasOwnProperty(this.data[i].id)) {
      this.labels = this.labelsObj[this.data[i].id];
      this.cacheAnnot = this.labels;
    } else {
      this.labels = [];
      for (let itm in this.data[i].results) {
        if (Array.isArray(this.data[i].results[itm])) {
          this.data[i].results[itm].forEach((element) => {
            this.labels.push(element.class);
          });
        }
      }
      this.labelsObj[this.data[i].id] = this.labels;
    }
  }

  clear(lebelIndex, dataIndex) {
    this.canvas = this.rd.selectRootElement(
      `canvas#jPolygon${dataIndex}.card-img-top.img-fluid`
    );
    this.ctx = this.canvas.getContext("2d");
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.data[dataIndex]["results"].splice(lebelIndex, 1);
    this.selectedImageIndex = dataIndex;
    this.re_draw();
    this.on = false;
    this.id = undefined;
    this.selectedID = undefined;
    this.clearAct = false;
  }

  openlebelModal(lebelIndex, dataIndex) {
    this.newLabel = this.data[dataIndex]["results"][lebelIndex][3].label;
    this.selectedImageIndex = dataIndex;
    this.id = lebelIndex;
  }

  updateLabel() {
    if (this.newLabel) {
      this.canvas = this.rd.selectRootElement(
        `canvas#jPolygon${this.selectedImageIndex}.card-img-top.img-fluid`
      );
      this.ctx = this.canvas.getContext("2d");
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (
        let e = 0;
        e < this.data[this.selectedImageIndex]["results"].length;
        e++
      ) {
        if (e == this.id) {
          this.data[this.selectedImageIndex]["results"][e][3].label =
            this.newLabel;
        }
      }
      this.re_draw();
      this.on = false;
      this.id = undefined;
      this.selectedID = undefined;
    }
  }

  get(lebelIndex, dataIndex) {
    this.on = true;
    this.clearAct = true;
    this.id = lebelIndex;
    this.selectedID = lebelIndex;
    this.canvas = this.rd.selectRootElement(
      `canvas#jPolygon${dataIndex}.card-img-top.img-fluid`
    );
    this.ctx = this.canvas.getContext("2d");
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let e = 0; e < this.data[dataIndex]["results"].length; e++) {
      this.ctx.fillStyle = "lime";
      this.ctx.strokeStyle = "lime";
      if (lebelIndex == e) {
        // this.label = this.data[dataIndex]["results"][e][3].label;
        this.ctx.fillStyle = "red";
        this.ctx.strokeStyle = "red";
      }
      if (this.data[dataIndex]["results"][e][2]["general_detection"] == "Yes") {
        this.ctx.fillRect(
          this.data[dataIndex]["results"][e][0]["x"] - 2,
          this.data[dataIndex]["results"][e][0]["y"] - 2,
          4,
          4
        );
        this.ctx.fillRect(
          this.data[dataIndex]["results"][e][0]["x"] - 2,
          this.data[dataIndex]["results"][e][1]["y"] - 2,
          4,
          4
        );
        this.ctx.fillRect(
          this.data[dataIndex]["results"][e][1]["x"] - 2,
          this.data[dataIndex]["results"][e][0]["y"] - 2,
          4,
          4
        );
        this.ctx.strokeRect(
          this.data[dataIndex]["results"][e][0]["x"],
          this.data[dataIndex]["results"][e][0]["y"],
          this.data[dataIndex]["results"][e][1]["x"] -
            this.data[dataIndex]["results"][e][0]["x"],
          this.data[dataIndex]["results"][e][1]["y"] -
            this.data[dataIndex]["results"][e][0]["y"]
        );
        this.ctx.fillRect(
          this.data[dataIndex]["results"][e][1]["x"] - 2,
          this.data[dataIndex]["results"][e][1]["y"] - 2,
          4,
          4
        );
      } else {
        this.ctx.fillRect(
          this.data[dataIndex]["results"][e][0]["x"] - 2,
          this.data[dataIndex]["results"][e][0]["y"] - 2,
          4,
          4
        );
        this.ctx.fillRect(
          this.data[dataIndex]["results"][e][0]["x"] +
            this.data[dataIndex]["results"][e][1]["x"] -
            4,
          this.data[dataIndex]["results"][e][0]["y"] - 4,
          4,
          4
        );
        this.ctx.fillRect(
          this.data[dataIndex]["results"][e][0]["x"] - 2,
          this.data[dataIndex]["results"][e][0]["y"] +
            this.data[dataIndex]["results"][e][1]["y"] -
            2,
          4,
          4
        );
        this.ctx.strokeRect(
          this.data[dataIndex]["results"][e][0]["x"],
          this.data[dataIndex]["results"][e][0]["y"],
          this.data[dataIndex]["results"][e][1]["x"],
          this.data[dataIndex]["results"][e][1]["y"]
        );
        this.ctx.fillRect(
          this.data[dataIndex]["results"][e][0]["x"] +
            this.data[dataIndex]["results"][e][1]["x"] -
            3,
          this.data[dataIndex]["results"][e][0]["y"] +
            this.data[dataIndex]["results"][e][1]["y"] -
            3,
          4,
          4
        );
      }
      this.ctx.lineWidth = 2.5;
      this.ctx.stroke();
    }
  }

  @HostListener("document:mousemove", ["$event"])
  onMouseMove(e) {
    let x, y, rect;
    if (this.datasetFlag && this.canvas) {
      // console.log(e.clientX+','+e.clientY, this.click);
      rect = this.canvas.getBoundingClientRect();
      x = e.clientX - rect.left - 3;
      y = e.clientY - rect.top - 3;
      if (this.count == 1) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.re_draw();
        this.ctx.fillStyle = "white";
        this.ctx.strokeStyle = "white";
        this.ctx.fillRect(
          this.coords[0]["x"] - 2,
          this.coords[0]["y"] - 2,
          4,
          4
        );
        this.ctx.fillRect(this.coords[0]["x"] - 2, y - 2, 4, 4);
        this.ctx.fillRect(x - 2, this.coords[0]["y"] - 2, 4, 4);
        this.ctx.strokeRect(
          this.coords[0]["x"],
          this.coords[0]["y"],
          x - this.coords[0]["x"],
          y - this.coords[0]["y"]
        );
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        this.ctx.fillRect(
          this.coords[0]["x"],
          this.coords[0]["y"],
          x - this.coords[0]["x"],
          y - this.coords[0]["y"]
        );
        this.ctx.fillRect(x - 2, y - 2, 4, 4);
        this.ctx.lineWidth = 2.5;
        this.ctx.stroke();
      }
    }
  }

  noMess() {
    this.showMyMessage = false;
  }

  annotate(event, i) {
    this.selectedImageIndex = i;
    this.canvas = this.rd.selectRootElement(event.target);
    this.ctx = this.canvas.getContext("2d");
    this.labelsMessage = false;

    this.goAnnotate(event, i);
  }

  goAnnotate(event, i) {
    this.getAnn(i);
    this.getLabels(i);
    let x, y, rect;
    if (this.objDet == false) {
      console.log("here3", this.label);
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
          this.coords.push({ x: x, y: y });
          this.ctx.moveTo(x, y);
          this.ctx.fillStyle = "white";
          this.ctx.fillRect(x - 2, y - 2, 4, 4);
        } else if (this.count == 2) {
          this.count = 0;
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          rect = this.canvas.getBoundingClientRect();
          x = event.clientX - rect.left;
          y = event.clientY - rect.top;
          this.ctx.fillStyle = "lime";
          this.ctx.fillRect(
            this.coords[0]["x"] - 2,
            this.coords[0]["y"] - 2,
            4,
            4
          );
          this.ctx.fillRect(this.coords[0]["x"] - 2, y - 2, 4, 4);
          this.ctx.fillRect(x - 2, this.coords[0]["y"] - 2, 4, 4);
          this.ctx.strokeStyle = "lime";
          this.ctx.strokeRect(
            this.coords[0]["x"],
            this.coords[0]["y"],
            x - this.coords[0]["x"],
            y - this.coords[0]["y"]
          );
          this.ctx.fillRect(x - 2, y - 2, 4, 4);
          x = x - this.coords[0].x;
          y = y - this.coords[0].y;
          this.coords.push({ x: x, y: y });
          this.coords.push({
            general_detection: "No",
            detection_source: "Manual Drawn",
          });
          this.coords.push({
            label: this.label + " " + (this.data[i]["results"].length + 1),
          });
          this.ctx.lineWidth = 2.5;
          this.ctx.stroke();
          this.data[i]["results"].push(this.coords);
          if (!this.annObj.hasOwnProperty(this.data[i].id)) {
            this.annObj[this.data[i].id] = {
              image: this.data[i].image,
              width: this.data[i].res_width,
              height: this.data[i].res_height,
              canvas_width: this.data[i].width,
              canvas_height: this.data[i].height,
              results: this.data[i]["results"],
              fixedSize: this.data[i]["results"].length,
              annotationType: this.data[i].annotationType,
            };
          } else {
            this.annObj[this.data[i].id].results = this.data[i]["results"];
          }
          this.labels.push(this.label + (this.data[i]["results"].length + 1));
          this.labelsObj[this.data[i].id] = this.labels;
          this.labels = this.labelsObj[this.data[i].id];
          this.re_draw();
          this.coords = [];
        }
      } else {
        this.showMyMessage = true;
        setTimeout(() => {
          this.showMyMessage = false;
        }, 5000);
      }
    } else {
      console.log("here4");
      if (this.label != undefined) {
        let inX, endX, inY, endY;
        rect = this.canvas.getBoundingClientRect();
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
        for (let i = 0; i < this.data[i]["results"].length; i++) {
          if (
            this.data[i]["results"][i][0].x < this.data[i]["results"][i][1].x
          ) {
            inX = this.data[i]["results"][i][0].x;
            endX = this.data[i]["results"][i][1].x;
          } else {
            inX = this.data[i]["results"][i][1].x;
            endX = this.data[i]["results"][i][0].x;
          }
          if (
            this.data[i]["results"][i][0].y < this.data[i]["results"][i][1].y
          ) {
            inY = this.data[i]["results"][i][0].y;
            endY = this.data[i]["results"][i][1].y;
          } else {
            inY = this.data[i]["results"][i][1].y;
            endY = this.data[i]["results"][i][0].y;
          }
          if (x >= inX && x <= endX && y >= inY && y <= endY) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let e = 0; e < this.data[i]["results"].length; e++) {
              this.ctx.fillStyle = "lime";
              this.ctx.strokeStyle = "lime";
              if (i == e) {
                this.data[i]["results"][e][3].label = this.label;
                this.annObj[this.data[i].id].results = this.data[i]["results"];
                this.labels.push(this.label);
                this.labelsObj[this.data[i].id] = this.labels;
                this.labels = this.labelsObj[this.data[i].id];
                this.ctx.strokeStyle = "red";
                this.ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
                this.ctx.fillRect(
                  this.data[i]["results"][e][0]["x"],
                  this.data[i]["results"][e][0]["y"],
                  this.data[i]["results"][e][1]["x"] -
                    this.data[i]["results"][e][0]["x"],
                  this.data[i]["results"][e][1]["y"] -
                    this.data[i]["results"][e][0]["y"]
                );
              }
              this.ctx.fillRect(
                this.data[i]["results"][e][0]["x"],
                this.data[i]["results"][e][0]["y"],
                4,
                4
              );
              this.ctx.fillRect(
                this.data[i]["results"][e][0]["x"] +
                  this.data[i]["results"][e][1]["x"],
                this.data[i]["results"][e][0]["y"],
                4,
                4
              );
              this.ctx.fillRect(
                this.data[i]["results"][e][0]["x"],
                this.data[i]["results"][e][0]["y"] +
                  this.data[i]["results"][e][1]["y"],
                4,
                4
              );
              this.ctx.strokeRect(
                this.data[i]["results"][e][0]["x"],
                this.data[i]["results"][e][0]["y"],
                this.data[i]["results"][e][1]["x"],
                this.data[i]["results"][e][1]["y"]
              );
              this.ctx.fillRect(
                this.data[i]["results"][e][0]["x"] +
                  this.data[i]["results"][e][1]["x"],
                this.data[i]["results"][e][0]["y"] +
                  this.data[i]["results"][e][1]["y"],
                4,
                4
              );
              this.ctx.lineWidth = 2.5;
              this.ctx.stroke();
            }
          }
        }
      } else {
        this.showMyMessage = true;
        setTimeout(() => {
          this.showMyMessage = false;
        }, 5000);
      }
    }
  }

  re_draw() {
    let len;
    let limitedArray;

    if (this.data[this.selectedImageIndex].maxKnobAnnotation) {
      len = this.data[this.selectedImageIndex].maxKnobAnnotation;
      limitedArray = this.data[this.selectedImageIndex]["results"].slice(
        0,
        len
      );
      this.data[this.selectedImageIndex]["actualResults"] =
        this.data[this.selectedImageIndex]["results"];
      this.data[this.selectedImageIndex]["results"] = limitedArray;
    }

    for (
      let e = 0;
      e < this.data[this.selectedImageIndex]["results"].length;
      e++
    ) {
      this.ctx.fillStyle = "lime";
      this.ctx.strokeStyle = "lime";
      if (
        this.data[this.selectedImageIndex]["results"][e][2][
          "general_detection"
        ] == "Yes"
      ) {
        this.ctx.fillRect(
          this.data[this.selectedImageIndex]["results"][e][0]["x"] - 2,
          this.data[this.selectedImageIndex]["results"][e][0]["y"] - 2,
          4,
          4
        );
        this.ctx.fillRect(
          this.data[this.selectedImageIndex]["results"][e][0]["x"] - 2,
          this.data[this.selectedImageIndex]["results"][e][1]["y"] - 2,
          4,
          4
        );
        this.ctx.fillRect(
          this.data[this.selectedImageIndex]["results"][e][1]["x"] - 2,
          this.data[this.selectedImageIndex]["results"][e][0]["y"] - 2,
          4,
          4
        );
        this.ctx.strokeRect(
          this.data[this.selectedImageIndex]["results"][e][0]["x"],
          this.data[this.selectedImageIndex]["results"][e][0]["y"],
          this.data[this.selectedImageIndex]["results"][e][1]["x"] -
            this.data[this.selectedImageIndex]["results"][e][0]["x"],
          this.data[this.selectedImageIndex]["results"][e][1]["y"] -
            this.data[this.selectedImageIndex]["results"][e][0]["y"]
        );
        this.ctx.fillRect(
          this.data[this.selectedImageIndex]["results"][e][1]["x"] - 2,
          this.data[this.selectedImageIndex]["results"][e][1]["y"] - 2,
          4,
          4
        );
      } else {
        this.ctx.fillRect(
          this.data[this.selectedImageIndex]["results"][e][0]["x"] - 2,
          this.data[this.selectedImageIndex]["results"][e][0]["y"] - 2,
          4,
          4
        );
        this.ctx.fillRect(
          this.data[this.selectedImageIndex]["results"][e][0]["x"] +
            this.data[this.selectedImageIndex]["results"][e][1]["x"] -
            4,
          this.data[this.selectedImageIndex]["results"][e][0]["y"] - 4,
          4,
          4
        );
        this.ctx.fillRect(
          this.data[this.selectedImageIndex]["results"][e][0]["x"] - 2,
          this.data[this.selectedImageIndex]["results"][e][0]["y"] +
            this.data[this.selectedImageIndex]["results"][e][1]["y"] -
            2,
          4,
          4
        );
        this.ctx.strokeRect(
          this.data[this.selectedImageIndex]["results"][e][0]["x"],
          this.data[this.selectedImageIndex]["results"][e][0]["y"],
          this.data[this.selectedImageIndex]["results"][e][1]["x"],
          this.data[this.selectedImageIndex]["results"][e][1]["y"]
        );
        this.ctx.fillRect(
          this.data[this.selectedImageIndex]["results"][e][0]["x"] +
            this.data[this.selectedImageIndex]["results"][e][1]["x"] -
            3,
          this.data[this.selectedImageIndex]["results"][e][0]["y"] +
            this.data[this.selectedImageIndex]["results"][e][1]["y"] -
            3,
          4,
          4
        );
      }
      this.ctx.lineWidth = 2.5;
      this.ctx.stroke();
    }
  }

  /** VISTA Single Image Processing */
  getImgAnnotations(i, event) {
    this.spin = true;
    this.activeButton(event);
    this.selectedID = "";
    this.canvas = this.rd.selectRootElement(
      `canvas#jPolygon${i}.card-img-top.img-fluid`
    );
    this.ctx = this.canvas.getContext("2d");
    this.labelsMessage = false;

    const req = { image_path: this.data[i].image };
    this.annotationsServ.processVistaSingle(req).subscribe(
      async (res: any) => {
        const response = JSON.parse(res);
        console.log("processVistaSingle -> ", response);
        this.spin = false;
        if (!response) {
          alert("Zero detections happened.");
        } else {
          console.log("this.data - ", this.data);
          const convertedResponse = await this.convertVistaResponseToXY(
            response.results,
            i,
            "Vista API"
          );
          convertedResponse.forEach((element) => {
            this.data[i]["results"].push(element);
          });
          this.annObj[this.data[i].id] = {
            image: this.data[i].image,
            width: this.data[i].res_width,
            height: this.data[i].res_height,
            canvas_width: this.data[i].width,
            canvas_height: this.data[i].height,
            results: this.data[i]["results"],
            fixedSize: this.data[i]["results"].length,
            annotationType: this.data[i].annotationType,
          };
          this.cacheAnnot = this.data[i]["results"];
          this.getAnn(i);
          this.getLabels(i);
          this.data[i]["vistaResponseReceived"] = true;
        }
      },
      (error) => {
        this.spin = false;
        alert(
          `There is an error processing your request. Please retry operation once or contact system administrator.`
        );
      }
    );
  }

  convertAnalyticsResponseToXY(res, i, source) {
    let annotatedList = [];
    for (let itm in res) {
      res[itm].Object.forEach((element) => {
        let obj1 = {
          x:
            (element.boundingBox.left * this.data[i].width) /
            this.data[i].res_width,
          y:
            (element.boundingBox.top * this.data[i].height) /
            this.data[i].res_height,
        };
        this.ann.push(obj1);
        let obj2 = {
          x:
            (element.boundingBox.width * this.data[i].width) /
            this.data[i].res_width,
          y:
            (element.boundingBox.height * this.data[i].height) /
            this.data[i].res_height,
        };
        this.ann.push(obj2);
        let obj3 = {
          general_detection: "No",
          detection_source: source,
        };
        this.ann.push(obj3);
        let obj4 = {
          label: element.class,
        };
        this.ann.push(obj4);
        annotatedList.push(this.ann);
        this.ann = [];
      });
    }
    return annotatedList;
  }

  convertVistaResponseToXY(res, i, source) {
    let annotatedList = [];
    for (let itm in res) {
      if (Array.isArray(res[itm])) {
        res[itm].forEach((element) => {
          let obj1 = {
            x:
              (element.boundingBox.left * this.data[i].width) /
              this.data[i].res_width,
            y:
              (element.boundingBox.top * this.data[i].height) /
              this.data[i].res_height,
          };
          this.ann.push(obj1);
          let obj2 = {
            x:
              (element.boundingBox.width * this.data[i].width) /
              this.data[i].res_width,
            y:
              (element.boundingBox.height * this.data[i].height) /
              this.data[i].res_height,
          };
          this.ann.push(obj2);
          let obj3 = {
            general_detection: "No",
            detection_source: source,
          };
          this.ann.push(obj3);
          let obj4 = {
            label: element.class,
          };
          this.ann.push(obj4);
          annotatedList.push(this.ann);
          this.ann = [];
        });
      }
    }
    return annotatedList;
  }

  getAnayticsImgAnnotations(callback) {
    this.pagedItems.forEach((val, i, array) => {
      this.selectedID = "";
      this.canvas = this.rd.selectRootElement(
        `canvas#jPolygon${val.id}.card-img-top.img-fluid`
      );
      this.ctx = this.canvas.getContext("2d");
      this.labelsMessage = false;
      this.getAnn(val.id);
      this.getLabels(val.id);
      if (i === array.length - 1) {
        callback();
        return;
      }
    });
  }

  activeButton(event) {
    let clickedElement = event.target || event.srcElement;

    if (clickedElement.nodeName === "BUTTON") {
      let isCertainButtonAlreadyActive =
        document.querySelector(".button-active");
      // if a Button already has Class: .active
      if (isCertainButtonAlreadyActive) {
        isCertainButtonAlreadyActive.classList.remove("button-active");
      }

      clickedElement.className += " button-active";
    }
  }

  generalDetection(i, event) {
    this.activeButton(event);
    this.selectedID = "";
    this.spin = true;
    let body = {
      type: this.detectionOriginType,
      details: this.data[i],
      img: !this.annObj.hasOwnProperty(this.data[i].id)
        ? this.data[i].image
        : this.annObj[this.data[i].id].image,
    };
    this.canvas = this.rd.selectRootElement(
      `canvas#jPolygon${i}.card-img-top.img-fluid`
    );
    this.ctx = this.canvas.getContext("2d");
    this.annotationsServ.generalDetection(body).subscribe((res) => {
      this.spin = false;
      alert(`${res.length} objects detected.`);
      if (res.length > 0) {
        res.forEach((element) => {
          element[2]["detection_source"] = "General Detection Script";
          this.data[i]["results"].push(element);
        });
        console.log(res);
        res.forEach((element) => {
          if (!this.annObj.hasOwnProperty(this.data[i].id)) {
            this.annObj[this.data[i].id] = {
              image: this.data[i].image,
              width: this.data[i].res_width,
              height: this.data[i].res_height,
              canvas_width: this.data[i].width,
              canvas_height: this.data[i].height,
              results: this.data[i]["results"],
              fixedSize: this.data[i]["results"].length,
              annotationType: this.data[i].annotationType,
            };
          } else {
            console.log("eee", this.annObj[this.data[i].id].results);
            this.annObj[this.data[i].id].results = this.data[i]["results"];
          }
        });
        this.data[i]["results"].forEach((element, index) => {
          if (element[3].label == "") {
            element[3].label = "object " + (index + 1);
          }
        });
        console.log(this.data[i]);
        this.labelsMessage = false;
        this.selectedImageIndex = i;
        this.re_draw();
        this.data[i]["generalDetectionResponseReceived"] = true;
      }
    });
  }

  handleSelected(img, checked) {
    console.log("img : ", img);
    console.log("checked : ", checked);
  }

  addLabel() {
    this.labels.push(this.newLabel);
    this.newLabel = null;
  }

  async next() {
    this.annObj["datasetName"] = this.folder;
    this.annObj["payloadType"] = this.folder;
    console.log(this.data);

    if (Object.keys(this.annObj).length == 0 || this.annObj == {}) {
      console.log("...............condition matched");
      this.annObj = this.data;
    }

    console.log(this.annObj);
    if (this.valueImage < this.total - 1) {
      this.valueImage++;
      if (JSON.stringify(this.cacheAnnot) != JSON.stringify(this.annotations)) {
        this.send();
      } else {
        this.router
          .navigateByUrl("/RefreshComponent", { skipLocationChange: true })
          .then(() => {
            this.router.navigate(["annotations/save"], {
              state: { data: this.annObj },
            });
          });
      }
    } else if (this.valueImage == this.total - 1) {
      if (JSON.stringify(this.cacheAnnot) != JSON.stringify(this.annotations)) {
        this.send();
      } else {
        this.router.navigateByUrl("/annotations");
      }
    } else {
      this.router.navigate(["annotations/save"], {
        state: { data: this.annObj },
      });
    }
  }

  send() {
    this.annotations.push({ width: this.annWidth, height: this.annHeight });
    this.annotationsServ
      .writeAnn(this.picture.split("/").join(" "), this.annotations)
      .subscribe(
        (res) => {
          if (this.valueImage < this.total - 1) {
            this.router
              .navigateByUrl("/RefreshComponent", { skipLocationChange: true })
              .then(() => {
                this.router.navigate([
                  "/annotations/dataset/" +
                    this.method +
                    "/" +
                    this.folder +
                    "/" +
                    this.valueImage,
                ]);
              });
          } else if (this.valueImage == this.total - 1) {
            this.router.navigateByUrl("/annotations");
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  prev() {
    if (this.valueImage > 0) {
      this.valueImage--;
      if (JSON.stringify(this.cacheAnnot) != JSON.stringify(this.annotations)) {
        this.send();
      } else {
        this.router
          .navigateByUrl("/RefreshComponent", { skipLocationChange: true })
          .then(() => {
            // this.router.navigate([ "/annotations/" + this.method + "/" + this.folder + "/" + this.valueImage]);
            this._location.back();
          });
      }
    }
  }
}
