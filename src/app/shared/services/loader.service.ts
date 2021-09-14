import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }

  public mainLoaderStatus = new BehaviorSubject(true);
  public componentLoaderStatus = new BehaviorSubject({
    status: false,
    section: ''
  });

  public toggleMainLoader(status: boolean): void{
    this.mainLoaderStatus.next(status);
  }

  public togglComponentLoader(status: {
    status: boolean,
    section: string
  }): void{
    this.componentLoaderStatus.next(status);
  }
}
