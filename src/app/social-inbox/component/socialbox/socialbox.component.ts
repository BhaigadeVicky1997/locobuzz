import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { post } from 'app/app-data/post';
import { LogStatus } from 'app/core/enums/LogStatus';
import { PostActionType } from 'app/core/enums/PostActionType';
import { UserRoleEnum } from 'app/core/enums/userRoleEnum';
import { AuthUser } from 'app/core/interfaces/User';
import { BulkMentionChecked } from 'app/core/models/dbmodel/TicketReplyDTO';
import { BaseMention } from 'app/core/models/mentions/locobuzz/BaseMention';
import { Tab, TabSignalR } from 'app/core/models/menu/Menu';
import { AutoRenderSetting, AutoRenderTime } from 'app/core/models/viewmodel/AutoRenderSetting';
import { Filter, GenericFilter, PostsType } from 'app/core/models/viewmodel/GenericFilter';
import { LocobuzzTab } from 'app/core/models/viewmodel/LocobuzzTab';
import { AccountService } from 'app/core/services/account.service';
import { CommonService } from 'app/core/services/common.service';
import { NavigationService } from 'app/core/services/navigation.service';
import { TicketsignalrService } from 'app/core/services/signalrservices/ticketsignalr.service';
import { FilterService } from 'app/social-inbox/services/filter.service';
import { ReplyService } from 'app/social-inbox/services/reply.service';
import { SubSink } from 'subsink';
import { TicketsService } from 'app/social-inbox/services/tickets.service';
import { take } from 'rxjs/operators';
import { AdvanceFilterService } from './../../services/advance-filter.service';

