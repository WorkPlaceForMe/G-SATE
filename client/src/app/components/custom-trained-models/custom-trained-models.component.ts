import { Component, OnInit, TemplateRef } from "@angular/core";
import { AnnotationsService } from "src/app/services/annotations.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { NavigationService } from "src/app/shared/services/navigation.service";

@Component({
  selector: "app-custom-trained-models",
  templateUrl: "./custom-trained-models.component.html",
  styleUrls: ["./custom-trained-models.component.scss"],
})
export class CustomTrainedModelsComponent implements OnInit {
  spin: boolean = false;
  rows: any = [];
  modalRef: BsModalRef;
  modelId: string = "";
  columns: any = [];
  loadingIndicator = true;
  reorderable = true;
  modalWarning: string = "";
  isAdmin: boolean = false;

  constructor(
    private annotationsServ: AnnotationsService,
    private modalService: BsModalService,
    private navigationService: NavigationService
  ) {
    this.navigationService.isAdmin.subscribe((value) => {
      this.isAdmin = value;
    });
  }

  ngOnInit() {
    this.getCustomTrainedModels();
  }

  getCustomTrainedModels() {
    this.spin = true;
    this.annotationsServ.getCustomTrainedModels().subscribe(
      (res: any) => {
        this.spin = false;
        this.rows = res;
        console.log(this.rows);
      },
      (err) => {
        this.spin = false;
        console.log(err);
      }
    );
  }

  deleteModel() {
    this.spin = true;
    this.modalRef.hide();
    console.log(this.modelId);
    this.annotationsServ.deleteCustomAlgorithm(this.modelId).subscribe(
      (res: any) => {
        this.spin = false;
        this.getCustomTrainedModels();
        console.log(res);
        alert(res.message);
      },
      (err) => {
        this.spin = false;
        console.log(err);
        alert("Not able to delete the algorithm.");
      }
    );
  }

  openModal(template: TemplateRef<any>, data: any) {
    this.modelId = data.id;
    this.modalWarning = `Are you sure to delete ${data.name} model?`;
    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: "static",
      class: "modal-sm modal-dialog-centered",
    });
  }
}
