import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthUser } from 'app/core/interfaces/User';
import { AccountService } from 'app/core/services/account.service';
import { take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService: AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
     let currentUser: AuthUser;
     this.accountService.currentUser$.pipe(take(1)).subscribe(user => currentUser = user);
     if (currentUser) {
      //  console.log(currentUser.data.token);
       request = request.clone({
        setHeaders: {
           Authorization: `Bearer ${currentUser.data.token}`
          // Authorization: `Bearer `
        }
      });
     }
     return next.handle(request);
  }
}
