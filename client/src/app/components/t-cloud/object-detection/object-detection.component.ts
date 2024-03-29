import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AnnotationsService } from "../../../services/annotations.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FileUploader, FileLikeObject } from "ng2-file-upload";
import { ip } from "../../../models/IpServer";
import { FacesService } from "../../../services/faces.service";
import { DatePipe } from "@angular/common";
import { SessionStorageService } from "src/app/services/session-storage.service";
import { NavigationService } from "src/app/shared/services/navigation.service";
import { throwError } from "rxjs";
import { environment } from "src/environments/environment";

const URL = "http://" + ip + ":3000/api/upload/pic";

@Component({
  selector: "app-object-detection",
  templateUrl: "./object-detection.component.html",
  styleUrls: ["./object-detection.component.css"],
})
export class ObjectDetectionComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: "photo",
    headers: [{ name: "x-api-key", value: environment.xApiKey }],
  });

  constructor(
    private router: Router,
    private annotationsServ: AnnotationsService,
    private facesservices: FacesService,
    private datepipe: DatePipe,
    private sessionService: SessionStorageService,
    private navigationService: NavigationService
  ) {
    const authInfo = this.sessionService.getItems();
    const token = "Bearer " + authInfo.accessToken;
    this.uploader.authToken = authInfo ? token : "";
  }
  uploadFileNames: Array<string> = [];

  fileName: string = "";
  uploadName: string;
  datasetsNames: any = [];
  classNames: any = [];
  datasetName: string = null;
  public showMyMessage2 = true;
  public showMyMessage3 = false;
  public showMyMessage4 = false;
  public showMyWatch = false;
  public showClass = false;
  public badFile = true;
  public open = false;
  choosenDataset: string;
  choosenClass: string;
  cameras: any = [];
  camera: any;
  date: any;

  public date_now = new Date(Date.now()).toString();
  public max = new Date(this.date_now);

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => {
      console.log("****************************", file.file.name.split(".")[1]);
      file.withCredentials = false;
      const format = file.file.name.split(".")[1];
      const name = this.fileName.split(" ").join("_");
      const newName = name + "." + format;
      console.log("new name.............", newName);
      file.file.name = newName;
      //const newStuff = this.datasetName.split(' ').join('_');
      //this.uploadName = newStuff + '.zip';
      // this.fileName += file.file.name + ",";

      // this.uploadFileNames.push(this.uploadName);
      // console.log(this.uploadFileNames);
    };
    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      if (status === 200) {
        console.log("Uploaded:", status, response, headers);
        this.router.navigate(
          ["/annotations/" + "object" + "/" + "miguel" + "/0"],
          { state: { data: JSON.parse(response) } }
        );
        // this.router.navigate(['/objectDetection/img/label'], { state: { data: JSON.parse(response) } });
      } else if (status === 401) {
        this.logout(response);
      } else {
        return throwError(response);
      }
    };
    this.uploader.onProgressItem = (progress: any) => {
      console.log(progress["progress"]);
      if (progress["progress"] == 100) {
        this.showMyMessage3 = undefined;
        this.showMyMessage4 = true;
      }
    };
    this.getDsets("data");
    this.getDsets("class");

    this.getLabels();

    this.facesservices.getCameras().subscribe(
      (res) => {
        console.log("cameras..........", res);
        this.cameras = res;
      },
      (err) => console.log(err)
    );
  }

  logout(response: any) {
    alert(JSON.parse(response).message);
    this.navigationService.isUserLoggedIn.next(false);
    this.navigationService.isUserLoggedIn.next(null);
    this.sessionService.removeItems();
    this.router.navigate(["/auth/login"]);
  }

  getDsets(thing: string) {
    this.annotationsServ.getUnAnnDatasets(thing).subscribe(
      (res) => {
        if (thing == "data") {
          this.datasetsNames = res;
          for (let i = 0; i < this.datasetsNames.length; i++) {
            this.datasetsNames[i]["open"] = false;
            this.datasetsNames[i]["name"] = this.datasetsNames[i]["name"]
              .split("_")
              .join(" ");
          }
        } else if (thing == "class") {
          this.classNames = res;
          for (let i = 0; i < this.classNames.length; i++) {
            this.classNames[i]["open"] = false;
            this.classNames[i]["name"] = this.classNames[i]["name"]
              .split("_")
              .join(" ");
          }
        }
      },
      (err) => console.log(err)
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
        console.log(res);
        this.newLabel = null;
        this.getLabels();
      },
      (err) => console.log(err)
    );
  }

  go() {
    this.showMyMessage = true;
  }

  @ViewChild("zip", { static: true }) myInputVariable: ElementRef;

  check() {
    // for(let i = 0; i < this.datasetsNames.length; i++){
    //   if(this.fileName == this.datasetsNames[i]){
    //     this.fileName = '!' + this.fileName;
    //   }
    // }
    this.uploader.uploadAll();
    this.myInputVariable.nativeElement.value = null;
    this.fileName = "";
    setTimeout(() => {
      this.getDsets("data");
    }, 2000);
    this.showMyMessage4 = false;
    this.showMyMessage3 = true;
  }

  watch() {
    this.date = this.datepipe.transform(this.date, "yyyy-M-dd");
    if (this.camera != undefined && this.date != undefined) {
      this.showMyWatch = true;
    }
  }

  detect() {
    this.showMyMessage2 = true;
    if (this.datasetName == "") {
      this.showMyMessage2 = false;
    }
  }

  info() {
    console.log(this.datasetsNames);
  }

  showInfo(event) {
    this.fileName = event.target.files[0].name;
    console.log("filename........", this.fileName);
    if (this.fileName.includes(".jpg") || this.fileName.includes(".png")) {
      this.badFile = false;
      console.log(this.badFile);
    } else {
      this.badFile = true;
    }
  }

  change(e) {
    for (let i = 0; i < this.datasetsNames.length; i++) {
      if (e == i) {
        this.datasetsNames[i]["open"] = true;
        this.choosenDataset = this.datasetsNames[i]["name"];
      } else {
        this.datasetsNames[i]["open"] = false;
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

  realGo() {
    if (this.label != undefined) {
      this.router.navigate([
        "/annotations/" + this.label + "/" + this.choosenDataset + "/0",
      ]);
    }
  }

  showMyMessage: boolean = false;
  newLabel: string;

  label: string;
  labels: any = [];
}
