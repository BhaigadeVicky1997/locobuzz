import { Injectable, Injector } from '@angular/core';
import { AdvanceFilterService } from 'app/social-inbox/services/advance-filter.service';
import { FilterService } from 'app/social-inbox/services/filter.service';
import * as moment from 'moment';
import { Menu, Tab } from '../models/menu/Menu';
import { GenericFilter } from '../models/viewmodel/GenericFilter';
import { MixedTicketCount } from '../models/viewmodel/TicketsCount';
import { MenuService } from './menu.service';
import { NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private injector: Injector) {
    this.subscribeToFilterEvents();
  }

  static calculateFLR(allticketCount: MixedTicketCount): string
    {
        if (allticketCount.myTicketsCount.flrTicketCount)
        {
            if (+allticketCount.myTicketsCount.flrTicketCount > 0)
            {
                const seconds = Number(+allticketCount.myTicketsCount.flrTatSeconds / +allticketCount.myTicketsCount.flrTicketCount)
                .toFixed(0);
                return CommonService.SecondstoHumanReadableShort(seconds);
            }
            return '0 s';
        }

        return '0 s';
    }
    static calculateInSeconds(tat: number, count: number): number
    {
        if (count)
        {
            if (count > 0)
            {
                return Number(tat / count);
            }
            return 0;
        }

        return 0;
    }

    static calculateTAT(allticketCount: MixedTicketCount): string
    {
        if (allticketCount.myTicketsCount.closedTicketCount)
        {
            if (+allticketCount.myTicketsCount.closedTicketCount > 0)
            {
                const seconds = Number(+allticketCount.myTicketsCount.closedTicketTAT / +allticketCount.myTicketsCount.closedTicketCount)
                .toFixed(0);
                return CommonService.SecondstoHumanReadableShort(seconds);
            }
            return '0 s';
        }

        return '0 s';
    }

    static calculateAHT(allticketCount: MixedTicketCount): string
    {
        if (allticketCount.myTicketsCount.avgAgentHandlingTime)
        {
            if (+allticketCount.myTicketsCount.avgAgentHandlingTime > 0)
            {
                return CommonService.SecondstoHumanReadableShort(allticketCount.myTicketsCount.avgAgentHandlingTime);
            }
            return '0 s';
        }

        return '0 s';
    }
  static SecondstoHumanReadableShort(seconds): string {
    if (
      seconds === null ||
      seconds === undefined ||
      seconds === '' ||
      seconds === '0'
    ) {
      seconds = 0;
    }
    const mobject = moment.duration(seconds, 'seconds');
    const asDays = +mobject.asDays().toFixed(0);
    // var asHours = parseInt(mobject.asHours());
    // var asMinutes = parseInt(mobject.asMinutes());
    // var asSeconds = parseInt(mobject.asSeconds());

    if (asDays > 0) {
      return (
        asDays +
        (asDays > 1 ? ' D ' : ' D ') +
        mobject.hours().toFixed(0) +
        (mobject.hours() > 1 ? ' h ' : ' h ') +
        mobject.minutes().toFixed(0) +
        (mobject.minutes() > 1 ? ' m ' : ' m ') +
        mobject.seconds().toFixed(0) +
        (mobject.seconds() > 1 ? ' s' : ' s')
      );
    } else if (mobject.hours() > 0) {
      return (
        mobject.hours().toFixed(0) +
        (mobject.hours() > 1 ? ' h ' : ' h ') +
        mobject.minutes().toFixed(0) +
        (mobject.minutes() > 1 ? ' m ' : ' m ') +
        mobject.seconds().toFixed(0) +
        (mobject.seconds() > 1 ? ' s' : ' s')
      );
    } else if (mobject.minutes() > 0) {
      return (
        mobject.minutes().toFixed(0) +
        (mobject.minutes() > 1 ? ' m ' : ' m ') +
        mobject.seconds().toFixed(0) +
        (mobject.seconds() > 1 ? ' s' : ' s')
      );
    } else if (mobject.seconds() > 0) {
      if (mobject.seconds() > 1) {
        return mobject.seconds().toFixed(0) + ' s';
      } else {
        return mobject.seconds().toFixed(0) + ' s';
      }
    } else {
      return '0 s';
    }
  }

  static returnCountWithTrendCount(CurrentCount, PreviousCount): number {
    CurrentCount = Number(CurrentCount);
    PreviousCount = Number(PreviousCount);

    const substraction = CurrentCount - PreviousCount;
    const addition = CurrentCount + PreviousCount;
    if (substraction < 0 && PreviousCount < 0) {
      PreviousCount = -PreviousCount;
    }
    let TotalCount = Number((substraction * 100) / PreviousCount);
    if (
      TotalCount === Number.POSITIVE_INFINITY ||
      TotalCount === Number.NEGATIVE_INFINITY
    ) {
      return 0;
    } else if (TotalCount || TotalCount === Number.NaN) {
      TotalCount = Number(TotalCount.toFixed(2));
      if (CurrentCount > PreviousCount) {
        return Math.abs(TotalCount);
      } else {
        return TotalCount;
      }
    }
  }

  subscribeToFilterEvents(): void {
    const _filterService = this.injector.get<FilterService>(FilterService);
    _filterService.ascDescFilterOpt.subscribe(obj => {
      if (obj)
      {
        this.changeTabFilterJson();
      }
    });
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

  changeTabFilterJson(updatedb = false): void
  {

    const _navigationService = this.injector.get<NavigationService>(NavigationService);
    const _filterService = this.injector.get<FilterService>(FilterService);
    const _advanceFilterService = this.injector.get<AdvanceFilterService>(AdvanceFilterService);
    // const _menuService = this.injector.get<MenuService>(MenuService);
    const currentTab = _navigationService.currentSelectedTab;
    const genericFilter: GenericFilter = JSON.parse(currentTab.filterJson);
    let fetchedTab: Tab = null;
    for (const tab of _navigationService.fetchedTabList)
    {
      if (tab.guid === currentTab.guid)
      {
        fetchedTab  = tab;
      }
    }

    if (genericFilter.isAdvance)
    {
      const filterJson = _advanceFilterService.getGenericFilter();
      currentTab.filterJson = JSON.stringify(filterJson);
      if (fetchedTab)
      {
        fetchedTab.filterJson = currentTab.filterJson;
      }

    }else{
      const filterJson = _filterService.getGenericFilter();
      currentTab.filterJson = JSON.stringify(filterJson);

      if (fetchedTab)
      {
        fetchedTab.filterJson = currentTab.filterJson;
      }

      // check current navigation
      console.log('currentNavigation', _navigationService.currentNavigation);

      console.log('navigation', _navigationService.navigation);

      console.log('tabs', _navigationService.tabs);

    }
    // _filterService.reverseApply(JSON.parse(currentTab.filterJson));

    if (updatedb)
    {
      _navigationService.updateTabDetails(currentTab, true).subscribe(obj => {
        console.log('Tab Updated');
      });

      // change localStorage
      const currentUserMenus = localStorage.getItem('userMenu');
      const menuObj: Menu[] = JSON.parse(currentUserMenus);
      const menuindex = menuObj.findIndex((obj) => obj.menuId === currentTab.menuId);
      if (menuindex > -1) {
        const tabindex = menuObj[menuindex].tabs.findIndex(
          (obj) => obj.guid === currentTab.guid
        );
        if (tabindex > -1) {
            menuObj[menuindex].tabs[tabindex].filterJson = currentTab.filterJson;
            localStorage.setItem('userMenu', JSON.stringify(menuObj));
        }
      }
    }
  }

  GetFilter(tab: Tab): GenericFilter
  {
    if (tab.guid)
    {
      const genericFilter: GenericFilter  = JSON.parse(tab.filterJson);
      const _filterService = this.injector.get<FilterService>(FilterService);
      const _advanceFilterService = this.injector.get<AdvanceFilterService>(AdvanceFilterService);
      if (genericFilter.isAdvance)
      {
          return _advanceFilterService.getGenericFilter();
      }
      else{
        return _filterService.getGenericFilter();
      }

    }

  }
}
