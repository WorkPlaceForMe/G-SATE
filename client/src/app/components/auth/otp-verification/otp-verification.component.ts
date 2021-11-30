import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxOtpInputConfig } from "ngx-otp-input";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-otp-verification",
  templateUrl: "./otp-verification.component.html",
  styleUrls: ["./otp-verification.component.scss"],
})
export class OtpVerificationComponent implements OnInit {
  spin: boolean = false;
  email: string = "";
  otp: string = "";
  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 5,
    autofocus: true,
    classList: {
      inputBox: "my-super-box-class",
      input: "my-super-class",
      inputFilled: "my-super-filled-class",
      inputDisabled: "my-super-disable-class",
      inputSuccess: "my-super-success-class",
      inputError: "my-super-error-class",
    },
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {
    this.email = this.activatedRoute.snapshot.queryParams.email;
  }

  ngOnInit() {}

  goToSignup() {
    this.router.navigate(["/auth/signup"]);
  }

  handeOtpChange(value: string[]): void {
    if (value.length === 5) {
      this.otp = value.join("");
    }
  }

  handleFillEvent(value: string): void {
    console.log(value);
  }

  verify() {
    if (this.email && this.otp.length === 5) {
      this.spin = true;
      const requestData = {
        email: this.email,
        otp: this.otp,
      };
      this.userService.verifyOtp(requestData).subscribe(
        (res: any) => {
          this.spin = false;
          alert(res.message);
          this.router.navigate(["/auth/login"]);
        },
        (err) => {
          this.spin = false;
          console.log(err);
          alert(err.error.message);
        }
      );
    }
  }

  resendOTP() {
    if (this.email) {
      this.spin = true;
      const requestData = {
        email: this.email,
      };
      this.userService.resendOtp(requestData).subscribe(
        (res: any) => {
          this.spin = false;
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
}
