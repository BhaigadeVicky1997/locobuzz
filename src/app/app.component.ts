import { AdvanceFilterService } from './social-inbox/services/advance-filter.service';
import { FilterService } from 'app/social-inbox/services/filter.service';
import { locobuzzAnimations } from './@locobuzz/animations';
import { Component, Inject } from '@angular/core';
import { navigation } from 'app/app-data/navigation';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, ActivationEnd, NavigationEnd, Router, Params, Routes, Route } from '@angular/router';
import { NavigationService } from './core/services/navigation.service';
import { filter, map, take } from 'rxjs/operators';
import { AccountService } from './core/services/account.service';
import { OnInit } from '@angular/core';
import { SignalRHelperService } from './core/services/signal-rhelper.service';
import { AuthUser } from './core/interfaces/User';
import { MenuService } from './core/services/menu.service';
import { Menu } from './core/models/menu/Menu';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: locobuzzAnimations,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'Locobuzz';
  navigation: any;
  guid: string;
  constructor(
    @Inject(DOCUMENT) private document: any,
    private _platform: Platform,
    private _navigationService: NavigationService,
    private _router: Router,
    private _accountService: AccountService,
    private _FilterService: FilterService,
    private _signalRService: SignalRHelperService,
    private _advanceFilterService: AdvanceFilterService,
    private route: ActivatedRoute,
    private _menuService: MenuService
  ) {
    // check authentication
    // take parameter from the route querystring
    // call check current user and store it
    let guidObj;
    guidObj = this.route.snapshot.queryParamMap.get('id');
    // this.guid = '4ce14721-b87e-4b18-8d6d-e44f1cef7c46'; // harcoded for now

    // this._router.events
    // .pipe(
    //   filter(e => (e instanceof ActivationEnd) && (Object.keys(e.snapshot.params).length > 0)),
    //   map(e => e instanceof ActivationEnd ? e.snapshot.params : {})
    // )
    // .subscribe(params => {
    // console.log('route params', params);
    // // Do whatever you want here!!!!
    // });


    // Get default navigation
    this.navigation = navigation;

    this._navigationService.register('main', this.navigation);

    // Set the main navigation as our current navigation
    this._navigationService.setCurrentNavigation('main');

    if (this._platform.ANDROID || this._platform.IOS) {
      this.document.body.classList.add('is-mobile');
    }
  }

  ngOnInit(): void {
    let guidObj;
    let urlstring;
    this.route.queryParams.subscribe((params: Params) => {
      guidObj = params.guid;
      urlstring = params.url;
      console.log(guidObj, urlstring);
    });

    // guidObj = this.route.snapshot.queryParamMap.get('id');
    console.log('current browser url', window.location.href);
    console.log('AppComponent - ngOnInit() -- Snapshot Params: ' + this.route.snapshot.paramMap.get('id'));
    console.log('AppComponent - ngOnInit() -- Snapshot Params: ' + this.route.snapshot.params.id);
    console.log('AppComponent - ngOnInit() -- Snapshot Query Params: ' + this.route.snapshot.queryParams.id);
    console.log('AppComponent - ngOnInit() -- Snapshot Query ParamMap: ' + this.route.snapshot.queryParamMap.get('id'));
    // tslint:disable-next-line: deprecation
    // this._router.events.subscribe(event => {
    //   if (event instanceof ActivationEnd) {
    //     const code = event.snapshot.queryParams['id'];
    //     if (code) {
    //       // handle it...
    //     }
    //   }
    // }
  //   this.route.queryParams.subscribe(params => {
  //     guidObj = params['guid'];
  // });
    if (guidObj)
    {
      this.guid = guidObj;
    }

    if (!this.guid)
    {
      const currentUserObj = localStorage.getItem('user');
      if (currentUserObj)
       {
         const userObj: AuthUser = JSON.parse(currentUserObj);
         this.guid = userObj.data.user.GUID;
       }
    }

    this._accountService.CheckCurrentUser(this.guid).subscribe(response => {
      // this._router.navigateByUrl('/members');
      if (response.success) {
        console.log('Authorized');
        this.setUpRoutingAndFilter(response);
        this._signalRService.createHubConnection();
        //
      } else {
        console.log(response.message);
        // redirect to notauthorized
      }
    }, error => {
      console.log(error);
    }, () => { });

  }

  setUpRoutingAndFilter(response: AuthUser): void
  {
    if (response.data.user.userMenu)
   {
    const userMenu: Menu[] = this._menuService.setMenuByUser(response.data.user.userMenu);

    this._menuService.getRoutes(userMenu).subscribe((data: Routes) => {
      // Updated routes
      console.log(data);
      const defualtRoute: Route = {
        path: '',
        component: AppComponent,
      };
      this._router.resetConfig([defualtRoute, ...data]);
      this._FilterService.populateFilter();
      this._advanceFilterService.populateAdvanceFilter();
      // this._router.navigate([`/${userMenu[0].menuURL}`]);
      this._router.navigate([`/${userMenu[0].menuURL}/${userMenu[0].tabs[0].guid}`]);
    });

   }
  }
}
