import { Component, Input, OnInit, EventEmitter, Output, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { locobuzzAnimations } from '@locobuzz/animations';
import { ClientStatusEnum } from 'app/core/enums/ActionStatus';
import { ChannelGroup } from 'app/core/enums/ChannelGroup';
import { ChannelType } from 'app/core/enums/ChannelType';
import { LogStatus } from 'app/core/enums/LogStatus';
import { PerformedAction } from 'app/core/enums/PerformedAction';
import { SsreIntent } from 'app/core/enums/ssreIntentEnum';
import { SSRELogStatus } from 'app/core/enums/SSRELogStatus';
import { TicketStatus } from 'app/core/enums/ticketStatusEnum';
import { UserRoleEnum } from 'app/core/enums/userRoleEnum';
import { AuthUser } from 'app/core/interfaces/User';
import { TicketsCommunicationLog } from 'app/core/models/dbmodel/TicketReplyDTO';
import { PostsType } from 'app/core/models/viewmodel/GenericFilter';
import { AccountService } from 'app/core/services/account.service';
import { NavigationService } from 'app/core/services/navigation.service';
import { AlertDialogModel, AlertPopupComponent } from 'app/shared/components/alert-popup/alert-popup.component';
import { FilterService } from 'app/social-inbox/services/filter.service';
import { ReplyService } from 'app/social-inbox/services/reply.service';
import { take } from 'rxjs/operators';
import { BrandList } from '../../../shared/components/filter/filter-models/brandlist.model';
import { MatMenuTrigger } from '@angular/material/menu';
import { PostDetailService } from 'app/social-inbox/services/post-detail.service';
import { PostAssigntoComponent } from '../post-assignto/post-assignto.component';
import { PostReplyComponent } from '../post-reply/post-reply.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BulkActionButtons } from 'app/core/interfaces/BulkTicketActions';
import { CategoryFilterComponent } from '../category-filter/category-filter.component';
import { TicketsService } from 'app/social-inbox/services/tickets.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-bulk-actions',
  templateUrl: './post-bulk-actions.component.html',
  styleUrls: ['./post-bulk-actions.component.scss'],
  animations: locobuzzAnimations
})
export class PostBulkActionsComponent implements OnInit, OnDestroy {
  @ViewChild('onholdnote') onholdnote: MatMenuTrigger;
  @ViewChild('bulkreopennote') bulkreopennote: MatMenuTrigger;
  postCount: number = this._ticketService.selectedPostList.length;
  @Input() pageType: PostsType;
  @Output() bulkActionEvent = new EventEmitter<string>();
  currentUser: AuthUser;
  bulkActionbtn: BulkActionButtons = {};
  private posttriggersubscription: Subscription;
  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _replyService: ReplyService, private _navigationService: NavigationService,
    private _accountService: AccountService, private _filterService: FilterService,
    private _postDetailService: PostDetailService,
    private _bottomSheet: MatBottomSheet,
    private _ticketService: TicketsService) { }

  ngOnInit(): void {
    this._accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.currentUser = user));
    this.bulkActionbtn = this._replyService.bulkActionButtons;
    this.posttriggersubscription = this._ticketService.postSelectTrigger.subscribe((count) => {
      this.postCount = count;
      if (this.postCount === 0) {
        this.bulkAction('dismiss');
      }
    });

  }

  ngOnDestroy(): void {
    this.posttriggersubscription.unsubscribe();
  }

  bulkAction(actionType): void {
    // this.onholdnote.closeMenu();
    if (actionType === 'approve') {
      let message = '';
      let IsCSDUser = false;
      if (+this.currentUser.data.user.role === UserRoleEnum.CustomerCare) {
        IsCSDUser = true;
      }
      if (IsCSDUser) {
        message = 'Some of the selected tickets have brand workflow enabled, thus selected action will be performed only on the qualified tickets.';
      }
      else {
        message = 'Are you sure to approve selected tickets?';
      }
      const dialogData = new AlertDialogModel(
        message,
        '',
        'Continue'
      );
      const dialogRef = this.dialog.open(AlertPopupComponent, {
        disableClose: true,
        autoFocus: false,
        data: dialogData,
      });
      dialogRef.afterClosed().subscribe((dialogResult) => {
        if (dialogResult) {
          const prop = {
            action: PerformedAction.Approve,
            guid: this._navigationService.currentSelectedTab.guid,
            currentteamid: +this.currentUser.data.user.teamID,
            userrole: +this.currentUser.data.user.role,
            pageType: this.pageType,
            agentWorkFlowEnabled: this.currentUser.data.user.agentWorkFlowEnabled
          };
          this._replyService.ConfirmBulkTicketAction(prop);
          // this.BulkTicketAction(PerformedAction.Approve);
        } else {
        }
      });
    }
    else if (actionType === 'ignore') {
      let message = '';
      let IsCSDUser = false;
      if (+this.currentUser.data.user.role === UserRoleEnum.CustomerCare) {
        IsCSDUser = true;
      }
      if (IsCSDUser) {
        message = 'Some of the selected tickets have brand workflow enabled, thus selected action will be performed only on the qualified tickets.';
      }
      else {
        message = 'Are you sure to reject selected tickets?';
      }
      const dialogData = new AlertDialogModel(
        message,
        '',
        'Continue'
      );
      const dialogRef = this.dialog.open(AlertPopupComponent, {
        disableClose: true,
        autoFocus: false,
        data: dialogData,
      });
      dialogRef.afterClosed().subscribe((dialogResult) => {
        if (dialogResult) {
          const prop = {
            action: PerformedAction.Reject,
            guid: this._navigationService.currentSelectedTab.guid,
            currentteamid: +this.currentUser.data.user.teamID,
            userrole: +this.currentUser.data.user.role,
            pageType: this.pageType,
            agentWorkFlowEnabled: this.currentUser.data.user.agentWorkFlowEnabled
          };
          this._replyService.ConfirmBulkTicketAction(prop);
          //this.BulkTicketAction(PerformedAction.Reject);
        } else {
        }
      });
    }
    else if (actionType === 'assign') {
      this.ShowUserPopupForAssignTickets();
    }
    else if (actionType === 'hold') {
      const ValidationData = this.ValidateTicketsToBeClosed();
      if (ValidationData.IsValid) {
        // show onhold popup
        this.onholdnote.openMenu();
      }
      else {
        this._snackBar.open(ValidationData.Message, 'Ok', {
          duration: 2000,
        });
      }
    }
    else if (actionType === 'escalate') {
      const ValidationData = this.ValidateTicketsToBeEscalate();
      if (ValidationData.IsValid) {
        const qualifiedforapproval = [];
        let isticketagentworkflowenabled = false;
        const GoingForApproval = [];
        let TotalTickets = 0;
        const qualifiedTickets = this._ticketService.bulkMentionChecked.filter(obj =>
          obj.guid === this._navigationService.currentSelectedTab.guid);
        TotalTickets = qualifiedTickets.length;

        if (qualifiedTickets.length > 0) {

          for (const checkedticket of qualifiedTickets) {
            isticketagentworkflowenabled = checkedticket.mention.ticketInfo.ticketAgentWorkFlowEnabled;

            const isworkflowenabled = this._filterService.fetchedBrandData.find(
              (brand: BrandList) => +brand.brandID === checkedticket.mention.brandInfo.brandID
            );
            if (+this.currentUser.data.user.role === UserRoleEnum.AGENT
              && isworkflowenabled.isEnableReplyApprovalWorkFlow
              && (this.currentUser.data.user.agentWorkFlowEnabled || isticketagentworkflowenabled)) {
              qualifiedforapproval.push(this);
              GoingForApproval.push(isticketagentworkflowenabled);
            }
          }
          if (GoingForApproval.length > 0) {

            const dialogData = new AlertDialogModel(
              `${GoingForApproval} of ${TotalTickets} tickets are qualified for Makerchecker`,
              '',
              'Continue'
            );
            const dialogRef = this.dialog.open(AlertPopupComponent, {
              disableClose: true,
              autoFocus: false,
              data: dialogData,
            });
            dialogRef.afterClosed().subscribe((dialogResult) => {
              if (dialogResult) {
                this._postDetailService.postObj = qualifiedTickets[0].mention;
                this._postDetailService.pagetype = this.pageType;
                this._postDetailService.isBulk = true;
                const replyPostRef = this._bottomSheet.open(PostReplyComponent, {
                  ariaLabel: 'Reply',
                  panelClass: 'post-reply__wrapper',
                  backdropClass: 'no-blur',
                  data: { onlyEscalation: true },
                });
              } else {
              }
            });
          }
          else {
            // show escalate popup
            this._postDetailService.postObj = qualifiedTickets[0].mention;
            this._postDetailService.pagetype = this.pageType;
            this._postDetailService.isBulk = true;
            const replyPostRef = this._bottomSheet.open(PostReplyComponent, {
              ariaLabel: 'Reply',
              panelClass: 'post-reply__wrapper',
              backdropClass: 'no-blur',
              data: { onlyEscalation: true },
            });
          }
        }
      }
      else {
        this._snackBar.open(ValidationData.Message, 'Ok', {
          duration: 2000,
        });
      }
    }
    else if (actionType === 'reopen') {
      const ValidationData = this.ValidateTicketsToBeReopened();
      if (ValidationData.IsValid) {
        // show reopen notes
        this.bulkreopennote.openMenu();
      }
      else {
        this._snackBar.open(ValidationData.Message, 'Ok', {
          duration: 2000,
        });
      }
    }
    else if (actionType === 'reply') {
      this.ShowBulkReplyPreview();
    }
    else if (actionType === 'close') {
      this.GetBulkDirectClose();
    }
    else if (actionType === 'tagcategory') {
      this.GetBulkTagggingCategoryFromOutSide();
    }
    this.bulkActionEvent.emit(actionType);
  }

  onlyUnique(value, index, self): boolean {
    return self.indexOf(value) === index;
  }

  GetBulkDirectClose(): void {
    const ValidationData = this.ValidateTicketsToBeClosed();
    if (ValidationData.IsValid) {

      const qualifiedforapproval = [];
      let isticketagentworkflowenabled = false;
      const GoingForApproval = [];
      let TotalTickets = 0;
      const qualifiedTickets = this._ticketService.bulkMentionChecked.filter(obj =>
        obj.guid === this._navigationService.currentSelectedTab.guid);
      TotalTickets = qualifiedTickets.length;
      if (qualifiedTickets.length > 0) {

        for (const checkedticket of qualifiedTickets) {
          isticketagentworkflowenabled = checkedticket.mention.ticketInfo.ticketAgentWorkFlowEnabled;

          const isworkflowenabled = this._filterService.fetchedBrandData.find(
            (brand: BrandList) => +brand.brandID === checkedticket.mention.brandInfo.brandID
          );
          if (+this.currentUser.data.user.role === UserRoleEnum.AGENT
            && isworkflowenabled.isEnableReplyApprovalWorkFlow
            && (this.currentUser.data.user.agentWorkFlowEnabled || isticketagentworkflowenabled)) {
            qualifiedforapproval.push(this);
            GoingForApproval.push(isticketagentworkflowenabled);
          }
        }

        if (GoingForApproval.length > 0) {

          const dialogData = new AlertDialogModel(
            `${GoingForApproval} of ${TotalTickets} tickets are qualified for Makerchecker`,
            '',
            'Continue'
          );
          const dialogRef = this.dialog.open(AlertPopupComponent, {
            disableClose: true,
            autoFocus: false,
            data: dialogData,
          });
          dialogRef.afterClosed().subscribe((dialogResult) => {
            if (dialogResult) {
              const prop = {
                action: PerformedAction.DirectClose,
                guid: this._navigationService.currentSelectedTab.guid,
                currentteamid: +this.currentUser.data.user.teamID,
                userrole: +this.currentUser.data.user.role,
                pageType: this.pageType,
                agentWorkFlowEnabled: this.currentUser.data.user.agentWorkFlowEnabled
              };
              this._replyService.ConfirmBulkTicketAction(prop);

            } else {
            }
          });
        }
        else {
          const dialogData = new AlertDialogModel(
            `Are you sure to close selected tickets?`,
            '',
            'Continue'
          );
          const dialogRef = this.dialog.open(AlertPopupComponent, {
            disableClose: true,
            autoFocus: false,
            data: dialogData,
          });
          dialogRef.afterClosed().subscribe((dialogResult) => {
            if (dialogResult) {
              const prop = {
                action: PerformedAction.DirectClose,
                guid: this._navigationService.currentSelectedTab.guid,
                currentteamid: +this.currentUser.data.user.teamID,
                userrole: +this.currentUser.data.user.role,
                pageType: this.pageType,
                agentWorkFlowEnabled: this.currentUser.data.user.agentWorkFlowEnabled
              };
              this._replyService.ConfirmBulkTicketAction(prop);
            } else {
            }
          });
        }
      }


    }
    else {
      this._snackBar.open(ValidationData.Message, 'Ok', {
        duration: 2000,
      });
    }
  }

  ValidateTicketsToBeClosed(): any {
    const SelectedTickets = this._ticketService.bulkMentionChecked.filter(obj =>
      obj.guid === this._navigationService.currentSelectedTab.guid);

    let IsValid = false;
    let Message = '';

    if (+this.currentUser.data.user.role === UserRoleEnum.AGENT
      || +this.currentUser.data.user.role === UserRoleEnum.SupervisorAgent
      || +this.currentUser.data.user.role === UserRoleEnum.TeamLead
      || +this.currentUser.data.user.role === UserRoleEnum.BrandAccount) {
      const SelectedTicketsStatus = SelectedTickets.map(s => s.mention.ticketInfo.status).filter(this.onlyUnique);

      switch (+this.currentUser.data.user.role) {
        case UserRoleEnum.AGENT:
        case UserRoleEnum.SupervisorAgent:
        case UserRoleEnum.TeamLead:
          if (SelectedTicketsStatus.indexOf(1) >= 0
            || SelectedTicketsStatus.indexOf(3) >= 0
            || SelectedTicketsStatus.indexOf(6) >= 0
            || SelectedTicketsStatus.indexOf(8) >= 0
            || SelectedTicketsStatus.indexOf(11) >= 0
            || SelectedTicketsStatus.indexOf(12) >= 0
            || SelectedTicketsStatus.indexOf(13) >= 0
            || SelectedTicketsStatus.indexOf(14) >= 0
            || SelectedTicketsStatus.indexOf(15) >= 0
            || SelectedTicketsStatus.indexOf(16) >= 0
          ) {

            IsValid = false;
            Message = 'You can only select open, on hold, approved and awaiting response from customer tickets to direct close';
          }
          else {
            IsValid = true;
            Message = '';
          }
          break;
        case UserRoleEnum.BrandAccount:
          if (SelectedTicketsStatus.indexOf(0) >= 0
            || SelectedTicketsStatus.indexOf(1) >= 0
            || SelectedTicketsStatus.indexOf(2) >= 0
            || SelectedTicketsStatus.indexOf(3) >= 0
            || SelectedTicketsStatus.indexOf(4) >= 0
            || SelectedTicketsStatus.indexOf(5) >= 0
            || SelectedTicketsStatus.indexOf(6) >= 0
            || SelectedTicketsStatus.indexOf(7) >= 0
            || SelectedTicketsStatus.indexOf(9) >= 0
            || SelectedTicketsStatus.indexOf(10) >= 0
            || SelectedTicketsStatus.indexOf(12) >= 0
            || SelectedTicketsStatus.indexOf(13) >= 0
            || SelectedTicketsStatus.indexOf(14) >= 0
            || SelectedTicketsStatus.indexOf(15) >= 0
            || SelectedTicketsStatus.indexOf(16) >= 0
          ) {

            IsValid = false;
            Message = 'You can only select on hold and escalated tickets to direct close';
          }
          else {
            IsValid = true;
            Message = '';
          }
          break;
        default:
          IsValid = false;
          Message = 'You are not authorized to direct close multiple tickets';
          break;
      }
    }
    else {
      IsValid = false;
      Message = 'You are not authorized to direct close multiple tickets';
    }

    return { IsValid, Message, SelectedTicketCount: SelectedTickets.length };
  }

  ValidateTicketsToBeOnHold(): any {
    const SelectedTickets = this._ticketService.bulkMentionChecked.filter(obj =>
      obj.guid === this._navigationService.currentSelectedTab.guid);

    let IsValid = false;
    let Message = '';

    if (+this.currentUser.data.user.role === UserRoleEnum.AGENT
      || +this.currentUser.data.user.role === UserRoleEnum.SupervisorAgent
      || +this.currentUser.data.user.role === UserRoleEnum.TeamLead
      || +this.currentUser.data.user.role === UserRoleEnum.BrandAccount
      || +this.currentUser.data.user.role === UserRoleEnum.CustomerCare) {
      if (SelectedTickets.length > 1 && SelectedTickets.length <= 50) {
        const SelectedTicketsStatus = SelectedTickets.map(s => s.mention.ticketInfo.status).filter(this.onlyUnique);

        switch (+this.currentUser.data.user.role) {
          case UserRoleEnum.AGENT:
          case UserRoleEnum.SupervisorAgent:
          case UserRoleEnum.TeamLead:
            if (SelectedTicketsStatus.indexOf(1) >= 0
              || SelectedTicketsStatus.indexOf(3) >= 0
              || SelectedTicketsStatus.indexOf(5) >= 0
              || SelectedTicketsStatus.indexOf(6) >= 0
              || SelectedTicketsStatus.indexOf(8) >= 0
              || SelectedTicketsStatus.indexOf(11) >= 0
              || SelectedTicketsStatus.indexOf(12) >= 0
              || SelectedTicketsStatus.indexOf(13) >= 0
              || SelectedTicketsStatus.indexOf(14) >= 0
              || SelectedTicketsStatus.indexOf(16) >= 0) {

              IsValid = false;
              Message = 'You can only select tickets with status open, approved and rejected';
            }
            else {
              IsValid = true;
              Message = '';
            }
            break;
          case UserRoleEnum.CustomerCare:
            if (SelectedTicketsStatus.indexOf(3) >= 0
              || SelectedTicketsStatus.indexOf(5) >= 0
              || SelectedTicketsStatus.indexOf(6) >= 0
              || SelectedTicketsStatus.indexOf(8) >= 0
              || SelectedTicketsStatus.indexOf(11) >= 0
              || SelectedTicketsStatus.indexOf(12) >= 0
              || SelectedTicketsStatus.indexOf(13) >= 0
              || SelectedTicketsStatus.indexOf(14) >= 0
              || SelectedTicketsStatus.indexOf(16) >= 0) {

              IsValid = false;
              Message = 'You can only select tickets with status escalated and rejected';
            }
            else {
              IsValid = true;
              Message = '';
            }
            break;
          case UserRoleEnum.BrandAccount:
            if (SelectedTicketsStatus.indexOf(1) >= 0
              || SelectedTicketsStatus.indexOf(3) >= 0
              || SelectedTicketsStatus.indexOf(5) >= 0
              || SelectedTicketsStatus.indexOf(6) >= 0
              || SelectedTicketsStatus.indexOf(11) >= 0
              || SelectedTicketsStatus.indexOf(12) >= 0
              || SelectedTicketsStatus.indexOf(13) >= 0
              || SelectedTicketsStatus.indexOf(14) >= 0
              || SelectedTicketsStatus.indexOf(15) >= 0
              || SelectedTicketsStatus.indexOf(16) >= 0) {

              IsValid = false;
              Message = 'You can only select tickets with status escalated';
            }
            else {
              IsValid = true;
              Message = '';
            }
            break;
          default:
            IsValid = false;
            Message = 'You are not authorized to peform onhold operation on multiple tickets';
            break;
        }
      }
      else {
        if (SelectedTickets.length < 2) {
          IsValid = false;
          Message = 'Please select minimum 2 tickets to perform on hold';
        }
        else {
          IsValid = false;
          Message = 'You can select maximum 50 tickets to keep on hold';
        }
      }
    }
    else {
      IsValid = false;
      Message = 'You are not authorized to peform onhold operation on multiple tickets';
    }

    return { IsValid, Message, SelectedTicketCount: SelectedTickets.length };
  }

  ValidateTicketsToBeEscalate(): any {
    const SelectedTickets = this._ticketService.bulkMentionChecked.filter(obj =>
      obj.guid === this._navigationService.currentSelectedTab.guid);

    let IsValid = false;
    let Message = '';
    let _TicketAgentWorkFlowEnabled = false;
    let _IsEnableReplyApprovalWorkFlow = false;
    const currentteamid = +this.currentUser.data.user.teamID;
    let isAgentHasTeam = false;
    if (currentteamid !== 0) {
      isAgentHasTeam = true;
    }

    if (+this.currentUser.data.user.role === UserRoleEnum.AGENT
      || +this.currentUser.data.user.role === UserRoleEnum.SupervisorAgent
      || +this.currentUser.data.user.role === UserRoleEnum.TeamLead
      || +this.currentUser.data.user.role === UserRoleEnum.BrandAccount
      || +this.currentUser.data.user.role === UserRoleEnum.CustomerCare) {
      if (SelectedTickets.length > 1 && SelectedTickets.length <= 50) {
        const SelectedTicketsBrandIDs = SelectedTickets.map(s => s.mention.brandInfo.brandID).filter(this.onlyUnique);

        if (SelectedTicketsBrandIDs.length === 1) {
          _TicketAgentWorkFlowEnabled = false;

          const isworkflowenabled = this._filterService.fetchedBrandData.find(
            (brand: BrandList) => +brand.brandID === SelectedTicketsBrandIDs[0]
          );
          _IsEnableReplyApprovalWorkFlow = isworkflowenabled.isEnableReplyApprovalWorkFlow;

          const SelectedTicketAgentWorkFlowEnabled =
            SelectedTickets.map(s => s.mention.ticketInfo.ticketAgentWorkFlowEnabled).filter(this.onlyUnique);
          if (SelectedTicketAgentWorkFlowEnabled.length === 0) {
            IsValid = false;
            Message = 'Something went wrong, please try again later';
          }
          else if (SelectedTicketAgentWorkFlowEnabled.length === 1) {
            _TicketAgentWorkFlowEnabled = SelectedTicketAgentWorkFlowEnabled[0];
          }
          else if (SelectedTicketAgentWorkFlowEnabled.length > 1) {
            if (SelectedTicketAgentWorkFlowEnabled.indexOf(true) >= 0) {
              _TicketAgentWorkFlowEnabled = true;
            }
          }

          if (!isAgentHasTeam && +this.currentUser.data.user.role === UserRoleEnum.AGENT
            && _IsEnableReplyApprovalWorkFlow
            && (_TicketAgentWorkFlowEnabled || +this.currentUser.data.user.agentWorkFlowEnabled)) {
            IsValid = false;
            Message = 'You cannot escalate this ticket as it falls under approval rules and needs to be escalated to a TL. Please contact supervisor to assign a TL to you.';
          }
          else {
            const SelectedTicketsStatus = SelectedTickets.map(s => s.mention.ticketInfo.status).filter(this.onlyUnique);

            switch (+this.currentUser.data.user.role) {
              case UserRoleEnum.AGENT:
              case UserRoleEnum.SupervisorAgent:
              case UserRoleEnum.TeamLead:
                if (SelectedTicketsStatus.indexOf(1) >= 0
                  || SelectedTicketsStatus.indexOf(3) >= 0
                  || SelectedTicketsStatus.indexOf(6) >= 0
                  || SelectedTicketsStatus.indexOf(8) >= 0
                  || SelectedTicketsStatus.indexOf(11) >= 0
                  || SelectedTicketsStatus.indexOf(12) >= 0
                  || SelectedTicketsStatus.indexOf(13) >= 0
                  || SelectedTicketsStatus.indexOf(14) >= 0
                  || SelectedTicketsStatus.indexOf(16) >= 0) {

                  IsValid = false;
                  Message = 'You can only select tickets with status open, approved and rejected';
                }
                else {
                  IsValid = true;
                  Message = '';
                }
                break;
              case 2:
                const SelectedTicketsBrandWorflowArray =
                  SelectedTickets.map(s => s.mention.brandInfo.isBrandworkFlowEnabled).filter(this.onlyUnique);

                if (SelectedTicketsBrandWorflowArray.length === 1
                  && SelectedTicketsBrandWorflowArray[0] === true) {
                  if (SelectedTicketsStatus.indexOf(3) >= 0
                    || SelectedTicketsStatus.indexOf(5) >= 0
                    || SelectedTicketsStatus.indexOf(8) >= 0
                    || SelectedTicketsStatus.indexOf(11) >= 0
                    || SelectedTicketsStatus.indexOf(14) >= 0
                    || SelectedTicketsStatus.indexOf(16) >= 0) {
                    IsValid = false;
                    Message = 'You can only select tickets with status escalated and rejected';
                  }
                  else {
                    IsValid = true;
                    Message = '';
                  }
                }
                else {
                  IsValid = false;
                  Message = 'Cannot esclate ticket as brand workflow is not enabled';
                }
                break;
              default:
                IsValid = false;
                Message = 'You are not authorized to peform escalate operation on multiple tickets';
                break;
            }
          }
        }
        else {
          IsValid = false;
          Message = 'You cannot select tickets from multiple brands while escalating';
        }
      }
      else {
        if (SelectedTickets.length < 2) {
          IsValid = false;
          Message = 'Please select minimum 2 tickets to perform escalate';
        }
        else {
          IsValid = false;
          Message = 'You can select maximum 50 tickets to escalate';
        }
      }
    }
    else {
      IsValid = false;
      Message = 'You are not authorized to peform escalate operation on multiple tickets';
    }

    return { IsValid, Message, SelectedTicketCount: SelectedTickets.length };
  }

  ValidateTicketsToBeReopened(): any {
    const SelectedTickets = this._ticketService.bulkMentionChecked.filter(obj =>
      obj.guid === this._navigationService.currentSelectedTab.guid);

    let IsValid = false;
    let Message = '';

    if (+this.currentUser.data.user.role === UserRoleEnum.AGENT
      || +this.currentUser.data.user.role === UserRoleEnum.SupervisorAgent
      || +this.currentUser.data.user.role === UserRoleEnum.TeamLead
      || +this.currentUser.data.user.role === UserRoleEnum.BrandAccount
      || +this.currentUser.data.user.role === UserRoleEnum.CustomerCare) {
      if (SelectedTickets.length > 1 && SelectedTickets.length <= 50) {
        const SelectedTicketsStatus = SelectedTickets.map(s => s.mention.ticketInfo.status).filter(this.onlyUnique);
        const SelectedSSRETicket =
          SelectedTickets.map(s => s.mention.ticketInfoSsre.ssreOriginalIntent === SsreIntent.NoActionTaken
            && s.mention.isSSRE && s.mention.ticketInfoSsre.ssreStatus === SSRELogStatus.Successful).filter(this.onlyUnique);

        if (SelectedSSRETicket.length > 0) {
          IsValid = false;
          Message = 'Please select tickets which are not in SSRE';
        }
        else {
          switch (+this.currentUser.data.user.role) {
            case UserRoleEnum.AGENT:
            case UserRoleEnum.SupervisorAgent:
            case UserRoleEnum.TeamLead:
              if (SelectedTicketsStatus.indexOf(0) >= 0
                || SelectedTicketsStatus.indexOf(1) >= 0
                || SelectedTicketsStatus.indexOf(2) >= 0
                || SelectedTicketsStatus.indexOf(4) >= 0
                || SelectedTicketsStatus.indexOf(6) >= 0
                || SelectedTicketsStatus.indexOf(8) >= 0
                || SelectedTicketsStatus.indexOf(9) >= 0
                || SelectedTicketsStatus.indexOf(10) >= 0
                || SelectedTicketsStatus.indexOf(11) >= 0
                || SelectedTicketsStatus.indexOf(12) >= 0
                || SelectedTicketsStatus.indexOf(13) >= 0
                || SelectedTicketsStatus.indexOf(14) >= 0
                || SelectedTicketsStatus.indexOf(15) >= 0
                || SelectedTicketsStatus.indexOf(16) >= 0) {

                IsValid = false;
                Message = 'You can only select tickets with status closed and on hold';
              }
              else {
                IsValid = true;
                Message = '';
              }
              break;
            case UserRoleEnum.CustomerCare:
              if (SelectedTicketsStatus.indexOf(0) >= 0
                || SelectedTicketsStatus.indexOf(1) >= 0
                || SelectedTicketsStatus.indexOf(2) >= 0
                || SelectedTicketsStatus.indexOf(3) >= 0
                || SelectedTicketsStatus.indexOf(4) >= 0
                || SelectedTicketsStatus.indexOf(5) >= 0
                || SelectedTicketsStatus.indexOf(7) >= 0
                || SelectedTicketsStatus.indexOf(8) >= 0
                || SelectedTicketsStatus.indexOf(9) >= 0
                || SelectedTicketsStatus.indexOf(10) >= 0
                || SelectedTicketsStatus.indexOf(11) >= 0
                || SelectedTicketsStatus.indexOf(12) >= 0
                || SelectedTicketsStatus.indexOf(13) >= 0
                || SelectedTicketsStatus.indexOf(14) >= 0
                || SelectedTicketsStatus.indexOf(5) >= 0
                || SelectedTicketsStatus.indexOf(16) >= 0) {

                IsValid = false;
                Message = 'You can only select tickets with status on hold';
              }
              else {
                IsValid = true;
                Message = '';
              }
              break;
            case UserRoleEnum.BrandAccount:
              if (SelectedTicketsStatus.indexOf(0) >= 0
                || SelectedTicketsStatus.indexOf(1) >= 0
                || SelectedTicketsStatus.indexOf(2) >= 0
                || SelectedTicketsStatus.indexOf(3) >= 0
                || SelectedTicketsStatus.indexOf(4) >= 0
                || SelectedTicketsStatus.indexOf(5) >= 0
                || SelectedTicketsStatus.indexOf(6) >= 0
                || SelectedTicketsStatus.indexOf(7) >= 0
                || SelectedTicketsStatus.indexOf(8) >= 0
                || SelectedTicketsStatus.indexOf(9) >= 0
                || SelectedTicketsStatus.indexOf(10) >= 0
                || SelectedTicketsStatus.indexOf(12) >= 0
                || SelectedTicketsStatus.indexOf(13) >= 0
                || SelectedTicketsStatus.indexOf(14) >= 0
                || SelectedTicketsStatus.indexOf(5) >= 0
                || SelectedTicketsStatus.indexOf(16) >= 0) {

                IsValid = false;
                Message = 'You can only select tickets with status on hold';
              }
              else {
                IsValid = true;
                Message = '';
              }
              break;
            default:
              IsValid = false;
              Message = 'You are not authorized to peform onhold operation on multiple tickets';
              break;
          }
        }
      }
      else {
        if (SelectedTickets.length < 2) {
          IsValid = false;
          Message = 'Please select minimum 2 tickets to reopen';
        }
        else {
          IsValid = false;
          Message = 'You can select maximum 50 tickets to reopen';
        }
      }
    }
    else {
      IsValid = false;
      Message = 'You are not authorized to reopen multiple tickets';
    }

    return { IsValid, Message, SelectedTicketCount: SelectedTickets.length };
  }

  ShowBulkReplyPreview(): any {
    let IsEnableReplyApprovalWorkFlow = false;
    const settings = this.GetCategoryBrandLevelBulkReplySetting();
    if (settings.IsCategory || settings.IsBrand) {

      const CheckedMentionsOrTickets = this._ticketService.bulkMentionChecked.filter(obj =>
        obj.guid === this._navigationService.currentSelectedTab.guid);


      let _ChannelGroupID = 0;
      const ticketagentworkflowenabled = false;
      if (CheckedMentionsOrTickets.length > 0) {
        const firstElement = CheckedMentionsOrTickets[0].mention;
        _ChannelGroupID = firstElement.channelGroup;
        const brandid = firstElement.brandInfo.brandID;
        const isworkflowenabled = this._filterService.fetchedBrandData.find(
          (brand: BrandList) => +brand.brandID === brandid
        );

        IsEnableReplyApprovalWorkFlow = isworkflowenabled.isEnableReplyApprovalWorkFlow;
      }

      const TicketApprovalEnable = [];
      for (const checkedticket of CheckedMentionsOrTickets) {
        if (checkedticket.mention.ticketInfo.ticketAgentWorkFlowEnabled) {
          TicketApprovalEnable.push(checkedticket.mention.ticketInfo.ticketAgentWorkFlowEnabled);
        }
      }

      if (+this.currentUser.data.user.role === UserRoleEnum.AGENT) {
        if (IsEnableReplyApprovalWorkFlow
          && (this.currentUser.data.user.agentWorkFlowEnabled || TicketApprovalEnable.length > 0)) {
          this._snackBar.open('Selected mentions cannot be used for bulk reply while reply approval workflow is on.', 'Ok', {
            duration: 2000,
          });
          return;
        }
      }

      // Page/account level restriction
      if (
        _ChannelGroupID !== 25 &&
        _ChannelGroupID !== 29 &&
        _ChannelGroupID !== 9 &&
        _ChannelGroupID !== 8 &&
        _ChannelGroupID !== 10 &&
        _ChannelGroupID !== 11 &&
        _ChannelGroupID !== 12 &&
        _ChannelGroupID !== 13 &&
        _ChannelGroupID !== 14 &&
        _ChannelGroupID !== 15 &&
        _ChannelGroupID !== 16 &&
        _ChannelGroupID !== 17 &&
        _ChannelGroupID !== 18 &&
        _ChannelGroupID !== 19 &&
        _ChannelGroupID !== 20 &&
        _ChannelGroupID !== 21 &&
        _ChannelGroupID !== 22 &&
        _ChannelGroupID !== 23 &&
        _ChannelGroupID !== 24 &&
        _ChannelGroupID !== 27
      ) {

        let _MaxSizeOfBulkReply = 0;
        switch (_ChannelGroupID) {
          case 1:
            _MaxSizeOfBulkReply = 6; // MaxSizeOfBulkReplyTwitter;
            break;
          case 2:
          case 3:
            _MaxSizeOfBulkReply = 10; // MaxSizeOfBulkReplyFacebook;
            break;
          default:
            _MaxSizeOfBulkReply = 10; // MaxSizeOfBulkReply;
            break;
        }

        if (CheckedMentionsOrTickets.length > 1
          && CheckedMentionsOrTickets.length <= _MaxSizeOfBulkReply) {

          const CaBulkReply = this.IsValidToBulkReply();

          if (CaBulkReply.success) {
            if (CheckedMentionsOrTickets.length > 0) {
              CaBulkReply.message = [];
              const qualifiedforapproval = [];
              let isticketagentworkflowenabled = false;
              const GoingForApproval = [];
              let TotalTickets = 0;
              const qualifiedTickets = this._ticketService.bulkMentionChecked.filter(obj =>
                obj.guid === this._navigationService.currentSelectedTab.guid);
              TotalTickets = qualifiedTickets.length;

              if (qualifiedTickets.length > 0) {
                for (const checkedticket of qualifiedTickets) {
                  isticketagentworkflowenabled = checkedticket.mention.ticketInfo.ticketAgentWorkFlowEnabled;

                  const isworkflowenabled = this._filterService.fetchedBrandData.find(
                    (brand: BrandList) => +brand.brandID === checkedticket.mention.brandInfo.brandID
                  );
                  if (+this.currentUser.data.user.role === UserRoleEnum.AGENT
                    && isworkflowenabled.isEnableReplyApprovalWorkFlow
                    && (this.currentUser.data.user.agentWorkFlowEnabled || isticketagentworkflowenabled)) {
                    qualifiedforapproval.push(this);
                    GoingForApproval.push(isticketagentworkflowenabled);
                  }
                }

                if (GoingForApproval.length > 0) {

                  // show popup
                }
                else {
                  let isTicket = false;
                  if (this.pageType === PostsType.Tickets) {
                    isTicket = true;
                  }
                  this.GetBulkReply(isTicket);
                }
              }
            }
            else {
              // ErrorModal("Something went wrong, please try again later");
              // BulkReply.HideBulkReplySection();
              this._snackBar.open('Something went wrong, please try again later', 'Ok', {
                duration: 2000,
              });
            }
          }
          else {
            if (CaBulkReply.message) {
              this._snackBar.open(CaBulkReply.message, 'Ok', {
                duration: 2000,
              });
            }
            // BulkReply.HideBulkReplySection();
          }
        }
        else {
          let message = '';
          let isTicket = false;
          if (this.pageType === PostsType.Tickets) {
            isTicket = true;
          }
          if (CheckedMentionsOrTickets.length > 1 && CheckedMentionsOrTickets.length > _MaxSizeOfBulkReply) {
            message = (isTicket) ? (`You cannot reply to more than ${_MaxSizeOfBulkReply} tickets at a time`) : (`You cannot reply to more than ${_MaxSizeOfBulkReply} mentions at a time`);
          }
          else if (CheckedMentionsOrTickets.length <= 1) {
            message = (isTicket) ? (`Minimum 2 tickets are required to perform reply action`) : (`Minimum 2 mentions are required to perform reply action`);
          }
          this._snackBar.open(message, 'Ok', {
            duration: 2000,
          });
        }
      }
      else {
        switch (_ChannelGroupID) {
          case 25:
            this._snackBar.open('Bulk reply is not supported for email channel', 'Ok', {
              duration: 2000,
            });
            break;
          case 29:
            this._snackBar.open('Bulk reply is not supported for chatbot channel', 'Ok', {
              duration: 2000,
            });
            break;
          case 19:
            this._snackBar.open('Bulk reply is not supported for News channel', 'Ok', {
              duration: 2000,
            });
            break;
          default:
            this._snackBar.open('Bulk reply is not supported for selected channel', 'Ok', {
              duration: 2000,
            });
            break;
        }

      }
    }
    else {
      this._snackBar.open('Bulk reply is not enabled for selected brands', 'Ok', {
        duration: 2000,
      });
    }
  }

  GetBulkReply(IsTicket): void {
    const settings = this.GetCategoryBrandLevelBulkReplySetting();
    if (settings.IsCategory || settings.IsBrand) {

      // _BulkReplyHtmlModalPopup = $('#BulkReplyPopup');
      // BulkReply.EmptyBulkReplySection();
      // _BulkReplyHtmlPlaceHolder = $('#BulkReplyPopup .replyclosebox .post__card #Replycloseform');
      // _BulkReplyHtmlInputLocobuzzMention = $('#BulkReplyPopup #ticketcontants');

      let CheckedMentionsOrTickets = undefined;

      if (IsTicket) {
        CheckedMentionsOrTickets = this._ticketService.bulkMentionChecked.filter(obj =>
          obj.guid === this._navigationService.currentSelectedTab.guid);
      }
      else {
        CheckedMentionsOrTickets = this._ticketService.bulkMentionChecked.filter(obj =>
          obj.guid === this._navigationService.currentSelectedTab.guid);
      }

      let _ChannelGroupID;
      let ticketagentworkflowenabled = false;
      if (CheckedMentionsOrTickets.length > 0) {
        var firstElement = CheckedMentionsOrTickets[0];
        _ChannelGroupID = CheckedMentionsOrTickets[0].mention.channelGroup;
        //var Ticketagentworkflowenabled = $(firstElement).closest('.post_card').find('.inputLocobuzzMention').attr('data-ticketagentworkflowenabled');
        //if (Ticketagentworkflowenabled == "True")
        //    ticketagentworkflowenabled = true;
        //else
        //    ticketagentworkflowenabled = false;
      }

      const TicketApprovalEnable = [];
      for (const ticket of CheckedMentionsOrTickets) {
        ticketagentworkflowenabled = ticket.mention.ticketInfo.ticketagentworkflowenabled;
        if (ticketagentworkflowenabled) {
          TicketApprovalEnable.push(ticketagentworkflowenabled);
        }
      }

      const isworkflowenabled = this._filterService.fetchedBrandData.find(
        (brand: BrandList) => +brand.brandID === CheckedMentionsOrTickets[0].mention.brandInfo.brandID
      );

      if (IsTicket === undefined && this.currentUser.data.user.role === UserRoleEnum.AGENT) {
        if (isworkflowenabled.isEnableReplyApprovalWorkFlow
          && (this.currentUser.data.user.agentWorkFlowEnabled || TicketApprovalEnable.length > 0)) {
          this._snackBar.open('Selected mentions cannot be used for bulk reply while reply approval workflow is on', 'Ok', {
            duration: 2000,
          });
          return;
        }
      }

      this.currentUser.data.user.isCanPerformActionEnable

      // Page/account level restriction
      if (
        _ChannelGroupID !== ChannelGroup.Email &&
        _ChannelGroupID !== ChannelGroup.WebsiteChatBot &&
        _ChannelGroupID !== ChannelGroup.Blogs &&
        _ChannelGroupID !== ChannelGroup.AutomotiveIndia &&
        _ChannelGroupID !== ChannelGroup.Booking &&
        _ChannelGroupID !== ChannelGroup.ComplaintWebsites &&
        _ChannelGroupID !== ChannelGroup.CustomerCare &&
        _ChannelGroupID !== ChannelGroup.DiscussionForums &&
        _ChannelGroupID !== ChannelGroup.ECommerceWebsites &&
        _ChannelGroupID !== ChannelGroup.Expedia &&
        _ChannelGroupID !== ChannelGroup.MakeMyTrip &&
        _ChannelGroupID !== ChannelGroup.MyGov &&
        _ChannelGroupID !== ChannelGroup.HolidayIQ &&
        _ChannelGroupID !== ChannelGroup.News &&
        _ChannelGroupID !== ChannelGroup.ReviewWebsites &&
        _ChannelGroupID !== ChannelGroup.TeamBHP &&
        _ChannelGroupID !== ChannelGroup.TripAdvisor &&
        _ChannelGroupID !== ChannelGroup.Videos &&
        _ChannelGroupID !== ChannelGroup.Zomato &&
        _ChannelGroupID !== ChannelGroup.ElectronicMedia
      ) {

        let _MaxSizeOfBulkReply = 0;
        switch (_ChannelGroupID) {
          case ChannelGroup.Twitter:
            _MaxSizeOfBulkReply = 6;
            break;
          case ChannelGroup.Facebook:
          case ChannelGroup.Instagram:
            _MaxSizeOfBulkReply = 10;
            break;
          default:
            _MaxSizeOfBulkReply = 10;
            break;
        }

        if (CheckedMentionsOrTickets.length > 1 && CheckedMentionsOrTickets.length <= _MaxSizeOfBulkReply) {

          const CaBulkReply = this.IsValidToBulkReply();


          if (CaBulkReply.success) {
            if (CheckedMentionsOrTickets.length > 0) {
              firstElement = CheckedMentionsOrTickets[0];
              const ChannelGroupID = firstElement.mention.channelGroup;
              if (ChannelGroupID !== undefined
                && ChannelGroupID !== null
                && ChannelGroupID !== ''
                && (ChannelGroupID === ChannelGroup.Twitter
                  || ChannelGroupID === ChannelGroup.Facebook)) {
                let ContainsDM = false;
                let DMElement;
                for (const ticketmention of CheckedMentionsOrTickets) {

                  const currentElementChannelType = ticketmention.mention.channelType;

                  if (currentElementChannelType
                    && (currentElementChannelType === ChannelType.DirectMessages
                      || currentElementChannelType === ChannelType.FBMessages)) {
                    ContainsDM = true;
                    DMElement = ticketmention;
                    return;
                  }
                }

                if (ContainsDM) {
                  if (DMElement !== undefined && DMElement != null && DMElement !== '') {
                    this._postDetailService.postObj = DMElement.mention;
                    this._postDetailService.isBulk = true;
                    this._postDetailService.pagetype = this.pageType;
                    const replyPostRef = this._bottomSheet.open(PostReplyComponent, {
                      ariaLabel: 'Reply',
                      panelClass: 'post-reply__wrapper',
                      backdropClass: 'no-blur',
                    });
                  }
                  else {
                    this._postDetailService.postObj = firstElement.mention;
                    this._postDetailService.isBulk = true;
                    this._postDetailService.pagetype = this.pageType;
                    const replyPostRef = this._bottomSheet.open(PostReplyComponent, {
                      ariaLabel: 'Reply',
                      panelClass: 'post-reply__wrapper',
                      backdropClass: 'no-blur',
                    });
                  }
                }
                else {
                  // CalculateTime(start, "Request");
                  this._postDetailService.postObj = firstElement.mention;
                  this._postDetailService.isBulk = true;
                  this._postDetailService.pagetype = this.pageType;
                  const replyPostRef = this._bottomSheet.open(PostReplyComponent, {
                    ariaLabel: 'Reply',
                    panelClass: 'post-reply__wrapper',
                    backdropClass: 'no-blur',
                  });
                }
              }
              else {
                this._postDetailService.postObj = firstElement.mention;
                this._postDetailService.isBulk = true;
                this._postDetailService.pagetype = this.pageType;
                const replyPostRef = this._bottomSheet.open(PostReplyComponent, {
                  ariaLabel: 'Reply',
                  panelClass: 'post-reply__wrapper',
                  backdropClass: 'no-blur',
                });
              }
            }
            else {
              // ErrorModal("Something went wrong, please try again later");
              this._snackBar.open('Something went wrong, please try again later', 'Ok', {
                duration: 2000,
              });
              // BulkReply.HideBulkReplySection();
            }
          }
          else {
            if (CaBulkReply.message) {
              this._snackBar.open(CaBulkReply.message, 'Ok', {
                duration: 2000,
              });
            }
            // BulkReply.HideBulkReplySection();
          }
        }
        else {
          let message = '';
          if (CheckedMentionsOrTickets.length > 1 && CheckedMentionsOrTickets.length > _MaxSizeOfBulkReply) {
            message = (IsTicket) ? (`You cannot reply to more than ${_MaxSizeOfBulkReply} tickets at a time`) : (`You cannot reply to more than ${_MaxSizeOfBulkReply} mentions at a time`);
          }
          else if (CheckedMentionsOrTickets.length <= 1) {
            message = (IsTicket) ? (`Minimum 2 tickets are required to perform reply action`) : (`Minimum 2 mentions are required to perform reply action`);
          }


          this._snackBar.open(message, 'Ok', {
            duration: 2000,
          });
        }
      }
      else {
        switch (_ChannelGroupID) {
          case ChannelGroup.Email:
            this._snackBar.open('Bulk reply is not supported for email channel', 'Ok', {
              duration: 2000,
            });
            break;
          case ChannelGroup.WebsiteChatBot:
            this._snackBar.open('Bulk reply is not supported for chat bot channel', 'Ok', {
              duration: 2000,
            });
            break;
          case ChannelGroup.News:
            this._snackBar.open('Bulk reply is not supported for News channel', 'Ok', {
              duration: 2000,
            });
            break;
          default:
            this._snackBar.open('Bulk reply is not supported for selected channel', 'Ok', {
              duration: 2000,
            });
            break;
        }

      }
    }
    else {
      this._snackBar.open('Bulk reply is not enabled for selected brands', 'Ok', {
        duration: 2000,
      });
    }
  }

  IsValidToBulkReply(): any {
    let isTicket = false;
    if (this.pageType === PostsType.Tickets) {
      isTicket = true;
    }
    const SelectedMentionsOrTickets = this._ticketService.bulkMentionChecked.filter(obj =>
      obj.guid === this._navigationService.currentSelectedTab.guid);
    const AllSeclectedMentions = this._ticketService.bulkMentionChecked.filter(obj =>
      obj.guid === this._navigationService.currentSelectedTab.guid);
    const BrandReplies = this._ticketService.bulkMentionChecked.filter(obj =>
      obj.guid === this._navigationService.currentSelectedTab.guid);


    let message = '';
    let AllSelectedMentionsOrTicketsBelongsToSameBand = false;
    let AllSelectedMentionsOrTicketsBelongsToSameChannelGroups = false;
    const SelectedMentionOrTicketsSources = new Array();
    const SelectedMentionOrTicketBrandIDs = new Array();
    const SelectedMentionOrTicketChannelGroup = new Array();
    const SelectedMentionOrTicketAlreadyInitiated = new Array();
    const SelectedMentionOrTicketBelongsToSamePage = new Array();

    const SelectedMentionOrTicketIsSentForApproval = new Array();
    const SelectedMentionOrSSRETicket = new Array();

    for (const checkedticket of SelectedMentionsOrTickets) {
      if (checkedticket.mention.isSSRE
        && checkedticket.mention.ticketInfoSsre.ssreIntent === SsreIntent.NoActionTaken
        && checkedticket.mention.ticketInfoSsre.ssreStatus === SSRELogStatus.Successful) {
        SelectedMentionOrSSRETicket.push(true);
      }
      const ObjectToSave = {
        Source: checkedticket,
        TagID: checkedticket.mention.tagID,
        TicketID: checkedticket.mention.ticketInfo.ticketID,
        ChannelGroup: checkedticket.mention.channelGroup,
        TicketStatus: checkedticket.mention.ticketInfo.status
      };

      SelectedMentionOrTicketsSources.push(ObjectToSave);
      SelectedMentionOrTicketBrandIDs.push(checkedticket.mention.brandInfo.brandID);
      SelectedMentionOrTicketChannelGroup.push(checkedticket.mention.channelGroup);

      SelectedMentionOrTicketAlreadyInitiated.push(checkedticket.mention.replyInitiated);

      switch (checkedticket.mention.channelGroup) {
        case ChannelGroup.Facebook:
          SelectedMentionOrTicketBelongsToSamePage.push(checkedticket.mention.fbPageID);
          break;
        case ChannelGroup.GooglePlayStore:
          SelectedMentionOrTicketBelongsToSamePage.push(checkedticket.mention.appID);
          break;
        case ChannelGroup.Instagram:
          SelectedMentionOrTicketBelongsToSamePage.push(checkedticket.mention.pageID);
          break;
        case ChannelGroup.Youtube:
          SelectedMentionOrTicketBelongsToSamePage.push(checkedticket.mention.inReplyToStatusId);
          break;
        case ChannelGroup.LinkedIn:
          SelectedMentionOrTicketBelongsToSamePage.push(checkedticket.mention.inReplyToStatusId);
          break;

      }
    }

    if (SelectedMentionOrSSRETicket.length > 0) {
      message = 'Please select tickets which are not in SSRE';
      return { success: false, message };
    }
    if (SelectedMentionOrTicketAlreadyInitiated.length > 0) {
      const NewArrayOfInitiation = SelectedMentionOrTicketAlreadyInitiated.map(s => s).filter(this.onlyUnique);
      if (NewArrayOfInitiation.indexOf(true) !== -1) {

        message = 'Previous request pending for this ticket';

        return { success: false, message };
      }
    }

    if (SelectedMentionOrTicketBrandIDs.length > 0
      && SelectedMentionOrTicketBrandIDs.map(s => s).filter(this.onlyUnique).length === 1) {
      AllSelectedMentionsOrTicketsBelongsToSameBand = true;

      const Settings = this.GetCategoryBrandLevelBulkReplySetting();

      if (Settings.IsCategory) {
        // Go ahed
      }
      else if (Settings.IsBrand) {
        if (Settings.BrandArray.indexOf(SelectedMentionOrTicketBrandIDs[0].toString()) !== -1) {
          // Go ahed
        }
        else {
          return {
            success: false, message: 'Bulk reply is not enabled for selected brand'
          };
        }
      }
      else {
        return {
          success: false, message: 'Bulk reply is not enabled for selected brand'
        };
      }
    }

    if (SelectedMentionOrTicketChannelGroup.length > 0
      && SelectedMentionOrTicketChannelGroup.map(s => s).filter(this.onlyUnique).length === 1) {
      AllSelectedMentionsOrTicketsBelongsToSameChannelGroups = true;
    }

    if (SelectedMentionsOrTickets.length > 0) {

      if (!AllSelectedMentionsOrTicketsBelongsToSameBand && !AllSelectedMentionsOrTicketsBelongsToSameChannelGroups) {

        message = 'Please select mentions from same brand and same channel to reply';

        return { success: false, message };
      }

      if (AllSelectedMentionsOrTicketsBelongsToSameBand && !AllSelectedMentionsOrTicketsBelongsToSameChannelGroups) {

        message = 'Please select mentions from same channel to reply';

        return { success: false, message };
      }

      if (SelectedMentionOrTicketBelongsToSamePage.length > 0 && AllSelectedMentionsOrTicketsBelongsToSameChannelGroups) {

        const DistinctPageID = SelectedMentionOrTicketBelongsToSamePage.map(s => s !== undefined && s !== null).filter(this.onlyUnique);
        switch (SelectedMentionOrTicketChannelGroup.map(s => s).filter(this.onlyUnique)[0]) {
          case ChannelGroup.Twitter:
            break;
          case ChannelGroup.Facebook:
            if (DistinctPageID.length > 1) {

              message = 'Please select mentions from same page to reply';

              return { success: false, message };
            }
            break;
          case ChannelGroup.GooglePlayStore:
            if (DistinctPageID.length > 1) {

              message = 'Please select mentions from same app to reply';

              return { success: false, message };
            }
            break;
          case ChannelGroup.Instagram:

            if (DistinctPageID.length > 1) {

              message = 'Please select mentions from same account to reply';

              return { success: false, message };
            }
            break;
          case ChannelGroup.Youtube:
            if (DistinctPageID.length > 1) {

              message = ('Please select mentions from same channel to reply');

              return { success: false, message };
            }
            break;
          case ChannelGroup.LinkedIn:

            if (DistinctPageID.length > 1) {

              message = ('Please select mentions from same page to reply');

              return { success: false, message };
            }
            break;
          default:

            break;
        }
      }


      if (!AllSelectedMentionsOrTicketsBelongsToSameBand && AllSelectedMentionsOrTicketsBelongsToSameChannelGroups) {

        message = ('Please select mentions from same brand to reply');

        return { success: false, message };
      }
      else if (AllSelectedMentionsOrTicketsBelongsToSameBand && AllSelectedMentionsOrTicketsBelongsToSameChannelGroups) {
        if (SelectedMentionOrTicketsSources.length > 0) {
          const SelectedMentionsOrTicketStatus = new Array();
          for (const checkedticket of SelectedMentionOrTicketsSources) {
            const _ticketStatus = checkedticket.TicketStatus;
            if (_ticketStatus !== undefined && _ticketStatus != null && _ticketStatus !== '') {
              SelectedMentionsOrTicketStatus.push(_ticketStatus);
            } else {
              SelectedMentionsOrTicketStatus.push(0);
            }
          }

          if (SelectedMentionsOrTicketStatus.length > 0) {

            const DistincetTicketStatus = SelectedMentionsOrTicketStatus.map(s => s).filter(this.onlyUnique);
            if (DistincetTicketStatus.length > 1) {

              message = ('You can send bulk replies to mentions of same ticket');

              return {
                success: false, message
              };
            }
            else {
              if (DistincetTicketStatus.length === 1 &&
                (
                  DistincetTicketStatus[0] === 3 ||
                  DistincetTicketStatus[0] === 1 ||
                  DistincetTicketStatus[0] === 6 ||
                  DistincetTicketStatus[0] === 8 ||
                  DistincetTicketStatus[0] === 11
                ) &&
                (this.currentUser.data.user.role === UserRoleEnum.AGENT
                  || this.currentUser.data.user.role === UserRoleEnum.SupervisorAgent)
              ) {

                switch (DistincetTicketStatus[0]) {
                  case TicketStatus.PendingwithCSD:
                    message = (isTicket) ? ('Cannot select tickets that are pending with CSD')
                      : ('Cannot select mentions from a ticket which is pending with CSD');
                    break;
                  case 3:
                    message = (isTicket) ? ('Cannot select tickets that are already closed')
                      : ('Cannot select mentions from a ticket which is already closed');
                    break;
                  case 6:
                    message = (isTicket) ? ('Cannot select tickets that are on hold with CSD')
                      : ('Cannot select mentions from a ticket which is on hold with CSD');
                    break;
                  case 8:
                    message = (isTicket) ? ('Cannot select tickets that are on pending with brand')
                      : ('Cannot select mentions from a ticket which is on pending with brand');
                    break;
                  case 11:
                    message = (isTicket) ? ('Cannot select tickets that are on hold with brand')
                      : ('Cannot select mentions from a ticket which is on hold with brand');
                    break;
                  default:
                    message = (isTicket) ? ('Cannot select tickets with this status')
                      : ('Cannot select mentions with this status');
                    break;
                }

                return {
                  success: false, message
                };
              }
              else {
                if (!isTicket) {
                  if (BrandReplies.length > 0
                    && AllSeclectedMentions.length === (BrandReplies.length + SelectedMentionsOrTickets.length)) {
                    for (const checkedticket of BrandReplies) {
                      const SourceElement = checkedticket;
                      // if (SourceElement.is(":checked")) {
                      //   SourceElement.click();
                      // }
                    }
                  }
                }

                return {
                  success: true, message: SelectedMentionOrTicketsSources
                };
              }
            }
          }
          else {
            return; // BulkReply.GenericErrorModal(IsTicket);
          }
        }
        else {
          return; // BulkReply.GenericErrorModal(IsTicket);
        }
      }
      else {
        return; // BulkReply.GenericErrorModal(IsTicket);
      }
    }
    else {
      return {
        success: false, message
      };
    }
  }

  GetCategoryBrandLevelBulkReplySetting(): any {
    const checkedticket = this._ticketService.bulkMentionChecked.filter(obj =>
      obj.guid === this._navigationService.currentSelectedTab.guid);
    const isworkflowenabled = this._filterService.fetchedBrandData.find(
      (brand: BrandList) => +brand.brandID === checkedticket[0].mention.brandInfo.brandID
    );

    const bulkreplyenabledbrandlist = this._filterService.fetchedBrandData.filter(obj =>
      obj.isBrandBulkReply === true);

    const bulkbrandlist = bulkreplyenabledbrandlist.map(obj => obj.brandID).filter(this.onlyUnique);

    const IsCategoryBulkReplyEnabledStr = isworkflowenabled.isCategoryBulkReply;
    const IsBrandBulkReplyEnabledStr = isworkflowenabled.isBrandBulkReply;
    const BulkReplyEnabledBrandIdJsonStr = '';
    if (IsCategoryBulkReplyEnabledStr) {
      return { IsCategory: true, IsBrand: false, BrandArray: [] };
    }
    else if (IsBrandBulkReplyEnabledStr) {
      // if (BulkReplyEnabledBrandIdJsonStr) {

      //const ParsedJson = JSON.parse(BulkReplyEnabledBrandIdJsonStr);

      if (bulkreplyenabledbrandlist.length > 0) {
        return { IsCategory: false, IsBrand: true, BrandArray: bulkbrandlist };
      }
      else {
        return { IsCategory: false, IsBrand: false, BrandArray: [] };
      }
      //}
      // else {
      //   return { IsCategory: false, IsBrand: false, BrandArray: [] };
      // }
    }
    else {
      return { IsCategory: false, IsBrand: false, BrandArray: [] };
    }
  }

  ShowUserPopupForAssignTickets(): void {

    const chkTicket = this._ticketService.bulkMentionChecked.filter(obj =>
      obj.guid === this._navigationService.currentSelectedTab.guid);

    const BulkAssignBrandIDs = [];
    const WorkFlowIDs = [];

    for (const checkedticket of chkTicket) {
      if (BulkAssignBrandIDs.length === 0) {
        BulkAssignBrandIDs.push(checkedticket.mention.brandInfo.brandID);
        WorkFlowIDs.push(checkedticket.mention.makerCheckerMetadata.workflowStatus);
      }
      else {
        const brandid = checkedticket.mention.brandInfo.brandID;
        const workflowstatuss = checkedticket.mention.makerCheckerMetadata.workflowStatus;
        if (BulkAssignBrandIDs.indexOf(brandid) > -1) {
          BulkAssignBrandIDs.push(brandid);
        }
        else {
          this._snackBar.open('You cannot select tickets from multiple brands while assigning', 'Ok', {
            duration: 2000,
          });
          return;
          break;
        }


        WorkFlowIDs.push(workflowstatuss);
      }
    }

    const replyforapprovallength = chkTicket.filter(s =>
      s.mention.makerCheckerMetadata.workflowStatus === LogStatus.ReplySentForApproval);
    if (WorkFlowIDs.length === replyforapprovallength.length) {
      // workflowstatus = 58;
    }
    else if (replyforapprovallength.length > 0 && WorkFlowIDs.length !== replyforapprovallength.length) {
      this._snackBar.open('The selected ticket cannot be reassigned in bulk with others as it is awaiting approval.', 'Ok', {
        duration: 2000,
      });
      return;
    }

    this._postDetailService.postObj = chkTicket[0].mention;
    this._postDetailService.isBulk = true;
    this._postDetailService.pagetype = this.pageType;
    this.dialog.open(PostAssigntoComponent, {
      autoFocus: false,
      width: '650px',
    });
  }

  bulkonHold(note?: string): void {
    let isTicket = false;
    if (this.pageType === PostsType.Tickets) {
      isTicket = true;
    }
    const logs = [];
    const log = new TicketsCommunicationLog(ClientStatusEnum.OnHold);
    if (note.trim()) {
      log.Note = note ? note : '';
    }
    logs.push(log);

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
      PerformedAction: PerformedAction.OnHoldAgent,
      IsTicket: isTicket,
      IsReplyModified: false,
      ActionTaken: 0,
      Tasks: logs,
      BulkReplyRequests: BulkObject
    };

    this._replyService.BulkActionAPI(sourceobj, PerformedAction.OnHoldAgent);
  }

  bulkReopen(note?: string): void {
    let isTicket = false;
    if (this.pageType === PostsType.Tickets) {
      isTicket = true;
    }
    const logs = [];
    const log = new TicketsCommunicationLog(ClientStatusEnum.ReopenACase);
    if (note.trim()) {
      log.Note = note ? note : '';
    }
    logs.push(log);

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
      PerformedAction: PerformedAction.ReopenCase,
      IsTicket: isTicket,
      IsReplyModified: false,
      ActionTaken: 0,
      Tasks: logs,
      BulkReplyRequests: BulkObject
    };

    this._replyService.BulkActionAPI(sourceobj, PerformedAction.ReopenCase);
  }

  bulkReplyApproved(): void {
    const CaBulkReply = this.IsValidToBulkApprove();
    if (CaBulkReply.success) {
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
          ChannelGroup: checkedticket.mention.channelGroup
        };

        BulkObject.push(properties);
      }


      const sourceobj = {
        SourceArray: BulkObject,
        ActionTaken: 0,
        CurrentTicketStatus: 3
      };

      this._replyService.BulkReplyApproved(sourceobj).subscribe((data) => {
        const message = 'Bulk Reply Approved successfull';
        this._ticketService.selectedPostList = [];
        this._ticketService.postSelectTrigger.next(0);
        this._ticketService.bulkMentionChecked = [];
        console.log(message, data);
        this._filterService.currentBrandSource.next(true);
        // this.dialogRef.close(true);
        this._snackBar.open(message, 'Ok', {
          duration: 2000,
        });
        this.bulkAction('dismiss');
        // this.zone.run(() => {
      });

    }
    else {

      if (CaBulkReply.message) {
        this._snackBar.open(CaBulkReply.message, 'Ok', {
          duration: 2000,
        });
      }
    }
  }

  bulkreplyRejected(note?: string): void {
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
        ChannelType: checkedticket.mention.channelType
      };

      BulkObject.push(properties);
    }


    const sourceobj = {
      SourceArray: BulkObject,
      RejectionNote: note ? note : ''
    };

    this._replyService.BulkReplyRejection(sourceobj).subscribe((data) => {
      const message = 'Bulk Reply Approved successfull';
      this._ticketService.selectedPostList = [];
      this._ticketService.postSelectTrigger.next(0);
      this._ticketService.bulkMentionChecked = [];
      console.log(message, data);
      this._filterService.currentBrandSource.next(true);
      // this.dialogRef.close(true);
      this._snackBar.open(message, 'Ok', {
        duration: 2000,
      });
      this.bulkAction('dismiss');
      // this.zone.run(() => {
    });
  }

  IsValidToBulkApprove(): any {
    let isTicket = false;
    if (this.pageType === PostsType.Tickets) {
      isTicket = true;
    }
    const SelectedMentionsOrTickets = this._ticketService.bulkMentionChecked.filter(obj =>
      obj.guid === this._navigationService.currentSelectedTab.guid);
    const AllSeclectedMentions = this._ticketService.bulkMentionChecked.filter(obj =>
      obj.guid === this._navigationService.currentSelectedTab.guid);
    const BrandReplies = this._ticketService.bulkMentionChecked.filter(obj =>
      obj.guid === this._navigationService.currentSelectedTab.guid);


    let message = '';
    const SelectedMentionOrTicketsSources = new Array();
    const SelectedMentionOrTicketBrandIDs = new Array();
    const SelectedMentionOrTicketChannelGroup = new Array();
    const SelectedMentionOrTicketAlreadyInitiated = new Array();
    const SelectedMentionOrTicketBelongsToSamePage = new Array();

    const SelectedMentionOrTicketIsSentForApproval = new Array();
    const SelectedMentionOrSSRETicket = new Array();


    for (const checkedticket of SelectedMentionsOrTickets) {
      const currentElement = checkedticket;
      const ObjectToSave = {
        Source: checkedticket,
        TagID: checkedticket.mention.tagID,
        TicketID: checkedticket.mention.ticketInfo.ticketID,
        ChannelGroup: checkedticket.mention.channelGroup,
        TicketStatus: checkedticket.mention.ticketInfo.status
      };

      SelectedMentionOrTicketsSources.push(ObjectToSave);
      SelectedMentionOrTicketBrandIDs.push(checkedticket.mention.brandInfo.brandID);
      SelectedMentionOrTicketChannelGroup.push(checkedticket.mention.channelGroup);

      let BulkRequestInitiated = checkedticket.mention.replyInitiated;
      if (BulkRequestInitiated) {
        BulkRequestInitiated = true;
      }
      else {
        BulkRequestInitiated = false;
      }

      SelectedMentionOrTicketAlreadyInitiated.push(BulkRequestInitiated);


    }


    if (SelectedMentionsOrTickets.length > 0) {
      return {
        success: true, SelectedMentionOrTicketsSources
      };
    }
    else {
      return {
        success: false, message
      };
    }
  }

  GetBulkTagggingCategoryFromOutSide(): void {

    let IsTwitter = false;

    const TwitterChannelTypes = [ChannelType.PublicTweets, ChannelType.Twitterbrandmention, ChannelType.BrandTweets]

    const chkTicket = this._ticketService.bulkMentionChecked.filter(obj =>
      obj.guid === this._navigationService.currentSelectedTab.guid);


    for (const checkedticket of chkTicket) {
      const channelId = checkedticket.mention.channelType;
      if (TwitterChannelTypes.indexOf(channelId) > -1) {
        IsTwitter = true;
      }
    }

    if (IsTwitter) {
      // $("#tagAlltagcategory").show();
    }
    else {
      // $("#tagAlltagcategory").hide();
    }


    // InitializeTagControl();
    // $('#ulControl input:radio').click(function () {
    //   $(this).attr('checked', 'checked');
    // });
    // //Show hide
    // $('.categorycb input').each(function () {
    //   if (this.checked) {
    //     $(this).removeAttr('checked');
    //   };
    // });
    // $('.Departmentcb input').each(function () {
    //   if (this.checked) {
    //     $(this).removeAttr('checked');
    //   };
    // });
    // $('.SubCategorycb input').each(function () {
    //   if (this.checked) {
    //     $(this).removeAttr('checked');
    //   };
    // });
    // $('.spCategoryRDs input').each(function () {
    //   if (this.checked) {
    //     $(this).removeAttr('checked');
    //   };
    // });
    // $('.spDepartmentRDs input').each(function () {
    //   if (this.checked) {
    //     $(this).removeAttr('checked');
    //   };
    // });
    // $('.spSubCategoryRDs input').each(function () {
    //   if (this.checked) {
    //     $(this).removeAttr('checked');
    //   };
    // });

    // $(".ulDepartments").hide();
    // $(".ulSubcategory").hide();
    // $(".spCategoryRDs").hide();
    const tagIds = [];
    let CatBrandID;
    let CategoryGroupIDs = [];
    let IsCategoryGroupSame = false;
    const brandList = this._filterService.fetchedBrandData;

    if (brandList.map(s => s.categoryGroupID).filter(this.onlyUnique).length === 1) {
      IsCategoryGroupSame = true;
    }
    else {
      IsCategoryGroupSame = false;
    }



    for (const checkedticket of chkTicket) {
      //tagIds.push(item.value);


      CatBrandID = checkedticket.mention.brandInfo.brandID;
      const isworkflowenabled = this._filterService.fetchedBrandData.find(
        (brand: BrandList) => +brand.brandID === checkedticket.mention.brandInfo.brandID
      );
      CategoryGroupIDs.push(isworkflowenabled.categoryGroupID);

    }

    CategoryGroupIDs = CategoryGroupIDs.map(s => s).filter(this.onlyUnique);
    if (CategoryGroupIDs.length != 1) {
      this._snackBar.open('Please select mentions with same category map for tagging.', 'Ok', {
        duration: 2000,
      });
      return;
    }
    else if (!IsCategoryGroupSame) {
      // GetTaggingCategoryHtml(CatBrandID, CategoryGroupIDs[0], function () {
      //   $("#popup_taggingcategory").modal();
      //   InitializeTagControl();
      //   $("#popup_taggingcategory #btnsavetagcategory").attr("onclick", "TaggingCategory.SaveBulkTaggingCategory('" + JSON.stringify(tagIds) + "', BrandTickets.BulkTaggingCategoryCallback, 'false')");
      // }, IsTwitter);
      this.openbulkCategoryDialog('ticketCategory');
    }
    else {
      this.openbulkCategoryDialog('ticketCategory');
      // $("#popup_taggingcategory").modal();
      // $("#popup_taggingcategory #btnsavetagcategory").attr("onclick", "TaggingCategory.SaveBulkTaggingCategory('" + JSON.stringify(tagIds) + "' ,BrandTickets.BulkTaggingCategoryCallback, 'false')");
    }
  }

  openbulkCategoryDialog(event): void {
    const chkTicket = this._ticketService.bulkMentionChecked.filter(obj =>
      obj.guid === this._navigationService.currentSelectedTab.guid);
    chkTicket[0].mention.categoryMapText = null;
    this._postDetailService.postObj = chkTicket[0].mention;
    this._postDetailService.categoryType = event;
    this._postDetailService.isBulk = true;
    this._postDetailService.pagetype = this.pageType;
    this.dialog.open(CategoryFilterComponent, {
      width: '73vw',
      disableClose: false,
    });
  }

  bulkpostselect(checked): void {
    this.bulkActionEvent.emit('selectAll');
  }

}
