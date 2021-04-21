import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router
  ) {
  }

  /**
   * This function used for chechk if user logged in or not
   * @param next
   * @param state
   */

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return true;
    // if (this.user_id && this.user_name) {
    //     return true;
    // } else {
    //   this.router.navigate(['/pre-auth/login'], { queryParams: { returnUrl: state.url } });
    //   return false;
    // }
  }
}
