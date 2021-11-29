import { Component, OnInit } from "@angular/core";
import { UserService } from "../../../services/user.service";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserRoleName, UserRoleValue } from "src/app/models/User";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  spin: boolean = false;
  show: boolean = false;
  userRoleArray = [
    { name: UserRoleName.branch, value: UserRoleValue.branch },
    { name: UserRoleName.client, value: UserRoleValue.client },
    { name: UserRoleName.user, value: UserRoleValue.user },
  ];
  // showConfirmPassword: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.signupForm = this.fb.group(
      {
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required]],
        name: ["", [Validators.required]],
        mobileNumber: ["", [Validators.pattern(/^[0-9]\d*$/)]],
        address: [""],
        role: ["", [Validators.required]],
        // confirmPassword: [{ value: "", disabled: true }, [Validators.required]],
      }
      //  { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit() {}

  signup() {
    if (this.signupForm.valid) {
      this.spin = true;
      this.userService
        .signup({
          name: this.signupForm.value.name,
          mobileNumber: this.signupForm.value.mobileNumber,
          role: this.signupForm.value.role,
          address: this.signupForm.value.address,
          email: this.signupForm.value.email,
          password: this.signupForm.value.password,
        })
        .subscribe(
          (res) => {
            this.spin = false;
            console.log(res);
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

  showOrHidePassword(type: string) {
    if (type === "show") {
      this.show = !this.show;
    }
    // if (type === "showConfirmPassword") {
    //   this.showConfirmPassword = !this.showConfirmPassword;
    // }
  }

  // passwordMatchValidator(form: FormGroup) {
  //   return form.controls["password"].value ===
  //     form.controls["confirmPassword"].value
  //     ? null
  //     : { mismatch: true };
  // }

  // onPasswordChange(value: string) {
  //   if (value.length > 0) {
  //     this.signupForm.get("confirmPassword").enable();
  //   } else {
  //     this.signupForm.get("confirmPassword").disable();
  //   }
  // }

  // (input)="onPasswordChange($event.target.value)"
}
