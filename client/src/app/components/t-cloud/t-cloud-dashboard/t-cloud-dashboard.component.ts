import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from "@angular/core";
import { AnnotationsService } from "../../../services/annotations.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FileUploader, FileLikeObject } from "ng2-file-upload";
import { ip } from "../../../models/IpServer";
import { FacesService } from "../../../services/faces.service";
import { PagerService } from "../../../services/pager.service";
import { DatePipe } from "@angular/common";

import * as jQuery from "jquery";
import "select2";

const zipURL = "http://" + ip + ":3000/api/datasets/upZip";
const imgURL = "http://" + ip + ":3000/api/upload/pic";

@Component({
  selector: "app-buttoms",
  templateUrl: "./t-cloud-dashboard.component.html",
  styleUrls: ["./t-cloud-dashboard.component.scss"],
})
export class TCloudDashboardComponent implements OnInit {
  @ViewChild("img", { static: true }) myImgInputVariable: ElementRef;
  @ViewChild("zip", { static: true }) myInputVariable: ElementRef;

  labelImport: ElementRef;
  fileToUpload: File = null;

  uploadFileNames: Array<string> = [];

  public uploader: FileUploader = new FileUploader({
    url: zipURL,
    itemAlias: "zip",
  });

  public photoUploader: FileUploader = new FileUploader({
    url: imgURL,
    itemAlias: "photo",
  });

  fileName: string = "";
  searchcount: number = 20;
  imgFileName: string = "";
  uploadName: string;
  unAnnDatasetsNames: any = [];
  annDatasetsNames: any = [];
  classNames: any = [];
  datasetName: string = null;
  searchDatasetName: string = null;
  searchKeyword: string = null;
  searchFlag: boolean = true;
  isSearchDisabled: boolean = true;
  public showMyMessage2 = false;
  public showMyMessage3 = false;
  public showMyMessage4 = false;
  public showMyWatch = false;
  public showClass = false;
  public badFile = true;
  public open = false;
  spinner: boolean = false;
  spin: boolean = false;
  unAnnSpin: boolean = false;
  annSpin: boolean = false;
  choosenDataset: string;
  choosenDatasetForVista: string;
  choosenDatasetForAnalytics: string;
  choosenClass: string;
  cameras: any = [];
  camera: any;
  rtsp_in: any;
  selectedDate: any;
  date: any;
  response: any = [];
  images: any = [];
  pagedImages: any = [];
  selectedImages: any = [];
  pager: any = {};
  uploadImage: boolean = false;
  showMyMessage: boolean = false;
  newLabel: string;

  label: string;
  labels: any = [];
  selectedUnAnnotatedDataset: any = "";
  selectedAnnotatedDataset: any = "";
  count = 0;

  elasticSearchKeyWord: any = "";

  public date_now = new Date(Date.now()).toString();
  public max = new Date(this.date_now);

