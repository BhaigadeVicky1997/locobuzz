import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router, Routes } from '@angular/router';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Menu, MenuResponse, Tab, TabResponse, TabResponseArray } from '../models/menu/Menu';
import * as CoreComponents from '../components/index';
import * as sharedComponents from 'app/shared/components/index';
import { NavigationService } from './navigation.service';
import { DefaultTabs, LocobuzzNavigation, LocobuzzNavigationItem } from '../interfaces/locobuzz-navigation';
import { ParentrouteresolverService } from './parentrouteresolver.service';
import { TabStatus } from '../enums/TabStatusEnum';
import { BreakComponent } from 'app/social-inbox/component/break/break.component';
import { SocialInboxModule } from 'app/social-inbox/social-inbox.module';


@Injectable({
  providedIn: 'root',
})
export class MenuService {
  baseUrl = environment.baseUrl;
  fetchedTabList: Tab[] = [];

  constructor(private http: HttpClient, private _router: Router,
              private _navigation: NavigationService) {}

  GetMenuByToken(userId: string): Observable<Menu[]> {
    const userid = userId;
    return this.http.post(this.baseUrl + `/Account/GetMenu`, {}).pipe(
      map((response: MenuResponse) => {
        if (response.success) {
          this.setMenuByUser(response.data);
          return response.data;
        }
      })
    );
  }

  setMenuByUser(userMenu: Menu[]): Menu[] {
    if (userMenu.length > 0) {
      // sort menus by order
      userMenu.sort(this.compareByInt);
      // sort by ispinned
      // userMenu.sort(this.compareByBoolean);

      // loop through each menus
      for (const menu of userMenu) {
        // sort menus by order
        menu.tabs.sort(this.compareByInt);
        // sort by ispinned
        // menu.tabs.sort(this.compareByBoolean);
      }
      this.getRoutes(userMenu);
    }
    localStorage.setItem('userMenu', JSON.stringify(userMenu));
    return userMenu;
  }

  compareByInt(a, b): number {
    const bandA = a.sortOrder;
    const bandB = b.sortOrder;

    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }

  compareByBoolean(x, y): any {
    // true values first
    return x.isPinned === y.isPinned ? 0 : x.isPinned ? -1 : 1;
    // false values first
    // return (x === y)? 0 : x? 1 : -1;
  }

