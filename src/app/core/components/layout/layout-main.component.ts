import { locobuzzAnimations } from '@locobuzz/animations';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { NavigationService } from '../../services/navigation.service';
import { SidebarService } from '../../services/sidebar.service';
import { NavigationEnd, Router } from '@angular/router';
import { navigation } from 'app/app-data/navigation';
import { FilterService } from 'app/social-inbox/services/filter.service';
import { MainService } from 'app/social-inbox/services/main.service';
import { AccountService } from 'app/core/services/account.service';
import { AuthUser } from 'app/core/interfaces/User';
import { UserRoleEnum } from 'app/core/enums/userRoleEnum';
import { BrandList } from 'app/shared/components/filter/filter-models/brandlist.model';
import * as moment from 'moment';

@Component({
  selector: 'app-layout-main',
  templateUrl: './layout-main.component.html',
  styleUrls: ['./layout-main.component.scss'],
  animations: locobuzzAnimations,
  encapsulation: ViewEncapsulation.None
})
export class LayoutMainComponent implements OnInit {

  private _unsubscribeAll: Subject<any>;
  sidebarToggleBool: boolean = false;
  notificationToggle: boolean = true;
  currentUser: AuthUser;
  userRole: UserRoleEnum;
  brandList: BrandList[];
  ticketAbouttoBreach: number;
  showbreachnotification: boolean = false;
  constructor(
    private _navigationService: NavigationService,
    private _sidebarService: SidebarService,
    private _router: Router,
    private _filterService: FilterService,
    private mainService: MainService,
    private accountService: AccountService
  ) {

    // Set the defaults
    this._unsubscribeAll = new Subject();
  }
  navigation: any;
  showPageData: boolean = true;
  currentUrl: string;

  ngOnInit(): void {
    this._filterService.currentBrandListFirstCall.subscribe(
      (value) => {
        if (value) {
          this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.currentUser = user);
          this.userRole = this.currentUser.data.user.role;
          this.brandList = this._filterService.fetchedBrandData;
          if (this.brandList) {
            const currentBrandObj = this.brandList.filter((obj) => {
              return obj.isSLAFLRBreachEnable === true;
            });
            if (currentBrandObj.length > 0) {
              if (this.userRole === UserRoleEnum.AGENT
                || this.userRole === UserRoleEnum.SupervisorAgent
                || this.userRole === UserRoleEnum.TeamLead) {
                this.getAboutToBreachCount();
              }
            }
          }
        }
      }
    );

    this._sidebarService.onsidebarToggle.subscribe((toggle) => {
      this.sidebarToggleBool = toggle;
     // console.log("sidebarToggleBool " + this.sidebarToggleBool);
      if (window.screen.width === 768) {
        this.sidebarToggleBool = true;
        //console.log("sidebarToggleBool " + this.sidebarToggleBool);
      }
    });

    // this._navigationService.onNavigationChanged
    //   .pipe(
    //     filter(value => value !== null),
    //     takeUntil(this._unsubscribeAll)
    //   )
    //   .subscribe(() => {
    //     this.navigation = this._navigationService.getCurrentNavigation();
    //   });

    if (this._router.url.includes('social-inbox')) {
      this.showPageData = true;
    }

    // this._router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     this._navigationService.getNavigationData(event.url);
    //     this.currentUrl = event.urlAfterRedirects;
    //     if (this._router.url === '/social-inbox') {
    //       this.showPageData = true;
    //     }
    //     else {
    //       this.showPageData = false;
    //     }
    //   }
    // });
  }

  hideNotification(status): void {
    this.notificationToggle = status;
  }

  getAboutToBreachCount(): void {
    setInterval(() => {
      const filterObj = this._filterService.getGenericFilter();
      filterObj.startDateEpoch = moment().startOf('day').utc().unix();
      filterObj.endDateEpoch = moment().endOf('day').utc().unix();

      this.mainService.getTicketsAboutToBreach(filterObj).subscribe((data) => {
        this.ticketAbouttoBreach = +data.data;
        if (this.ticketAbouttoBreach > 0) {
          this.showbreachnotification = true;
        }
        else{
          this.showbreachnotification = false;
        }
      });
    }, 60000);
  }




}
