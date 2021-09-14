import { WidgetContainerComponent } from './../widget-container/widget-container.component';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SelectDashboardComponent } from './../select-dashboard/select-dashboard.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-widgetbox',
  templateUrl: './widgetbox.component.html',
  styleUrls: ['./widgetbox.component.scss']
})
export class WidgetboxComponent implements OnInit {

  constructor(private _dialog: MatDialog, private _bottomSheet: MatBottomSheet) { }

  ngOnInit(): void {
  }

  openDashboardSelect(): void {
    this._dialog.open(SelectDashboardComponent, {
      disableClose: true,
      autoFocus: false,
      panelClass: ['full-screen-modal']
    });
  }

  openWidgetContainer(): void{
    this._bottomSheet.open(WidgetContainerComponent, {
      panelClass: ['full-screen-bottomsheet']
    });
  }

}
