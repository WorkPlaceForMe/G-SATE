import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HomeService } from "src/app/services/home.service";
// import { SessionStorageService } from "src/app/services/session-storage.service";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"],
})
export class HomePageComponent implements OnInit, OnDestroy {
  contactsForm: FormGroup;
  spin: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private homeService: HomeService
  ) //  private sessionStorageService: SessionStorageService
  {
    this.contactsForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
      subject: ["", [Validators.required, Validators.minLength(3)]],
      message: ["", [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit() {}

  // goto(page) {
  //   const sessionItems = this.sessionStorageService.getItems();
  //   if (page == "/annotations") {
  //     if (sessionItems) {
  //       this.router.navigate([page]);
  //     } else {
  //       this.router.navigate(["auth/login"]);
  //     }
  //   } else {
  //     this.router.navigate([page]);
  //   }
  // }

  goto(page) {
    this.router.navigate([page]);
  }

  openTab(url) {
    window.open(url, "_blank");
  }

  ngOnDestroy() {}

  onContactSubmit() {
    this.spin = true;
    const contactData = {
      name: this.contactsForm.value.name,
      email: this.contactsForm.value.email,
      subject: this.contactsForm.value.subject,
      message: this.contactsForm.value.message,
    };
    this.contactsForm.reset();
    this.homeService.addToContacts(contactData).subscribe(
      (res: any) => {
        this.spin = false;
        alert(res.message);
      },
      (error) => {
        console.log(error);
        this.spin = false;
        alert(error.message);
      }
    );
  }
}
