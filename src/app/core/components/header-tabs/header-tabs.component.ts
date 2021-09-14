import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SelectDashboardComponent } from 'app/analytics/component/analyticsindex';
import { LocobuzzTab } from 'app/core/models/viewmodel/LocobuzzTab';
import { FilterService } from 'app/social-inbox/services/filter.service';
import { TicketsService } from 'app/social-inbox/services/tickets.service';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { ModalService } from '../../../shared/services/modal.service';
import { NavigationService } from '../../services/navigation.service';
import { FilterGroupService } from './../../../social-inbox/services/filter-group.service';
import { SavedTabsComponent } from './../saved-tabs/saved-tabs.component';


@Component({
  selector: 'app-header-tabs',
  templateUrl: './header-tabs.component.html',
  styleUrls: ['./header-tabs.component.scss']
})
export class HeaderTabsComponent implements OnInit {
  tabs = new Array<LocobuzzTab>();
  selectedTab: number;
  constructor(
    private _navigationService: NavigationService,
    public dialog: MatDialog,
    private _filterGroupService: FilterGroupService,
    private _modalService: ModalService,
    private router: Router,
    private _filterService: FilterService,
    private _ticketService: TicketsService
  ) { }


  activeLinkIndex = 0;
  navLinks = [];
  ngOnInit(): void {
    // this._navigationService.onNavigationSelect.subscribe((link) => {
    //   if (link) {
    //     console.log(link);
    //     this.navLinks = [];
    //     for (const element of link.defaultTabs)
    //     {
    //       const currentLink = new Tab(element.id, element.title);
    //       currentLink.url = element.url;
    //       this.navLinks.push(currentLink);
    //     }
    //   }
    // });
    this._navigationService.currentSelectedTabIndex.subscribe(index => {
      this.activeLinkIndex = index;
    });

    this._navigationService.tabSub.subscribe(tabs => {
      this.tabs = tabs;
      this.selectedTab = tabs.findIndex(tab => tab.active);
    });

    this.navLinks = this._navigationService.currentNavigation.defaultTabs;
    this._filterGroupService.getValue().subscribe((link) => {
      if (link) {
        this.navLinks.push(link);
      }
    });

    // setTimeout(() => {
    //   this.activeLinkIndex = 1;
    // this._navigationService.currentSelectedTabIndex.next(1);
    // this.router.navigate([`/${this.tabs[1].tab.tabUrl}`]);
    //  }, 10000);
    //  setTimeout(() => {
    //   this.activeLinkIndex = 0;
    // this._navigationService.currentSelectedTabIndex.next(0);
    // this.router.navigate([`/${this.tabs[0].tab.tabUrl}`]);
    //  }, 15000);

  }

  activate(ind, linktitle, tab): void{
    
    this._ticketService.selectedPostList = [];
    this._ticketService.postSelectTrigger.next(0);
    this._ticketService.bulkMentionChecked = [];
    // this.checkAllCheckBox = false;
    this.activeLinkIndex = ind;
    this._navigationService.currentSelectedTabIndex.next(ind);
    this.router.navigate([`/${tab.tab.tabUrl}`]);
    // this._navigationService._currentNavigation.next(linktitle);
  }

  openFilterDialog(): void {
    const currentNavigationUrl = this._navigationService.currentNavigation.id;

    if (currentNavigationUrl === 'social-inbox')
    {
      const dialogRef = this.dialog.open(FilterComponent, {
        width: '73vw',
        disableClose: true,
        data: {
          requiredFor: 'Add New Tab',
          submit: 'Add Tab'
        }
      });
    }
    else if (currentNavigationUrl === 'analytics')
    {
      this.dialog.open(SelectDashboardComponent, {
        disableClose: true,
        autoFocus: false,
        panelClass: ['full-screen-modal']
      });
    }
  }

  tabDrop(event): void{
    this.activeLinkIndex = +event.currentIndex;
    moveItemInArray( this.tabs, +event.previousIndex, +event.currentIndex);
    moveItemInArray( this._navigationService.currentNavigation.defaultTabs, +event.previousIndex, +event.currentIndex);
    // this._navigationService.currentNavigation.defaultTabs = this.tabs.map(obj => obj.tab);
    this._navigationService.tabSub.next(this.tabs);
    this._navigationService.currentSelectedTabIndex.next(+event.currentIndex);
    this.router.navigate([`/${this.tabs[ +event.currentIndex].tab.tabUrl}`]);
    // setTimeout(() => {
    //   this.activeLinkIndex = 0;
    // this._navigationService.currentSelectedTabIndex.next(0);
    // this.router.navigate([`/${this.tabs[0].tab.tabUrl}`]);
    //  }, 3000);
  }

  tabDragging(event): void{
    this.activeLinkIndex = this.tabs.length;
    event.item.element.nativeElement.classList.add('active');
  }

  openSavedTabs(): void {
    const sideModalConfig = this._modalService.getSideModalConfig('saved-tabs');
    this.dialog.open(SavedTabsComponent, sideModalConfig);
  }

  // Remove Tab
  removeLink(id: any): void {
    if (id > -1)
    {
      this._navigationService.removeTab(id);
    }
    // if (this.activeLinkIndex === id){
    //   this.activate(0, this.navLinks[0], '');
    // }
    // if (id > -1) {
    //   this.navLinks.splice(id, 1);
    // }
  }
}
