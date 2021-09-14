import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LocobuzzNavigationItem } from '../interfaces/locobuzz-navigation';
import { MenuService } from './menu.service';
import { NavigationService } from './navigation.service';
import { TabService } from './tab.service';

@Injectable({
  providedIn: 'root'
})
export class ParentrouteresolverService implements Resolve<boolean> {
  navigation: LocobuzzNavigationItem[] =  [];
  constructor(private _navigation: NavigationService,
              private _tabService: TabService) {
    this.navigation = _navigation.navigation;
   }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    console.log('Route Parent', route.routeConfig.path);
    const menuUrl = route.routeConfig.path;
    for (const menu of this.navigation)
    {
      if (menu.url.includes(menuUrl))
      {
        this._navigation.currentNavigation = menu;
        this._tabService.setCurrentNavigationTabs();
        break;
      }
    }
    return of(true);
  }
}
