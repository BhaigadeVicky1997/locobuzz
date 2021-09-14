import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { CdkPortal } from '@angular/cdk/portal';
import { Component, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FilterEvents } from 'app/core/enums/FilterEvents';
import { UserRoleEnum } from 'app/core/enums/userRoleEnum';
import { AuthUser } from 'app/core/interfaces/User';
import { Tab, TabEvent } from 'app/core/models/menu/Menu';
import { AutoRenderSetting } from 'app/core/models/viewmodel/AutoRenderSetting';
import { PostsType } from 'app/core/models/viewmodel/GenericFilter';
import { LocobuzzTab } from 'app/core/models/viewmodel/LocobuzzTab';
import { MentionCounts } from 'app/core/models/viewmodel/MentionCounts';
import { AgentNavTicketCount, SupervisorNavTicketCount } from 'app/core/models/viewmodel/NavTicketCountDTO';
import { MyTicketsCount } from 'app/core/models/viewmodel/TicketsCount';
import { AccountService } from 'app/core/services/account.service';
import { CommonService } from 'app/core/services/common.service';
import { HeaderTabsService } from 'app/core/services/header-tabs.service';
import { NavigationService } from 'app/core/services/navigation.service';
import { AdvanceFilterService } from 'app/social-inbox/services/advance-filter.service';
import { FilterService } from 'app/social-inbox/services/filter.service';
import { MainService } from 'app/social-inbox/services/main.service';
import { ReplyService } from 'app/social-inbox/services/reply.service';
import { TicketsService } from 'app/social-inbox/services/tickets.service';
import { take } from 'rxjs/operators';
import { SubSink } from 'subsink/dist/subsink';
import { PostOptionService } from '../../services/post-options.service';



@Component({
  selector: 'app-post-options',
  templateUrl: './post-options.component.html',
  styleUrls: ['./post-options.component.scss']
})
export class PostOptionsComponent implements OnInit, OnDestroy {
  selectedItem: any;
  @Input() postDetailTab: LocobuzzTab;
  currentTab: Tab;
  overlayRef: OverlayRef;
  IsDisplayBlock = false;
  @ViewChild('overlayTemplate') overlayTemplate: CdkPortal ;
  addFilterData: any =  {
    requiredFor: 'Filter',
    submit: 'Apply'
  };

  constructor(private filterService: FilterService,
              private _advanceFilterService: AdvanceFilterService,
              private _tabService: HeaderTabsService,
              public dialog: MatDialog,
              private mainService: MainService,
              private accountService: AccountService,
              private _postOptionService: PostOptionService,
              private _commonService: CommonService,
              private _replyService: ReplyService,
              private _navigationService: NavigationService,
              private _ticketService: TicketsService,
              private overlay: Overlay
  ) {
    this.getScreenSize();
  }
  navbar: any;
  toggleSearch: boolean = false;
  loopThreshold: number = 4;
  unseenMyTicketCount: MyTicketsCount;
  AllTicketCount: MyTicketsCount;
  supervisorNavTicketCount: SupervisorNavTicketCount;
  agentNavTicketCount: AgentNavTicketCount;
  userRole: UserRoleEnum;
  currentUser: AuthUser;
  optionForm: FormGroup;
  selectedTicketOption: {
    label: string,
    dbvalue: number
  } = {
      label: 'More',
      dbvalue: null
    };
  searchForm: FormControl;
  optionMobTab = true;
  scrHeight: any;
  scrWidth: any;
  currentPostType: PostsType;
  mentionCount: MentionCounts;
  actionchk = true;
  nonactionchk = true;
  brandpost = true;
  brandreply = true;
  filetrOverlay = false;
  callFilterComp = false;
  subs = new SubSink();
  chatbotIcon: any;
  customOverlay: any;
  postNavClicked = false;
  ngOnInit(): void {

    this.filterService.closeFilterModal.subscribe(obj => {
      // this.filetrOverlay = obj;
      if (!obj)
      {
          this.onNoClick();
      }
    });
    // this.filterService.currentBrandSource.subscribe(
    //   (value) => {
    //     if (value) {
    //       this.navbar = this._tabService.getNavData();
    //       this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.currentUser = user);
    //       this.userRole = this.currentUser.data.user.role;
    //       this.getUnseenTicketCount();
    //     }
    //   }
    // );
    // this.filterService.filterTabSource.subscribe(
    //   (tabObj) => {
    //     if (tabObj) {
    //       if (tabObj.guid === this.postDetailTab.tab.guid)
    //       {
    //         this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.currentUser = user);
    //         this.userRole = this.currentUser.data.user.role;
    //         this.getUnseenTicketCount();
    //       }
    //     }
    //   }
    // );
    // this._advanceFilterService.filterTabSource.subscribe(
    //   (tabObj) => {
    //     if (tabObj) {
    //       if (tabObj.guid === this.postDetailTab.tab.guid)
    //       {
    //         this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.currentUser = user);
    //         this.userRole = this.currentUser.data.user.role;
    //         this.getUnseenTicketCount();
    //       }
    //     }
    //   }
    // );
    this.subs.add(this.filterService.currentCountData.subscribe(obj => {
      if (obj)
      {
        if (obj.tab.guid === this.postDetailTab.tab.guid && !this.postNavClicked)
        {
          this.currentTab = obj.tab;
          if (obj.posttype === PostsType.Tickets)
          {
              const tickettypearray = JSON.parse(this.currentTab.filterJson).ticketType;
              this.selectedItem = tickettypearray && tickettypearray.length > 0 ? tickettypearray[0] : 4;
              this.currentPostType = PostsType.Tickets;
              this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.currentUser = user);
              this.userRole = this.currentUser.data.user.role;
              this.getUnseenTicketCount();
          }
          else if (obj.posttype === PostsType.Mentions)
          {
            this.selectedItem = this.selectedItem ? this.selectedItem : 2;
            if (obj.MentionCount)
            {
              this.currentPostType = PostsType.Mentions;
              this.mentionCount = obj.MentionCount;
            }
          }
        }
        this.postNavClicked = false;
      }
    }));

