import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { SessionStorageService } from "../services/session-storage.service";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { NavigationService } from "../shared/services/navigation.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private sessionService: SessionStorageService,
    private navigationService: NavigationService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authInfo = this.sessionService.getItems();

    if (authInfo) {
      request = this.addToken(request, authInfo.accessToken);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.navigationService.isUserLoggedIn.next(false);
          this.navigationService.isUserLoggedIn.next(null);
          this.sessionService.removeItems();
          this.router.navigate(["/auth/login"]);
        } else {
          return throwError(error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        authorization: `Bearer ${token}`,
      },
    });
  }
}
