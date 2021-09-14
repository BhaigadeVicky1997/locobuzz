import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUser } from 'app/core/interfaces/User';
import { AccountService } from 'app/core/services/account.service';
import { UserDetailService } from 'app/social-inbox/services/user-details.service';
import { Subscription, interval } from 'rxjs';
import { take } from 'rxjs/internal/operators/take';

@Component({
  selector: 'app-break',
  templateUrl: './break.component.html',
  styleUrls: ['./break.component.scss']
})
export class BreakComponent implements OnInit {
  interval;
  currentUser: AuthUser;
  time = new Date();
  currenttime: any;
  oldBreakTime: any;
  username: string;
  constructor(
    private _router: Router,
    private _userDetailService: UserDetailService,
    private _accountService: AccountService) { }

  // private subscription: Subscription;

  public dDay = new Date();
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;

  public timeDifference;
  public secondsToDday;
  public minutesToDday;
  public hoursToDday;


  getTimeDifference(): void {
    this.timeDifference = new Date().getTime() - this.dDay.getTime();
    this.allocateTimeUnits(this.timeDifference);
  }



  allocateTimeUnits(timeDifference): string {
    this.hoursToDday = Math.floor((timeDifference) /
      (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
    this.minutesToDday = Math.floor((timeDifference) /
      (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
    this.secondsToDday = Math.floor((timeDifference) /
      (this.milliSecondsInASecond) % this.SecondsInAMinute);

    const currenttime = ('00' + this.hoursToDday).slice(-2)
      + ':' + ('00' + this.minutesToDday).slice(-2) + ':' + ('00' + (this.secondsToDday)).slice(-2);
    // console.log(currenttime);
    this.hoursToDday = ('00' + this.hoursToDday).slice(-2);
    this.minutesToDday = ('00' + this.minutesToDday).slice(-2);
    this.secondsToDday = ('00' + (this.secondsToDday)).slice(-2);
    return currenttime;
  }



  ngOnInit(): void {
    this._accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.currentUser = user));
    this.username = this.currentUser.data.user.firstName + ' ' + this.currentUser.data.user.lastName;

    const a = setInterval(() => {
      this.getTimeDifference();
    }, 1000);
    // this.subscription = interval(1000)
    //   .subscribe(x => { this.getTimeDifference(); });

  }

  endBreak(password: string): void {
    const obj = {
      password
    };

    this._userDetailService.BreakEnding(obj).subscribe((data) => {
      if (data) {
        if (data.BreakEnded) {
          this._router.navigate(['/social-inbox']);
        }
      }
    });

  }

  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }

}
