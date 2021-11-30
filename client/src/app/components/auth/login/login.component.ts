import { Component, OnInit } from "@angular/core";
import { UserService } from "../../../services/user.service";
import { ActivatedRoute, Router } from "@angular/router";
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
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
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
      this.userService.verificationStatus(this.loginForm.value.email).subscribe(
        (res: any) => {
          this.spin = false;
          if (res.verificationStatus === 0 && res.role !== "ADMIN") {
            this.resendOTP(this.loginForm.value.email);
          } else {
            this.userService
              .login(this.loginForm.value.email, this.loginForm.value.password)
              .subscribe(
                (res: any) => {
                  console.log(res);
                  this.handleNavigation();
                  this.navigationService.isUserLoggedIn.next(true);
                  this.navigationService.userName.next(res.name);
                  const isAdmin = res.role === "ADMIN" ? true : false;
                  this.navigationService.isAdmin.next(isAdmin);
                  this.sessionStorageService.setItems(res);
                },
                (err) => {
                  console.log(err);
                  alert(err.error.message);
                }
              );
          }
        },
        (err) => {
          this.spin = false;
          console.log(err);
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

  resendOTP(email: string) {
    const requestData = {
      email,
    };
    this.userService.resendOtp(requestData).subscribe(
      (res: any) => {
        this.router.navigate(["/auth/verify-otp"], {
          relativeTo: this.activatedRoute,
          queryParams: { email },
        });
        alert(
          `Please verify your registered email, Verification OTP sent to ${email}`
        );
      },
      (err) => {
        console.log(err);
        alert(err.error.message);
      }
    );
  }
}
