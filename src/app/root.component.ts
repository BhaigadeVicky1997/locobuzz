import { Component } from '@angular/core';
import { Route, Router, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthUser } from './core/interfaces/User';
import { Menu } from './core/models/menu/Menu';
import { AccountService } from './core/services/account.service';
import { MenuService } from './core/services/menu.service';
import { SignalRHelperService } from './core/services/signal-rhelper.service';
import { AdvanceFilterService } from './social-inbox/services/advance-filter.service';
import { FilterService } from './social-inbox/services/filter.service';

@Component({
  selector: 'app-mainroot',
  template: `<app-main-loader></app-main-loader><router-outlet></router-outlet>`,
})
export class RootComponent {
  constructor(private _FilterService: FilterService,
              private _advanceFilterService: AdvanceFilterService,
              private _accountService: AccountService,
              private _menuService: MenuService,
              private _signalRService: SignalRHelperService,
              private _router: Router) {

      const currentUserObj = localStorage.getItem('user');
      if (currentUserObj)
       {
         // const userObj: AuthUser = JSON.parse(currentUserObj);
         // this.guid = userObj.data.user.GUID;
         const userObj: AuthUser = JSON.parse(currentUserObj);
         this._accountService.currentUserSource.next(userObj);
         this._signalRService.createHubConnection();

         const currentUserMenus = localStorage.getItem('userMenu');
         const menuObj: Menu[] = JSON.parse(currentUserMenus);

         this._menuService.getRoutes(menuObj).subscribe((data: Routes) => {
          // Updated routes
          console.log(data);
          const defualtRoute: Route = {
            path: '',
            component: AppComponent,
          };
          this._router.resetConfig([defualtRoute, ...data]);
          this._FilterService.populateFilter();
          this._advanceFilterService.populateAdvanceFilter();
          const currenturl = window.location.href;
          if (currenturl)
          {
            const curretUrlObj = currenturl.replace(/^(?:\/\/|[^/]+)*\//, '');
            if (curretUrlObj)
            {
              if (curretUrlObj.indexOf('?') === 0)
              {
                this._router.navigate([`/${menuObj[0].menuURL}/${menuObj[0].tabs[0].guid}`]);
              }
              else
              {
                this._router.navigate([`/${curretUrlObj}`]);
              }

            }
            else
            {
              this._router.navigate([`/${menuObj[0].menuURL}/${menuObj[0].tabs[0].guid}`]);
            }
          }
          else
          {
            this._router.navigate([`/${menuObj[0].menuURL}/${menuObj[0].tabs[0].guid}`]);
          }
        });
       }

   }
}
