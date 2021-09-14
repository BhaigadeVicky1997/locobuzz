import { PostAssignToService } from './../../services/post-assignto.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FilterService } from 'app/social-inbox/services/filter.service';
import { PostDetailService } from 'app/social-inbox/services/post-detail.service';
import { TicketsService } from 'app/social-inbox/services/tickets.service';
import { AssignToList, AssignToListWithTeam } from '../../../shared/components/filter/filter-models/assign-to.model';
import { PerformedAction } from 'app/core/enums/PerformedAction';
import { ReplyService } from 'app/social-inbox/services/reply.service';
import { NavigationService } from 'app/core/services/navigation.service';
import { PostsType } from 'app/core/models/viewmodel/GenericFilter';
import { TicketsCommunicationLog } from 'app/core/models/dbmodel/TicketReplyDTO';
import { ClientStatusEnum } from 'app/core/enums/ActionStatus';

@Component({
  selector: 'app-post-assignto',
  templateUrl: './post-assignto.component.html',
  styleUrls: ['./post-assignto.component.scss']
})
export class PostAssigntoComponent implements OnInit {


  assignTo: AssignToList[] = [];
  assignToForm: FormGroup;
  assignToName: string;
  note: string;
  selectedAssignTo: number;
  defaultNote: string;

  constructor(
    private _filterService: FilterService,
    private _postDetailService: PostDetailService,
    private formBuilder: FormBuilder,
    private _ticketService: TicketsService,
    private _snackBar: MatSnackBar,
    private _postAssignToService: PostAssignToService,
    private _replyService: ReplyService,
    private _navigationService: NavigationService) { }

  ngOnInit(): void {
    this.createAssignToForm();
    console.log(this.defaultNote);
    this.assignTo = this._postAssignToService.assignTo;
    this.selectedAssignTo = this._postAssignToService.selectedAssignTo;
    this.defaultNote = this._postAssignToService.defaultNote;
  }


  getAssignTo(list): void {

    console.log(this._postDetailService.postObj);
    const userwithteam: AssignToListWithTeam[] = [];
    for (const item of list) {

      for (const subItem of item.authorizedBrandsList) {
        if (subItem === this._postDetailService.postObj.brandInfo.brandID) {
          this.assignTo.push(item);
          if (userwithteam.length > 0) {
            for (const userObj of userwithteam) {
              if (userObj.teamID === item.teamID) {
                userObj.user.push(item);
              }
            }
          } else {
            const userof: AssignToListWithTeam = {
              teamID: item.teamID,
              teamName: item.teamName,
              user: [item]
            };
            userwithteam.push(userof);
          }
        }
      }

    }

    // setTimeout(() => {

    this.selectedAssignTo = this._postDetailService.postObj.ticketInfo.assignedTo;
    this.defaultNote = this._postDetailService.postObj.ticketInfo.lastNote;
    console.log(this.defaultNote);
    // }, 1);
  }


  createAssignToForm(): void {
    this.assignToForm = this.formBuilder.group(
      {
        assignToName: new FormControl(this._postDetailService.postObj.ticketInfo.assignedTo),
        assignToid: new FormControl(null),
        note: new FormControl(this._postDetailService.postObj.ticketInfo.lastNote)
      }
    );

  }

  setAssigntoFromValue(form): void {
    this.assignToForm.get('assignToid').patchValue(form.value);
  }

  onSubmit(): void {
    console.log(this.assignToForm.value);
    if (this._postDetailService.isBulk) {
      let isTicket = false;
      if (this._postDetailService.pagetype === PostsType.Tickets) {
        isTicket = true;
      }
      const logs = [];
      const log = new TicketsCommunicationLog(ClientStatusEnum.Assigned);
      log.AssignedToUserID = this.assignToForm.value.assignToid;
      logs.push(log);

      const log1 = new TicketsCommunicationLog(ClientStatusEnum.NotesAdded);
      if (this.assignToForm.value.note.trim()) {
        log1.Note = this.assignToForm.value.note ? this.assignToForm.value.note : '';
      }
      log1.AssignedToUserID = this.assignToForm.value.assignToid;
      logs.push(log1);
      const BulkObject = [];
      const chkTicket = this._ticketService.bulkMentionChecked.filter(obj =>
        obj.guid === this._navigationService.currentSelectedTab.guid);
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
      }


      const sourceobj = {
        PerformedAction: PerformedAction.Assign,
        IsTicket: isTicket,
        IsReplyModified: false,
        ActionTaken: 0,
        Tasks: logs,
        BulkReplyRequests: BulkObject
      };
      this._replyService.BulkActionAPI(sourceobj, PerformedAction.Assign);
    }
    else {
      this._postDetailService.postObj.ticketInfo.assignedTo = this.assignToForm.value.assignToid;
      this._postDetailService.postObj.ticketInfo.lastNote = this.assignToForm.value.note;
      console.log('Note', this.assignToForm.value.note);

      const object = {
        brandInfo: this._postDetailService.postObj.brandInfo,
        ticketInfo: this._postDetailService.postObj.ticketInfo,
        channelType: this._postDetailService.postObj.channelType
      };

      // object.ticketInfo.assignedTo = ;
      // console.log(object.ticketInfo);


      this._ticketService.ticketReassignToUser(object).subscribe((data) => {
        if (JSON.parse(JSON.stringify(data)).success) {
          console.log('Assign To Result', data);
          this._snackBar.open('Ticket Successfully Assigned', 'Ok', {
            duration: 1000
          });
        }
        else {
          this._snackBar.open('Error Occured', 'Close', {
            duration: 1000
          });
        }
      }, error => {
        console.log(error);

      });


      console.log(this._postDetailService.postObj.ticketInfo);
    }



  }


}
