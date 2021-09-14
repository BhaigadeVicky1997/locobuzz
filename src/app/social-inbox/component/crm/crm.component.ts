import { Component, OnInit } from '@angular/core';
import { NewSrComponent } from '../new-sr/new-sr.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-crm',
  templateUrl: './crm.component.html',
  styleUrls: ['./crm.component.scss']
})
export class CrmComponent implements OnInit {
  selected = '+91';

  crmLists=['Customer Details','Product List (3)','SR Details(5)','FTR Details(15)','Recommended Products(2)']
  // tabList=['Details','proList','srDetails','ftrDetails','proRecommended']
  tabLists=['Details','proList','srDetails']
  selectedTab:any

  constructor(public dialog: MatDialog) { }


  ngOnInit(): void {
    this.selectedTab = this.crmLists[0]
  }

// create new SR

newSRDialog() {
  const dialogRef = this.dialog.open(NewSrComponent ,{
    width: '1000px',
  });
}


// CRM data hide and show



openTab(crmList:any){
  this.selectedTab = crmList;
}


}
