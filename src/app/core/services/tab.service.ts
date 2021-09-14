import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WidgetboxComponent } from 'app/analytics/component/widgetbox/widgetbox.component';
import { PostDetailComponent } from 'app/social-inbox/component/post-detail/post-detail.component';
import { SocialboxComponent } from 'app/social-inbox/component/socialbox/socialbox.component';
import { TabStatus } from '../enums/TabStatusEnum';
import { Menu, Tab } from '../models/menu/Menu';
import { PostsType } from '../models/viewmodel/GenericFilter';
import { LocobuzzTab } from '../models/viewmodel/LocobuzzTab';
import { MenuService } from './menu.service';
import { NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root'
})
export class TabService {

  constructor(private _navigationService: NavigationService,
              private router: Router) {
  }

  setCurrentNavigationTabs(): void {
    // set to default navigation level
    this._navigationService.tabs = [];
    this._navigationService.loadedNavLinks = [];
    // end of reset
    for (const tab of this._navigationService.currentNavigation.defaultTabs)
    {
      if (this._navigationService.currentNavigation.id === 'social-inbox')
      {
        const filterJson = tab.filterJson ? JSON.parse(tab.filterJson) : null;
        if (filterJson)
        {
          if (filterJson.postsType === PostsType.TicketHistory)
          {
            const currentTab  = new LocobuzzTab(PostDetailComponent, tab.tabName, '');
            currentTab.tab = tab;
            currentTab.guid = tab.guid;
            this._navigationService.tabs.push(currentTab);
          }
          else{
            const currentTab  = new LocobuzzTab(SocialboxComponent, tab.tabName, '');
            currentTab.tab = tab;
            currentTab.guid = tab.guid;
            this._navigationService.tabs.push(currentTab);
          }
        }
        else{
          const currentTab  = new LocobuzzTab(SocialboxComponent, tab.tabName, '');
          currentTab.tab = tab;
          currentTab.guid = tab.guid;
          this._navigationService.tabs.push(currentTab);
        }
      }
      else if (this._navigationService.currentNavigation.id === 'analytics')
      {
        const currentTab  = new LocobuzzTab(WidgetboxComponent, tab.tabName, '');
        currentTab.tab = tab;
        currentTab.guid = tab.guid;
        this._navigationService.tabs.push(currentTab);
      }
    }
    this._navigationService.tabSub.next(this._navigationService.tabs);
  }

  addNewTab(tab: Tab, isSavedFilter = false): void {
    const currentTab  = new LocobuzzTab(SocialboxComponent, tab.tabName, '');
    currentTab.tab = tab;
    currentTab.guid = tab.guid;
    this._navigationService.tabs.push(currentTab);
    this._navigationService.tabSub.next(this._navigationService.tabs);
    this._navigationService.currentSelectedTabIndex.next(this._navigationService.tabs.length - 1);
    if (isSavedFilter)
    {
      this.setTabForSavedFilter(tab);
    }
    else{
      this.setTabs(tab);
    }
    this.router.navigate([`/${tab.tabUrl}`]);
  }

  OpenNewTab(tab: Tab, isSavedFilter = false): void {
    const currentTab  = new LocobuzzTab(PostDetailComponent, tab.tabName, '');
    currentTab.tab = tab;
    currentTab.guid = tab.guid;
    this._navigationService.tabs.push(currentTab);
    this._navigationService.tabSub.next(this._navigationService.tabs);
    this._navigationService.currentSelectedTabIndex.next(this._navigationService.tabs.length - 1);
    if (isSavedFilter)
    {
      this.setTabForSavedFilter(tab);
    }
    else{
      this.setTabs(tab);
    }
    this.router.navigate([`/${tab.tabUrl}`]);
  }

  setTabs(tab: Tab): void
  {
    const currentUserMenus = localStorage.getItem('userMenu');
    const menuObj: Menu[] = JSON.parse(currentUserMenus);
    if (menuObj.length > 0) {
      // sort menus by order
      // menuObj.sort(this.compareByInt);
      // sort by ispinned
      // menuObj.sort(this.compareByBoolean);

      // loop through each menus
      for (const menu of menuObj) {

        if (tab.menuId === menu.menuId)
        {
            menu.tabs.push(tab);
            // add tab to current navigation
            this._navigationService.currentNavigation.defaultTabs.push(tab);
        }
        // sort menus by order
        // menu.tabs.sort(this.compareByInt);
        // sort by ispinned
        // menu.tabs.sort(this.compareByBoolean);
      }
      localStorage.setItem('userMenu', JSON.stringify(menuObj));
      // add entry to locobuzzNavigationItem
      for (const navigation of this._navigationService.navigation)
      {
         if (tab.menuId === navigation.menuid)
         {
          const defaultTab: Tab = tab;
          defaultTab.tabUrl = `${navigation.id}/${tab.guid}`;
          navigation.defaultTabs.push(tab);
          if (tab.status === TabStatus.Saved)
            {
              if (navigation.savedFilter && navigation.savedFilter.length > 0)
              {
                navigation.savedFilter.push(tab);
              }
              else{
                navigation.savedFilter = [];
                navigation.savedFilter.push(tab);
              }
            }
         }
      }
    }

  }

  setTabForSavedFilter(tab: Tab): void
  {
    const currentUserMenus = localStorage.getItem('userMenu');
    const menuObj: Menu[] = JSON.parse(currentUserMenus);
    if (menuObj.length > 0) {
      // sort menus by order
      // menuObj.sort(this.compareByInt);
      // sort by ispinned
      // menuObj.sort(this.compareByBoolean);

      // loop through each menus
      for (const menu of menuObj) {

        if (tab.menuId === menu.menuId)
        {
            const tabindex = menu.tabs.findIndex(obj => obj.guid === tab.guid);
            tab.status = TabStatus.Saved;
            this._navigationService.clickedOnSavedFilter.next(tab);

            if (tabindex < 0)
            {
              menu.tabs.push(tab);
            }
            else{
              menu.tabs.splice(tabindex, 1);
              menu.tabs.push(tab);
            }
            const defualttabindex = this._navigationService.currentNavigation.defaultTabs.findIndex(obj => obj.guid === tab.guid);
            if (defualttabindex < 0)
            {
              this._navigationService.currentNavigation.defaultTabs.push(tab);
            }
        }
        // sort menus by order
        // menu.tabs.sort(this.compareByInt);
        // sort by ispinned
        // menu.tabs.sort(this.compareByBoolean);
      }
      localStorage.setItem('userMenu', JSON.stringify(menuObj));
      // add entry to locobuzzNavigationItem
      for (const navigation of this._navigationService.navigation)
      {
         if (tab.menuId === navigation.menuid)
         {
          const defaultTab: Tab = tab;
          defaultTab.tabUrl = `${navigation.id}/${tab.guid}`;
          const tabindex = navigation.defaultTabs.findIndex(obj => obj.guid === tab.guid);
          if (tabindex < 0)
          {
            navigation.defaultTabs.push(tab);
          }
         }
      }
    }

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
}