  constructor(
    private router: Router,
    private annotationsServ: AnnotationsService,
    private facesservices: FacesService,
    private datepipe: DatePipe,
    private pagerService: PagerService,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      const newStuff = this.datasetName.split(" ").join("_");
      this.uploadName = newStuff + ".zip";
      // this.fileName += file.file.name + ",";
      file.file.name = this.uploadName;
      // this.uploadFileNames.push(this.uploadName);
      // console.log(this.uploadFileNames);
    };
    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      console.log("Uploaded:", status, response, headers);
      this.uploadImage = false;
      this.getUnAnnDsets("data");
      alert("Dataset created successfully");
    };
    this.uploader.onProgressItem = (progress: any) => {
      this.spin = true;
      console.log(progress["progress"]);
      if (progress["progress"] == 100) {
        this.showMyMessage3 = undefined;
        this.showMyMessage4 = true;
        this.spin = false;
      }
    };

    this.photoUploader.onAfterAddingFile = (file) => {
      console.log("****************************", file._file);
      this.imgFileName = file._file.name;
      console.log("imgFileName........", this.imgFileName);

      if (
        file._file.type === "image/png" ||
        file._file.type === "image/jpeg" ||
        file._file.type === "image/jpg"
      ) {
        file.withCredentials = false;
        const format = file.file.name.split(".")[1];
        const name = this.imgFileName.split(" ").join("_");
        const newName = name + "." + format;
        file.file.name = newName;
      } else {
        file = null;
        this.myImgInputVariable.nativeElement.value = null;
        this.imgFileName = "";
        alert("Unsupported file format");
        this.clearImageStack();
      }
    };
    this.photoUploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      if (status == 500 || response == '"<h1>Server Error (500)</h1>"') {
        this.uploadImage = false;
        alert("There is an error Processing you request. Please try again.");
      } else {
        console.log("Image Upload Response - ", JSON.parse(response));
        this.router.navigate(
          ["/annotations/" + "object" + "/" + "image" + "/0"],
          { state: { data: JSON.parse(response) } }
        );
      }
    };
    this.photoUploader.onProgressItem = (progress: any) => {
      console.log(progress["progress"]);
      if (progress["progress"] == 100) {
        this.showMyMessage3 = undefined;
        this.showMyMessage4 = true;
      }
    };

    this.getUnAnnDsets("data");
    this.getUnAnnDsets("class");
    this.getAnnDsets("data");
    this.getLabels();

    this.facesservices.getCameras().subscribe(
      (res) => {
        console.log("cameras..........", res);
        this.cameras = res;
      },
      (err) => console.log(err)
    );

    // Select2
    // @ts-ignore
    if (
      jQuery(".createDatasetSelect2").select2 &&
      typeof jQuery(".createDatasetSelect2").select2 == "function"
    ) {
      // @ts-ignore
      jQuery(".createDatasetSelect2")
        .select2({
          placeholder: "Enter Dataset Name",
          tags: true,
        })
        .on("select2:selecting", (e: any) => {
          // console.log('Selecting: ', e.params.args.data);
          // if (e.params.args.data.text == e.params.args.data.id) {
          //   this.datasetName = e.params.args.data.text
          // } else {
          //   this.datasetName = {
          //     name: e.params.args.data.text,
          //     id: e.params.args.data.id
          //   };
          // }

          this.datasetName = e.params.args.data.text.trim();
          this.searchDatasetName = e.params.args.data.text.trim();

          this.detect();
          this.detectChange();
        });
    }
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  clearImageStack() {
    this.photoUploader.cancelAll();
    this.photoUploader.clearQueue();
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    // get pager object from service
    this.pager = this.pagerService.getPager(this.images.length, page, 9);
    // get current page of items
    this.pagedImages = this.images.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }

  getElasticSearchDate() {
    this.spin = true;
    this.annotationsServ
      .getElasticSearchResults(this.elasticSearchKeyWord)
      .subscribe(
        (res) => {
          this.spin = false;
          console.log("Elastic Search response - ", res);
        },
        (error) => {
          this.spin = false;
          alert(
            `There is an error processing your request. Please retry operation once or contact system administrator.`
          );
        }
      );
  }

  getUnAnnDsets(thing: string) {
    this.spin = true;
    this.annotationsServ.getUnAnnDatasets(thing).subscribe(
      (res) => {
        this.spin = false;
        if (thing == "data") {
          this.unAnnDatasetsNames = res;
          for (let i = 0; i < this.unAnnDatasetsNames.length; i++) {
            this.unAnnDatasetsNames[i]["open"] = false;
            this.unAnnDatasetsNames[i]["name"] =
              this.unAnnDatasetsNames[i]["name"];
            this.unAnnDatasetsNames[i]["id"] = this.unAnnDatasetsNames[i]["id"];
          }
        } else if (thing == "class") {
          this.classNames = res;
          for (let i = 0; i < this.classNames.length; i++) {
            this.classNames[i]["open"] = false;
            this.classNames[i]["name"] = this.classNames[i]["name"]
              .split("_")
              .join(" ");
            this.classNames[i]["id"] = this.classNames[i]["id"];
          }
        }
      },
      (err) => {
        this.spin = false;
        console.log(err);
      }
    );
  }

  getAnnDsets(thing: string) {
    this.spin = true;
    this.annotationsServ.getAnnDatasets(thing).subscribe(
      (res) => {
        this.spin = false;
        if (thing == "data") {
          this.annDatasetsNames = res;
          for (let i = 0; i < this.annDatasetsNames.length; i++) {
            this.annDatasetsNames[i]["open"] = false;
            this.annDatasetsNames[i]["name"] = this.annDatasetsNames[i]["name"];
            this.annDatasetsNames[i]["id"] = this.annDatasetsNames[i]["id"];
          }
        } else if (thing == "class") {
          this.classNames = res;
          for (let i = 0; i < this.classNames.length; i++) {
            this.classNames[i]["open"] = false;
            this.classNames[i]["name"] = this.classNames[i]["name"]
              .split("_")
              .join(" ");
            this.classNames[i]["id"] = this.classNames[i]["id"];
          }
        }
      },
      (err) => {
        this.spin = false;
        console.log(err);
      }
    );
  }

  getLabels() {
    this.annotationsServ.readLabels().subscribe(
      (res) => {
        this.labels = res;
        this.labels = this.labels.split("\r\n");
        this.labels.pop();
      },
      (err) => console.log(err)
    );
  }

  addLabel() {
    this.annotationsServ.writeLabel(this.newLabel).subscribe(
      (res) => {
        this.newLabel = null;
        this.getLabels();
      },
      (err) => console.log(err)
    );
  }

  go() {
    this.showMyMessage = true;
  }

  annotateByVista() {
    this.router.navigate([
      "/annotations/dataset/object/" + this.choosenDataset + "/vista",
    ]);
  }

  annotateByAnalytics() {
    this.router.navigate([
      "/annotations/dataset/object/" + this.choosenDataset + "/analytics",
    ]);
  }

  annotateByElasticSearch() {
    this.router.navigate([
      "/annotations/dataset/object/" +
        this.elasticSearchKeyWord +
        "/elastic-search",
    ]);
  }

  check() {
    this.uploader.uploadAll();
    this.myInputVariable.nativeElement.value = null;
    this.fileName = "";
    setTimeout(() => {
      // this.getUnAnnDsets("data");
      this.refreshDataSets();
    }, 2000);
    this.showMyMessage4 = false;
    this.showMyMessage3 = true;
  }

  checkImg() {
    this.uploadImage = true;
    this.photoUploader.uploadAll();
    this.myImgInputVariable.nativeElement.value = null;
    this.imgFileName = "";
  }

  isCameraReady() {
    this.date = this.datepipe.transform(this.selectedDate, "yyyy-M-dd");
    if (this.camera != undefined && this.date != undefined) {
      return true;
    } else {
      return false;
    }
  }

  refreshDataSets() {
    this.unAnnRefresh();
    this.annRefresh();
  }

  unAnnRefresh() {
    this.unAnnDatasetsNames = [];
    this.unAnnSpin = true;
    setTimeout(() => {
      this.getUnAnnDsets("data");
      this.unAnnSpin = false;
    }, 100);
  }

  annRefresh() {
    this.annDatasetsNames = [];
    this.annSpin = true;
    setTimeout(() => {
      this.getAnnDsets("data");
      this.annSpin = false;
    }, 100);
  }

  detect() {
    this.showMyMessage2 = true;
    if (this.datasetName == "") {
      this.showMyMessage2 = false;
    }
  }

  showPicInfo(event) {
    console.log(event);
  }

  detectChange() {
    debugger;
    this.searchFlag = false;
    if (this.searchDatasetName == "") {
      this.searchFlag = true;
      this.isSearchDisabled = true;
    }
    if (this.searchKeyword != "" && this.searchDatasetName != "") {
      this.isSearchDisabled = false;
    }
  }

  validateWhite(event: number) {
    let max;
    if (event > 150) {
      max = 150;
    } else if (event < 0) {
      max = 0;
    } else {
      max = event;
    }
    setTimeout(() => {
      this.searchcount = max;
    });
  }

  detectSearchChange() {
    this.isSearchDisabled = false;
    if (this.searchKeyword == "" || this.searchDatasetName == "") {
      this.isSearchDisabled = true;
    }
  }

  search() {
    this.pagedImages = [];
    this.images = [];
    this.pager = {};
    this.spinner = true;
    this.annotationsServ
      .searchImages(this.searchKeyword, this.searchcount)
      .subscribe((res: any) => {
        this.spinner = false;
        this.images = res.value;
        this.images = this.images.map((obj) => ({ ...obj, checked: true }));
        this.setPage(1);
        this.searchFlag = true;
        // this.isSearchDisabled = true
      });
    /* this.images = this.images.map(obj=> ({ ...obj, checked: true }))
        setTimeout(() => {
          this.spinner = false;
          this.setPage(1);
        }, 3000) */
  }

  okay() {
    let data = {
      images: this.selectedImages,
      name: this.searchDatasetName,
    };

    this.annotationsServ.createDataset(data).subscribe((res) => {
      this.searchDatasetName = null;
      this.searchKeyword = null;
      this.images = [];
      this.selectedImages = [];
      // this.getUnAnnDsets("data");
      this.refreshDataSets();
    });
  }

  close() {
    this.searchDatasetName = null;
    this.searchKeyword = null;
  }

  info() {
    console.log(this.unAnnDatasetsNames);
  }

  showInfo(event) {
    this.fileName = event.target.files[0].name;
    if (this.fileName.includes(".zip")) {
      this.badFile = false;
    } else {
      this.badFile = true;
    }
  }

  UnAnnDSetchange() {
    for (let i = 0; i < this.unAnnDatasetsNames.length; i++) {
      if (this.selectedUnAnnotatedDataset == i) {
        this.unAnnDatasetsNames[i]["open"] = true;
        this.choosenDatasetForAnalytics = undefined;
        this.choosenDataset = this.unAnnDatasetsNames[i]["name"];
        this.choosenDatasetForVista = this.unAnnDatasetsNames[i]["name"];
      } else {
        this.unAnnDatasetsNames[i]["open"] = false;
      }
    }
  }

  AnnDSetchange() {
    for (let i = 0; i < this.annDatasetsNames.length; i++) {
      if (this.selectedAnnotatedDataset == i) {
        this.annDatasetsNames[i]["open"] = true;
        this.choosenDatasetForVista = undefined;
        this.choosenDataset = this.annDatasetsNames[i]["name"];
        this.choosenDatasetForAnalytics = this.annDatasetsNames[i]["name"];
      } else {
        this.annDatasetsNames[i]["open"] = false;
      }
    }
  }

  change1(e) {
    for (let i = 0; i < this.classNames.length; i++) {
      if (e == i) {
        this.classNames[i]["open"] = true;
        this.choosenClass = this.classNames[i]["name"];
      } else {
        this.classNames[i]["open"] = false;
      }
    }
    if (this.choosenClass != undefined) {
      this.showClass = true;
    }
  }

  deleteUnAnnDataset(dataset: any) {
    if (confirm('Are you sure you want to delete "' + dataset.name + '" ?')) {
      this.annotationsServ
        .deleteDataset(dataset.snippet_id, dataset.type, dataset.name)
        .subscribe(
          (res) => {
            console.log(res);
            this.unAnnRefresh();
            this.choosenDatasetForVista = undefined;
            this.selectedUnAnnotatedDataset = "";
          },
          (err) => console.error(err)
        );
    }
  }

  deleteAnnDataset(dataset: any) {
    if (confirm('Are you sure you want to delete "' + dataset.name + '" ?')) {
      this.annotationsServ
        .deleteDataset(dataset.snippet_id, dataset.type, dataset.name)
        .subscribe(
          (res) => {
            console.log(res);
            this.annRefresh();
            this.choosenDatasetForAnalytics = undefined;
            this.selectedAnnotatedDataset = "";
          },
          (err) => console.error(err)
        );
    }
  }

  handleSelected(data, isChecked) {
    isChecked = isChecked === true ? false : true;
    let index = this.images.findIndex((x) => x.imageId === data.imageId);
    this.images[index].checked = isChecked;
  }

  confirm() {
    this.selectedImages = this.images.filter((itm) => itm.checked === true);
  }

  realGo() {
    if (this.label != undefined) {
      this.router.navigate([
        "/annotations/" + this.label + "/" + this.choosenDataset + "/0",
      ]);
    }
  }

  onFileChange(files: FileList) {
    this.labelImport.nativeElement.innerText = Array.from(files)
      .map((f) => f.name)
      .join(", ");
    this.fileToUpload = files.item(0);
  }
}
