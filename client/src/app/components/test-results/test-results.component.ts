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
  showGraphs: boolean = false;
  testList: Array<any>;
  selectedDataset: any;
  graphData: any;
  rows: any = [];
  columns: any = [];
  loadingIndicator = true;
  reorderable = true;

  public accuracyLineChartData: ChartDataSets[] = [
    {
      data: [],
      label: "Training Accuracy",
      lineTension: 0,
      fill: false,
    },
    {
      data: [],
      label: "Validation Accuracy",
      lineTension: 0,
      fill: false,
    },
  ];
  public lossLineChartData: ChartDataSets[] = [
    {
      data: [],
      label: "Training Loss",
      lineTension: 0,
      fill: false,
    },
    {
      data: [],
      label: "Validation Loss",
      lineTension: 0,
      fill: false,
    },
  ];

  public accuracyLineChartLabels: Label[] = [];
  public lossLineChartLabels: Label[] = [];

  public lineChartLegend = true;
  public lineChartType = "line";

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

  ngOnInit() {
    this.getTrainStatus();
  }

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

  getTrainStatus() {
    this.spin = true;
    this.annotationsServ.getTrainStatus().subscribe(
      (res: any) => {
        this.spin = false;
        const result = [];

        // FOR TESTING
        // res.results.push({
        //   datasetName: "change_rm_conf3",
        //   datasetStatus: "Training Completed",
        // });

        for (const element of res.results) {
          if (element.datasetStatus == "Training Completed") {
            element["enable"] = true;
          } else {
            element["enable"] = false;
          }
          result.push(element);
        }
        this.rows = result;
      },
      (err) => {
        this.spin = false;
        console.log(err);
      }
    );
  }

  onSelectRow(data: any) {
    this.annotationsServ.getModel(data.datasetName).subscribe(
      (res: any) => {
        this.spin = false;
        if (res.success) {
          this.annotationsServ.addToAlgorithm(data.datasetName).subscribe(
            (res: any) => {
              console.log(res);
              if (res.algorithmAdded) {
                alert("Training model will be moved to inferencing engine.");
              } else {
                alert(res.message);
              }
            },
            (error) => {
              console.log(error);
            }
          );
        } else {
          alert(res.error);
        }
      },
      (err) => {
        this.spin = false;
        console.log(err);
      }
    );
  }

  getGraphData() {
    this.accuracyLineChartLabels = [];
    this.lossLineChartLabels = [];
    this.spin = true;
    this.annotationsServ
      .getGraph(this.testList[this.selectedDataset])
      .subscribe(
        (res: any) => {
          debugger;
          this.spin = false;
          this.graphData = res;
          console.log("this.graphData - ", this.graphData);
          this.accuracyLineChartLabels = this.graphData.epoch;
          this.lossLineChartLabels = this.graphData.epoch;
          this.accuracyLineChartData[0].data = this.graphData.training_acc;
          this.accuracyLineChartData[1].data = this.graphData.validation_acc;
          this.lossLineChartData[0].data = this.graphData.training_loss;
          this.lossLineChartData[1].data = this.graphData.validation_loss;
          this.showGraphs = true;
        },
        (err) => {
          this.spin = false;
          this.showGraphs = false;
          console.log(err);
        }
      );
  }

  ngOnDestroy() {}
}
