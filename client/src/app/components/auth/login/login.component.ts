import { Component, OnInit } from "@angular/core";
import { UserService } from "../../../services/user.service";
import { Router } from "@angular/router";
import { NavigationService } from "src/app/shared/services/navigation.service";
import { SessionStorageService } from "src/app/services/session-storage.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  spin: boolean = false;
  email;
  password;

  constructor(
    private userService: UserService,
    private navigationService: NavigationService,
    private router: Router,
    private sessionStorageService: SessionStorageService
  ) {}

  ngOnInit() {}

  login() {
    if (this.email && this.password) {
      this.spin = true;
      this.userService.login(this.email, this.password).subscribe(
        (res: any) => {
          this.spin = false;
          this.router.navigate(["/home"]);
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
}
