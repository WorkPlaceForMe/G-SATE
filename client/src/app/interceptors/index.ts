import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ApikeyInterceptor } from "./apikey.interceptor";
import { AuthInterceptor } from "./auth.interceptor";

export const InterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ApikeyInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