  getRoutes(usermenu: Menu[]): Observable<Routes> {
    const aapRoutes: Routes = [];

    for (const menu of usermenu) {
      if (menu.menuURL === 'social-inbox') {
        const basesocialRoute: Route = {
          path: 'social-inbox',
          component: CoreComponents.LayoutMainComponent,
          resolve: { resolvedData: ParentrouteresolverService },
          loadChildren: () =>
            import('app/social-inbox/social-inbox.module').then(
              (m) => m.SocialInboxModule
            ),
        };
        aapRoutes.push(basesocialRoute);


        const socialRoute: Route = {
          path: 'social-inbox/:guid',
          component: CoreComponents.LayoutMainComponent,
          resolve: { resolvedData: ParentrouteresolverService },
          loadChildren: () =>
            import('app/social-inbox/social-inbox.module').then(
              (m) => m.SocialInboxModule
            ),
        };
        aapRoutes.push(socialRoute);

        // add menu to navigation with defaultTabs
        const locobuzzNavigationItem: LocobuzzNavigationItem = {};
        const defaulttabs: Tab[] = [];
        const savedTabs: Tab[] = [];
        // tslint:disable-next-line: prefer-for-of
        for (const tab of menu.tabs)
        {
            const defaultTab: Tab = tab;
            defaultTab.tabUrl = `${menu.menuURL}/${tab.guid}`;
            if (tab.status !== TabStatus.RemovedTab)
          {
            defaulttabs.push(defaultTab);
          }
            if ((tab.status === TabStatus.Saved && tab.userID !== -1)
            || (tab.status === TabStatus.RemovedTab && !tab.isdeleted))
          {
            savedTabs.push(defaultTab);
          }

        }

        locobuzzNavigationItem.id = menu.menuURL;
        locobuzzNavigationItem.menuid = menu.menuId;
        locobuzzNavigationItem.title = menu.displayName;
        locobuzzNavigationItem.icon = this.getMenuIcon(menu.menuURL);
        locobuzzNavigationItem.url = `/${menu.menuURL}`;
        locobuzzNavigationItem.defaultTabs = defaulttabs;
        locobuzzNavigationItem.savedFilter = savedTabs;
        this._navigation.navigation.push(locobuzzNavigationItem);

      }
      else if (menu.menuURL === 'analytics')
      {
        const baseanalyticsRoute: Route = {
          path: 'analytics',
          component: CoreComponents.LayoutMainComponent,
          resolve: { resolvedData: ParentrouteresolverService },
          loadChildren: () =>
            import('app/analytics/analytics.module').then(
              (m) => m.AnalyticsModule
            ),
        };
        aapRoutes.push(baseanalyticsRoute);


        const analyticRoute: Route = {
          path: 'analytics/:guid',
          component: CoreComponents.LayoutMainComponent,
          resolve: { resolvedData: ParentrouteresolverService },
          loadChildren: () =>
            import('app/analytics/analytics.module').then(
              (m) => m.AnalyticsModule
            ),
        };
        aapRoutes.push(analyticRoute);

        // add menu to navigation with defaultTabs
        const locobuzzNavigationItem: LocobuzzNavigationItem = {};
        const defaulttabs: Tab[] = [];
        const savedTabs: Tab[] = [];
        // tslint:disable-next-line: prefer-for-of
        for (const tab of menu.tabs)
        {
            const defaultTab: Tab = tab;
            defaultTab.tabUrl = `${menu.menuURL}/${tab.guid}`;
            if (tab.status !== TabStatus.RemovedTab)
          {
            defaulttabs.push(defaultTab);
          }
            if ((tab.status === TabStatus.Saved && tab.userID !== -1)
            || (tab.status === TabStatus.RemovedTab && !tab.isdeleted))
          {
            savedTabs.push(defaultTab);
          }

        }

        locobuzzNavigationItem.id = menu.menuURL;
        locobuzzNavigationItem.menuid = menu.menuId;
        locobuzzNavigationItem.title = menu.displayName;
        locobuzzNavigationItem.icon = this.getMenuIcon(menu.menuURL);
        locobuzzNavigationItem.url = `/${menu.menuURL}`;
        locobuzzNavigationItem.defaultTabs = defaulttabs;
        locobuzzNavigationItem.savedFilter = savedTabs;
        this._navigation.navigation.push(locobuzzNavigationItem);

      }
      else{
        const locobuzzNavigationItem: LocobuzzNavigationItem = {};
        locobuzzNavigationItem.id = menu.menuURL;
        locobuzzNavigationItem.menuid = menu.menuId;
        locobuzzNavigationItem.title = menu.displayName;
        locobuzzNavigationItem.icon = this.getMenuIcon(menu.menuURL);
        locobuzzNavigationItem.url = `/${menu.menuURL}`;
        locobuzzNavigationItem.defaultTabs = [];
        locobuzzNavigationItem.savedFilter = [];
        this._navigation.navigation.push(locobuzzNavigationItem);
      }
      // add other menus
    }
    const breakRoute: Route = {
      path: 'break-time',
      component: BreakComponent,
      
    };
    aapRoutes.push(breakRoute);

    const noPageRoute: Route = {
      path: '**',
      component: sharedComponents.NoPageComponent,
    };
    aapRoutes.push(noPageRoute);

    return of(aapRoutes);
  }
  getMenuIcon(menuUrl): string{
    switch (menuUrl)
    {
      case 'dashboard':
        return 'dashboard';
        case 'analytics':
        return 'poll';
        case 'social-inbox':
        return 'inbox';
        case 'email-marketing':
        return 'email';
        case 'calendar':
        return 'calendar_today';
        case 'pr-dashboard':
        return 'poll';
        default:
          return 'inbox';
    }

  }

  getTabJsonByTabId(tab: Tab): Observable<Tab> {
    if (this.fetchedTabList.length > 0)
    {
      const currentTab = this.fetchedTabList.find((obj) => {
        if (obj)
        {
          return obj.menuId === tab.menuId && obj.guid === tab.guid;
        }
      });
      if (currentTab)
      {
         return of(currentTab);
      }
    }

    if (tab.tabId && tab.tabId > 0)
    {
      const tabObj = {
        MenuID: tab.menuId,
        TabID: tab.tabId
      };
      return this.http.post(this.baseUrl + `/Account/GetMenuDetails`, tabObj).pipe(
        map((response: TabResponse) => {
          if (response.success) {
            if (response.data)
            {
              this.fetchedTabList.push(response.data[0]);
              return response.data[0];
            }
          }
        })
      );
    }
    else{
      const tabObj = {
        MenuID: tab.menuId
      };
      return this.http.post(this.baseUrl + `/Account/GetMenuDetails`, tabObj).pipe(
        map((response: TabResponseArray) => {
          if (response.success) {
            const currentTab = response.data.find(obj => obj.menuId === tab.menuId && obj.guid === tab.guid);
            this.fetchedTabList.push(currentTab);
            return currentTab;
          }
        })
      );

    }

  }

}
