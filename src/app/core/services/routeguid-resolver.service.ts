import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { LocobuzzNavigationItem } from '../interfaces/locobuzz-navigation';
import { NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root',
})
export class RouteguidResolverService implements Resolve<string> {
  navigation: LocobuzzNavigationItem[] = [];
  constructor(private _navigation: NavigationService,
              private router: Router) {
    this.navigation = _navigation.navigation;
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<string> {
    console.log('Route Parent', route.parent.routeConfig.path);
    const id = route.paramMap.get('guid');
    if (id)
    {
      this.router.navigate([`/${route.parent.routeConfig.path}/${id}`]);
      return of(id);
    }
    else{
      const menu: LocobuzzNavigationItem  = this.navigation.find(obj => obj.id === route.parent.routeConfig.path);
      if (menu)
      {
        if (menu.defaultTabs.length > 0)
        {
          this.router.navigate([`/${route.parent.routeConfig.path}/${menu.defaultTabs[0].guid}`]);
          return of(menu.defaultTabs[0].guid);
        }
      }
    }

    // const id = route.paramMap.get('id');
    // if (isNaN(+id)) {
    // const message = `Product id was not a number: ${id}`;
    // console.error(message);
    // return of({ product: null, error: message });
    // }

    // return this.productService.getProduct(+id)
    // .pipe(
    //   map(product => ({ product: product })),
    //   catchError(error => {
    //     const message = `Retrieval error: ${error}`;
    //     console.error(message);
    //     return of({ product: null, error: message });
    //   })
    // );
  }
}
