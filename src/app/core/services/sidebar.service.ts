import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  toggleBool: boolean = false;

  private _onsidebarToggle: BehaviorSubject<boolean>;



  constructor() {
    this._onsidebarToggle = new BehaviorSubject(false);
   }



  get onsidebarToggle(): Observable<any> {
    return this._onsidebarToggle.asObservable();
  }


  toggleSidebar(): void{
    this.toggleBool = !this.toggleBool;
    this._onsidebarToggle.next(this.toggleBool);
  }
}
