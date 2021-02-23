import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from "../../shared/services/auth.service";
import { NavigationService } from "../../shared/services/navigation.service";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SecureInnerPagesGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    public navigationService: NavigationService,
    public router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if(this.authService.isLoggedIn) {
      window.alert("You are not allowed to access this URL!");
      this.router.navigate(['dashboard'])
      this.navigationService.isUserLoggedIn.next(true);
      if(this.authService.isAdmin){
          this.navigationService.isUserAdmin.next(true);
        } else {
          this.navigationService.isUserAdmin.next(false);
        }
      this.authService.permissionString();
    }
    this.navigationService.isUserLoggedIn.next(false);
    this.navigationService.isUserAdmin.next(false);
    return true;
  }
}
