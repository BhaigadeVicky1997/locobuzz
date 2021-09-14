import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root'
})

export class ModalService {

  constructor() {}

  private _sidedialogConfig = new MatDialogConfig();
  private  _dialogConfig = new MatDialogConfig();



   getSideModalConfig(id: string, classes?: string[]): any{
     classes = classes == undefined ? [] : classes;
     this._sidedialogConfig.position = {
        top: '0',
        right: '0'
      };
     this._sidedialogConfig.id = id;
     this._sidedialogConfig.height = '100%';
     this._sidedialogConfig.panelClass = ['side-modal', ...classes];
     this._sidedialogConfig.backdropClass = 'side-modal-overlay';
     this._sidedialogConfig.autoFocus = false;

     return this._sidedialogConfig;
  }

  getModalConfig(id: string, classes?: string[]): any{
    classes = classes === undefined ? [] : classes;
    this._dialogConfig.id = id;
    this._dialogConfig.panelClass = ['main-modal', ...classes];
    this._dialogConfig.backdropClass = 'main-modal-overlay';
    return this._dialogConfig;
 }
}