@Component({
  selector: 'app-socialbox',
  templateUrl: './socialbox.component.html',
  styleUrls: ['./socialbox.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialboxComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() postData: {}[] = post;
  @Input() postDetailTab: LocobuzzTab;
  TicketList: BaseMention[] = [];
  MentionList: BaseMention[] = [];
  filter: GenericFilter;
  postloader: boolean = false;
  ticketsFound: number;
  result: string = '';
  tickets: BaseMention[] = [];
  currentPageType: string;
  currentPostType: PostsType;
  isadvance: boolean = false;
  selectedPostList: number[] = [];
  bulkActionpanelStatus: boolean = false;
  firstFilterApply: boolean = false;
  firstFilterJson: GenericFilter;
  loadedNavLinks = [];
  brandactivity = false;
  useractivity = false;
  actionchk = false;
  nonactionchk = false;
  brandpost = false;
  brandreply = false;
  pagerCount: number;
  ticketInterval: any;
  mentionInterval: any;
  showDataFound = false;
  currentAutoRenderSetting: number;
  checkAllCheckBox = false;
  currentUser: AuthUser;
  testingmentionObj = `[{"concreteClassName":"LocobuzzNG.Entities.Classes.Mentions.TwitterMention","inReplyToUserID":"0","isShared":false,"urlClicks":null,"tweetClick":null,"followingCount":null,"isDMSent":false,"taggedUsersJson":"[{\"Userid\":\"1150754595016040448\",\"Name\":\"BittuLoco2030\",\"UserType\":null,\"offset\":0,\"length\":13}]","newSelectedTaggedUsersJson":null,"mainTweetid":null,"canReplyPrivately":false,"mentionMetadata":{"videoView":0,"postClicks":0,"postVideoAvgTimeWatched":0,"likeCount":0,"commentCount":null,"reach":null,"impression":null,"videoViews":0,"engagementCount":0,"reachCountRate":0,"impressionsCountRate":0,"engagementCountRate":0,"isFromAPI":false,"shareCount":0},"author":{"isVerifed":false,"screenname":"gonsalve_s","followersCount":23,"followingCount":0,"kloutScore":0,"bio":null,"tweetCount":0,"isBlocked":false,"isMuted":false,"isUserFollowing":false,"isBrandFollowing":false,"isMarkedInfluencer":false,"markedInfluencerID":0,"markedInfluencerCategoryName":"Automobile","markedInfluencerCategoryID":27,"influences":null,"interests":null,"influencesString":null,"insterestsString":null,"canHaveUserTags":false,"canBeMarkedInfluencer":false,"canHaveConnectedUsers":false,"profileUrl":null,"socialId":"1054251559826141184","isAnonymous":false,"name":"Dany Gonsalve's مرحبا","channel":0,"url":null,"profileImage":null,"nps":0,"sentimentUpliftScore":0,"id":0,"picUrl":"https://s3.amazonaws.com/locobuzz.socialimages/1054251559826141184.jpg","glbMarkedInfluencerCategoryName":"Automobile","glbMarkedInfluencerCategoryID":27,"interactionCount":0,"location":null,"locationXML":null,"userSentiment":0,"channelGroup":1,"latestTicketID":"110229","userTags":[],"markedInfluencers":[],"connectedUsers":[],"locoBuzzCRMDetails":{"id":0,"name":null,"emailID":null,"alternativeEmailID":null,"phoneNumber":null,"link":null,"address1":null,"address2":null,"notes":null,"city":null,"state":null,"country":null,"zipCode":null,"alternatePhoneNumber":null,"ssn":null,"customCRMColumnXml":null,"gender":null,"age":0,"dob":null,"modifiedByUser":null,"modifiedTime":null,"modifiedDateTime":"0001-01-01T00:00:00","modifiedTimeEpoch":0,"timeoffset":0,"dobString":null,"isInserted":false},"previousLocoBuzzCRMDetails":null,"crmColumns":null,"lastActivity":null,"firstActivity":null},"description":"@BittuLoco2030 tat chk 6","canReply":true,"parentSocialID":null,"parentPostID":null,"parentID":null,"id":null,"socialID":"1376886768742506501","title":null,"isActionable":true,"channelType":7,"channelGroup":1,"mentionID":null,"url":null,"sentiment":0,"tagID":335204,"isDeleted":false,"isDeletedFromSocial":false,"mediaType":1,"mediaTypeFormat":1,"status":0,"isSendFeedback":false,"isSendAsDMLink":false,"isPrivateMessage":false,"isBrandPost":false,"updatedDateTime":null,"location":null,"mentionTime":"2021-03-30T13:19:21","contentID":186220,"isRead":true,"readBy":33536,"readAt":"2021-03-31T21:08:12.067","numberOfMentions":"13","languageName":null,"isReplied":false,"isParentPost":false,"inReplyToStatusId":0,"replyInitiated":false,"isMakerCheckerEnable":false,"attachToCaseid":null,"mentionsAttachToCaseid":null,"insertedDate":"2020-01-23T11:55:32.053","mentionCapturedDate":null,"mentionTimeEpoch":1617110361,"modifiedDateEpoch":1617179433.9,"likeStatus":false,"modifiedDate":"2021-03-31T08:30:33.9","brandInfo":{"brandID":7121,"brandName":"wrong","categoryGroupID":0,"categoryID":0,"categoryName":null,"mainBrandID":0,"compititionBrandIDs":null,"brandFriendlyName":"Wrong Brand","brandLogo":null,"isBrandworkFlowEnabled":false,"brandGroupName":null},"upperCategory":{"id":0,"name":null,"userID":null,"brandInfo":null},"categoryMap":[{"id":53927,"name":"shivam22","upperCategoryID":0,"sentiment":0,"isTicket":false,"subCategories":[]}],"retweetedStatusID":"0","ticketInfo":{"ticketID":110229,"tagID":335204,"assignedBy":null,"assignedTo":null,"assignedToTeam":null,"assignToAgentUserName":null,"readByUserName":"aditya ghosalkar","escalatedTotUserName":"ACTCSD G","escalatedToBrandUserName":"shivam test","assignedAt":"0001-01-01T00:00:00","previousAssignedTo":0,"escalatedTo":22946,"escaltedToAccountType":0,"escalatedToCSDTeam":null,"escalatedBy":null,"escalatedAt":"2020-01-24T08:55:33.123","escalatedToBrand":22911,"escalatedToBrandTeam":null,"escalatedToBrandBy":null,"escalatedToBrandAt":"2020-01-29T13:18:34.483","status":14,"updatedAt":"0001-01-01T00:00:00","createdAt":"0001-01-01T00:00:00","numberOfMentions":13,"ticketPriority":0,"lastNote":"zxdxcx","latestTagID":335204,"autoClose":false,"isAutoClosureEnabled":false,"isMakerCheckerEnable":false,"ticketPreviousStatus":null,"guid":null,"srid":null,"previousAssignedFrom":null,"previouAgentWorkflowWorkedAgent":null,"csdTeamId":null,"brandTeamId":null,"teamid":null,"previousAgentAccountType":null,"ticketAgentWorkFlowEnabled":false,"makerCheckerStatus":0,"messageSentforApproval":null,"replyScheduledDateTime":null,"requestedByUserid":null,"workFlowTagid":null,"workflowStatus":0,"ssreStatus":0,"isCustomerInfoAwaited":false,"utcDateTimeOfOperation":null,"toEmailList":null,"ccEmailList":null,"bccEmailList":null,"taskJsonList":null,"caseCreatedDate":"2020-01-23T11:55:32.053","tatflrBreachTime":"2020-01-23T11:58:32.053","lockUserID":null,"lockDatetime":null,"lockUserName":null,"isTicketLocked":false,"tattime":624157,"flrtatSeconds":null,"replyEscalatedToUsername":null,"replyUserName":null,"replyUserID":0,"replyApprovedOrRejectedBy":null,"ticketProcessStatus":null,"ticketProcessNote":null,"replyUseid":0,"escalationMessage":null,"isSubscribed":false,"ticketUpperCategory":{"id":0,"name":null,"userID":null,"brandInfo":null},"ticketCategoryMap":[{"id":53915,"name":"other random words","upperCategoryID":0,"sentiment":0,"isTicket":false,"subCategories":[{"id":42551,"name":"FLR","categoryID":0,"sentiment":0,"subSubCategories":[]}]}],"ticketCategoryMapText":"<CategoryMap>\r\n<Category><ID>53915</ID><Name>other random words</Name><Sentiment>0</Sentiment><SubCategory><ID>42551</ID><Name>FLR</Name><Sentiment>0</Sentiment></SubCategory></Category></CategoryMap>\r\n","latestResponseTime":null},"ticketInfoSsre":{"ssreOriginalIntent":0,"ssreReplyVerifiedOrRejectedBy":null,"latestMentionActionedBySSRE":0,"transferTo":2,"ssreEscalatedTo":0,"ssreEscalationMessage":null,"intentRuleType":0,"ssreStatus":0,"retrainTagid":0,"retrainBy":0,"retrainDate":"0001-01-01T00:00:00","ssreMode":0,"ssreIntent":0,"ssreReplyType":0,"intentFriendlyName":null,"intentOrRuleID":0,"latestSSREReply":null,"ssreReplyVerifiedOrRejectedTagid":132424,"ssreReply":{"authorid":null,"replyresponseid":null,"replymessage":null,"channelType":0,"escalatedTo":0,"escalationMessage":null}},"ticketInfoCrm":{"srUpdatedDateTime":null,"srid":null,"isPushRE":0,"srStatus":0,"srCreatedBy":null,"srDescription":null,"remarks":null,"jioNumber":null,"partyid":null,"isPartyID":0,"mapid":null,"isFTR":null},"attachmentMetadata":{"mediaContents":[],"mediaContentText":"<Attachments></Attachments>","mediaUrls":"","mediaAttachments":[],"attachments":"<Attachments></Attachments>"},"makerCheckerMetadata":{"workflowReplyDetailID":0,"replyMakerCheckerMessage":null,"isSendGroupMail":false,"replyStatus":null,"replyEscalatedTeamName":null,"workflowStatus":0,"isTakeOver":null},"categoryMapText":"<CategoryMap>\r\n<Category><ID>53927</ID><Name>shivam22</Name><Sentiment>0</Sentiment></Category></CategoryMap>\r\n","ticketID":110229,"isSSRE":false,"settingID":12269,"mediaContents":null}]`;
  noDataFound = false;
  subs = new SubSink();

  constructor(
    private _ticketService: TicketsService,
    private _filterService: FilterService,
    private _advanceFilterService: AdvanceFilterService,
    public dialog: MatDialog,
    private navService: NavigationService,
    private route: ActivatedRoute,
    private _ticketSignalrService: TicketsignalrService,
    private _commonService: CommonService,
    private _navigationService: NavigationService,
    private _replyService: ReplyService,
    private _accountService: AccountService) { }

  ngOnInit(): void {
    this._accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.currentUser = user));

    if (this.postDetailTab) {
      this.subs.add(this.navService.fireSelectedTabInitialEvent.subscribe(guid => {
        if (guid) {
          if (guid === this.postDetailTab.guid) {
            this.firstFilterApply = true;
            this.initializePageComponent(this.postDetailTab.tab);
            this.setAutoRenderSetting();
          }
        }
      }));

      // if (this.postDetailTab.fireInitializeEvent)
      // {
      //   this.initializePageComponent(this.postDetailTab.tab);
      // }
    }

  }

  setAutoRenderSetting(): void {
    this.subs.add(this.navService.autoRenderSetting.subscribe(renderSetting => {
      if (renderSetting) {
        if (renderSetting.tab.guid === this.postDetailTab.guid) {
          this.setRenderTiming(renderSetting.autoRender);
        }
      }
    }));
    this.subs.add(this._ticketSignalrService.ticketSignalCall.subscribe(tabObj => {
      if (tabObj) {
        if (tabObj.tab.guid === this.postDetailTab.guid) {
          this.checkIfTicketsRecieved(tabObj);
        }
      }
    }));
    this.subs.add(this._ticketSignalrService.removeTicketCall.subscribe(ticketId => {
      if (ticketId && (+ticketId) > 0)
      {
        this.closeTicket(+ticketId);
      }
    }));
    this.subs.add(this._ticketSignalrService.mentionSignalCall.subscribe(ticketId => {
      if (ticketId && (+ticketId) > 0)
      {
        this.closeMention(+ticketId);
      }
    }));

    const autorenderjson = localStorage.getItem('IsTicketAutoRender');
    if (autorenderjson && autorenderjson !== '') {
      const autorenderTabs = JSON.parse(autorenderjson);
      if (autorenderTabs && autorenderTabs.length > 0)
    {
      const tabexist = autorenderTabs.findIndex(obj => obj.tab.guid === this.postDetailTab.guid);
      if (tabexist > -1)
      {
        const currentRenderSetting: AutoRenderSetting = autorenderTabs[tabexist];
        this.setRenderTiming(currentRenderSetting.autoRender);
      }
      else{
        this.setRenderTiming(AutoRenderTime.AutoRender);
      }
    }
  }
    else
    {
      this.setRenderTiming(AutoRenderTime.AutoRender);
    }
  }

  setRenderTiming(value): void {
    // const tabindex = this.navService.fetchedTabList.findIndex(obj => obj.guid === this.postDetailTab.guid);
    // let genericFilter: GenericFilter;
    // if (tabindex > -1)
    // {
    //   genericFilter = JSON.parse(this.navService.fetchedTabList[tabindex].filterJson);
    // }
    // this.filter = this.isadvance ? this._advanceFilterService.getGenericFilter()
    //  : this._filterService.getGenericFilter();
    this.currentAutoRenderSetting = value;
    if (this.ticketInterval) {
      clearInterval(this.ticketInterval);
    }

    if (+value === AutoRenderTime.AskBeforeRender) {
      if (this.currentPostType === PostsType.Tickets) {

      }
      else if (this.currentPostType === PostsType.Mentions) {

      }
    }
    else if (+value === AutoRenderTime.AutoRender) {
      this.ticketInterval = setInterval(() => {
        // this.checkIfTicketsRecieved();
      }, 10000);
    }
    else if (+value === AutoRenderTime.RenderThirtySec) {
      this.ticketInterval = setInterval(() => {
        // this.checkIfTicketsRecieved();
        this.autoRenderData();
      }, 30000);
    }
    else if (+value === AutoRenderTime.RenderOneMinute) {
      this.ticketInterval = setInterval(() => {
        // this.checkIfTicketsRecieved();
        this.autoRenderData();
      }, 60000);
    }
    else if (+value === AutoRenderTime.RenderTwoMinute) {
      this.ticketInterval = setInterval(() => {
        // this.checkIfTicketsRecieved();
        this.autoRenderData();
      }, 120000);
    }
  }

  getCurrentFilter(): void {

  }

  checkIfTicketsRecieved(tabObj: TabSignalR): void {
    const tabindex = this.navService.fetchedTabList.findIndex(obj => obj.guid === this.postDetailTab.guid);
    let genericFilter: GenericFilter;
    if (tabindex > -1) {
      genericFilter = JSON.parse(this.navService.fetchedTabList[tabindex].filterJson);
    }

    if (Number(this.currentAutoRenderSetting) === AutoRenderTime.AskBeforeRender
       && this.TicketList.length !== 0)
    {
        this.showDataFound = true;
    }
    else
    {
      if (this.currentPostType === PostsType.Tickets)
      {
        // if (Number(tabObj.signalId) === 1)
        {
          const ticketArray = [];
          for (const tickets of this._ticketSignalrService.TicketSignalRObj) {
            ticketArray.push(+tickets.CaseID);
          }
          const ticketObj: Filter = {
            name: 'CD.CaseID',
            value: ticketArray,
            type: 2
          };

          genericFilter.filters.push(ticketObj);
          if (Number(tabObj.signalId) !== 1)
          {
            this.closeTicket(tabObj.message.TicketID);
          }
          this.getTicketsByTicketId(genericFilter);

          // change filter count data
          const CountData = {
            MentionCount: null,
            tab: this.postDetailTab.tab,
            posttype: PostsType.Tickets
          };
          this._filterService.currentCountData.next(CountData);
        }
      }
      else if (this.currentPostType === PostsType.Mentions) {
      }
    }
  }

  getTicketsByTicketId(genericFilter: GenericFilter): void
  {
    this._ticketSignalrService.TicketSignalRObj = [];
    this._ticketService.GetTicketsByTicketIds(genericFilter).subscribe(resp => {
      if (resp && resp.length > 0)
      {
        this.ticketsFound = this.ticketsFound + resp.length;
        this.postloader = false;
        const MentionList =  JSON.parse(JSON.stringify(this.TicketList));
        MentionList.unshift(...resp);
        this.TicketList = [];
        this.TicketList = MentionList;
        console.log('TikcetList', this.TicketList);
      }
     },
     err => {
       console.log(err);
       this.postloader = false;
     },
     () => {
         console.log('call completed');
     });
  }

  loadNewData(): void {
    this.showDataFound = false;

    if (this.isadvance) {
      this.filter = this._advanceFilterService.getGenericFilter();
    }
    else {
      this.filter = this._filterService.getGenericFilter();
    }

    if (this.currentPostType === PostsType.Tickets) {
      const CountData = {
        MentionCount: null,
        tab: this.postDetailTab.tab,
        posttype: PostsType.Tickets
      };
      this._filterService.currentCountData.next(CountData);
      this.GetTickets(this.filter, true);
    }
    if (this.currentPostType === PostsType.Mentions) {
      this.getMentionsCount(this.filter);
      this.getMentions(this.filter, true);
    }
  }

  public get postTypeEnum(): typeof PostsType {
    return PostsType;
  }

  initializePageComponent(tab?: Tab): void {
    let genricfilterObj;
    if (tab) {
      const filterJson = tab.filterJson ? JSON.parse(tab.filterJson) : null;
      if (filterJson) {
        genricfilterObj = filterJson as GenericFilter;
        if (genricfilterObj) {
          // this.firstFilterJson = tab.userID === -1 ? this.getDefaultTabJson(genricfilterObj) :  genricfilterObj;
          if (genricfilterObj.postsType) {
            this.currentPostType = genricfilterObj.postsType;
            if (this.currentPostType === PostsType.Tickets) {
              this.currentPageType = 'ticket';
            }
            if (this.currentPostType === PostsType.Mentions) {
              this.currentPageType = 'mention';
            }
          }
        }
      }
    }
    this.subs.add(this._filterService.filterTabSource.subscribe(
      (tabObj) => {
        if (tabObj) {
          if (tabObj.guid === tab.guid) {
            // if (tabObj.userID !== -1)
            // {
            // this._filterService.reverseApply(JSON.parse(tabObj.filterJson));
            // }
            // this.filter = this.firstFilterApply && genricfilterObj ? this.getDefaultTabJson(tabObj, genricfilterObj)
            // : this._filterService.getGenericFilter() ;
            // this.filter = this._filterService.getGenericFilter() ;
            // reverseApply when it is first call
            this.filter = this.firstFilterApply && genricfilterObj ? this.reverseApplyGetFilter(tabObj.filterJson)
              : this._filterService.getGenericFilter();
            // const filterFromObject: FilterFilledData = this._filterService.reverseApply(this.filter, true);
            // console.log(`%c reverse filter object -> ${JSON.stringify(filterFromObject)}`, 'background: #222; color: #bada55');
            // console.log(`%c filter object -> ${JSON.stringify(this.filter)}`, 'background: #222; color: #bada55');
            console.log(`%c start date ->  ${this.filter.startDateEpoch}`, 'background: #222; color: #bada55');
            console.log(`%c end date -> ${this.filter.endDateEpoch}`, 'background: #222; color: #bada55');

            this.postDetailTab.tab.Filters = this.filter;

            this.firstFilterApply = false;
            if (this.filter.postsType === PostsType.Tickets) {
              this.currentPageType = 'ticket';
              this.currentPostType = this.filter.postsType;
              const CountData = {
                MentionCount: null,
                tab: this.postDetailTab.tab,
                posttype: PostsType.Tickets
              };
              this._filterService.currentCountData.next(CountData);
              this.GetTickets(this.filter, true);
            }
            if (this.filter.postsType === PostsType.Mentions) {
              this.currentPageType = 'mention';
              this.currentPostType = this.filter.postsType;
              this.getMentionsCount(this.filter);
              this.getMentions(this.filter, true);
            }
            this.isadvance = false;
          }
        }
      }
    ));
    this.subs.add(this._advanceFilterService.filterTabSource.subscribe(
      (tabObj) => {
        if (tabObj) {
          if (tabObj.guid === tab.guid) {
            // if (tabObj.userID !== -1)
            // {
            // }
            // this.filter = this.firstFilterApply && genricfilterObj ? this.getDefaultTabJson(tabObj, genricfilterObj)
            // :  this._advanceFilterService.getGenericFilter();

            // reverseApply when it is first call
            this.filter = this.firstFilterApply && genricfilterObj ? this.reverseApplyGetFilter(tabObj.filterJson)
              : this._advanceFilterService.getGenericFilter();

            // console.log(`%c filter object -> ${JSON.stringify(this.filter)}`, 'background: #222; color: #bada55');
            console.log(`%c start date ->  ${this.filter.startDateEpoch}`, 'background: #222; color: #bada55');
            console.log(`%c end date -> ${this.filter.endDateEpoch}`, 'background: #222; color: #bada55');

            // this.filter = this._advanceFilterService.getGenericFilter();
            this.postDetailTab.tab.Filters = this.filter;

            this.firstFilterApply = false;
            if (this.filter.postsType === PostsType.Tickets) {
              this.currentPageType = 'ticket';
              this.currentPostType = this.filter.postsType;
              const CountData = {
                MentionCount: null,
                tab: this.postDetailTab.tab,
                posttype: PostsType.Tickets
              };
              this._filterService.currentCountData.next(CountData);
              this.GetTickets(this.filter, true);
            }
            if (this.filter.postsType === PostsType.Mentions) {
              this.currentPageType = 'mention';
              this.currentPostType = this.filter.postsType;
              this.getMentionsCount(this.filter);
              this.getMentions(this.filter, true);
            }
            this.isadvance = true;
          }
        }
      }
    ));
  }

  getDefaultTabJson(tab: Tab, genericFilter: GenericFilter): GenericFilter {
    if (tab.userID === -1) {
      const genfilterObj = this._filterService.getGenericFilter();
      genfilterObj.orderBYColumn = genericFilter.orderBYColumn;
      genfilterObj.orderBY = genericFilter.orderBY;
      genfilterObj.postsType = genericFilter.postsType;
      return genfilterObj;

    }
    return genericFilter;

  }

  reverseApplyGetFilter(filterJson: string): GenericFilter {
    const genericFilter: GenericFilter = JSON.parse(filterJson);
    if (genericFilter.isAdvance) {
      this._filterService.reverseApply(JSON.parse(filterJson));
      this._commonService.changeTabFilterJson();
      return this._advanceFilterService.getGenericFilter();
    } else {
      this._filterService.reverseApply(JSON.parse(filterJson));
      this._commonService.changeTabFilterJson();
      return this._filterService.getGenericFilter();
    }
  }

  private GetTickets(filterObj, firstCall): void {
    this.postloader = true;
    // filterObj = this.checkAutoEnableforAgent(filterObj);
    this._ticketService.GetTickets(filterObj).subscribe(resp => {
      this.postloader = false;
      if(resp && resp.length == 0){
        this.noDataFound = true;
      }
      this.TicketList = resp;
      this.checkAllCheckBox = false;
      console.log('TikcetList', this.TicketList);
      this.ticketsFound = this._ticketService.ticketsFound;
      this.pagerCount = this._ticketService.ticketsFound;
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
      err => {
        console.log(err);
        this.postloader = false;
        this.noDataFound = true;
      },
      () => {
        console.log('call completed');
      });
  }

  OnPageChange(event: PageEvent): void {
    console.log(event);
    if (this.isadvance) {
      this.filter = this._advanceFilterService.getGenericFilter();
    }
    else {
      this.filter = this._filterService.getGenericFilter();
    }
    this.filter.oFFSET = event.pageIndex * event.pageSize;
    if (event.pageIndex !== event.previousPageIndex) {
      if (this.currentPostType === PostsType.Tickets) {
        this.GetTickets(this.filter, false);
      }
      else if (this.currentPostType === PostsType.Mentions) {
        this.getMentions(this.filter, false);
      }
    }
  }

  checkAutoEnableforAgent(filterObj: GenericFilter): GenericFilter {
  if (+this.currentUser.data.user.role === UserRoleEnum.AGENT)
  {
    if (filterObj.brands)
    {
      for (const brand of filterObj.brands)
      {
        const autoindex = this._filterService.fetchedBrandData.
        findIndex(obj => +obj.brandID === brand.brandID && obj.autoQueuingEnabled === 1);
        if (autoindex > -1)
        {
          // filterObj
          filterObj.filters = filterObj.filters.filter(obj => {
            return obj.name !== 'users';
          });
          filterObj.filters.push({name: 'users', type: 2, value: [+this.currentUser.data.user.userId]});
          return filterObj;
        }
      }
    }
  }
  return filterObj;
  }

  ngOnDestroy(): void {
    // this._filterService.currentBrandSource.unsubscribe();
    this.subs.unsubscribe();
    if (this.ticketInterval) {
      clearInterval(this.ticketInterval);
    }
  }


  private getMentions(filterObj, firstCall): void {
    this.postloader = true;
    const removeBrandActFilter = this.removeBrandActivityIfBoth(filterObj);
    this._ticketService.getMentionList(removeBrandActFilter).subscribe((data) => {
      this.TicketList = data;
      this.checkAllCheckBox = false;
      // this.ticketsFound = data.length;
      if (firstCall) {
        if (this.paginator) {
          this.paginator.pageIndex = 0;
          this.paginator._changePageSize(this.paginator.pageSize);
        }
      }
      // this.ticketsFound = this._ticketService.ticketsFound;
      this.postloader = false;
      if(data && data.length == 0){
        this.noDataFound = true;
      }
    });
  }

  private getMentionsCount(filterObj): void {
    this.postloader = true;
    this.checkWhichActionIsClicked(filterObj);
    const removeBrandActivity = this.removeBrandActivity(filterObj);
    this._ticketService.getMentionCount(removeBrandActivity).subscribe((data) => {
      // this.TicketList = data;
      const CountData = {
        MentionCount: data,
        tab: this.postDetailTab.tab,
        posttype: PostsType.Mentions
      };
      this._filterService.currentCountData.next(CountData);
      if (data && data.totalRecords) {
        if (this.useractivity) {
          if (this.actionchk && this.nonactionchk) {
            this.pagerCount = data.userActivityCount;
            this.ticketsFound = data.userActivityCount;
          }
          else if (this.actionchk && this.nonactionchk === false) {
            this.pagerCount = data.actionable;
            this.ticketsFound = data.actionable;
          }
          else if (this.nonactionchk && this.actionchk === false) {
            this.pagerCount = data.nonActinable;
            this.ticketsFound = data.nonActinable;
          }
        }
        else if (this.brandactivity) {
          if (this.brandpost && this.brandreply) {
            this.pagerCount = data.brandActivityCount;
            this.ticketsFound = data.brandActivityCount;
          }
          else if (this.brandpost && this.brandreply === false) {
            this.pagerCount = data.brandPost;
            this.ticketsFound = data.brandPost;
          }
          else if (this.brandreply && this.brandpost === false) {
            this.pagerCount = data.brandReply;
            this.ticketsFound = data.brandReply;
          }
        }
      }
      this.postloader = false;
    });
  }

  toggleBulkSelect(selectedPost: [boolean, number]): void {
    if (selectedPost[0] === true) {
      this._ticketService.selectedPostList.push(+selectedPost[1]);
      this._ticketService.postSelectTrigger.next(this._ticketService.selectedPostList.length);
    } else {
      const index = this._ticketService.selectedPostList.indexOf(+selectedPost[1]);
      if (index > -1) {
        this._ticketService.selectedPostList.splice(index, 1);
        this._ticketService.postSelectTrigger.next(this._ticketService.selectedPostList.length);
      }
    }
    this.bulkActionpanelStatus = this._ticketService.selectedPostList.length >= 2 ? true : false;

  }

  postActionClicked(data: any): void {
    if (data.post)
    {
      if (data.operation)
      {
        if (data.operation === PostActionType.Close)
        {
          this.closeTicket(data.post.ticketInfo.ticketID);
        }
      }
    }
  }

  closeTicket(ticketID): void
  {
    const ticketIndex  = this.TicketList.findIndex(obj => obj.ticketInfo.ticketID === ticketID);
    if (ticketIndex > -1)
    {
      this.TicketList.splice(ticketIndex, 1);
      --this.ticketsFound;
      if (this.currentPostType === PostsType.Tickets)
      {
        const CountData = {
          MentionCount: null,
          tab: this.postDetailTab.tab,
          posttype: PostsType.Tickets
        };
        this._filterService.currentCountData.next(CountData);
      }
      if (this.currentPostType === PostsType.Mentions)
      {
        this.getMentionsCount(this.filter);
      }
    }
  }

  closeMention(ticketId): void
  {
    const ticketIndex  = this.TicketList.findIndex(obj => obj.ticketInfo.ticketID === ticketId);
    if (ticketIndex > -1)
    {
      if (this.currentPostType === PostsType.Mentions)
      {
        this.TicketList.splice(ticketIndex, 1);
        --this.ticketsFound;
        this.getMentionsCount(this.filter);
      }
    }
  }

  postBulkAction(event): void {
    if (event === 'dismiss') {
      this.bulkActionpanelStatus = false;
    }
    else if (event === 'selectAll') {
      this._ticketService.bulkMentionChecked = [];
      this._ticketService.selectedPostList = [];
      if (this.checkAllCheckBox) {
        this.checkAllCheckBox = false;
      }
      else {
        this.checkAllCheckBox = true;
      }
      for (const ticket of this.TicketList) {
        if (this.checkAllCheckBox) {
          const obj: BulkMentionChecked =
          {
            guid: this._navigationService.currentSelectedTab.guid,
            mention: ticket
          };
          this._ticketService.bulkMentionChecked.push(obj);
          this._ticketService.selectedPostList.push(ticket.ticketInfo.ticketID);
          this._ticketService.postSelectTrigger.next(this._ticketService.selectedPostList.length);
        }
        else {
          this._ticketService.postSelectTrigger.next(this._ticketService.selectedPostList.length);
        }

        this.bulkActionpanelStatus = this._ticketService.selectedPostList.length >= 2 ? true : false;


        const CheckedTickets = this._ticketService.bulkMentionChecked.filter(obj =>
          obj.guid === this._navigationService.currentSelectedTab.guid);
        if (CheckedTickets.length > 1) {
          const forapproval = CheckedTickets.map(s =>
            s.mention.makerCheckerMetadata.workflowStatus === LogStatus.ReplySentForApproval).filter(this.onlyUnique);
          if (forapproval.length > 1) {
            // show makerchecker approve and reject
            this._replyService.bulkActionButtons.btnbulkreplyapproved = true;
            this._replyService.bulkActionButtons.btnbulkreplyrejected = true;
          }
          else {
            // hide makerchecker approve/reject
            this._replyService.bulkActionButtons.btnbulkreplyapproved = false;
            this._replyService.bulkActionButtons.btnbulkreplyrejected = false;
          }
        } else {

        }

        // this.ShowHideButtonsFromTicketStatus();
        // this.postSelectEvent.emit([checked, id]);
      }
    }
  }

  removeBrandActivity(genericFilter: GenericFilter): GenericFilter {
    const filterObj = JSON.parse(JSON.stringify(genericFilter));
    if (filterObj.filters.length > 0) {
      filterObj.filters = filterObj.filters.filter(obj => {
        return obj.name !== 'isbrandactivity';
      });
      filterObj.filters = filterObj.filters.filter(obj => {
        return obj.name !== 'isactionable';
      });
      filterObj.filters = filterObj.filters.filter(obj => {
        return obj.name !== 'brandpostorreply';
      });
    }
    return filterObj;
  }

  removeBrandActivityIfBoth(genericFilter: GenericFilter): GenericFilter {
    // tslint:disable-next-line: prefer-for-of
    const filterObj = JSON.parse(JSON.stringify(genericFilter));
    if (filterObj.filters.length > 0) {
      const brandindex = filterObj.filters.findIndex(obj =>
        obj.name === 'isbrandactivity');
      if (brandindex > -1) {
        const actionableindex = filterObj.filters.findIndex(obj =>
          obj.name === 'isactionable');

        if (actionableindex > -1) {
          if (filterObj.filters[actionableindex].value.length > 1) {
            filterObj.filters = filterObj.filters.filter(obj => {
              return obj.name !== 'isbrandactivity';
            });
            filterObj.filters = filterObj.filters.filter(obj => {
              return obj.name !== 'isactionable';
            });
          }
        }

        const brandpostindex = filterObj.filters.findIndex(obj =>
          obj.name === 'brandpostorreply');

        if (brandpostindex > -1) {
          if (filterObj.filters[brandpostindex].value.length > 1) {
            filterObj.filters = filterObj.filters.filter(obj => {
              return obj.name !== 'isbrandactivity';
            });
            filterObj.filters = filterObj.filters.filter(obj => {
              return obj.name !== 'brandpostorreply';
            });
          }
        }
      }
    }
    return filterObj;
  }

  checkWhichActionIsClicked(genericFilter: GenericFilter): GenericFilter {
    // tslint:disable-next-line: prefer-for-of
    const filterObj = JSON.parse(JSON.stringify(genericFilter));
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < filterObj.filters.length; i++) {
      if (filterObj.filters[i].name === 'isbrandactivity') {
        if (filterObj.filters[i].value && filterObj.filters[i].value.length > 0) {
          this.brandactivity = filterObj.filters[i].value.includes(1);
          this.useractivity = filterObj.filters[i].value.includes(2);
        }
      }
      if (filterObj.filters[i].name === 'isactionable') {
        if (filterObj.filters[i].value && filterObj.filters[i].value.length > 0) {
          this.actionchk = filterObj.filters[i].value.includes(1);
          this.nonactionchk = filterObj.filters[i].value.includes(0);
        }
      }
      if (filterObj.filters[i].name === 'brandpostorreply') {
        if (filterObj.filters[i].value && filterObj.filters[i].value.length > 0) {
          this.brandpost = filterObj.filters[i].value.includes(0);
          this.brandreply = filterObj.filters[i].value.includes(1);
        }
      }
    }
    return filterObj;

  }

  testingMention(): void {
    // const MentionList =  JSON.parse(JSON.stringify(this.TicketList));
    // MentionList.unshift(...this._ticketService.testingMentionObj);
    // this.TicketList = [];
    // this.TicketList = MentionList;
    this.TicketList.splice(0, 1);
  }
  autoRenderData(): void {
    this.showDataFound = false;

    if (this.isadvance) {
      this.filter = this._advanceFilterService.getGenericFilter();
    }
    else {
      this.filter = this._filterService.getGenericFilter();
    }

    if (this.currentPostType === PostsType.Tickets) {
      const CountData = {
        MentionCount: null,
        tab: this.postDetailTab.tab,
        posttype: PostsType.Tickets
      };
      this._filterService.currentCountData.next(CountData);
      this.GetTickets(this.filter, true);
    }
    if (this.currentPostType === PostsType.Mentions) {
      this.getMentionsCount(this.filter);
      this.getMentions(this.filter, true);
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

  onlyUnique(value, index, self): boolean {
    return self.indexOf(value) === index;
  }

}