    this.subs.add(this.filterService.filterApiSuccessFull.subscribe(
      (value) => {
        if (value) {
          this.callFilterComp = true;
        }
      }
    ));

    this.subs.add(this._ticketService.ticketStatusChange.subscribe(
      (value) => {
        if(value)
        {
          if(this.currentPostType === PostsType.Tickets)
          {
            this._ticketService.ticketStatusChange.next(false);
            this.getUnseenTicketCount();
          }        
        }
      }
    ));

    this.optionForm = this._postOptionService.optionForm;

    this.searchForm = new FormControl('');
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this._postOptionService.optionForm = this.optionForm;
  }

  public get userRoleEnum(): typeof UserRoleEnum {
    return UserRoleEnum;
  }

  public get getPostType(): typeof PostsType {
    return PostsType;
  }

  onClickNav(obj, tickettype): void {
    //console.log(obj.value);
    this._ticketService.selectedPostList = [];
    this._ticketService.postSelectTrigger.next(0);
    this._ticketService.bulkMentionChecked = [];
    this.postNavClicked = true;
    if (this.currentPostType === PostsType.Tickets)
    {
      this.filterService.setTicketType(+tickettype);
      this._commonService.changeTabFilterJson();
      this.filterService.filterTabSource.next(this.postDetailTab.tab);
      this.selectedItem = obj.dbValue;
      if (+obj.level === 2) {
      this.selectedTicketOption = {
        label: obj.name,
        dbvalue: obj.dbValue
      };
    }
    }else{
      this.selectedItem = tickettype;
      this.filterService.setMention([tickettype]);
      this._commonService.changeTabFilterJson();
      this.filterService.filterTabSource.next(this.postDetailTab.tab);
    }
  }

  toggleActionable(event): void {
    this.postNavClicked = true;
    const tabevent: TabEvent = {
      tab: this.postDetailTab.tab,
      event: FilterEvents.togleActionable,
      value: event.checked
    }
    // this.filterService.togleActionable(event.checked);
    this.filterService.filterTab.next(tabevent);
    this.filterService.filterTabSource.next(this.postDetailTab.tab);
  }

  toggleNonActionable(event): void {
    this.postNavClicked = true;
    const tabevent: TabEvent = {
      tab: this.postDetailTab.tab,
      event: FilterEvents.togleNonActionable,
      value: event.checked
    }
    this.filterService.filterTab.next(tabevent);
    // this.filterService.togleNonActionable(event.checked);
    this.filterService.filterTabSource.next(this.postDetailTab.tab);
  }

  togleBrandReplies(event): void{
    this.postNavClicked = true;
    const tabevent: TabEvent = {
      tab: this.postDetailTab.tab,
      event: FilterEvents.togleBrandReplies,
      value: event.checked
    }
    this.filterService.filterTab.next(tabevent);
    // this.filterService.togleBrandReplies(event.checked);
    this.filterService.filterTabSource.next(this.postDetailTab.tab);
  }

  togleBrandPost(event): void{
    this.postNavClicked = true;
    const tabevent: TabEvent = {
      tab: this.postDetailTab.tab,
      event: FilterEvents.togleBrandPost,
      value: event.checked
    }
    this.filterService.filterTab.next(tabevent);
    // this.filterService.togleBrandPost(event.checked);
    this.filterService.filterTabSource.next(this.postDetailTab.tab);
  }

  openDialog(): void {
    const chatbotIcon = document.querySelector('.chatbot__bubble');
    const customOverlay = document.querySelector('.custom-overlay');
    customOverlay.classList.add('display-flex');
    chatbotIcon.classList.add('z-index-inherit');
    // const dialogRef = this.dialog.open(FilterComponent, {
    //   width: '1000px', disableClose: true, autoFocus: false,
    //   data: {
    //     requiredFor: 'Filter',
    //     submit: 'Apply'
    //   }
    // });
  }
  onNoClick(): void{
    const chatbotIcon = document.querySelector('.chatbot__bubble');
    const customOverlay = document.querySelector('.custom-overlay');
    customOverlay.classList.remove('display-flex');
    chatbotIcon.classList.remove('z-index-inherit');
  }

  getTicketCount(): void {
    const filterObj = this.filterService.getGenericFilter();
    filterObj.ticketType = [];
    console.log('Ticket Count API JSON', filterObj);
    this.mainService
      .GetTicketsCount(filterObj)
      .subscribe((data) => {
        this.AllTicketCount = data;
        if (this.currentUser.data.user.role === UserRoleEnum.SupervisorAgent) {
          this.supervisorNavTicketCount = new SupervisorNavTicketCount(this.AllTicketCount,
            this.unseenMyTicketCount);
          this.supervisorNavTicketCount.userRole = UserRoleEnum.SupervisorAgent;
        }
        else if (this.currentUser.data.user.role === UserRoleEnum.AGENT) {
          this.agentNavTicketCount = new AgentNavTicketCount(this.AllTicketCount,
            this.unseenMyTicketCount);
          this.agentNavTicketCount.userRole = UserRoleEnum.AGENT;
        }
        console.log('AllTicketCount', this.AllTicketCount);
      });
  }

  getUnseenTicketCount(): void {
    const filterObj = this.filterService.getGenericFilter();
    filterObj.ticketType = [];
    this.currentPostType = filterObj.postsType;
    this.mainService
      .GetUnseenTicketsCount(filterObj)
      .subscribe((data) => {
        this.unseenMyTicketCount = data;
        this.getTicketCount();
      });
  }

  isApply(isRemoved: boolean = false): void {
    if (this.toggleSearch || isRemoved) {
      this.submitSearchForm();
    }
  }

  searchFormFill(event): void {
    this.searchForm = event[0];
    if (event[1] && event[0].value !== '') {
      this.isApply();
    }else if (event[0].value === ''){
      this.isApply(true);
    }
  }

  setAutoRender(event): any
  {
    const autorenderjson = localStorage.getItem('IsTicketAutoRender');
    if (autorenderjson && autorenderjson !== '')
    {
      const autorenderTabs = JSON.parse(autorenderjson);
      if (autorenderTabs && autorenderTabs.length > 0)
    {
      const tabexist = autorenderTabs.findIndex(obj => obj.tab.guid === this.currentTab.guid);
      if (tabexist > -1)
      {
        const currentRenderSetting: AutoRenderSetting = autorenderTabs[tabexist];
        currentRenderSetting.tab = this.currentTab;
        currentRenderSetting.autoRender = event.value;
        currentRenderSetting.time = currentRenderSetting.time;
        currentRenderSetting.autoClose = currentRenderSetting.autoClose;
        autorenderTabs.splice(tabexist, 1);
        autorenderTabs.push(currentRenderSetting);
        this._navigationService.autoRenderSetting.next(currentRenderSetting);
        localStorage.setItem('IsTicketAutoRender', JSON.stringify(autorenderTabs));
      }
      else{
        const tabArray: AutoRenderSetting[] = [];
        const obj: AutoRenderSetting = {
        tab: this.currentTab,
        autoRender: event.value,
        time: null,
        autoClose: false
      };

        tabArray.push(obj);

        localStorage.setItem('IsTicketAutoRender', JSON.stringify(tabArray));
        this._navigationService.autoRenderSetting.next(obj);
      }
    }
  }
    else
    {
      const tabArray: AutoRenderSetting[] = [];
      const obj: AutoRenderSetting = {
        tab: this.currentTab,
        autoRender: event.value,
        time: null,
        autoClose: false
      };

      tabArray.push(obj);

      localStorage.setItem('IsTicketAutoRender', JSON.stringify(tabArray));
      this._navigationService.autoRenderSetting.next(obj);
    }
  }

  submitSearchForm(): void {
    const tabevent: TabEvent = {
      tab: this.postDetailTab.tab,
      event: FilterEvents.searchInFilter,
      value: this.searchForm.value
    }
    this.filterService.filterTab.next(tabevent);
    // this.filterService.setSearchInFilter(this.searchForm.value);
    this._commonService.changeTabFilterJson();
    // this.filterService.searchInFilter(this.searchForm.value);
  }

 @HostListener('window:resize', ['$event'])
  getScreenSize(event?): void {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
    if (this.scrWidth <= 768 && this.scrWidth >= 320) {
      this.optionMobTab = false;
    }
  }
  OptionSelect(): void {
    this.optionMobTab = !this.optionMobTab;
  }
}
