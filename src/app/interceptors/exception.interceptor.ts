import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class ExceptionInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error) {
          switch (error.status) {
            case 400:
              if (error.error.errors) {
                const modalStateErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modalStateErrors.push(error.error.errors[key]);
                  }
                }
                // throw modalStateErrors.flat();
                throw modalStateErrors;
              } else if (typeof(error.error) === 'object') {
                // this.toastr.error(error.statusText, error.status);
                console.log(error, error.status);
              } else {
                // this.toastr.error(error.error, error.status);
                console.log(error, error.status);
              }
              break;
            case 401:
              console.log(error, error.status);
              // this.toastr.error(error.statusText, error.status);
              break;
            case 404:
              console.log(error, error.status);
              // this.router.navigateByUrl('/not-found');
              break;
            case 500:
              console.log(error, error.status);
              // const navigationExtras: NavigationExtras = {state: {error: error.error}}
              // this.router.navigateByUrl('/server-error', navigationExtras);
              // show toastr
              break;
            default:
              // show toastr
              console.log(error);
              break;
          }
        }
        return throwError(error);
      })
    );
  }
}
