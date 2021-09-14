import { Component, Input, OnInit } from '@angular/core';
import { BaseMention } from 'app/core/models/mentions/locobuzz/BaseMention';
import { FilterService } from 'app/social-inbox/services/filter.service';
import { PostDetailService } from 'app/social-inbox/services/post-detail.service';
import * as moment from 'moment';
import {
  CommLogFilter,
  CommunicationLog,
  CommunicationLogResponse,
} from 'app/core/models/viewmodel/CommunicationLog';
import { BaseSocialAuthor } from 'app/core/models/authors/locobuzz/BaseSocialAuthor';
import { LogStatus } from 'app/core/enums/LogStatus';
import { UpliftAndSentimentScore } from 'app/core/models/dbmodel/UpliftAndSentimentScore';
import { TicketInfo } from 'app/core/models/viewmodel/ticketInfo';
import { SubSink } from 'subsink';
import { AccountService } from 'app/core/services/account.service';
import { LocobuzzTab } from 'app/core/models/viewmodel/LocobuzzTab';
import { PostsType } from 'app/core/models/viewmodel/GenericFilter';
import { AuthUser } from 'app/core/interfaces/User';
import { UserDetailService } from 'app/social-inbox/services/user-details.service';
import { TicketsignalrService } from 'app/core/services/signalrservices/ticketsignalr.service';
import { TicketsService } from 'app/social-inbox/services/tickets.service';

@Component({
  selector: 'app-ticket-conversation',
  templateUrl: './ticket-conversation.component.html',
  styleUrls: ['./ticket-conversation.component.scss']
})
export class TicketConversationComponent implements OnInit {

  lockUnlockNote = '';
  loadMoreSize = 50;
  mentionDefaultSize = 10;
  comminicationLogLoading: boolean;
  LogObject: any[];
  mentionCount: number;
  lastmentionDateEpoch: any;
  baseLogObject: any[] = [];
  showLoadMoreOption: boolean;
  currentUser: AuthUser;
  conversationItem: any;
  postObj: BaseMention;
  TicketData: BaseMention[] = [];
  authorDetails: BaseSocialAuthor;
  communicationLog: CommunicationLog;
  communicationLogResponse: CommunicationLogResponse;
  subs = new SubSink();
  hideQuickWindow = false;
  LogFilter = new CommLogFilter();
  postDetailData: {};
  postShortenedData = true;
  @Input() postDetailTab?: LocobuzzTab;
  selectedPostID: number;
  ticketInfo: TicketInfo;
  upliftAndSentimentScore: UpliftAndSentimentScore;
  currentPostType: PostsType = PostsType.Mentions;

  constructor(private _ticketSignalrService: TicketsignalrService,   private ticketService: TicketsService, private _userDetailService: UserDetailService, private _postDetailService: PostDetailService, private _filterService: FilterService, private accountService: AccountService) { }


 

  ngOnInit(): void {

    this.postObj = this._postDetailService.postObj

    this.selectedPostID = this.postObj?.ticketInfo?.ticketID;
    this._postDetailService.postObj = this.postObj
    this.baseLogObject = [];

    if (localStorage.getItem('commlogfilter') && localStorage.getItem('commlogfilter') !== 'NaN')
    {
    }
    else{
      localStorage.setItem('commlogfilter', String(0));

    }

    this.getCommunicationLogHistory();

    
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

    ) {
      logcondition = 2;
    }
    else if ((comObj.logVersion === 0) && (comObj.status === LogStatus.Closed
      || comObj.status === LogStatus.SRClosed)) {
      logcondition = 3;
    }
    return logcondition;
  }


  public getCommunicationLogHistory(date?, noOfRows?): void {
    const filterObj = this._filterService.getGenericRequestFilter(this.postObj);
    console.log(this.postObj);
    if (date) {
      filterObj.to = this.loadMoreSize;
      console.log(moment());
      console.log(moment(date * 1000).utc().format());
      filterObj.endDateEpoch = +moment(date * 1000).utc().unix();
    }
    else {
      filterObj.to = this.mentionDefaultSize;
    }
    this.comminicationLogLoading = true;
    filterObj.isPlainLogText = false;
    filterObj.isActionableData = Number(localStorage.getItem('commlogfilter'));
    this.ticketService.GetTicketHistory(filterObj).subscribe(
      (resp) => {
        this.comminicationLogLoading = false;
        this.TicketData = resp;
        console.log('Respnse');
        this.LogObject = [];
        this.mentionCount = 0;
        for (const mention of resp) {
          if (mention.concreteClassName === 'LocoBuzzRespondDashboardMVCBLL.Classes.TicketClasses.CommunicationLog') {
            const communicationLog: any = this.mapAsComminucationLog(mention);
            communicationLog.isCommunicationLog = true;
            const logcondition = this.checkLogCondition(communicationLog);
            if (logcondition > 0) {
              this.LogObject.push(communicationLog);
            }
          } else {
            if (this.mentionCount === 0) {
              this.lastmentionDateEpoch = mention.mentionTimeEpoch;
            }
            const communicationLog: any = mention;
            communicationLog.isCommunicationLog = false;
            this.LogObject.push(communicationLog);
            this.mentionCount += 1;
          }
        }
        if (this.baseLogObject.length > 0) {
          const existingLog = JSON.parse(JSON.stringify(this.baseLogObject));
        //  this.baseLogObject = this.LogObject;
          this.baseLogObject = this.LogObject.concat(existingLog);
          console.log(this.baseLogObject);
  
        }
        else {
          this.baseLogObject = this.LogObject;
          console.log(this.baseLogObject);
         
        }
        if (this.mentionCount >= filterObj.to) {
          this.showLoadMoreOption = true;
        }
        else {
          this.showLoadMoreOption = false;
        }
        // setTimeout(() => {
        //   this.conversationItem.forEach(elementItem => {
        //     if (elementItem.nativeElement.classList.contains('active')) {
        //       elementItem.nativeElement.scrollIntoView();
        //     }
        //   });
        // }, 0);
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

}
