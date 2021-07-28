import { DatePipe } from "@angular/common";
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";
import { ChartDataSets, ChartOptions } from "chart.js";
import { Label, Color } from "ng2-charts";
import { AnnotationsService } from "src/app/services/annotations.service";
import { FacesService } from "src/app/services/faces.service";
import { PagerService } from "src/app/services/pager.service";

@Component({
  selector: "app-test-results",
  templateUrl: "./test-results.component.html",
  styleUrls: ["./test-results.component.scss"],
})
export class TestResultComponent implements OnInit, OnDestroy {
  spin: boolean = false;
  testList: Array<any>;
  selectedDataset: any;
  graphData: any;

  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = {};
  public lineChartColors: Color[] = [
    {
      borderColor: "black",
      backgroundColor: "rgba(255,0,0,0.3)",
    },
  ];
  public lineChartLegend = true;
  public lineChartType = "line";
  public lineChartPlugins = [];

  constructor(
    private router: Router,
    private annotationsServ: AnnotationsService,
    private facesservices: FacesService,
    private datepipe: DatePipe,
    private pagerService: PagerService,
    private cdref: ChangeDetectorRef
  ) {
    this.selectedDataset = "";
    this.testList = [];
    this.getTestResults();
  }

  ngOnInit() {}

  getTestResults() {
    this.spin = true;
    this.annotationsServ.getTestList().subscribe(
      (res: any) => {
        this.spin = false;
        this.testList = res.data;
        console.log("this.testList - ", this.testList);
      },
      (err) => {
        this.spin = false;
        console.log(err);
      }
    );
  }

  getGraphData() {
    this.spin = true;
    this.annotationsServ
      .getGraph(this.testList[this.selectedDataset])
      .subscribe(
        (res: any) => {
          this.spin = false;
          this.graphData = res;
          console.log("this.graphData - ", this.graphData);
          this.lineChartLabels.push(this.graphData.epoch);
          let training_acc = {
            data: this.graphData.training_acc,
            label: "Training Accuracy",
            lineTension: 0,
            fill: false,
          }
          let training_loss = {
            data: this.graphData.training_loss,
            label: "Training Loss",
            lineTension: 0,
            fill: false,
          }
          this.lineChartData.push(training_acc);
          this.lineChartData.push(training_loss);

          let validation_acc = {
            data: this.graphData.validation_acc,
            label: "Validation Accuracy",
            lineTension: 0,
            fill: false,
          }
          let validation_loss = {
            data: this.graphData.validation_loss,
            label: "Validation Loss",
            lineTension: 0,
            fill: false,
          }
        },
        (err) => {
          this.spin = false;
          console.log(err);
        }
      );
  }

  ngOnDestroy() {}
}
