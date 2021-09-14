import { CursorError } from '@angular/compiler/src/ml_parser/lexer';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TabResolved } from '../models/menu/Menu';
import { MenuService } from './menu.service';
import { NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root'
})
export class FilterjsonresolverService implements Resolve<any> {

  constructor(private _navigationService: NavigationService,
              private _menuService: MenuService) {

  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<TabResolved> {
    const guid = route.paramMap.get('guid');
    if (guid)
    {
      const currenttabIndex = this._navigationService.currentNavigation.defaultTabs.findIndex(obj => obj.guid === guid);

      if (currenttabIndex > -1)
      {
        this._navigationService.currentSelectedTabIndex.next(currenttabIndex);
        const currenttab = this._navigationService.currentNavigation.defaultTabs[currenttabIndex];
        this._navigationService.currentSelectedTab = currenttab;

        return this._navigationService.getTabJsonByTabId(currenttab)
        .pipe(
          map(tab => ({ tab, error: null })),
          catchError(error => {
            const message = `Retrieval error: ${error}`;
            console.error(message);
            return of({ tab: null, error: message });
          })
        );

      }
    }
  }
}
