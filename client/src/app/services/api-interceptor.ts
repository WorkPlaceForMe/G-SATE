import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
// tslint:disable-next-line: import-blacklist
import 'rxjs/Rx';
import { Router } from '@angular/router';
/**
 * @fileOverview This file is responsible for adding headers
 *  at the time of API calling. Works as an Interceptor.
 * @author TA
*/
@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    counter = 0;
    constructor(
        private route: Router,
    ) { }
    /* istanbul ignore next */
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // tslint:disable-next-line:max-line-length
        return next.handle(req).map((event: HttpEvent<any>) => {
            return event;
        }).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                
            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {

            }
        });
    }
}
