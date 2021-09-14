import { post } from './../../app-data/post';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActionStatusEnum, ClientStatusEnum } from 'app/core/enums/ActionStatus';
import { ActionTaken } from 'app/core/enums/ActionTakenEnum';
import { MakerCheckerEnum } from 'app/core/enums/MakerCheckerEnum';
import { PerformedAction } from 'app/core/enums/PerformedAction';
import { UserRoleEnum } from 'app/core/enums/userRoleEnum';
import { BaseSocialAccountConfiguration, BaseSocialAccountConfResponse } from 'app/core/models/accountconfigurations/BaseSocialAccountConfiguration';
import { MakerChecker, MakerCheckerResponse } from 'app/core/models/dbmodel/MakerCheckerDB';
import { BulkMentionChecked, CustomResponse, ReplyOptions, TicketsCommunicationLog } from 'app/core/models/dbmodel/TicketReplyDTO';
import { BaseMention, BaseMentionWithCommLog } from 'app/core/models/mentions/locobuzz/BaseMention';
import { BrandQueueData, BrandQueueResponse } from 'app/core/models/viewmodel/BrandQueueData';
import { PostsType } from 'app/core/models/viewmodel/GenericFilter';
import { GroupEmailList, GroupEmailListResponse } from 'app/core/models/viewmodel/GroupEmailList';
import { LocoBuzzAgent, LocobuzzAgentResponse } from 'app/core/models/viewmodel/LocoBuzzAgent';
import { LocobuzzIntentDetectedResult } from 'app/core/models/viewmodel/LocobuzzIntentDetectResult';
import { BaseReply, PerformActionParameters } from 'app/core/models/viewmodel/PerformActionParameters';
import { Reply } from 'app/core/models/viewmodel/Reply';
import { UgcMention } from 'app/core/models/viewmodel/UgcMention';
import { MaplocobuzzentitiesService } from 'app/core/services/maplocobuzzentities.service';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { BrandList } from '../../shared/components/filter/filter-models/brandlist.model';
import { FilterService } from './filter.service';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { BulkActionButtons } from 'app/core/interfaces/BulkTicketActions';
import { TicketsService } from './tickets.service';
import { ReplyInputParams } from 'app/core/models/viewmodel/ReplyInputParams';
import { AlertMails, AlertMailsResponse } from 'app/core/models/viewmodel/AlertMails';
import { TicketStatus } from 'app/core/enums/ticketStatusEnum';

@Injectable({
  providedIn: 'root'
})
export class ReplyService {

  selectedMedia = new BehaviorSubject<UgcMention[]>([]);
  selectedCannedResponse = new BehaviorSubject<string>('');
  selectedSmartSuggestion = new BehaviorSubject<string>('');
  closeReplyBox = new BehaviorSubject<boolean>(false);
  setTicktOverview = new BehaviorSubject<BaseMention>(null);
  checkReplyInputParams = new BehaviorSubject<ReplyInputParams>(null);
  locobuzzIntentDetectedResult: LocobuzzIntentDetectedResult[] = [];
  emailList: string[];
  bulkActionButtons: BulkActionButtons = {
    btnbulkapprove: false,
    btnbulkassign: false,
    btnbulkdirectclose: false,
    btnbulkescalae: false,
    btnbulkonhold: false,
    btnbulkreject: false,
    btnbulkreopen: false,
    btnbulkreply: false,
    btnbulkreplyapproved: false,
    btnbulkreplyrejected: false

  };

  constructor(private _http: HttpClient,
              private _snackBar: MatSnackBar,
              private _mapLocobuzzEntity: MaplocobuzzentitiesService,
              private _filterService: FilterService,
              private _ticketService: TicketsService) { }

  GetBrandAccountInformation(keyObj): Observable<BaseSocialAccountConfiguration[]> {
    return this._http.post<BaseSocialAccountConfResponse>(environment.baseUrl + '/Account/ConfiguredBrandChannelAccount', keyObj).pipe(
      map(response => {
        if (response.success) {
          const MentionList: BaseSocialAccountConfiguration[] = response.data;
          return MentionList;
        }
      })
    );

  }

  Reply(keyObj): Observable<CustomResponse> {
    return this._http.post<CustomResponse>(environment.baseUrl + '/Tickets/PerformAction', keyObj).pipe(
      map(response => {
        if (response.success) {
          return response;
        }
        else {
          this._snackBar.open('Error Occurred while sending reply', 'Ok', {
            duration: 2000
          });
        }
      })
    );

  }

