import { Component, Input, OnInit } from '@angular/core';
import { LogStatus } from 'app/core/enums/LogStatus';
import { UserRoleEnum } from 'app/core/enums/userRoleEnum';
import { AuthUser } from 'app/core/interfaces/User';
import {
  CommunicationLog,
  NoteAndMessage,
} from 'app/core/models/viewmodel/CommunicationLog';
import { AccountService } from 'app/core/services/account.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-post-log',
  templateUrl: './post-log.component.html',
  styleUrls: ['./post-log.component.scss'],
})
export class PostLogComponent implements OnInit {
  @Input() logMessage: CommunicationLog;
  currentUser: AuthUser;
  style: string;
  cssClass: string;
  isNoteNull: boolean;
  LogCondition: number;
  isApproved: boolean;
  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.currentUser = user));
    // construct an object
    this.mapCommunicatioObject(this.logMessage);
  }
  mapCommunicatioObject(comObj: CommunicationLog): void {
    this.style = '';
    this.cssClass = '';
    if (comObj.status === LogStatus.NotesAdded) {
      this.style = 'display:none';
    } else {
      this.style = 'display:block';
    }
    if (comObj.status === LogStatus.Approve) {
      // this.cssClass = 'post__log--approved';
      this.cssClass = 'post-log__success';
      this.isApproved = true;
    } else if (
      comObj.status === LogStatus.Ignore ||
      comObj.status === LogStatus.SSREReplyRejected
    ) {
      // this.cssClass = 'post__log--rejected';
      this.cssClass = 'post-log__danger';
      this.isApproved = false;
    }

    if (
      comObj.logVersion === 1 &&
      comObj.status === LogStatus.GroupDisplayMessage
    ) {
      this.LogCondition = 1;
      if (comObj.logText.includes('approved')) {
        this.cssClass = 'post-log__success';
        this.isApproved = true;
      } else if (
        comObj.logText.includes('ignored') ||
        comObj.logText.includes('rejected')
      ) {
        this.cssClass = 'post-log__danger';
        this.isApproved = false;
      }

      if (comObj.note) {
        this.isNoteNull = false;
        const obj = JSON.parse(comObj.note);
        this.logMessage.note = obj.Note;
        if (obj.Note) {
          let ClassName: LogStatus;
          if (obj.Note.length > 0) {
            if (
              +this.currentUser.data.user.role === UserRoleEnum.BrandAccount
            ) {
              ClassName = comObj.status;
            }
          }
        }
      }
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
        this.LogCondition = 2;
        if (comObj.note) {
          let ClassName: LogStatus;
          if (comObj.note.length > 0) {
              if (
                +this.currentUser.data.user.role === UserRoleEnum.BrandAccount
              ) {
                ClassName = comObj.status;
              }
            }
        }

      }
      else if ((comObj.logVersion === 0) && (comObj.status === LogStatus.Closed
        || comObj.status === LogStatus.SRClosed)){
          this.LogCondition = 3;
      }
  }
}
