import { TakeBreakComponent } from './../../../social-inbox/component/take-break/take-break.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationService } from 'app/core/services/navigation.service';
import { SidebarService } from '../../services/sidebar.service';
import { MainService } from './../../../social-inbox/services/main.service';
import { AccountService } from 'app/core/services/account.service';
import { UserDetailService } from 'app/social-inbox/services/user-details.service';
import { AuthUser } from 'app/core/interfaces/User';
import { take } from 'rxjs/operators';
import * as moment from 'moment';
import { PerformedAction } from 'app/core/enums/PerformedAction';
import { ReplyService } from 'app/social-inbox/services/reply.service';
import { AlertPopupComponent } from 'app/shared/components';
import { AlertDialogModel } from 'app/shared/components/alert-popup/alert-popup.component';
import { UserRoleEnum } from 'app/core/enums/userRoleEnum';

import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-locobuzz-sidebar',
  templateUrl: './locobuzz-sidebar.component.html',
  styleUrls: ['./locobuzz-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class LocobuzzSidebarComponent implements OnInit {
  @Input() pageNavInfoToggle: any;
  @Input() summary: any;
  @Inject(DOCUMENT) private document: any;
  currentUser: AuthUser;
  link1SubMenu: boolean;
  link2SubMenu: boolean;
  sideBarStatus: boolean = false;
  sidebarContent: boolean = true;
  showTakeaBreak: boolean = true;
  timetobreak?: string = '';
  breakinterval: NodeJS.Timeout;
  IsTakeaBreak?: boolean = false;
  selected = 'Eng';
  sideBarMenu: boolean = false;
  themeModeToggle = false;
  // summary;
  constructor(
    private _sidebarService: SidebarService,
    private _mainService: MainService,
    private dialog: MatDialog,
    private _accountService: AccountService,
    private _userDetailService: UserDetailService,
    private _replyService: ReplyService,
    private _navigationService: NavigationService,
    private _router: Router
  ) { }


  ngOnInit(): void {
    this._accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.currentUser = user));
    this.summary = this._mainService.getSummaryData();
    this.sidebarContentNav();
    if (+this.currentUser.data.user.role === UserRoleEnum.AGENT)
    {
      this.IsTakeaBreak = true;
    }
    const breakschedule = localStorage.getItem('currentuserbreakschedule_' + this.currentUser.data.user.userId);
    if (breakschedule === '1') {

      this.BreakCounter();

      this.showTakeaBreak = false;
    }
    else {
      this.showTakeaBreak = true;
      localStorage.removeItem('currentuserbreakschedule_' + this.currentUser.data.user.userId);
      localStorage.removeItem('currentuserbreaktime_' + this.currentUser.data.user.userId);
      localStorage.removeItem('currentuserbreaktype_' + this.currentUser.data.user.userId);
      // localStorage.removeItem('currentuserextendbreak_' + this.currentUser.data.user.userId);
      localStorage.removeItem('currentusershowextendpopup_' + this.currentUser.data.user.userId);
      // this.ngOnDestroy();
    }
  }

  openTakeBreakPopup(): void {
    this.dialog.open(TakeBreakComponent, {
      autoFocus: false,
      width: '550px',
    });
    this._userDetailService.schedulebreak.subscribe(
      (data) => {
        if (data) {
          const isbreakschedule = localStorage.getItem('currentuserbreakschedule_' + this.currentUser.data.user.userId);
          if (data.isscheduled && isbreakschedule === '1') {
            this.showTakeaBreak = false;
            this.BreakCounter();
          }
        }
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // ngOnDestroy(): void {
  //   this._userDetailService.schedulebreak.unsubscribe();
  // }

  toggleSidebar(): void {
    this._sidebarService.toggleSidebar();
  }

  postSummaryEvent(status): void {
    this.sideBarStatus = status;
    console.log(this.sideBarStatus);

  }


  sidebarContentNav(): void {
    if (window.screen.width === 599) {
      this.sidebarContent = true;
    }
  }


  mobileNav(): void {
    if (window.screen.width === 599) {
      this.sidebarContent = true;
      console.log('sidebarContent' + this.sidebarContent);
    }

  }

  logOut(): void {
    this._accountService.logout();
  }

  BreakCounter(): void {

    const breaktype = localStorage.getItem('currentuserbreaktype_' + this.currentUser.data.user.userId);
    // const extendbreak = localStorage.getItem('currentuserextendbreak_' + this.currentUser.data.user.userId);

    this.breakinterval = setInterval(() => {
      const breaktime = new Date(localStorage.getItem('currentuserbreaktime_' + this.currentUser.data.user.userId));
      const showpopup = localStorage.getItem('currentusershowextendpopup_' + this.currentUser.data.user.userId);
      // $("#breakcontainer").css("display", "none");
      const currenttime = new Date();

      const difftime = +breaktime - +currenttime;
      let duration = moment.duration(difftime, 'milliseconds');
      const interval = 1000;
      duration = moment.duration(+duration - interval, 'milliseconds');
      let timetobreak = '';

      if (duration.minutes() < 2 && duration.minutes() > 0) {

        // if (extendbreak !== '1') {

        if (showpopup !== '1') {
          localStorage.setItem('currentusershowextendpopup_' + this.currentUser.data.user.userId, '1');
          this._userDetailService.GetTotalTicketAssignedCount().subscribe((data) => {
            if (data.ticketcount > 0) {
              const dialogData = new AlertDialogModel(
                'Your break will start in ' + this.timetobreak + ' Minutes and your screen will automatically get locked',
                '',
                'Extend by 2 min'
              );
              const dialogRef = this.dialog.open(AlertPopupComponent, {
                disableClose: true,
                autoFocus: false,
                data: dialogData,
              });
              dialogRef.afterClosed().subscribe((dialogResult) => {
                if (dialogResult) {
                  this.ExtendTwoMinBreak();
                } else {
                }
              });
            }
          });
        }


        // }
        if (duration.hours() <= 0 && duration.minutes() > 0 && duration.seconds() >= 0) {
          timetobreak = duration.minutes() + 'm ' + duration.seconds() + 's ';
        }
        else if (duration.hours() <= 0 && duration.minutes() <= 0 && duration.seconds() >= 0) {
          timetobreak = duration.seconds() + 's ';
        }
      }
      else if (duration.hours() <= 0 && duration.minutes() > 0 && duration.seconds() >= 0) {
        timetobreak = duration.minutes() + 'm ' + duration.seconds() + 's ';
      }
      else if (duration.hours() <= 0 && duration.minutes() <= 0 && duration.seconds() >= 0) {
        timetobreak = duration.seconds() + 's ';
      }
      else {
        this.ClearInterval();


        const obj = {
          pageURL: window.location.href,
          typeOfBreak: breaktype
        };
        this._userDetailService.UserIsOnBreakFromCounter(obj).subscribe((data) => {
          localStorage.removeItem('currentuserbreakschedule_' + this.currentUser.data.user.userId);
          localStorage.removeItem('currentuserbreaktime_' + this.currentUser.data.user.userId);
          localStorage.removeItem('currentuserbreaktype_' + this.currentUser.data.user.userId);
          // localStorage.removeItem('currentuserextendbreak_' + this.currentUser.data.user.userId);
          localStorage.removeItem('currentusershowextendpopup_' + this.currentUser.data.user.userId);
          this.showTakeaBreak = true;
          this._router.navigate(['/break-time']);
          // this.ngOnDestroy();
          // $(window).off('beforeunload');
          //         window.location.href = "/ResponseDashboard/OnBreak";
        });

      }
      this.timetobreak = timetobreak;
      //        $("#breaktimecounter").html(timetobreak);
      //      $("#extendtimecounter").html(timetobreak);
    }, 1000);
  }

  CancelBreak(): void {

    this._userDetailService.CancelBreakAndStartAssignment().subscribe((data) => {
      this.showTakeaBreak = true;
      localStorage.removeItem('currentuserbreakschedule_' + this.currentUser.data.user.userId);
      localStorage.removeItem('currentuserbreaktime_' + this.currentUser.data.user.userId);
      localStorage.removeItem('currentuserbreaktype_' + this.currentUser.data.user.userId);
      // localStorage.removeItem('currentuserextendbreak_' + this.currentUser.data.user.userId);
      localStorage.removeItem('currentusershowextendpopup_' + this.currentUser.data.user.userId);
      this.ClearInterval();
      // this.ngOnDestroy();
    });
  }

  ExtendTwoMinBreak(): void {
    const currentuserbreakschedule = localStorage.getItem('currentuserbreakschedule_' + this.currentUser.data.user.userId);
    if (currentuserbreakschedule === '1') {
      const currentuserbreaktime =
        new Date(localStorage.getItem('currentuserbreaktime_' + this.currentUser.data.user.userId));

      currentuserbreaktime.setMinutes(currentuserbreaktime.getMinutes() + 2);
      localStorage.setItem('currentuserbreaktime_' + this.currentUser.data.user.userId, currentuserbreaktime.toString());
      localStorage.setItem('currentusershowextendpopup_' + this.currentUser.data.user.userId, '0');
    }
    this.ClearInterval();
    this.BreakCounter();
  }




  themeModeChange(): void{
    // console.log("toggle");
    // console.log(this.themeModeToggle = !this.themeModeToggle);
    if (this.themeModeToggle === !this.themeModeToggle) {
      this.document.body.classList.add('darkMode');
      this.document.body.classList.remove('theme-default');
    } else {
      this.document.body.classList.remove('darkMode');
      this.document.body.classList.add('theme-default');
    }
  }

  ClearInterval(): void
  {
    clearInterval(this.breakinterval);
    this.breakinterval = new NodeJS.Timeout();
  }

}
