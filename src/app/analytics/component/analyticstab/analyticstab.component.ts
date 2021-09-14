import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { LocobuzzTab } from 'app/core/models/viewmodel/LocobuzzTab';
import { NavigationService } from 'app/core/services/navigation.service';
import { AdvanceFilterService } from 'app/social-inbox/services/advance-filter.service';
import { FilterService } from 'app/social-inbox/services/filter.service';

@Component({
  selector: 'app-analyticstab',
  templateUrl: './analyticstab.component.html',
  styleUrls: ['./analyticstab.component.scss']
})
export class AnalyticstabComponent implements OnInit {

  tabs = new Array<LocobuzzTab>();
  selectedTabIndex: number;

  constructor(
    private _filterService: FilterService,
    private _advanceFilterService: AdvanceFilterService,
    public dialog: MatDialog,
    private navService: NavigationService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.navService.tabSub.subscribe((tabs) => {
      this.tabs = tabs;
    });

    this.navService.currentSelectedTabIndex.subscribe((index) => {
      this.selectedTabIndex = index;
    });
  }

}
