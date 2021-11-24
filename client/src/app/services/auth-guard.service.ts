import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, Router } from "@angular/router";
import { SessionStorageService } from "./session-storage.service";

@Injectable({ providedIn: "root" })
export class AuthGuardService implements CanActivate {
  constructor(
    private sessionService: SessionStorageService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const refPath = route.url.join();
    const authInfo = this.sessionService.getItems();

    if (!authInfo) {
      this.router.navigate([`/auth/login`], { queryParams: { ref: refPath } });
      return false;
    }
    return true;
  }
}
