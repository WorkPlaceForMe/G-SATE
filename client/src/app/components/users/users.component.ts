import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { AdminService } from "src/app/services/admin.service";
import * as moment from "moment-timezone";
import { UserRoleName } from "src/app/models/User";
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
  showExpired = false;

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

  openModal1(template: TemplateRef<any>, data: any) {
    this.showExpired = false;
    if (data.startDate && data.endDate) {
      const expired = this.checkExpired(data.endDate);
      if (!expired) {
        const dateValue = [
          new Date(moment.utc(data.startDate).format(format)),
          new Date(moment.utc(data.endDate).format(format)),
        ];
        this.bsRangeValue = dateValue;
      } else {
        this.showExpired = true;
      }
    }

    this.modelId = data.id;
    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: "static",
      class: "modal-sm",
    });
  }

  openModal(template: TemplateRef<any>, data: any, modalType?: string) {
    if (modalType === "update") {
      this.showExpired = false;
      if (data.startDate && data.endDate) {
        const expired = this.checkExpired(data.endDate);
        if (!expired) {
          const dateValue = [
            new Date(moment.utc(data.startDate).format(format)),
            new Date(moment.utc(data.endDate).format(format)),
          ];
          this.bsRangeValue = dateValue;
        } else {
          this.showExpired = true;
        }
      }
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

  formatDate(start: string, end: string) {
    const startDate = moment.utc(start).format("YYYY/MM/DD");
    let endDate = moment.utc(end).format("YYYY/MM/DD");
    const expired = this.checkExpired(end);
    if (expired) {
      endDate = endDate + " " + "(Expired)";
    }
    return start && end ? `${startDate}-${endDate}` : "-";
  }

  formatRole(role: string) {
    return UserRoleName[role.toLowerCase()];
  }

  checkExpired(endDate: string) {
    const expired = moment().isAfter(
      new Date(moment.utc(endDate).format(format))
    );
    // console.log(moment().format(format), "current date time");
    // console.log(moment.utc(endDate).format(format), "end date time");

    return expired ? true : false;
  }

  removeAccessibility() {
    this.spin = true;
    this.adminService.removeUserAccessibility(this.modelId).subscribe(
      (res: any) => {
        this.spin = false;
        this.getUsers();
        this.modalRef.hide();
        alert(res.message);
      },
      (err) => {
        this.spin = false;
        console.log(err);
        alert(err.error.message);
      }
    );
  }

  // {{
  //   (row.startDate ? (row.startDate | date: "MM/dd/yyyy") : "") +
  //     "-" +
  //     (row.endDate ? (row.endDate | date: "MM/dd/yyyy") : "")
  // }}
}
