import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AnnotationsService } from "../../../services/annotations.service";
import { Customer } from "src/app/models/Customer";
import { v4 as uuid } from "uuid";
import * as moment from "moment-timezone";

@Component({
  selector: "app-annotations-details",
  templateUrl: "./annotations-details.component.html",
  styleUrls: ["./annotations-details.component.scss"],
})
export class AnnotationsDetailsComponent implements OnInit {
  payloadType: string;
  datasetName: string;
  emailAddress: string;
  date: any;
  data: any;
  model: string;
  overfit_mode: string;
  models: any = [];
  versions: any = [];
  customerData: Customer = {
    id: "",
    datasetName: null,
    emailAddress: null,
    date: null,
    model: null,
    overfit_mode: null,
    version: null,
    data: null,
  };
  public date_now = new Date(Date.now()).toString();
  public min = new Date(this.date_now);
  spin: boolean = false;
  constructor(
    private router: Router,
    private annotationsServ: AnnotationsService
  ) {
    this.data = this.router.getCurrentNavigation().extras.state.data;
    this.annotationsServ.getModels().subscribe(
      (res) => {
        this.models = res;
      },
      (err) => console.log(err)
    );
  }

  getModel() {
    console.log("model - ", this.model);
  }

  ngOnInit() {
    debugger;
    this.datasetName = this.data.datasetName;
    this.payloadType = this.data.payloadType;
    delete this.data["datasetName"];
    delete this.data["payloadType"];
  }

  isFormFilled() {
    let isEmailFilled: boolean =
      this.emailAddress !== undefined &&
      this.emailAddress !== "" &&
      this.ValidateEmail(this.emailAddress);
    let isDateTimeFilled: boolean = this.date !== undefined;
    let isModelFilled: boolean = this.model !== undefined;
    let isOverfitModeFilled: boolean = this.overfit_mode !== undefined;
    if (this.model == "Face Recognition") {
      return isEmailFilled && isModelFilled;
    } else {
      return (
        isDateTimeFilled &&
        isEmailFilled &&
        isModelFilled &&
        isOverfitModeFilled
      );
    }
  }

  ValidateEmail(mail) {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        mail
      )
    ) {
      return true;
    }
    return false;
  }

  train() {
    this.spin = true;
    this.annotationsServ.datasetName = this.datasetName;
    this.annotationsServ.emailAddress = this.emailAddress;
    this.annotationsServ.date = new Date(this.date).toUTCString();
    this.annotationsServ.model = this.model;
    this.annotationsServ.overfit_mode = this.overfit_mode;
    console.log("this.annotationsServ - ", this.annotationsServ);
    console.log("this.data - ", this.data);
    console.log("this.payloadType - ", this.payloadType);
    this.prepareCustomerData();
    if (this.payloadType === "image") {
      this.sendSingleImageAnnotations();
    } else {
      this.datasetAnnotations();
    }
  }

  prepareCustomerData() {
    this.customerData.data = this.data;
    this.customerData.datasetName = this.annotationsServ.datasetName;
    this.customerData.emailAddress = this.annotationsServ.emailAddress;
    this.customerData.date = this.annotationsServ.date;
    this.customerData.version = this.annotationsServ.version;
    this.customerData.model = this.annotationsServ.model;
    this.customerData.overfit_mode = this.annotationsServ.overfit_mode;
    this.customerData.id = uuid();
  }

  sendSingleImageAnnotations() {
    console.log(
      "sendSingleImageAnnotations Req - ",
      JSON.stringify(this.customerData)
    );
    this.annotationsServ.saveCustomerDetails(this.customerData).subscribe(
      (res) => {
        console.log(
          "sendSingleImageAnnotations Response - ",
          JSON.stringify(res)
        );
        this.sendPayloadToTrain(res);
      },
      (err) => {
        console.log(err);
        this.spin = false;
      }
    );
  }

  datasetAnnotations() {
    console.log("datasetAnnotations Req - ", JSON.stringify(this.customerData));
    this.annotationsServ
      .saveObjectDetectionDetails(this.customerData)
      .subscribe(
        (res) => {
          console.log("datasetAnnotations Response - ", JSON.stringify(res));
          this.sendPayloadToTrain(res);
        },
        (err) => {
          console.log(err);
          this.spin = false;
        }
      );
  }

  sendPayloadToTrain(data) {
    if (this.model == "Face Recognition") {
      this.annotationsServ.trainScriptForFR(data).subscribe(
        (res: any) => {
          this.spin = false;
          alert(
            "The faces for " +
              res.datasetName +
              " have been added for inferencing"
          );
          this.router.navigate(["/annotations"]);
        },
        (err) => {
          console.log(err);
          alert("There have some problem to do this action");
          this.spin = false;
        }
      );
    } else {
      this.annotationsServ.trainScript(data).subscribe(
        (res: any) => {
          this.spin = false;
          console.log("sendPayloadToTrain Response - ", res);
          var now = moment(res.date).format("DD/MM/YYYY h:mm A");
          alert("Your training has been saved. It will start on " + now);
          this.router.navigate(["/annotations"]);
        },
        (err) => {
          console.log(err);
          alert("There have some problem to do this action");
          this.spin = false;
        }
      );
    }
  }
}