  ReplyApproved(keyObj): Observable<CustomResponse> {
    return this._http.post<CustomResponse>(environment.baseUrl + '/Tickets/ReplyApproved', keyObj).pipe(
      map(response => {
        if (response.success) {
          return response;
        }
        else {
          this._snackBar.open('Error Occurred while approving reply', 'Ok', {
            duration: 2000
          });
        }
      })
    );

  }

  ReplyRejected(keyObj): Observable<CustomResponse> {
    return this._http.post<CustomResponse>(environment.baseUrl + '/Tickets/ReplyRejected', keyObj).pipe(
      map(response => {
        if (response.success) {
          return response;
        }
        else {
          this._snackBar.open('Error Occurred while rejecting reply', 'Ok', {
            duration: 2000
          });
        }
      })
    );

  }

  SSRELiveRightVerified(keyObj): Observable<CustomResponse> {
    return this._http.post<CustomResponse>(environment.baseUrl + '/Ssre/SsreLiveRightVerified', keyObj).pipe(
      map(response => {
        if (response.success) {
          return response;
        }
        else {
          this._snackBar.open('Error Occurred while approving reply', 'Ok', {
            duration: 2000
          });
        }
      })
    );

  }

  ssreLiveWrongKeep(keyObj): Observable<CustomResponse> {
    return this._http.post<CustomResponse>(environment.baseUrl + '/Ssre/SsreLiveKeepReply', keyObj).pipe(
      map(response => {
        if (response.success) {
          return response;
        }
        else {
          this._snackBar.open('Error Occurred while approving reply', 'Ok', {
            duration: 2000
          });
        }
      })
    );

  }

  ssreLiveWrongDelete(keyObj): Observable<CustomResponse> {
    return this._http.post<CustomResponse>(environment.baseUrl + '/Ssre/SsreLiveDeleteSocial', keyObj).pipe(
      map(response => {
        if (response.success) {
          return response;
        }
        else {
          this._snackBar.open('Error Occurred while approving reply', 'Ok', {
            duration: 2000
          });
        }
      })
    );

  }


