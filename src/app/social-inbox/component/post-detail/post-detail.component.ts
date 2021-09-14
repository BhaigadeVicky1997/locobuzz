import { PostDetailService } from './../../services/post-detail.service';
import { locobuzzAnimations } from '@locobuzz/animations';
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { BaseMention } from 'app/core/models/mentions/locobuzz/BaseMention';
import { TicketsService } from 'app/social-inbox/services/tickets.service';
import { TicketStatus } from 'app/core/enums/ticketStatusEnum';
import { Priority } from 'app/core/enums/Priority';
import { TicketClient } from 'app/core/interfaces/TicketClient';
import {
  CommLogFilter,
  CommunicationLog,
  CommunicationLogResponse,
} from 'app/core/models/viewmodel/CommunicationLog';
import { UserDetailService } from 'app/social-inbox/services/user-details.service';
import { FilterService } from 'app/social-inbox/services/filter.service';
import { BaseSocialAuthor } from 'app/core/models/authors/locobuzz/BaseSocialAuthor';
import { UpliftAndSentimentScore } from 'app/core/models/dbmodel/UpliftAndSentimentScore';
import { TicketInfo } from 'app/core/models/viewmodel/ticketInfo';
import { LogStatus } from 'app/core/enums/LogStatus';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { element } from 'protractor';
import { LocobuzzTab } from 'app/core/models/viewmodel/LocobuzzTab';
import { AccountService } from 'app/core/services/account.service';
import { AuthUser } from 'app/core/interfaces/User';
import { take } from 'rxjs/operators';
import { Filter, GenericFilter, PostsType } from 'app/core/models/viewmodel/GenericFilter';
import { TicketsignalrService } from 'app/core/services/signalrservices/ticketsignalr.service';
import { Subscription } from 'rxjs';
import { SubSink } from 'subsink';
import { PostSignalR } from 'app/core/models/menu/Menu';
import { TicketSignalEnum } from 'app/core/enums/TicketSignalEnum';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit, OnDestroy {
  @ViewChildren('conversationItem') conversationItem: QueryList<ElementRef<HTMLDivElement>>;
  @Input() postDetailTab?: LocobuzzTab;
  postDetailData: {};
  filter: any;
  selectedPostID: number;
  TicketData: BaseMention[] = [];
  postObj: BaseMention;
  shortData: {};
  baseLogObject: any[] = [];
  LogObject: any[] = [];
  mentionCount = 0;
  mentionDefaultSize = 10;
  loadMoreSize = 50;
  showLoadMoreOption = false;
  lastmentionDateEpoch = 0;
  currentPostType: PostsType = PostsType.Mentions;
  userList: {}[] = [{
    id: 1,
    label:  'John Doe',
  },
  {
    id: 2,
    label:  'Mark Doe',
  },
  {
    id: 3,
    label:  'Jane Doe',
  }
];
  post: TicketClient;
  authorDetails: BaseSocialAuthor;
  communicationLog: CommunicationLog;
  communicationLogResponse: CommunicationLogResponse;
  upliftAndSentimentScore: UpliftAndSentimentScore;
  ticketInfo: TicketInfo;
  currentUser: AuthUser;
  comminicationLogLoading: boolean = false;
  postShortenedData = true;
  showBlurLockStrip = false;
  showLockStrip = false;
  ticketLockUserName: string;
  ticketLockTime = 0;
  lockUnlockLabel = 'Locked';
  sendingReply = false;
  subs = new SubSink();
  lockUnlockNote = '';
  LogFilter = new CommLogFilter();
  hideQuickWindow = false;

  constructor(
    private _postDetailService: PostDetailService,
    private _userDetailService: UserDetailService,
    private ticketService: TicketsService,
    private _filterService: FilterService,
    private snackBar: MatSnackBar,
    private accountService: AccountService,
    private _ticketSignalrService: TicketsignalrService
  ) {}
  ngOnInit(): void {
    if(this._postDetailService.openInNewTab)
    {
      this.hideQuickWindow = true;
      this._postDetailService.openInNewTab = false;
    }
    this.comminicationLogLoading = true;
    if (localStorage.getItem('commlogfilter') && localStorage.getItem('commlogfilter') !== 'NaN')
    {
      this.LogFilter.radioButtonList = this.LogFilter.radioButtonList.filter(obj => {
        obj.checked =  obj.value === Number(localStorage.getItem('commlogfilter')) ? true : false;
        return obj;
      });
    }
    else{
      localStorage.setItem('commlogfilter', String(0));
      this.LogFilter.radioButtonList = this.LogFilter.radioButtonList.filter(obj => {
        obj.checked =  obj.value === 0 ? true : false;
        return obj;
      });
    }
    this.postDetailData = this._postDetailService.postDetailData;
    // this.GetTickets(this.filter);
    this.TicketData = this.ticketService.MentionListObj;
    console.log(this.TicketData);
    this.accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.currentUser = user));
    if (this.postDetailTab)
      {
        if (this.postDetailTab.tab && this._postDetailService.refreshNewTab)
        {
          const filterJson = this.postDetailTab.tab.filterJson ? JSON.parse(this.postDetailTab.tab.filterJson) : null;
          if (filterJson)
          {
            const genericFilter = filterJson as GenericFilter;
            if (genericFilter.postsType === PostsType.TicketHistory)
            {
              this.postShortenedData = false;
              // get ticketSummary by ticketId
              this.getTicketSummaryByTicketID(genericFilter);
            }
          }
        }
      }
    // this.postObj = this._postDetailService.postObj;
    // this.selectedPostID = this.postObj?.ticketInfo?.ticketID;
    // this.getCommunicationLogHistory();
    // this.getAuthorDetails();
    // this.getTicketTimeline(null);
    // this.getTicketSummary();
    // this.getSentimentUpliftAndNPSScore();

    this.subs.add(this._postDetailService.currentPostObject.subscribe(
      (value) => {
        if (value > 0) {
          this.postObj = this.TicketData.find(obj => obj.ticketInfo.ticketID === value) || this._postDetailService.postObj;

          this.selectedPostID = this.postObj?.ticketInfo?.ticketID;
          this._postDetailService.postObj = this.postObj;
          this.authorDetails = {};
          this.communicationLogResponse = {};
          this.upliftAndSentimentScore = {};
          this.ticketInfo = {};
          this.baseLogObject = [];
          if (this.postObj)
          {
            this.getTicketLockDetails();
            this.getCommunicationLogHistory();
            this.markIsRead();
            // this.getAuthorDetails();
            // this.getTicketTimeline(null);
            // this.getTicketSummary();
            // this.getSentimentUpliftAndNPSScore();
          }
        }
      }
    ));

    this.subs.add(this._ticketSignalrService.openTicketDetailSignalCall.subscribe(postSignalObj => {
      if (postSignalObj && postSignalObj.ticketId && this.postObj.ticketInfo.ticketID === postSignalObj.ticketId)
      {
        this.executeSignalCall(postSignalObj);
      }
    }));

    

  }

  markIsRead(): void
  {
    if (!this.postObj.isRead)
    {
      const filterObj = this._filterService.getGenericRequestFilter(this.postObj);
      this.ticketService.markTicketAsRead(filterObj).subscribe(
        (resp) => {
          if (resp.success)
          {
             // success
          }
        }
      );
    }
  }

  executeSignalCall(signalObj: PostSignalR): void {
    if (signalObj.signalId === TicketSignalEnum.LockUnlockTicketSignalR)
    {
      if ((signalObj.message.status === 'U' || signalObj.message.status === 'L'))
      {
        this.lockUnlockNote = `${signalObj.message.Name} started working on this case`;
      }
    }
  }

  getTicketLockDetails(): void
  {
    const lockObj = {
      BrandID: this.postObj.brandInfo.brandID,
      BrandName: this.postObj.brandInfo.brandName,
      TicketID: this.postObj.ticketInfo.ticketID
    };

    this.ticketService.getTicketLock(lockObj).subscribe(
      (resp) => {
        if (resp.success)
        {
           // success
           if (resp.data && resp.data.lockUserName)
           {
            this.checkTicketLock(resp.data);
           }
           else{
            this.showBlurLockStrip = false;
            this.showLockStrip = false;
            const obj = {
              BrandID: this.postObj.brandInfo.brandID,
              BrandName: this.postObj.brandInfo.brandName,
              TicketID: this.postObj.ticketInfo.ticketID,
              Status: 'L'
            };
            this.lockUnlockTicket(obj);
           }

        }
      }
    );
  }

  callLockUnlock(event): void
  {
    if (event.checked)
    {
      const obj = {
        BrandID: this.postObj.brandInfo.brandID,
        BrandName: this.postObj.brandInfo.brandName,
        TicketID: this.postObj.ticketInfo.ticketID,
        Status: 'L'
      };
      this.lockUnlockTicket(obj);
      this.showBlurLockStrip = true;
      this.lockUnlockLabel = 'Locked';
    }
    else
    {
      const obj = {
        BrandID: this.postObj.brandInfo.brandID,
        BrandName: this.postObj.brandInfo.brandName,
        TicketID: this.postObj.ticketInfo.ticketID,
        Status: 'U'
      };
      this.lockUnlockTicket(obj);
      this.showBlurLockStrip = false;
      this.lockUnlockLabel = 'Unlocked';

    }
  }

  checkTicketLock(lockObj): void
  {
    if (lockObj.lockUserName)
    {
        // show strip
        this.ticketLockUserName = lockObj.lockUserName;
        this.ticketLockTime = lockObj.lockTime;
        this.showBlurLockStrip = true;
        this.showLockStrip = true;

    }
    // else
    // {
    //   const obj = {
    //     BrandID: this.postObj.brandInfo.brandID,
    //     BrandName: this.postObj.brandInfo.brandName,
    //     TicketID: this.postObj.ticketInfo.ticketID,
    //     Status: 'L'
    //   };

    //   this.lockUnlockTicket(obj);
    // }
  }

  lockUnlockTicket(obj): void
  {
    this.ticketService.lockUnlockTicket(obj).subscribe(
      (resp) => {
        if (resp.success)
        {
           // success
        }
      }
    );
  }

  public getCommunicationLogHistory(date?, noOfRows?): void {
    const filterObj = this._filterService.getGenericRequestFilter(this.postObj);
    if (date)
    {
      filterObj.to = this.loadMoreSize;
     // console.log(moment());
      //console.log(moment(date * 1000).utc().format());
      filterObj.endDateEpoch = +moment(date * 1000).utc().unix();
    }
    else
    {
      filterObj.to = this.mentionDefaultSize;
    }
    this.comminicationLogLoading = true;
    filterObj.isPlainLogText = false;
    filterObj.isActionableData = Number(localStorage.getItem('commlogfilter'));
    this.ticketService.GetTicketHistory(filterObj).subscribe(
      (resp) => {
        this.comminicationLogLoading = false;
        // this.TicketData = resp;
        console.log('Respnse');
        this.LogObject = [];
        this.mentionCount = 0;
        for (const mention of resp) {
          if (mention.concreteClassName === 'LocoBuzzRespondDashboardMVCBLL.Classes.TicketClasses.CommunicationLog') {
            const communicationLog: any = this.mapAsComminucationLog(mention);
            communicationLog.isCommunicationLog = true;
            const logcondition = this.checkLogCondition(communicationLog);
            if (logcondition > 0){
              this.LogObject.push(communicationLog);
            }
          } else {
            if (this.mentionCount === 0)
            {
              this.lastmentionDateEpoch = mention.mentionTimeEpoch;
            }
            const communicationLog: any = mention;
            communicationLog.isCommunicationLog = false;
            this.LogObject.push(communicationLog);
            this.mentionCount += 1;
          }
        }
        if (this.baseLogObject.length > 0)
        {
          const existingLog = JSON.parse(JSON.stringify(this.baseLogObject));
          // this.baseLogObject = this.LogObject;
          this.baseLogObject = this.LogObject.concat(existingLog);
          console.log(this.baseLogObject);
        }
        else
        {
          this.baseLogObject = this.LogObject;
          console.log(this.baseLogObject);
        }
        if (this.mentionCount >= filterObj.to)
        {
          this.showLoadMoreOption = true;
        }
        else{
          this.showLoadMoreOption = false;
        }
        setTimeout(() => {
          this.conversationItem.forEach(elementItem => {
            if (elementItem.nativeElement.classList.contains('active')){
              elementItem.nativeElement.scrollIntoView();
            }
          });
        }, 0);
      },
      (err) => {
        this.comminicationLogLoading = false;
        console.log(err);
      },
      () => {
        this.comminicationLogLoading = false;
        console.log('Done completed');
      }
    );
  }

  logFilterChange(event): void {
    const currvalue = +event.value;
    localStorage.setItem('commlogfilter', String(currvalue));
    this.getCommunicationLogHistory();
  }

  private getAuthorDetails(): void {
    const filterObj = this._filterService.getGenericRequestFilter(this.postObj);
    this._userDetailService.GetAuthorDetails(filterObj).subscribe((data) => {
      console.log('User Details', data);
      this.authorDetails = {};
      this.authorDetails = data;
    });
  }

  private getTicketTimeline(ticketId?: number): void {
    const filterObj = this._filterService.getGenericRequestFilter(this.postObj);
    if (ticketId) {
      filterObj.ticketId = ticketId;
    }
    this._userDetailService.GetTicketTimeline(filterObj).subscribe((data) => {
      this.communicationLogResponse = {};
      this.communicationLogResponse = data;
      console.log('Ticket Timeline', data);
    });
  }

  public CallTicketTimeLine(ticketId): void {
    this.getTicketTimeline(+ticketId);
  }

  private getTicketSummary(): void {
    const filterObj = this._filterService.getGenericRequestFilter(this.postObj);
    this._userDetailService.GetTicketSummary(filterObj).subscribe((data) => {
      console.log('Ticket Summary', data);
      this.ticketInfo = {};
      this.ticketInfo = data;
    });
  }

  private getSentimentUpliftAndNPSScore(): void {
    const filterObj = this._filterService.getGenericRequestFilter(this.postObj);
    this._userDetailService
      .GetSentimentUpliftAndNPSScore(filterObj)
      .subscribe((data) => {
        this.upliftAndSentimentScore = {};
        this.upliftAndSentimentScore = data;
        console.log('Uplift&NPS Score', data);
      });
  }

  private GetTickets(filterObj): void {
    this.ticketService.GetTickets(filterObj).subscribe(
      (resp) => {
        this.TicketData = resp;
        console.log(this.TicketData);
      },
      (err) => {
        console.log(err);
      },
      () => {
        console.log('Done completed');
      }
    );
  }

  change($event: any): void {}

  private mapPostByChannel(mention: BaseMention): TicketClient {
    console.log(mention);
    const assignToname = this._filterService.getNameByID(mention.ticketInfo.assignedTo, this._filterService.fetchedAssignTo);
    this.post = {
      ticketId: mention.ticketInfo.ticketID,
      mentionCount: mention.ticketInfo.numberOfMentions,
      note: mention.note,
      assignTo: assignToname,
      ticketStatus: TicketStatus[mention.ticketInfo.status],
      ticketPriority: Priority[mention.ticketInfo.ticketPriority],
      ticketDescription: mention.description,
      ticketCategory: {
        ticketUpperCategory: mention.ticketInfo.ticketUpperCategory.name,
        mentionUpperCategory: mention.upperCategory.name,
      },
      Userinfo: {
        name: mention.author.name,
        image: mention.author.picUrl,
        screenName: mention.author.screenname,
        bio: mention.author.bio,
        followers: mention.author.followersCount,
        following: mention.author.followingCount,
        location: mention.author.location,
        sentimentUpliftScore: mention.author.sentimentUpliftScore,
        npsScore: mention.author.nPS,
        isVerified: mention.author.isVerifed,
      },
      ticketCategoryTop: '',
      mentionCategoryTop: '',
    };
    return this.post;
  }

  checkLogCondition(comObj: CommunicationLog): number {
    let logcondition = 0;
    if (
      comObj.logVersion === 1 &&
      comObj.status === LogStatus.GroupDisplayMessage
    ) {
      logcondition = 1;
    }
    else if ((comObj.logVersion === 0) && (comObj.status === LogStatus.RepliedToUser
      || comObj.status === LogStatus.Escalated
      || comObj.status === LogStatus.Ignore
      || comObj.status === LogStatus.Approve
      || comObj.status === LogStatus.NotesAdded
      || comObj.status === LogStatus.Acknowledge
      || comObj.status === LogStatus.SRCreated
      || comObj.status === LogStatus.SRUpdated
      || comObj.status === LogStatus.CopyMentionFrom
      || comObj.status === LogStatus.CopyMentionTo
      || comObj.status === LogStatus.MoveMentionFrom
      || comObj.status === LogStatus.MoveMentionTo
      || comObj.status === LogStatus.EmailSent
      || comObj.status === LogStatus.CustomerInfoAwaited
      || comObj.status === LogStatus.ModifiedTicketTagging
      || comObj.status === LogStatus.TicketSubscribed
      || comObj.status === LogStatus.TicketUnsubscribed
      || comObj.status === LogStatus.TicketSubscriptionModified
      || comObj.status === LogStatus.TicketSubscriptionEmailSent
      || comObj.status === LogStatus.CrmLeadCreated
      || comObj.status === LogStatus.PerformActionReplyFailed
      || comObj.status === LogStatus.ReopenACase
      || comObj.status === LogStatus.OnHold
      || comObj.status === LogStatus.TeamDeleted
      || comObj.status === LogStatus.BulkReplyRequestInitiated
      || comObj.status === LogStatus.ReplyTextModified
      || comObj.status === LogStatus.MakerCheckerSet
      || comObj.status === LogStatus.MakerCheckerDisable
      || comObj.status === LogStatus.SSREReplyRejected
      || comObj.status === LogStatus.SSREReplyVerified
      )

      ){
        logcondition = 2;
      }
      else if ((comObj.logVersion === 0) && (comObj.status === LogStatus.Closed
        || comObj.status === LogStatus.SRClosed)){
          logcondition = 3;
      }
    return logcondition;
  }

  mapAsComminucationLog(mention: BaseMention): CommunicationLog {
    return (this.communicationLog = {
      note: mention.note,
      iD: mention.id,
      mentionTime: mention.mentionTime,
      userID: +mention.userID,
      username: mention.username,
      usernames: mention.usernames,
      ticketID: mention.ticketID,
      mentionID: mention.mentionID,
      postID: mention.postID,
      tagID: mention.tagID,
      assignedToUserID: mention.assignedToUserID,
      assignedToTeam: mention.assignedToTeam,
      assignedToTeamName: mention.assignedToTeamName,
      previousAssignToUserID: mention.previousAssignToUserID,
      previousAssignedToTeam: mention.previousAssignedToTeam,
      previousAssignedToTeamName: mention.previousAssignedToTeamName,
      assignedToUsername: mention.assignedToUsername,
      status: mention.status,
      lstStatus: mention.lstStatus,
      lstUserNames: mention.lstUserNames,
      lstUserIDs: mention.lstUserIDs,
      lstLogIDs: mention.lstLogIDs,
      lstAssignedtoUserNames: mention.lstAssignedtoUserNames,
      batchID: mention.batchID,
      agentPic: mention.agentPic,
      assignedToAgentPic: mention.assignedToAgentPic,
      assignedToAccountType: mention.assignedToAccountType,
      accountType: mention.accountType,
      postScheduledDateTime: mention.postScheduledDateTime,
      replyScheduledDateTime: mention.replyScheduledDateTime,
      replyEscalatedToUsername: mention.replyEscalatedToUsername,
      replyUserName: mention.replyUserName,
      isScheduled: mention.isScheduled,
      workflowReplyDetailID: mention.workflowReplyDetailID,
      channelType: mention.channelType,
      isLastLog: mention.isLastLog,
      author: mention.author,
      brandInfo: mention.brandInfo,
      globalTicketVersion: mention.globalTicketVersion,
      nextLogBatchID: mention.nextLogBatchID,
      nextLogStatus: mention.nextLogStatus,
      actionTakenFrom: mention.actionTakenFrom,
      logVersion: mention.logVersion,
      contentID: mention.contentID,
      isHtml: mention.isHtml,
      concreteClassName: mention.concreteClassName,
      mentionTimeEpoch: mention.mentionTimeEpoch,
      channelGroup: mention.channelGroup,
      logText: mention.logText,
    });
  }

  addNote(note): void
  {
    console.log(note);
    const object = {
      brandInfo : this._postDetailService.postObj.brandInfo,
      communicationLog: {
        Note : note.value,
        TicketID : this._postDetailService.postObj.ticketInfo.ticketID,
        TagID : this._postDetailService.postObj.ticketInfo.tagID,
        AssignedToUserID : this._postDetailService.postObj.ticketInfo.assignedTo,
        Channel : this._postDetailService.postObj.channelType,
        Status : 'NotesAdded',
        type : 'CommunicationLog',
        MentionTime : this._postDetailService.postObj.mentionTime,
      },
      actionFrom : 0
    };

    console.log(object);

    this.ticketService.addTicketNotes(object).subscribe((data) =>
    {
      if (JSON.parse(JSON.stringify(data)).success)
      {
      console.log(data);
      this.snackBar.open('Note Added', '', {
        duration: 1000
      });


      }
    });

  }

  getTicketSummaryByTicketID(genericFilter: GenericFilter): void {
    const genericRequestParameter = {
      brandInfo: genericFilter.brands[0],
      startDateEpcoh: 0,
      endDateEpoch: 0,
      ticketId: Number(genericFilter.simpleSearch),
      to: 1,
      from: 1,
      authorId: '',
      author: null,
      isActionableData: 0,
      channel: 0,
      isPlainLogText: false,
      targetBrandName: '',
      targetBrandID: 0,
      oFFSET: 0,
      noOfRows: 10,
      isCopy: true
  };

    this._userDetailService.GetTicketSummary(genericRequestParameter).subscribe((data) => {
      console.log('Ticket Summary', data);
      genericFilter.startDateEpoch = moment(data.updatedAt).subtract({hours: 2}).unix();
      genericFilter.endDateEpoch = moment(data.updatedAt).unix();

      const ticketArray = [];
      ticketArray.push(+data.ticketID);
      const ticketObj: Filter = {
            name: 'CD.CaseID',
            value: ticketArray,
            type: 2
          };

      // genericFilter.filters.push(ticketObj);
      this.getTicketsByTicketId(genericFilter);

    });
  }

  getTicketsByTicketId(genericFilter: GenericFilter): void
  {
    this.ticketService.GetTicketsByTicketIds(genericFilter).subscribe(resp => {
      if (resp && resp.length > 0)
      {
        this._postDetailService.postObj = resp[0];
        this._postDetailService.currentPostObject.next(
          resp[0].ticketInfo.ticketID
        );
      }
     },
     err => {
       console.log(err);
     },
     () => {
         console.log('call completed');
     });
  }

  CloseTicketDetailWindow(): void {
    this._postDetailService.ticketOpenDetail = null;
  }


  ngOnDestroy(): void {
    // this._postDetailService.currentPostObject.unsubscribe();
    this.subs.unsubscribe();
  }
}
