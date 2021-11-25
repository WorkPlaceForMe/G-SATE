import { Component, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { AdminService } from "src/app/services/admin.service";

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
  modalWarning: string = "";

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.spin = true;
    this.adminService.getUsers().subscribe(
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
}
