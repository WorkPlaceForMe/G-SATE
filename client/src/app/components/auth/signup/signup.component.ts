import { Component, OnInit } from "@angular/core";
import { UserService } from "../../../services/user.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  spin: boolean = false;
  name;
  email;
  password;
  mobileNumber;
  address;

  edit: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {}

  signup() {
    if (this.email && this.password) {
      this.spin = true;
      this.userService
        .signup({
          name: this.name,
          mobileNumber: this.mobileNumber,
          address: this.address,
          email: this.email,
          password: this.password,
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
}
