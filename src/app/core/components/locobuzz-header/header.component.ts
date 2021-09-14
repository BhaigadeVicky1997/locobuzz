import { Component, OnInit, Input, ViewChild, ViewChildren, AfterViewInit, AfterContentInit, ChangeDetectorRef } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { GenericFilter, PostsType } from 'app/core/models/viewmodel/GenericFilter';
import { LocobuzzTab } from 'app/core/models/viewmodel/LocobuzzTab';
import { NavigationService } from 'app/core/services/navigation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit, AfterContentInit {
  @Input() pageHeadInfoToggle: boolean;
  selectedTabIndex: number;
  showToolbar =  true;
  tabs = new Array<LocobuzzTab>();
  // @ViewChildren('headertabgroup') headertabgroup: MatTabGroup;
  @ViewChild('headertabgroup', { static: false }) headertabgroup: MatTabGroup;

  constructor(private _navService: NavigationService, public cdr: ChangeDetectorRef ) { }

  ngOnInit(): void {
    const appContent = document.querySelector('.app__content--scrollable');
    this._navService.tabSub.subscribe(tabs => {
      this.tabs = tabs;
      for (const obj of this.tabs)
      {
        obj.tabHide = true;
        if (obj.tab)
        {
          const filterJson = obj.tab.filterJson ? JSON.parse(obj.tab.filterJson) : null;
          if (filterJson)
          {
            const genericFilter = filterJson as GenericFilter;
            if (genericFilter.postsType === PostsType.TicketHistory)
            {
              obj.tabHide = false;
            }
          }
        }
      }
    });
    this._navService.currentSelectedTabIndex.subscribe((index) => {
      this.selectedTabIndex = index;
      if (!this.tabs[index].tabHide)
      {
        this.showToolbar = false;
        appContent.classList.add('app__content--overflow--inherit');
      }
      else
      {
        this.showToolbar = true;
        appContent.classList.remove('app__content--overflow--inherit');
      }
    });
  }
  ngAfterViewInit(): void {
    // this.headertabgroup.selectedIndexChange.subscribe(obj => {
    //   const array = this.headertabgroup._tabs.toArray();
    //   this.headertabgroup._tabs.reset(array);
    //   this.selectedTabIndex = obj;
    //   this.cdr.detectChanges();
    // })
  }
  ngAfterContentInit(): void {

  }

}
