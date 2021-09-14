import { locobuzzAnimations } from '@locobuzz/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Tab } from 'app/core/models/menu/Menu';
import { NavigationService } from 'app/core/services/navigation.service';
import { TabService } from 'app/core/services/tab.service';

@Component({
  selector: 'app-saved-tabs',
  templateUrl: './saved-tabs.component.html',
  styleUrls: ['./saved-tabs.component.scss'],
  animations: locobuzzAnimations
})
export class SavedTabsComponent implements OnInit {

  savedFilterTab: Tab[] = [];
  activeTabIndex: number;

  constructor(private navigationService: NavigationService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private tabService: TabService,
              public dialog: MatDialog) {
   }

  ngOnInit(): void {
    this.getCurrentTabs();
    this.navigationService.currentSelectedTabIndex.subscribe(index => {
      const tabindex = this.savedFilterTab.findIndex(obj =>
        obj.guid === this.navigationService.tabs[index].guid);
      if (tabindex > -1)
        {
          this.activeTabIndex = tabindex;
        }
        else{
          this.activeTabIndex = NaN;
        }
    });
  }

  getCurrentTabs(): void {
    if (this.navigationService.currentNavigation.savedFilter.length > 0)
    {
      this.savedFilterTab = this.navigationService.currentNavigation.savedFilter;
      const tabindex = this.savedFilterTab.findIndex(obj =>
        obj.guid === this.navigationService.currentSelectedTab.guid);
      if (tabindex > -1)
        {
          this.activeTabIndex = tabindex;
        }
        else{
          this.activeTabIndex = NaN;
        }

    }

  }

  selectTab(index): void{
this.activeTabIndex = index;
  }

  activateTab(): void {
    if (this.activeTabIndex > -1)
    {
      // find the tabindex if the tab is present in the list
      const currentTabIndex = this.navigationService.tabs.findIndex(obj =>
        obj.guid === this.savedFilterTab[this.activeTabIndex].guid);
      if (currentTabIndex > -1)
        {
          this.navigationService.currentSelectedTabIndex.next(currentTabIndex);
          this.router.navigate([`/${this.navigationService.tabs[currentTabIndex].tab.tabUrl}`]);
        }
        else{
          this.tabService.addNewTab(this.savedFilterTab[this.activeTabIndex], true);
        }
      this.dialog.closeAll();

    }
    else{
      this._snackBar.open('Please select any tab to apply', 'Ok', {
        duration: 2000,
      });
    }
  }

}
