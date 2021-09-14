import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthUser } from 'app/core/interfaces/User';
import { AccountService } from 'app/core/services/account.service';
import { UserDetailService } from 'app/social-inbox/services/user-details.service';
import * as moment from 'moment';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-take-break',
  templateUrl: './take-break.component.html',
  styleUrls: ['./take-break.component.scss']
})
export class TakeBreakComponent implements OnInit {
  isAutoAssignmentDisabled: boolean;
  currentUser: AuthUser;
  isScheduled?: boolean = false;
  isScheduleButton?: boolean = false;
  typeofBreak?: string = 'Tea Break';
  timeofBreak?: string = '0';

  constructor(
    private _userDetailService: UserDetailService,
    private _accountService: AccountService,
    private _takeabreakDialog: MatDialogRef<TakeBreakComponent>,
    private _router: Router
    ) { }

  ngOnInit(): void {
    this._accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.currentUser = user));
    this.GetUserAssigmentDetails();
  }

  GetUserAssigmentDetails(): void {
    this._userDetailService.getUserAssigmentDetails().subscribe((data) => {
      if (this.currentUser.data.user.isScheduledBreakApplicable
        && this.currentUser.data.user.isScheduledBreakEnabled) {
        this.isScheduled = true;
        if (this.timeofBreak === '0') {
          this.isScheduleButton = false;
        }
        else {
          this.isScheduleButton = true;
        }
      }
      else {
        this.isScheduled = false;
        this.isScheduleButton = false;
      }

      if (data.isUserAssignmentDisabled === 0) {
        this.isAutoAssignmentDisabled = false;
      }
      else {
        this.isAutoAssignmentDisabled = true;
      }
    });
  }

  scheduledbreak(): void {

    const obj = {
      typeofBreak: this.typeofBreak,
      timeofBreak: this.timeofBreak,
      isscheduled: true
    };

    const scheduletime = this.timeofBreak;
    const breaktype = this.typeofBreak;
    const breaktime = new Date();
    breaktime.setMinutes(breaktime.getMinutes() + +scheduletime);
    const currentuserbreakschedule = localStorage.getItem('currentuserbreakschedule_' + this.currentUser.data.user.userId);
    if (!currentuserbreakschedule) {
      localStorage.setItem('currentuserbreakschedule_' + this.currentUser.data.user.userId, '1');
    }

    const currentuserbreaktime = localStorage.getItem('currentuserbreaktime_' + this.currentUser.data.user.userId);
    if (!currentuserbreaktime) {
      localStorage.setItem('currentuserbreaktime_' + this.currentUser.data.user.userId, breaktime.toString());
    }

    const currentuserbreaktype = localStorage.getItem('currentuserbreaktype_' + this.currentUser.data.user.userId);
    if (!currentuserbreaktype) {
      localStorage.setItem('currentuserbreaktype_' + this.currentUser.data.user.userId, breaktype);
    }




    this._userDetailService.ScheduleBreakAndPauseAssignment().subscribe((data) => {
      this._takeabreakDialog.close();
      this._userDetailService.schedulebreaksubmit(obj);
    });
  }

  ScheduleBreaktime(): void {
    if (this.timeofBreak !== '0') {
      this.GetUserAssigmentDetails();
    }
    else {
      this.isScheduleButton = false;
    }
  }

  Goforbreak(): void {
    const obj = {
      pageURL: window.location.href,
      typeOfBreak: this.typeofBreak
    };


    this._userDetailService.UserIsOnBreak(obj).subscribe((data) => {
      this._takeabreakDialog.close();
      this._router.navigate(['/break-time']);
    });
  }

}
