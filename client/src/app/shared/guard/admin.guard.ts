import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "../../shared/services/auth.service";
import { NavigationService } from "../../shared/services/navigation.service";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate{
constructor(
    public authService: AuthService,
    public navigationService: NavigationService,
    public router: Router
  ){ }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | Promise<boolean> | boolean {
      if(this.authService.isAdmin !== true){
        this.navigationService.isUserAdmin.next(false);
        this.authService.permissionString();
        if(this.authService.isLoggedIn !== true) {
          this.router.navigate(['sign-in'])
          this.navigationService.isUserLoggedIn.next(false);
        } else {
          this.router.navigate(['dashboard'])
          this.navigationService.isUserLoggedIn.next(true);
        }
      }
      this.authService.permissionString();
      this.navigationService.isUserAdmin.next(true);
      this.navigationService.isUserLoggedIn.next(true);
      return true;
    }
}
