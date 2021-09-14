import { Type } from '@angular/core';
import { Tab } from '../menu/Menu';

export class LocobuzzTab {
  public id?: number;
  public title?: string;
  public guid?: string;
  public tab?: Tab;
  public tabData?: any;
  public active?: boolean;
  public tabHide?: boolean;
  public fireInitializeEvent?: boolean;
  public component?: Type<any>;

  constructor(component: Type<any>, title: string, tabData: any) {
    this.tabData = tabData;
    this.component = component;
    this.title = title;
  }
}
