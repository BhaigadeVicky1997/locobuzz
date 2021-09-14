import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatBottomSheet, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseMention } from 'app/core/models/mentions/locobuzz/BaseMention';
import { PostDetailService } from 'app/social-inbox/services/post-detail.service';
import { TicketsService } from 'app/social-inbox/services/tickets.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TicketConversationComponent } from '../ticket-conversation/ticket-conversation.component';
import { ReplyService } from 'app/social-inbox/services/reply.service';
import { FilterService } from 'app/social-inbox/services/filter.service';
import { ActionStatusEnum } from 'app/core/enums/ActionStatus';


@Component({
  selector: 'app-attach-ticket',
  templateUrl: './attach-ticket.component.html',
  styleUrls: ['./attach-ticket.component.scss']
})

export class AttachTicketComponent implements OnInit {

  postData: BaseMention;
  currentTicket: BaseMention;
  ticketStatGroup: TicketStatGroup[] = [];
  selected = '';
  attachedNote = '';
  constructor(private _bottomSheet: MatBottomSheet,
              private _postDetailService: PostDetailService,
              private _ticketService: TicketsService,
              private _snackBar: MatSnackBar,
              private _replyService: ReplyService,
              public dialog: MatDialog,
              private _filterService: FilterService,
              @Optional() @Inject(MAT_BOTTOM_SHEET_DATA) public data: {CurrentPost?: BaseMention}) {
                if (data && data.CurrentPost)
                {
                  this.currentTicket = data.CurrentPost;
                }
               }

  ngOnInit(): void {
    this.postData = this._postDetailService.postObj;
    this.getAuthorTickets();
  }

  getAuthorTickets(): void
  {
    // construct author tickets
    const brandObj = {
      BrandName: this.currentTicket.brandInfo.brandName,
      BrandId: this.currentTicket.brandInfo.brandID
    }

    const keyObj = {
      BrandInfo: brandObj,
      AuthorId: this.currentTicket.author.socialId,
      ChannelGroup: this.currentTicket.channelGroup
    }

    this._ticketService.getAuthorTickets(keyObj).subscribe((data) => {
      if (data.success) {
            this.createDropDownObj(data.data);
      }
      else {
        // this.clickTicketMenuTrigger.closeMenu();
        this._snackBar.open('Error Occured', 'Close', {
          duration: 1000
        });
      }
    });
  }

  createDropDownObj(ticketlist): void
  {
    ticketlist = ticketlist.filter(obj => {
      return +obj.ticketId !== +this.currentTicket.ticketInfo.ticketID;
    });
    if (ticketlist && ticketlist.length > 0)
    {
      const drpOpenTickets: DrpTicketStat[] = [];
      const drpClosedTickets: DrpTicketStat[] = [];

      const opentickets = ticketlist.filter(obj => {
        return +obj.ticketStatus === 0;
      });
      const closedtickets = ticketlist.filter(obj => {
        return +obj.ticketStatus === 3;
      });
      if (opentickets && opentickets.length > 0)
      {
         for (const obj of opentickets)
         {
          drpOpenTickets.push({value: obj.ticketId, viewValue: obj.ticketId});
         }

         this.ticketStatGroup.push({disabled: false, name: 'Open', tickets: drpOpenTickets});
      }

      if (closedtickets && closedtickets.length > 0)
      {
         for (const obj of closedtickets)
         {
          drpClosedTickets.push({value: obj.ticketId, viewValue: obj.ticketId});
         }
         this.ticketStatGroup.push({disabled: false, name: 'Closed', tickets: drpClosedTickets});
      }
    }
    else{
      this._snackBar.open('No Tickets to attach', 'Close', {
        duration: 3000
      });
    }

  }

  closeAttachTicket(): void {
    // this.replyTextInitialValue = '';
    // this.clearInputs();
    this._bottomSheet.dismiss();
  }

  lastTalk(): void {
    const dialogRef = this.dialog.open(TicketConversationComponent ,{
      width: '1000px',
    });
  }

  attachTicket(): void {
    if (this.selected && this.selected !== '')
    {
      const performActionObj = this._replyService.BuildReply(this.currentTicket,
        ActionStatusEnum.AttachTicket, this.attachedNote, this.selected);

      this._replyService.Reply(performActionObj).subscribe((data) => {
        if (data)
        {
          this._filterService.currentBrandSource.next(true);
          this._bottomSheet.dismiss();
          this._snackBar.open('Ticket Attached successfully', 'Ok', {
            duration: 2000,
          });
        }
        else
        {
          this._snackBar.open('Some error occured', 'Ok', {
            duration: 2000,
          });
        }
        // this.zone.run(() => {
      });
    }
    else{
      this._snackBar.open('Please select ticket Id', 'Ok', {
        duration: 2000,
      });
    }
  }

}

interface DrpTicketStat {
  value: string;
  viewValue: string;
}

interface TicketStatGroup {
  disabled?: boolean;
  name: string;
  tickets: DrpTicketStat[];
}
