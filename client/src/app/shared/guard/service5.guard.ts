import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from "../../shared/services/auth.service";
import { NavigationService } from "../../shared/services/navigation.service";
import { Observable } from 'rxjs';

@Injectable({
providedIn: 'root'
})
export class Service5Guard implements CanActivate {
constructor(
    public authService: AuthService,
    public navigationService: NavigationService,
    public router: Router
  ){ }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | Promise<boolean> | boolean {
      const service5 = JSON.parse(localStorage.getItem('service5'));
      if(this.authService.isLoggedIn !== true) {
        this.router.navigate(['sign-in'])
        this.navigationService.isUserLoggedIn.next(false);
        this.navigationService.isUserAdmin.next(false);
      }
      if(this.authService.isAdmin){
          this.navigationService.isUserAdmin.next(true);
        } else {
          this.navigationService.isUserAdmin.next(false);
        }
      this.navigationService.isUserLoggedIn.next(true);
      if(service5 === false) {
        this.router.navigate(['dashboard']);
        if(this.authService.isAdmin){
          this.navigationService.isUserAdmin.next(true);
        } else {
          this.navigationService.isUserAdmin.next(false);
        }
        this.navigationService.isUserLoggedIn.next(true);
      }
      return true;
    }
}