  GetUsersWithTicketCount(keyObj): Observable<LocoBuzzAgent[]> {
    return this._http.post<LocobuzzAgentResponse>(environment.baseUrl + '/Account/GetLocobuzzUsersWithTicketCount', keyObj).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
      })
    );

  }

  getAutoQueueingConfig(keyObj): Observable<BrandQueueData[]> {
    return this._http.post<BrandQueueResponse>(environment.baseUrl + '/Account/GetAutoQueueingConfig', keyObj).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
      })
    );
  }

  GetMailGroup(keyObj): Observable<GroupEmailList[]> {
    return this._http.post<GroupEmailListResponse>(environment.baseUrl + '/Tickets/GetMailGroup', keyObj).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
      })
    );

  }

  GetMakerCheckerData(keyObj): Observable<MakerChecker> {
    return this._http.post<MakerCheckerResponse>(environment.baseUrl + '/Tickets/GetMakerCheckerDetails', keyObj).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
      })
    );

  }

  BuildComminicationLog(baseMention: BaseMention, selectedReplyType,
    note?, ticketId?, locobuzzAgent?: LocoBuzzAgent): TicketsCommunicationLog[] {
    const tasks: TicketsCommunicationLog[] = [];
    const actionEnum = ReplyOptions.GetActionEnum();
    switch (+selectedReplyType) {
      case ActionStatusEnum.DirectClose: {
        // if ($.trim(formObject.txtNotes) != '') {
        //     let noteLog = CommunicationLogGenerator._getCommunicationLogForNote();
        //     noteLog.Note = $.trim(formObject.txtNotes);
        //     tasks.push(noteLog);
        // }

        const log = new TicketsCommunicationLog(ClientStatusEnum.Closed);

        tasks.push(log);

        baseMention.ticketInfo.makerCheckerStatus = MakerCheckerEnum.DirectClose;
        break;
      }

      case ActionStatusEnum.CreateTicket: {
        const log1 = new TicketsCommunicationLog(
          ClientStatusEnum.CaseDetach
        );
        const log2 = new TicketsCommunicationLog(
          ClientStatusEnum.CaseCreated
        );
        const log3 = new TicketsCommunicationLog(
          ClientStatusEnum.CaseAttach
        );
        const log4 = new TicketsCommunicationLog(
          ClientStatusEnum.Acknowledge
        );

        tasks.push(log4);
        tasks.push(log1);
        tasks.push(log2);
        tasks.push(log3);

        const escalationMessage = note;
        if (escalationMessage.trim() !== '') {
          const log5 = new TicketsCommunicationLog(ClientStatusEnum.NotesAdded);
          log5.Note = escalationMessage.trim();
          tasks.push(log5);
        }

        break;
      }
      case ActionStatusEnum.AttachTicket: {
        const log1 = new TicketsCommunicationLog(
          ClientStatusEnum.CaseDetach
        );
        const log2 = new TicketsCommunicationLog(
          ClientStatusEnum.CaseAttach
        );

        log2.TicketID = ticketId;

        tasks.push(log1);
        tasks.push(log2);

        const escalationMessage = note;
        if (escalationMessage.trim() !== '') {
          const log3 = new TicketsCommunicationLog(ClientStatusEnum.NotesAdded);
          log3.Note = escalationMessage.trim();
          tasks.push(log3);
        }
        baseMention.ticketInfo.makerCheckerStatus =
          MakerCheckerEnum.CaseAttach;
        break;
      }
      case ActionStatusEnum.ReplyAndAwaitingCustomerResponse: {
        const log1 = new TicketsCommunicationLog(
          ClientStatusEnum.RepliedToUser
        );
        const log2 = new TicketsCommunicationLog(
          ClientStatusEnum.CustomerInfoAwaited
        );
        tasks.push(log1);
        tasks.push(log2);

        baseMention.ticketInfo.makerCheckerStatus =
          MakerCheckerEnum.ReplyAwaitingResponse;

        break;
      }
      case ActionStatusEnum.Approve: {

        const log1 = new TicketsCommunicationLog(
          ClientStatusEnum.Approve
        );

        const escalationMessage = note;
        if (escalationMessage.trim() !== '') {
          const log3 = new TicketsCommunicationLog(ClientStatusEnum.NotesAdded);
          log3.Note = escalationMessage.trim();
          tasks.push(log3);
        }

        tasks.push(log1);
        break;
      }
      case ActionStatusEnum.Reject: {
        const log1 = new TicketsCommunicationLog(
          ClientStatusEnum.Ignore
        );

        const escalationMessage = note;
        if (escalationMessage.trim() !== '') {
          const log2 = new TicketsCommunicationLog(ClientStatusEnum.NotesAdded);
          log2.Note = escalationMessage.trim();
          tasks.push(log2);
        }

        tasks.push(log1);
        break;
      }
      case ActionStatusEnum.Escalate: {
        const escalationMessage = note;
        if (escalationMessage.trim() !== '') {
          const log1 = new TicketsCommunicationLog(ClientStatusEnum.NotesAdded);
          log1.Note = escalationMessage.trim();
          tasks.push(log1);
        }

        const log3 = new TicketsCommunicationLog(ClientStatusEnum.Escalated);

        log3.AssignedToUserID = locobuzzAgent.agentID;
        log3.AssignedToTeam = locobuzzAgent.teamID;


        tasks.push(log3);
        baseMention.ticketInfo.makerCheckerStatus =
          MakerCheckerEnum.Escalate;
        break;
      }

      default:
        break;
    }
    tasks.forEach((obj) => {
      obj.TagID = String(baseMention.tagID);
    });
    return tasks;
  }

  getFoulKeywords(postData: BaseMention): any {
    const foulParams = {
      brandInfo: postData.brandInfo, fag: 0
    }
    return this._http.post(environment.baseUrl + '/Tickets/GetAllfoulkeywordsOrEmailsList', foulParams).pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }

  BuildReply(baseMention: BaseMention, selectedReplyType,
    note?, ticketid?, locobuzzAgent?: LocoBuzzAgent): PerformActionParameters {

    const replyObj: PerformActionParameters = {};
    const replyArray: Reply[] = [];
    const baseReply = new BaseReply();
    const customReplyObj = baseReply.getReplyClass();
    // map the properties
    replyObj.ActionTaken = ActionTaken.Locobuzz;


    replyObj.Tasks = this.BuildComminicationLog(
      baseMention, selectedReplyType,
      note,
      ticketid,
      locobuzzAgent
    );
    const source = this._mapLocobuzzEntity.mapMention(
      baseMention
    );
    replyObj.Source = source;

    // replyArray = this._mapLocobuzzEntity.mapReplyObject(replyArray);
    const replyopt = new ReplyOptions();
    replyObj.PerformedActionText = replyopt.replyOption
      .find((obj) => obj.id === +selectedReplyType)
      .value.trim();
    replyObj.Replies = replyArray;

    replyObj.ReplyFromAccountId = 0;
    replyObj.ReplyFromAuthorSocialId = '';


    // call Reply Api
    return replyObj;

  }

  getSubscibeData(postData: BaseMention): any {
    const subscribeParams = { BrandInfo: postData.brandInfo, TicketId: postData.ticketID };
    return this._http.post(environment.baseUrl + '/Tickets/GetTicketSubscription', subscribeParams).pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }

  getmailList(term): any {
    return this._http.get(environment.baseUrl + '/Tickets/SearchEmails/' + term).pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }



  postSubscribe(postParams): any {
    return this._http.post<any>(
      `${environment.baseUrl}/Tickets/SaveSubscription`, postParams
    ).pipe(
      map(response => {
        return response;
      },
        err => {
          console.log(err);
        })
    );
  }




  BulkTicketAction(keyObj): Observable<CustomResponse> {
    return this._http.post<CustomResponse>(environment.baseUrl + '/Tickets/SaveBulkReplyRequest', keyObj).pipe(
      map(response => {
        if (response.success) {
          return response;
        }
        else {
          this._snackBar.open('Error Occurred while approving reply', 'Ok', {
            duration: 2000
          });
        }
      })
    );

  }

  ConfirmBulkTicketAction(prop: any): void {

    let TicketAgentWorkFlowEnabled = false;
    const BulkObject = [];
    const chkTicket = this._ticketService.bulkMentionChecked.filter(obj =>
      obj.guid === prop.guid);
    const TicketIDs = [];
    const oldAssignedTo = [];
    const oldEscalatedTo = [];
    const BrandIDs = [];
    const BrandNames = [];
    const SocialIDs = [];
    const TagIDs = [];
    const AssignToAgentUserID = 0;
    const AssignmentNote = '';
    const AssignToAgentTeamID = 0;
    const TicketAssignmentArray = [];
    const TicketGoingForApproval = [];
    const DirectCloseErrorTickets = [];
    let DirectCloseErrorflag = false;
    let IsBrandMakerEnabled = false;
    let IsTicketMakerEnabled = false;
    let IsEnableReplyApprovalWorkFlow = false;
    const currentteamid = prop.currentteamid;
    let isAgentHasTeam = false;
    let IsCSDUser = false;
    if (currentteamid !== 0) {
      isAgentHasTeam = true;
    }
    if (prop.userrole === UserRoleEnum.CustomerCare) {
      IsCSDUser = true;
    }
    if (prop.action === PerformedAction.Approve || prop.action === PerformedAction.Reject) {
      for (const checkedticket of chkTicket) {
        const properties = {
          ReplyFromAccountId: 0,
          ReplyFromAuthorSocialId: '',
          TicketID: checkedticket.mention.ticketInfo.ticketID,
          TagID: checkedticket.mention.tagID,
          BrandID: checkedticket.mention.brandInfo.brandID,
          BrandName: checkedticket.mention.brandInfo.brandName,
          ChannelGroup: checkedticket.mention.channelGroup,
          Replies: []
        };

        BulkObject.push(properties);

        TicketIDs.push(checkedticket.mention.ticketInfo.ticketID);
        oldAssignedTo.push(checkedticket.mention.ticketInfo.assignedTo);
        SocialIDs.push(checkedticket.mention.socialID);
        oldEscalatedTo.push(checkedticket.mention.ticketInfo.escalatedTo);
        BrandIDs.push(checkedticket.mention.brandInfo.brandID);
        BrandNames.push(checkedticket.mention.brandInfo.brandName);
        TagIDs.push(checkedticket.mention.tagID);
      }
    }
    else {
      if (prop.action === PerformedAction.Assign) {
        for (const checkedticket of chkTicket) {
          const properties = {
            ReplyFromAccountId: 0,
            ReplyFromAuthorSocialId: '',
            TicketID: checkedticket.mention.ticketInfo.ticketID,
            TagID: checkedticket.mention.tagID,
            BrandID: checkedticket.mention.brandInfo.brandID,
            BrandName: checkedticket.mention.brandInfo.brandName,
            ChannelGroup: checkedticket.mention.channelGroup,
            Replies: []
          };

          BulkObject.push(properties);

          TicketIDs.push(checkedticket.mention.ticketInfo.ticketID);
          oldAssignedTo.push(checkedticket.mention.ticketInfo.assignedTo);
          SocialIDs.push(checkedticket.mention.socialID);
          oldEscalatedTo.push(checkedticket.mention.ticketInfo.escalatedTo);
          BrandIDs.push(checkedticket.mention.brandInfo.brandID);
          BrandNames.push(checkedticket.mention.brandInfo.brandName);
          TagIDs.push(checkedticket.mention.tagID);
          const _ChannelType = checkedticket.mention.channelType;
          TicketAssignmentArray.push({
            ChannelType: (_ChannelType) ? Number(_ChannelType) : 0,
            TagID: checkedticket.mention.tagID,
            TicketID: checkedticket.mention.ticketInfo.ticketID
          });
        }
      }
      else {

        for (const checkedticket of chkTicket) {
          const properties = {
            ReplyFromAccountId: 0,
            ReplyFromAuthorSocialId: '',
            TicketID: checkedticket.mention.ticketInfo.ticketID,
            TagID: checkedticket.mention.tagID,
            BrandID: checkedticket.mention.brandInfo.brandID,
            BrandName: checkedticket.mention.brandInfo.brandName,
            ChannelGroup: checkedticket.mention.channelGroup,
            Replies: []
          };

          BulkObject.push(properties);

          const brandid = checkedticket.mention.brandInfo.brandID;
          const tagid = checkedticket.mention.tagID;
          const ticketid = checkedticket.mention.ticketInfo.ticketID;

          TicketIDs.push(ticketid);
          oldAssignedTo.push(checkedticket.mention.ticketInfo.assignedTo);
          SocialIDs.push(checkedticket.mention.socialID);
          oldEscalatedTo.push(checkedticket.mention.ticketInfo.escalatedTo);
          BrandIDs.push(brandid);
          BrandNames.push(checkedticket.mention.brandInfo.brandName);
          TagIDs.push(tagid);

          const isworkflowenabled = this._filterService.fetchedBrandData.find(
            (brand: BrandList) => +brand.brandID === checkedticket.mention.brandInfo.brandID
          );

          if (isworkflowenabled.isEnableReplyApprovalWorkFlow) {
            IsEnableReplyApprovalWorkFlow = true;
            IsBrandMakerEnabled = true;
          }
          else {
            IsEnableReplyApprovalWorkFlow = false;
          }

          if (checkedticket.mention.ticketInfo.ticketAgentWorkFlowEnabled) {
            TicketAgentWorkFlowEnabled = true;
            IsTicketMakerEnabled = true;
          }
          else {
            TicketAgentWorkFlowEnabled = false;
          }

          TicketGoingForApproval.push(TicketAgentWorkFlowEnabled);

          if (!isAgentHasTeam && prop.userrole === UserRoleEnum.AGENT
            && IsEnableReplyApprovalWorkFlow
            && (TicketAgentWorkFlowEnabled || prop.agentWorkFlowEnabled)) {
            DirectCloseErrorflag = true;
            DirectCloseErrorTickets.push(ticketid);

          }

        }

        IsEnableReplyApprovalWorkFlow = IsBrandMakerEnabled;
        TicketAgentWorkFlowEnabled = IsTicketMakerEnabled;
      }
    }


    if (DirectCloseErrorflag) {

      const length = DirectCloseErrorTickets.length;
      let tickettext = 'Ticket';
      if (length > 1) {
        tickettext = 'Tickets';
      }
      const ticketids = DirectCloseErrorTickets.join(',');

      this._snackBar.open(length + tickettext + ' {' + ticketids + '} cannot be direct close as it falls under approval rules and needs to be escalated to a TL. Please contact supervisor to assign a TL to you.', 'Ok', {
        duration: 2000,
      });
      return;
    }
    let isTicket = false;
    if (prop.pageType === PostsType.Tickets) {
      isTicket = true;
    }
    const log = [];
    if (prop.action === PerformedAction.DirectClose) {
      log.push(new TicketsCommunicationLog(ClientStatusEnum.Closed));
    }
    else if (prop.action === PerformedAction.Approve) {
      log.push(new TicketsCommunicationLog(ClientStatusEnum.Approve));
      log.push(new TicketsCommunicationLog(ClientStatusEnum.NotesAdded));
    }
    else if (prop.action === PerformedAction.Reject) {
      log.push(new TicketsCommunicationLog(ClientStatusEnum.Ignore));
      log.push(new TicketsCommunicationLog(ClientStatusEnum.NotesAdded));
    }
    const sourceobj = {
      PerformedAction: prop.action,
      IsTicket: isTicket,
      IsReplyModified: false,
      ActionTaken: 0,
      Tasks: log,
      BulkReplyRequests: BulkObject
    };

    this.BulkActionAPI(sourceobj, prop.action);
  }

  BulkActionAPI(sourceobj, action): void {
    this.BulkTicketAction(sourceobj).subscribe((data) => {
      let message = '';
      this._ticketService.selectedPostList = [];
      this._ticketService.postSelectTrigger.next(0);
      this._ticketService.bulkMentionChecked = [];
      if (action === PerformedAction.DirectClose) {
        message = 'Bulk direct close successfull';
      }
      else if (action === PerformedAction.Approve) {
        message = 'Bulk approved successfull';
      }
      else if (action === PerformedAction.Reject) {
        message = 'Bulk reject successfull';
      }
      else if (action === PerformedAction.OnHoldAgent) {
        message = 'Bulk Onhold successfull';
      }
      else if (action === PerformedAction.ReopenCase) {
        message = 'Bulk Reopen successfull';
      }
      else if (action === PerformedAction.Escalate) {
        message = 'Bulk Escalate successfull';
      }
      else if (action === PerformedAction.Assign) {
        message = 'Bulk Assign successfull';
      }
      console.log(message, data);
      this._filterService.currentBrandSource.next(true);
      // this.dialogRef.close(true);
      this._snackBar.open(message, 'Ok', {
        duration: 2000,
      });
      // this.zone.run(() => {
    });
  }

  MarkActionable(keyObj): Observable<any> {
    return this._http.post<CustomResponse>(environment.baseUrl + '/Mention/MarkActionable', keyObj).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        else {
          this._snackBar.open('Error Occurred while making mention actionable', 'Ok', {
            duration: 2000
          });
        }
      })
    );

  }

  BulkReplyApproved(keyObj): Observable<CustomResponse> {
    return this._http.post<CustomResponse>(environment.baseUrl + '/Tickets/BulkReplyApproved', keyObj).pipe(
      map(response => {
        if (response.success) {
          return response;
        }
        else {
          this._snackBar.open('Error Occurred while approving reply', 'Ok', {
            duration: 2000
          });
        }
      })
    );

  }

  BulkReplyRejection(keyObj): Observable<CustomResponse> {
    return this._http.post<CustomResponse>(environment.baseUrl + '/Tickets/BulkReplyRejection', keyObj).pipe(
      map(response => {
        if (response.success) {
          return response;
        }
        else {
          this._snackBar.open('Error Occurred while rejecting bulk reply', 'Ok', {
            duration: 2000
          });
        }
      })
    );

  }

  getTicketHtmlForEmail(keyObj): Observable<CustomResponse> {
    // ?IsRazor=true
    return this._http.post<CustomResponse>(environment.baseUrl + '/Tickets/GetTicketHtmlForEmail', keyObj).pipe(
      map(response => {
        if (response.success) {
          return response;
        }
        else {
          this._snackBar.open('Error Occurred while getting ticket html data', 'Ok', {
            duration: 2000
          });
        }
      })
    );

  }

  GetTagAlerEmails(keyObj): Observable<AlertMails[]> {
    return this._http.post<AlertMailsResponse>(environment.baseUrl + '/Tickets/GetTagAlerEmails', keyObj).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        else {
          this._snackBar.open('Error Occurred while getting tag emails', 'Ok', {
            duration: 2000
          });
        }
      })
    );
  }

  forwardReply(keyObj): Observable<CustomResponse> {
    return this._http.post<CustomResponse>(environment.baseUrl + '/Tickets/ForwardEmail', keyObj).pipe(
      map(response => {
        if (response.success) {
          return response;
        }
        else {
          this._snackBar.open('Error Occurred while sending reply', 'Ok', {
            duration: 2000
          });
        }
      })
    );

  }
}
