import { Component, OnInit } from "@angular/core";
import { UserService } from "../../../services/user.service";
import { Router } from "@angular/router";
import { NavigationService } from "src/app/shared/services/navigation.service";
import { SessionStorageService } from "src/app/services/session-storage.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  spin: boolean = false;
  show: boolean = false;

  constructor(
    private userService: UserService,
    private navigationService: NavigationService,
    private router: Router,
    private sessionStorageService: SessionStorageService,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
  }

  ngOnInit() {}

  onLoginSubmit() {
    if (this.loginForm.valid) {
      this.spin = true;
      this.userService
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe(
          (res: any) => {
            console.log(res);
            this.spin = false;
            // this.router.navigate(["/home"]);
            this.handleNavigation();
            this.navigationService.isUserLoggedIn.next(true);
            this.navigationService.userName.next(res.name);
            this.sessionStorageService.setItems(res);
          },
          (err) => {
            console.log(err);
            this.spin = false;
            alert(err.error.message);
          }
        );
    }
  }

  goToSignup() {
    this.router.navigate(["/auth/signup"]);
  }

  showOrHidePassword() {
    this.show = !this.show;
  }

  handleNavigation() {
    const queryParams = this.router.parseUrl(this.router.url).queryParams;
    if (queryParams.hasOwnProperty("ref")) {
      const ref = queryParams.ref.split(",").join("/");
      this.router.navigate([`/${ref}`]);
    } else {
      this.router.navigate(["/home"]);
    }
  }
}
