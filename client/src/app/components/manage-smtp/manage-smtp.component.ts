import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdminService } from "src/app/services/admin.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

@Component({
  selector: "app-manage-smtp",
  templateUrl: "./manage-smtp.component.html",
  styleUrls: ["./manage-smtp.component.scss"],
})
export class ManageSMTPComponent implements OnInit {
  manageSMTPForm: FormGroup;
  spin: boolean = false;
  show: boolean = false;
  rows: any = [];
  modalRef: BsModalRef;
  modelId: string = "";
  columns: any = [];
  loadingIndicator = true;
  reorderable = true;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private modalService: BsModalService
  ) {
    this.initializeReactiveFrom();
  }

  ngOnInit() {
    this.getSMTPDetails();
  }

  initializeReactiveFrom(email?: string, password?: string) {
    this.manageSMTPForm = this.fb.group({
      email: [email || "", [Validators.required, Validators.email]],
      password: [password || "", [Validators.required]],
    });
  }

  smtpDetailsSubmit() {
    if (this.manageSMTPForm.valid) {
      this.spin = true;
      this.adminService
        .updateSMTPDetails({
          email: this.manageSMTPForm.value.email,
          password: this.manageSMTPForm.value.password,
        })
        .subscribe(
          (res: any) => {
            this.spin = false;
            this.modalRef.hide();
            this.getSMTPDetails();
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

  showOrHidePassword() {
    this.show = !this.show;
  }

  getSMTPDetails() {
    this.spin = true;
    this.adminService.getSMTPDetails().subscribe(
      (res: any) => {
        this.spin = false;
        if (res.email && res.password) {
          this.manageSMTPForm.setValue({
            email: res.email,
            password: res.password,
          });
          this.rows = [res];
        }
      },
      (err) => {
        console.log(err);
        this.spin = false;
        alert(err.error.message);
      }
    );
  }

  openModal(template: TemplateRef<any>) {
    const initializedData = {
      email:
        this.rows && this.rows.length === 1 && this.rows[0].email
          ? this.rows[0].email
          : "",
      password:
        this.rows && this.rows.length === 1 && this.rows[0].password
          ? this.rows[0].password
          : "",
    };

    this.initializeReactiveFrom(
      initializedData.email,
      initializedData.password
    );

    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: "static",
      class: "modal-dialog-centered",
    });
  }
}
