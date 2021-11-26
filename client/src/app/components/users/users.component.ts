import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { AdminService } from "src/app/services/admin.service";
import * as moment from "moment-timezone";
const format = "YYYY-MM-DD HH:mm:ss";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit {
  spin: boolean = false;
  rows: any = [];
  modalRef: BsModalRef;
  modelId: string = "";
  columns: any = [];
  loadingIndicator = true;
  reorderable = true;
  currentDate = new Date();
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  minDate = new Date();

  constructor(
    private adminService: AdminService,
    private modalService: BsModalService
  ) {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.spin = true;
    this.adminService.getUsers().subscribe(
      (res: any) => {
        this.spin = false;
        this.rows = res;
      },
      (err) => {
        this.spin = false;
        console.log(err);
      }
    );
  }

  openModal(template: TemplateRef<any>, data: any) {
    if (data.startDate && data.endDate) {
      const dateValue = [
        new Date(moment(data.startDate).format(format)),
        new Date(moment(data.endDate).format(format)),
      ];
      this.bsRangeValue = dateValue;
    }
    this.modelId = data.id;
    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: "static",
      class: "modal-sm",
    });
  }

  submit() {
    this.spin = true;
    if (this.bsRangeValue.length === 2) {
      const requestData = {
        startDate: moment(this.bsRangeValue[0]).startOf("day").format(format),
        endDate: moment(this.bsRangeValue[1]).endOf("day").format(format),
      };

      this.adminService
        .updateUserAccessibility(this.modelId, requestData)
        .subscribe(
          (res: any) => {
            this.spin = false;
            this.getUsers();
            this.hideModal();
            alert(res.message);
          },
          (err) => {
            this.spin = false;
            console.log(err);
            alert(err.error.message);
          }
        );
    }
  }

  hideModal() {
    this.modalRef.hide();
    this.bsRangeValue = [this.bsValue, this.maxDate];
  }
}
