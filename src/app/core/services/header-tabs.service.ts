import { Injectable } from '@angular/core';
import { navbarItem } from 'app/core/interfaces/locobuzz-navigation';
import { filter } from 'app/app-data/ticket';
@Injectable({
  providedIn: 'root'
})
export class HeaderTabsService {
  constructor() { }


  getNavData(): navbarItem[] {
    return filter;
  };

}


