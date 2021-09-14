import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { locobuzzAnimations } from '@locobuzz/animations';
import { post } from 'app/app-data/post';
import { TabStatus } from 'app/core/enums/TabStatusEnum';
import { DefaultTabs } from 'app/core/interfaces/locobuzz-navigation';
import { BaseMention } from 'app/core/models/mentions/locobuzz/BaseMention';
import { Tab, TabResolved } from 'app/core/models/menu/Menu';
import {
  GenericFilter,
  PostsType
} from 'app/core/models/viewmodel/GenericFilter';
import { LocobuzzTab } from 'app/core/models/viewmodel/LocobuzzTab';
import { PostDetailData } from 'app/core/models/viewmodel/PostDetailData';
import { NavigationService } from 'app/core/services/navigation.service';
import { FilterService } from 'app/social-inbox/services/filter.service';
import { TicketsService } from 'app/social-inbox/services/tickets.service';
import { SubSink } from 'subsink';
import { AdvanceFilterService } from './../../services/advance-filter.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  animations: locobuzzAnimations,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() postData: {}[] = post;
  navbar;
  TicketList: BaseMention[] = [];
  MentionList: BaseMention[] = [];
  filter: GenericFilter;
  postloader: boolean = false;
  ticketsFound: number;
  result: string = '';
  tickets: BaseMention[] = [];
  currentPageType: string;
  currentPostType: PostsType;
  currentGuid: string;
  isadvance: boolean = false;
  selectedPostList: number[] = [];
  bulkActionpanelStatus: boolean = false;
  loadedNavLinks = [];
  defaultTabs: DefaultTabs[] = [];
  CurrentTab: Tab = {};
  postDetailData: PostDetailData = {};
  selectedTabIndex: number;
  tabs = new Array<LocobuzzTab>();
  isSingleSocialBoxLoaded = false;
  updateTabDetails = true;
  @ViewChild('contenttabgroup', { static: false }) contenttabgroup: MatTabGroup;
  showToolbar: boolean;
  subs = new SubSink();

  constructor(
    private _ticketService: TicketsService,
    private _filterService: FilterService,
    private _advanceFilterService: AdvanceFilterService,
    public dialog: MatDialog,
    private navService: NavigationService,
    private route: ActivatedRoute
  ) {}
  // ngAfterViewInit(): void {
  //   this.contenttabgroup.selectedIndexChange.subscribe(obj => {
  //     const array = this.contenttabgroup._tabs.toArray();
  //     this.contenttabgroup._tabs.reset(array);
  //     this.selectedTabIndex = obj;
  //   });
  // }

  ngOnInit(): void {
    this.selectedTabIndex = 0
    this.subs.add(this.navService.tabSub.subscribe((tabs) => {
      let currentTabs = tabs;
      for (const obj of currentTabs) {
        obj.tabHide = true;
        if (obj.tab) {
          const filterJson = obj.tab.filterJson
            ? JSON.parse(obj.tab.filterJson)
            : null;
          if (filterJson) {
            const genericFilter = filterJson as GenericFilter;
            if (genericFilter.postsType === PostsType.TicketHistory) {
              obj.tabHide = false;
            }
          }
        }
      }
      this.tabs = [];
      this.tabs = currentTabs;
      //    if (this.contenttabgroup){
      //   const array = this.contenttabgroup._tabs.toArray();
      //   console.log(array);
      //   this.contenttabgroup._tabs.reset(array);
      // }
    //  setTimeout(() => {
    //   if (this.contenttabgroup){
    //     const array = this.contenttabgroup._tabs.toArray();
    //     console.log(array);
    //     this.contenttabgroup._tabs.reset(array);
    //   }
    //  }, 20 ); 
    }));
    this.subs.add(this.navService.currentSelectedTabIndex.subscribe((index) => {
      this.selectedTabIndex = index;
      this.selectedTabIndex = index;
      if (!this.tabs[index].tabHide) {
        this.showToolbar = false;
        // appContent.classList.add('app__content--overflow--inherit');
      } else {
        this.showToolbar = true;
        // appContent.classList.remove('app__content--overflow--inherit');
      }
    }));
    this.defaultTabs = this.navService.currentNavigation.defaultTabs;
    this.route.data.subscribe((data) => {
      if (data.resolvedjson.tab.guid) {
        const resolvedData: TabResolved = data.resolvedjson;
        this.currentGuid = resolvedData.tab.guid;
        // this._filterService.reverseApply(JSON.parse(resolvedData.tab.filterJson));
        // find the tab and add Json to it
        // call an api
        // call an api
        this.navService.clickedOnSavedFilter.subscribe((tabdetails) => {
          if (
            tabdetails &&
            tabdetails.guid === this.currentGuid &&
            this.updateTabDetails
          ) {
            this.updateTabDetails = false;
            resolvedData.tab.status = TabStatus.Saved;
            this.navService
              .updateTabDetails(resolvedData.tab, true)
              .subscribe((obj) => {
                console.log('Tab Updated');
              });
          }
        });

        this.tabs = this.tabs.filter((obj) => {
          if (obj.guid === this.currentGuid) {
            obj.tab.filterJson = resolvedData.tab.filterJson;

            if (this.navService.loadedNavLinks.includes(this.currentGuid)) {
              obj.fireInitializeEvent = false;
              this._filterService.reverseApply(
                JSON.parse(resolvedData.tab.filterJson)
              );
            } else {
              this.navService.loadedNavLinks.push(resolvedData.tab.guid);
              if (this.isSingleSocialBoxLoaded) {
                this._filterService.filterTabSource.next(resolvedData.tab);
              }
              // this._filterService.filterTabSource.next(resolvedData.tab[0]);
              this.navService.fireSelectedTabInitialEvent.next(
                resolvedData.tab.guid
              );
              this.isSingleSocialBoxLoaded = true;

              obj.fireInitializeEvent = true;
              // this.initializePageComponent(resolvedData.tab[0]);
            }
          }
          return obj;
        });
        this.postDetailData.tab = resolvedData.tab;
        if (resolvedData.error) {
        }
      }
    });
    // this.navService._currentNavigation.subscribe((data) =>
    // {
    //   if (data === 'All Mentions')
    //   {
    //     console.log('Mentions Called', this.MentionList);
    //     this.currentPageType = 'All Mentions';
    //   }

    //   if (data === 'tickets')
    //   {
    //     console.log('Tickets Called');
    //     this.currentPageType = 'tickets';
    //   }
    // });
  }

  public get postTypeEnum(): typeof PostsType {
    return PostsType;
  }

  initializePageComponent(tab?: Tab): void {
    if (tab) {
      const filterJson = tab.filterJson ? JSON.parse(tab.filterJson) : null;
      if (filterJson) {
        const genricfilterObj = filterJson as GenericFilter;
        if (genricfilterObj) {
          if (genricfilterObj.postsType) {
            this.currentPostType = genricfilterObj.postsType;
          }
        }
      }
    }
    this._filterService.filterTabSource.subscribe((value) => {
      if (value) {
        this.filter = this._filterService.getGenericFilter();
        this.GetTickets(this.filter, true);
        this.getMentions(this.filter);
        this.isadvance = false;
      }
    });
    this._advanceFilterService.filterTabSource.subscribe((value) => {
      if (value) {
        this.filter = this._advanceFilterService.getGenericFilter();
        this.GetTickets(this.filter, true);
        // this.getMentions(this.filter);
        this.isadvance = true;
      }
    });
  }

  private GetTickets(filterObj, firstCall): void {
    this.postloader = true;
    this._ticketService.GetTickets(filterObj).subscribe(
      (resp) => {
        this.postloader = false;
        this.TicketList = resp;
        console.log('TikcetList', this.TicketList);
        this.ticketsFound = this._ticketService.ticketsFound;
        if (firstCall) {
          if (this.paginator) {
            this.paginator.pageIndex = 0;
            this.paginator._changePageSize(this.paginator.pageSize);
          }
          setTimeout(() => {
            // this.paginator.length = this.ticketsFound;
          }, 1);
        }
      },
      (err) => {
        console.log(err);
        this.postloader = false;
      },
      () => {
        console.log('call completed');
      }
    );
  }

  OnPageChange(event: PageEvent): void {
    console.log(event);
    if (this.isadvance) {
      this.filter = this._advanceFilterService.getGenericFilter();
    } else {
      this.filter = this._filterService.getGenericFilter();
    }
    this.filter.oFFSET = event.pageIndex * event.pageSize;
    this.GetTickets(this.filter, false);
  }

  ngOnDestroy(): void {
    // this._filterService.currentBrandSource.unsubscribe();
    this.subs.unsubscribe();
  }

  private getMentions(filterObj): void {
    this._ticketService.getMentionList(filterObj).subscribe((data) => {
      this.MentionList = data;
    });
  }

  toggleBulkSelect(selectedPost: [boolean, number]): void {
    if (selectedPost[0] === true) {
      this.selectedPostList.push(+selectedPost[1]);
    } else {
      const index = this.selectedPostList.indexOf(+selectedPost[1]);
      if (index > -1) {
        this.selectedPostList.splice(index, 1);
      }
    }
    this.bulkActionpanelStatus =
      this.selectedPostList.length >= 2 ? true : false;
  }

  postBulkAction(event): void {
    console.log(event);
    if (event === 'dismiss') {
      this.bulkActionpanelStatus = false;
    }
  }

  // openCofirmDialog(): void {
  //   console.log('dialog called');
  //   const message = `By choosing to the delete action,
  // please note that the reply to customers previously published by the SSRE will also be erased from your configured platforms as well.?`;
  //   const dialogData = new AlertDialogModel('Would you like to delete the SSRE reply?', message, 'Keep SSRE Reply','Delete SSRE Reply');
  //   const dialogRef = this.dialog.open(AlertPopupComponent, {
  //     disableClose: true,
  //     autoFocus: false,
  //     data: dialogData
  //   });

  //   dialogRef.afterClosed().subscribe(dialogResult => {
  //     this.result = dialogResult;
  //     if(dialogResult){
  //       console.log(this.result);
  //     }else{
  //       console.log(this.result);
  //     }
  //   });
  // }
}
