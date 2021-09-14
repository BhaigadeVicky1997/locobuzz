import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthUser } from '../interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.baseUrl;
  public currentUserSource = new ReplaySubject<AuthUser>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  CheckCurrentUser(userId: string): Observable<AuthUser> {
   const userid = userId;

   const currentUserObj = localStorage.getItem('user');
   if (currentUserObj)
    {
      const userObj: AuthUser = JSON.parse(currentUserObj);
      if (userObj.data.user.GUID === userId)
      {
        this.currentUserSource.next(userObj);
        return of(userObj);
      }

    }

   return this.http.get( this.baseUrl + `/Account/GenerateUserToken/${userId}`).pipe(
      map((response: AuthUser) => {
        const authuser = response;
        if (authuser.success) {
          authuser.data.user.GUID = userId;
          this.setCurrentUser(authuser);
        }
        return response;
      })
    );
  }

  setCurrentUser(user: AuthUser): void {
    const obj = {
       username: user.data.user.username,
       userToken: user.data.token
    };
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('userMenu');
    this.currentUserSource.next(null);
    // this._signalRService.stopHubConnection();
  }

}
