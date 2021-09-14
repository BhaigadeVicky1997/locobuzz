import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import * as _ from 'lodash';
// import { navigation } from 'app/app-data/navigation';
import {
  LocobuzzNavigation,
  LocobuzzNavigationItem,
} from '../interfaces/locobuzz-navigation';
import { LocobuzzTab } from '../models/viewmodel/LocobuzzTab';
import { Menu, Tab, TabResponse, TabResponseArray } from '../models/menu/Menu';
import { Router } from '@angular/router';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';
import { TabStatus } from '../enums/TabStatusEnum';
import { TicketFilterTabParametersResponse } from '../models/viewmodel/TicketFilterTabParameters';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AutoRenderSetting } from '../models/viewmodel/AutoRenderSetting';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  // Private
  private _onNavigationChanged: BehaviorSubject<any>;
  private _onNavigationRegistered: BehaviorSubject<any>;
  private _onNavigationSelect: BehaviorSubject<any>;
  _currentNavigation = new BehaviorSubject<string>('tickets');
  loadedNavLinks = [];

  private _currentNavigationKey: string;
  private _registry: { [key: string]: any } = {};
  baseUrl = environment.baseUrl;

  // created for global reference
  navigation: LocobuzzNavigationItem[] = [];
  currentNavigation: LocobuzzNavigationItem = {};

  public tabs: LocobuzzTab[] = [
    // new LocobuzzTab(Comp1Component, "Comp1 View", { parent: "AppComponent" }),
    // new LocobuzzTab(Comp2Component, "Comp2 View", { parent: "AppComponent" })
  ];
  currentSelectedTab: Tab = {};
  fetchedTabList: Tab[] = [];
  // end of global reference

  public tabSub = new BehaviorSubject<LocobuzzTab[]>(this.tabs);
  public clickedOnSavedFilter = new BehaviorSubject<Tab>(null);
  currentNavigationChanged = new BehaviorSubject<boolean>(false);
  currentSelectedTabIndex = new BehaviorSubject<number>(0);
  fireSelectedTabInitialEvent = new BehaviorSubject<string>(null);
  automaticRedirectTabEvent = new BehaviorSubject<string>(null);
  autoRenderSetting = new BehaviorSubject<AutoRenderSetting>(null);

  constructor(
    private _router: Router,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) {
    // Set the private defaults
    this._currentNavigationKey = null;
    this._onNavigationChanged = new BehaviorSubject(null);
    this._onNavigationRegistered = new BehaviorSubject(null);
    this._onNavigationSelect = new BehaviorSubject(null);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get onNavigationChanged(): Observable<any> {
    return this._onNavigationChanged.asObservable();
  }

  get onNavigationRegistered(): Observable<any> {
    return this._onNavigationRegistered.asObservable();
  }

  get onNavigationSelect(): Observable<any> {
    return this._onNavigationSelect.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  register(key, nav): void {
    // Check if the key already being used
    if (this._registry[key]) {
      console.error(
        `The navigation with the key '${key}' already exists. Either unregister it first or use a unique key.`
      );
      return;
    }

    // Add to the registry
    this._registry[key] = nav;

    // Notify the subject
    this._onNavigationRegistered.next([key, this.navigation]);
  }

  getNavigation(key): any {
    // Check if the navigation exists
    if (!this._registry[key]) {
      console.warn(
        `The navigation with the key '${key}' doesn't exist in the registry.`
      );

      return;
    }

    // Return the sidebar
    return this._registry[key];
  }

  getCurrentNavigation(): any {
    if (!this._currentNavigationKey) {
      console.warn(`The current navigation is not set.`);
      return;
    }

    return this.getNavigation(this._currentNavigationKey);
  }

  setCurrentNavigation(key): void {
    // Check if the sidebar exists
    if (!this._registry[key]) {
      return;
    }

    // Set the current navigation key
    this._currentNavigationKey = key;

    // Notify the subject
    this._onNavigationChanged.next(key);
  }

  getNavigationData(route): void {
    const index = this.navigation.findIndex(
      (routeItem) => routeItem.url === route
    );
    this._onNavigationSelect.next(this.navigation[index]);
  }

  public removeTab(index: number): void {
    // remove from local storage
    if (this.currentNavigation.defaultTabs[index].userID !== -1)
    {
      this.removeTabFromLocalStorage(this.currentNavigation.defaultTabs[index]);
      // console.log(this.currentNavigation.defaultTabs[index]);
      // call an api and update the tab details
      // remove from Loaded Nav Links
      const loadedindex = this.loadedNavLinks.findIndex(obj => obj === this.currentNavigation.defaultTabs[index].guid);
      this.loadedNavLinks.splice(loadedindex, 1);
      this.updateTabDetails(this.tabs[index].tab).subscribe((obj) => {
        console.log('tab removed');
      });
      this.tabs.splice(index, 1);
      this.tabSub.next(this.tabs);
      // remove from current navigation
      const currenttabIndex = this.currentNavigation.defaultTabs.splice(index, 1);

      if (this.tabs.length > 0) {
        if (index > 0) {
          this.currentSelectedTabIndex.next(index - 1);
          this._router.navigate([`/${this.tabs[index - 1].tab.tabUrl}`]);
        } else {
          this.currentSelectedTabIndex.next(0);
          this._router.navigate([`/${this.tabs[0].tab.tabUrl}`]);
        }
        // this.tabs[this.tabs.length - 1].active = true;
      }
    }
    else{
      this._snackBar.open('Sorry currently dont have permission to close default tabs', 'Ok', {
        duration: 3000,
      });
    }
  }

  public addTab(tab: LocobuzzTab): void {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i].active === true) {
        this.tabs[i].active = false;
      }
    }
    tab.id = this.tabs.length + 1;
    tab.active = true;
    this.tabs.push(tab);
    this.tabSub.next(this.tabs);
  }

  removeTabFromLocalStorage(tab: Tab): void {
    const currentUserMenus = localStorage.getItem('userMenu');
    const menuObj: Menu[] = JSON.parse(currentUserMenus);
    const menuindex = menuObj.findIndex((obj) => obj.menuId === tab.menuId);
    if (menuindex > -1) {
      const tabindex = menuObj[menuindex].tabs.findIndex(
        (obj) => obj.guid === tab.guid
      );
      if (tabindex > -1) {
        const currentTab = menuObj[menuindex].tabs[tabindex];
        if (currentTab.status === TabStatus.Saved)
        {
          menuObj[menuindex].tabs[tabindex].status = TabStatus.RemovedTab;
        }
        else{
          menuObj[menuindex].tabs.splice(tabindex, 1);
        }
        localStorage.setItem('userMenu', JSON.stringify(menuObj));
      }
    }
    // if (menuObj.length > 0) {
    //   // sort menus by order
    //     menuObj.sort(this._commonService.compareByInt);
    //   // sort by ispinned
    //     menuObj.sort(this._commonService.compareByBoolean);

    //   // loop through each menus
    //     for (const menu of menuObj) {

    //     if (tab.menuId === menu.menuId)
    //     {
    //        if ( menu.tabs &&  menu.tabs.length > 0)
    //        {
    //         const tabindex = menu.tabs.findIndex(obj => obj.guid === tab.guid);
    //         if (tabindex > -1)
    //         {
    //           menu.tabs.slice(tabindex, 1);
    //         }
    //        }
    //     }
    //     // sort menus by order
    //     menu.tabs.sort(this._commonService.compareByInt);
    //     // sort by ispinned
    //     menu.tabs.sort(this._commonService.compareByBoolean);
    //   }
    //     localStorage.setItem('userMenu', JSON.stringify(menuObj));
    // }
  }

  updateTabDetails(tab: Tab, opentab = false): Observable<Tab> {
    if (tab.userID !== -1) {
      // if it is saved filter
      if (!opentab)
      {
        if (tab.status === TabStatus.Saved) {
          tab.status = TabStatus.RemovedTab;
        }
        // if its not saved filter
        if (tab.status === TabStatus.NotSaved) {
          tab.status = TabStatus.RemovedTab;
          tab.isdeleted = true;
        }
      }

      tab.Filters = JSON.parse(tab.filterJson);
      return this.http
        .post<TicketFilterTabParametersResponse>(
          environment.baseUrl + `/Tickets/SaveTicketFilterTab`,
          tab
        )
        .pipe(
          map((response) => {
            if (response.success) {
              return response.data;
            }
          })
        );
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
              this.changeLocalStorageJson(response.data[0]);
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
            this.changeLocalStorageJson(currentTab);
            return currentTab;
          }
        })
      );

    }

  }
  changeLocalStorageJson(tab: Tab): void {
    // change localStorage
    const currentUserMenus = localStorage.getItem('userMenu');
    const menuObj: Menu[] = JSON.parse(currentUserMenus);
    const menuindex = menuObj.findIndex((obj) => obj.menuId === tab.menuId);
    if (menuindex > -1) {
      const tabindex = menuObj[menuindex].tabs.findIndex(
        (obj) => obj.guid === tab.guid
      );
      if (tabindex > -1) {
          menuObj[menuindex].tabs[tabindex].filterJson = tab.filterJson;
          localStorage.setItem('userMenu', JSON.stringify(menuObj));
      }
    }
  }
}
