import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChannelGroup } from 'app/core/enums/ChannelGroup';
import { ChannelImage } from 'app/core/enums/ChannelImgEnum';
import { TicketSignalEnum } from 'app/core/enums/TicketSignalEnum';
import { UserRoleEnum } from 'app/core/enums/userRoleEnum';
import { AuthUser } from 'app/core/interfaces/User';
import { PostSignalR, Tab, TabSignalR } from 'app/core/models/menu/Menu';
import { ChatBotSignalR } from 'app/core/models/viewmodel/ChatWindowDetails';
import { GenericFilter } from 'app/core/models/viewmodel/GenericFilter';
import {
  SignalMessage,
  SignalRMessage,
} from 'app/core/models/viewmodel/SignalMessage';
import {
  AlertDialogModel,
  AlertPopupComponent,
} from 'app/shared/components/alert-popup/alert-popup.component';
import { FilterFilledData } from 'app/shared/components/filter/filter-models/filterFilledData.model';
import { FilterService } from 'app/social-inbox/services/filter.service';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AccountService } from '../account.service';
import { CommonService } from '../common.service';
import { NavigationService } from '../navigation.service';

@Injectable({
  providedIn: 'root',
})
export class TicketsignalrService {
  public ticketSignalCall = new BehaviorSubject<TabSignalR>(null);
  public chatbotSignalCall = new BehaviorSubject<ChatBotSignalR>(null);
  public removeTicketCall = new BehaviorSubject<number>(null);
  public mentionSignalCall = new BehaviorSubject<number>(null);
  public openTicketDetailSignalCall = new BehaviorSubject<PostSignalR>(null);
  public postSignalCall = new BehaviorSubject<PostSignalR>(null);
  constructor(
    private accountService: AccountService,
    private _navigationService: NavigationService,
    private _filterService: FilterService,
    private _commonService: CommonService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.currentUser = user;
      this.currentUserRole = +this.currentUser.data.user.role;
    });

    this.fetchedTabList = _navigationService.fetchedTabList;
  }

  TicketSignalRObj: any[] = [];
  currentUser: AuthUser;
  fetchedTabList: Tab[] = [];
  currentUserRole: number;
  void;
  QualifiedSignalRObj: any[] = [];

  processSignal(signalrObj: SignalMessage): void {
    switch (Number(signalrObj.signalId)) {
      case TicketSignalEnum.FetchNewData:
        this.fetchNewData(signalrObj);
        break;
      case TicketSignalEnum.CloseTicket:
        this.closeTicket(signalrObj);
        break;
      case TicketSignalEnum.TicketEscalatedToCC:
        this.ticketEscalatedToCC(signalrObj);
        break;
      case TicketSignalEnum.TicketEscalatedToBrand:
        this.ticketEscalatedToBrand(signalrObj);
        break;
      case TicketSignalEnum.ReOpenTicket:
        this.reOpenTicket(signalrObj);
        break;
      case TicketSignalEnum.TicketIgnoredByCC:
        this.ticketIgnoredByCC(signalrObj);
        break;
      case TicketSignalEnum.TicketIgnoredByBrand:
        this.ticketIgnoredByBrand(signalrObj);
        break;
      case TicketSignalEnum.TicketApprovedByCCOrBrand:
        this.ticketApprovedByCCOrBrand(signalrObj);
        break;
      case TicketSignalEnum.TicketReassigned:
        this.ticketReassigned(signalrObj);
        break;
      case TicketSignalEnum.ReplySentForApproval:
        this.replySentForApproval(signalrObj);
        break;
      case TicketSignalEnum.ReplyApproved:
        this.replyApproved(signalrObj);
        break;
      case TicketSignalEnum.ReplyRejected:
        this.replyRejected(signalrObj);
        break;
      case TicketSignalEnum.EnableMakerChecker:
        this.enableMakerChecker(signalrObj);
        break;
      case TicketSignalEnum.DisableMakerChecker:
        this.disableMakerChecker(signalrObj);
        break;
      case TicketSignalEnum.ReplyFailed:
        this.replyFailed(signalrObj);
        break;
      case TicketSignalEnum.ReplyThreadComplete:
        // this.replyRejected(signalrObj);
        break;
      case TicketSignalEnum.TicketTaggingCategoryChangeSignalR:
        // this.enableMakerChecker(signalrObj);
        break;
      case TicketSignalEnum.TicketMentionTaggingResponseMessageSignalR:
        this.ShowTicketMentionTaggingResponseMessageSignalR(signalrObj);
        break;
      case TicketSignalEnum.SSREInProcess:
        this.SSREInProcess(signalrObj);
        break;
      case TicketSignalEnum.SSREProcessCompleted:
        this.SSREProcessCompleted(signalrObj);
        break;
      case TicketSignalEnum.SSREProcessFailed:
        this.SSREProcessFailed(signalrObj);
        break;
      case TicketSignalEnum.SSREReplyVerifiedOrRejected:
        this.SSREReplyVerifiedOrRejected(signalrObj);
        break;
      case TicketSignalEnum.NewCaseAttach:
        this.NewCaseAttach(signalrObj);
        break;
      case TicketSignalEnum.CaseDetachFrom:
        this.CaseDetachFrom(signalrObj);
        break;
      case TicketSignalEnum.TicketNoteAdd:
        this.TicketNoteAdd(signalrObj); // Notification Note add
        break;
      case TicketSignalEnum.LockUnlockTicketSignalR:
        this.LockUnlockTicketSignalR(signalrObj);
        break;
      case TicketSignalEnum.LogOutMultipleUser:
        this.LogOutMultipleUser(signalrObj);
        break;
      case TicketSignalEnum.ClearAllSession:
        this.ClearAllSession(signalrObj);
        break;
      case TicketSignalEnum.TicketMarkedAsRead:
        this.TicketMarkedAsRead(signalrObj);
        break;
      case TicketSignalEnum.LogOutOnTeamUserRemove:
        this.LogOutOnTeamUserRemove(signalrObj);
        break;
      case TicketSignalEnum.MakeActionableSingnal:
        this.MakeActionableSingnal(signalrObj);
        break;
      case TicketSignalEnum.WhatsAppStatusUpdate:
        this.WhatsAppStatusUpdate(signalrObj);
        break;
      case TicketSignalEnum.UserRecievedFromWhatsapp:
        this.UserRecievedFromWhatsapp(signalrObj);
        break;
      case TicketSignalEnum.CloseWebsiteBotTicket:
        this.CloseWebsiteBotTicket(signalrObj);
        break;
      case TicketSignalEnum.UnreadMessageSignalR:
        this.UnreadMessageSignalR(signalrObj);
        break;
      case TicketSignalEnum.AgentReminderWebsiteSignalR:
        this.AgentReminderWebsiteSignalR(signalrObj);
        break;
      case TicketSignalEnum.RefreshActionButtonEnableJson:
        this.RefreshActionButtonEnableJson(signalrObj);
        break;
      case TicketSignalEnum.UpdateBulkReplyCountSignalR:
        this.UpdateBulkReplyCountSignalR(signalrObj);
        break;
      case TicketSignalEnum.BulkReopenOnHoldEscalateResponseMessageSignalR:
        this.BulkReopenOnHoldEscalateResponseMessageSignalR(signalrObj);
        break;
      case TicketSignalEnum.RefreshAgentTicketReassignement:
        this.RefreshAgentTicketReassignement(signalrObj);
        break;
      case TicketSignalEnum.TeamLeaderAssignment:
        this.TeamLeaderAssignment(signalrObj);
        break;
      case TicketSignalEnum.RefreshRAWSettingSignalR:
        this.RefreshRAWSettingSignalR(signalrObj);
        break;
      case TicketSignalEnum.UpdateNPSAndSnetimentScoreOfAuthor:
        this.UpdateNPSAndSnetimentScoreOfAuthor(signalrObj);
        break;
      case TicketSignalEnum.RefreshEditRuleTicketRAWSettings:
        this.RefreshEditRuleTicketRAWSettings(signalrObj);
        break;
      case TicketSignalEnum.RefreshDeleteRuleTicketRAWSettings:
        this.RefreshDeleteRuleTicketRAWSettings(signalrObj);
        break;
    }
  }

  ChecksignalrQualifies(data: any): boolean {
    // if (typeof data.Data !== undefined) {
    //   data = data.Data;
    // }

    const brand = this._filterService.fetchedBrandData.find((brandObject) => {
      return +brandObject.brandID === +data.BrandID;
    });

    // let brand = Enumerable.From(genericDropDownList.Brands).Where(x => x.BrandID == data.BrandID.toString()).FirstOrDefault();

    let check = false;

    const brandinfo = this._filterService.getGenericFilter().brands;

    const selectedbrand = brandinfo.findIndex((brandObject) => {
      return brandObject.brandName === brand.brandName;
    });

    if (selectedbrand > -1) {
      if (
        this.currentUserRole === UserRoleEnum.TeamLead ||
        this.currentUserRole === UserRoleEnum.SupervisorAgent ||
        (brand && !brand.autoQueuingEnabled)
      ) {
        check = true;
      } else if (brand.autoQueuingEnabled) {
        if (
          +this.currentUser.data.user.userId ===
          Number(data.AssignedToAgencyUser)
        ) {
          check = true;
        }
      }
    }

    return check;
  }

  CheckCustomFilter(tab: Tab, Data, isTicket: boolean): boolean {
    if (Data.Data) {
      Data = Data.Data;
    }
    const genericFilter: GenericFilter = JSON.parse(tab.filterJson);
    let ToShowNotification = true;
    if (isTicket) {
      if (
        !this.CheckForTicketStatusValid(
          genericFilter.ticketType[0],
          Data.CaseStatus
        )
      ) {
        return false;
      }
    }
    const rcdDate = Number(
      Data.RecordDate.replace('/Date(', '').replace(')/', '')
    );
    const sdateEpoch = genericFilter.startDateEpoch * 1000;
    const edateEpoch = genericFilter.endDateEpoch * 1000;

    if (rcdDate >= sdateEpoch && rcdDate <= edateEpoch) {
      ToShowNotification = true;
    } else {
      return false;
    }
    // check this CheckAnyFilterIsApplied if it is mandatory
    if (!isTicket || this.CheckAnyFilterIsApplied(genericFilter)) {
      const category = JSON.parse(Data.CategoryJson);
      const cat = [];
      const subcat = [];
      const subsubcat = [];
      const sentiment = [];
      // tslint:disable: prefer-for-of
      if (typeof category !== 'undefined' && category.length > 0) {
        for (let i = 0; i < category.length; i++) {
          const depatments = category[i].depatments;
          if (typeof depatments !== 'undefined' && depatments.length > 0) {
            for (let j = 0; j < depatments.length; j++) {
              const subCategories = depatments[j].subCategories;

              if (
                typeof subCategories !== 'undefined' &&
                subCategories.length > 0
              ) {
                for (let k = 0; k < subCategories.length; k++) {
                  if (subCategories[k].subCategorySentiment != null) {
                    sentiment.push(subCategories[k].subCategorySentiment);
                  }
                  subsubcat.push(subCategories[k].subsubCategoryID);
                }
              }

              if (depatments[j].departmentSentiment != null) {
                sentiment.push(depatments[j].subCategorySentiment);
              }
              subcat.push(depatments[j].DepartmentID);
            }
          }

          if (category[i].sentiment != null) {
            sentiment.push(category[i].sentiment);
          }
          cat.push(category[i].CategoryID);
        }
      }
      // const filterFromObject: FilterFilledData = this._filterService.reverseApply(genericFilter);

      if (isTicket) {
        for (const filterObj of genericFilter.filters) {
          if (filterObj.name === 'MAIN.ChannelType') {
            if (filterObj.value.length > 0) {
              const channelgroupIndex = filterObj.value.includes(
                Data.ChannelGroupId
              );
              const channeltypeindex = filterObj.value.includes(Data.Channel);
              if (channelgroupIndex || channeltypeindex) {
                ToShowNotification = true;
              }
            }
            if (!ToShowNotification) {
              return ToShowNotification;
            }
          }
          if (genericFilter.ticketType) {
            ToShowNotification = genericFilter.ticketType.includes(
              +Data.CaseStatus
            );
            if (!ToShowNotification) {
              return ToShowNotification;
            }
          }
          if (filterObj.name === 'CD.Priority') {
            if (filterObj.value.length > 0) {
              ToShowNotification = filterObj.value.includes(Data.TagPriority);
            }
            if (!ToShowNotification) {
              return ToShowNotification;
            }
          }
        }
      } else {
        let isbrandactivity = false;
        let isuseractivity = false;
        let isaction = false;
        let nonaction = false;
        for (const filterObj of genericFilter.filters) {
          if (filterObj.name === 'MAIN.ChannelType') {
            if (filterObj.value.length > 0) {
              const channelgroupIndex = filterObj.value.includes(
                Data.ChannelGroupId
              );
              const channeltypeindex = filterObj.value.includes(Data.Channel);
              if (channelgroupIndex || channeltypeindex) {
                ToShowNotification = true;
              }
            }
            if (!ToShowNotification) {
              return ToShowNotification;
            }
          }

          if (filterObj.name === 'isbrandactivity') {
            isbrandactivity = filterObj.value.includes(1);
            isuseractivity = filterObj.value.includes(2);
            if (isbrandactivity) {
              ToShowNotification = Data.IsBrandPost;
            }
            if (!ToShowNotification) {
              return ToShowNotification;
            }
          }
          if (filterObj.name === 'isactionable' && isuseractivity) {
            isaction = filterObj.value.includes(1);
            nonaction = filterObj.value.includes(0);
            if (isaction) {
              ToShowNotification = Data.CaseID > 0;
            }
            if (nonaction) {
              ToShowNotification = Data.CaseID === 0;
            }
            if (ToShowNotification) {
              ToShowNotification = !Data.IsBrandPost;
            }
            if (!ToShowNotification) {
              return ToShowNotification;
            }

            if (isaction && Data.CaseID === 0) {
              ToShowNotification = false;
            }
            if (!ToShowNotification) {
              return ToShowNotification;
            }
            if (nonaction && Data.CaseID > 0) {
              ToShowNotification = false;
            }
            if (!ToShowNotification) {
              return ToShowNotification;
            }
          }
          if (filterObj.name === 'Main.SentimentType') {
            if (filterObj.value && filterObj.value.length > 0) {
              ToShowNotification = filterObj.value.some((x) =>
                sentiment.includes(x)
              );
              if (!ToShowNotification) {
                return ToShowNotification;
              }
            }
          }
          if (filterObj.name === 'Main.Lang') {
            if (filterObj.value && filterObj.value.length > 0) {
              ToShowNotification = filterObj.value.includes(Data.Language);
              if (!ToShowNotification) {
                return ToShowNotification;
              }
            }
          }
        }
      }
      if (genericFilter.simpleSearch && genericFilter.simpleSearch !== '') {
        ToShowNotification = Data.Description.includes(
          genericFilter.simpleSearch
        );
        if (isTicket) {
          ToShowNotification =
            genericFilter.simpleSearch === Data.CaseID.toString();
        } else {
          ToShowNotification =
            genericFilter.simpleSearch === Data.NewMention.toString();
        }
        ToShowNotification = Data.Author.includes(genericFilter.simpleSearch);
        ToShowNotification =
          genericFilter.simpleSearch === Data.PostURL.toString();
      }
      if (!ToShowNotification) {
        return ToShowNotification;
      }

      // cateogories

      const categories = genericFilter.filters.map((obj) => {
        if (obj.name === 'TCL.LabelID') {
          return obj;
        }
      });
      if (categories && categories.length > 0) {
        ToShowNotification = categories[0].value.some((x) =>
          cat.includes(x.toString())
        );
      }

      if (!ToShowNotification) {
        return ToShowNotification;
      }

      // SubCateogories
      const subcategories = genericFilter.filters.map((obj) => {
        if (obj.name === 'TCD.DepartmentID') {
          return obj;
        }
      });
      if (subcategories && subcategories.length > 0) {
        ToShowNotification = subcategories[0].value.some((x) =>
          subcat.includes(x.toString())
        );
      }

      if (!ToShowNotification) {
        return ToShowNotification;
      }

      // SubSubCateogories

      const subSubCategories = genericFilter.filters.map((obj) => {
        if (obj.name === 'TCS.SubCategoryID') {
          return obj;
        }
      });
      if (subSubCategories && subSubCategories.length > 0) {
        ToShowNotification = subSubCategories[0].value.some((x) =>
          subsubcat.includes(x.toString())
        );
      }

      if (!ToShowNotification) {
        return ToShowNotification;
      }
      // feedback rating

      const FeedbackRating = genericFilter.filters.map((obj) => {
        if (obj.name === 'MUI.FeedbackRating') {
          return obj;
        }
      });
      if (FeedbackRating && FeedbackRating.length > 0) {
        ToShowNotification = FeedbackRating[0].value.includes(
          Data.AverageRating
        );
      }

      if (!ToShowNotification) {
        return ToShowNotification;
      }

      // subscribe check
      const checksubscribe = genericFilter.filters.map((obj) => {
        if (obj.name === 'CDSD.IsSubscribe') {
          return obj;
        }
      });
      if (checksubscribe && checksubscribe.length > 0) {
        ToShowNotification = checksubscribe[0].value === true;
      }

      if (!ToShowNotification) {
        return ToShowNotification;
      }

      // isSocialDeleted

      const isSocialDeleted = genericFilter.filters.map((obj) => {
        if (obj.name === 'Main.isDeletedFromSocial') {
          return obj;
        }
      });
      if (isSocialDeleted && isSocialDeleted.length > 0) {
        ToShowNotification = isSocialDeleted[0].value === true;
      }

      if (!ToShowNotification) {
        return ToShowNotification;
      }
    }

    if (genericFilter.simpleSearch && genericFilter.simpleSearch !== '') {
      ToShowNotification = Data.Description.includes(
        genericFilter.simpleSearch
      );
      if (isTicket) {
        ToShowNotification =
          genericFilter.simpleSearch === Data.CaseID.toString();
      } else {
        ToShowNotification =
          genericFilter.simpleSearch === Data.NewMention.toString();
      }
      ToShowNotification = Data.Author.includes(genericFilter.simpleSearch);
      ToShowNotification =
        genericFilter.simpleSearch === Data.PostURL.toString();
    }
    if (!ToShowNotification) {
      return ToShowNotification;
    }
    return ToShowNotification;
  }

  CheckAnyFilterIsApplied(genericFilter: GenericFilter): boolean {
    if (genericFilter) {
      if (genericFilter.filters && genericFilter.filters.length > 0) {
        return true;
      }
      if (
        genericFilter.query &&
        genericFilter.query !== '' &&
        genericFilter.query !== 'string'
      ) {
        return true;
      }
      if (genericFilter.notFilters && genericFilter.notFilters.length > 0) {
        return true;
      }
      if (genericFilter.simpleSearch && genericFilter.simpleSearch !== '') {
        return true;
      }
      return false;
    }
  }

  CheckForTicketStatusValid(ticketType, CaseStatus): boolean {
    let valid = true;
    let statusarr = [];
    switch (+ticketType) {
      case 0:
        return true;
      case 1:
        //    TT 1 U2
        //    8, 11, 14, 16
        //    U8
        //    9, 10, 15
        // else 1, 6, 9, 8, 11, 12, 13, 14, 15, 16
        if (this.currentUserRole === UserRoleEnum.CustomerCare) {
          statusarr = [8, 11, 14, 16];
        } else if (this.currentUserRole === UserRoleEnum.BrandAccount) {
          statusarr = [9, 10, 15];
        } else {
          statusarr = [1, 6, 9, 8, 11, 12, 13, 14, 15, 16];
        }

        break;

      case 2:
        //    TT2  3
        statusarr = [3];

        break;
      case 4:
        //    TT4   U2
        //    1, 9, 12, 15
        //    U8
        //    8, 14
        // 	else 0, 12, 13, 14, 15, 16

        if (this.currentUserRole === UserRoleEnum.CustomerCare) {
          statusarr = [1, 9, 12, 15];
        } else if (this.currentUserRole === UserRoleEnum.BrandAccount) {
          statusarr = [8, 14];
        } else {
          statusarr = [0, 12, 13, 14, 15, 16];
        }
        break;
      case 5:
        //    TT5 	U2
        //    9, 15
        // 		else not U8 2, 4, 10

        if (this.currentUserRole === UserRoleEnum.CustomerCare) {
          statusarr = [9, 15];
        } else if (this.currentUserRole !== UserRoleEnum.BrandAccount) {
          statusarr = [2, 4, 10];
        }

        break;
      case 6:
        //    TT6  	U3
        //    0, 2, 3, 4, 5, 7, 10
        if (this.currentUserRole === UserRoleEnum.SupervisorAgent) {
          statusarr = [0, 2, 3, 4, 5, 7, 10];
        }
        break;
      case 7:
        //    TT7      U2
        //    6, 13
        //    U8
        //    11, 16
        // 			else 5

        if (this.currentUserRole === UserRoleEnum.CustomerCare) {
          statusarr = [6, 13];
        } else if (this.currentUserRole === UserRoleEnum.BrandAccount) {
          statusarr = [11, 16];
        } else {
          statusarr = [5];
        }
        break;
      case 8:
        //    TT8   Not U2 and U8   7

        if (
          this.currentUserRole !== UserRoleEnum.CustomerCare &&
          this.currentUserRole !== UserRoleEnum.BrandAccount
        ) {
          statusarr = [7];
        }
        break;
      case 9:
        //    TT9  		U2
        //    2
        //    U8
        //    10
        if (this.currentUserRole === UserRoleEnum.CustomerCare) {
          statusarr = [2];
        } else if (this.currentUserRole === UserRoleEnum.BrandAccount) {
          statusarr = [10];
        }
        break;
      case 10:
        if (
          this.currentUserRole === UserRoleEnum.TeamLead ||
          this.currentUserRole === UserRoleEnum.SupervisorAgent
        ) {
          statusarr = [0, 12, 13, 14, 15, 16];
        }
        break;
      case 12:
        statusarr = [0, 1, 3, 12, 13, 14, 15, 16];
        break;
      default:
        // U2   1,6,9,8,11,12,13,14,15,16
        // U8   8,11,14,16
        if (this.currentUserRole === UserRoleEnum.CustomerCare) {
          statusarr = [1, 6, 9, 8, 11, 12, 13, 14, 15, 16];
        } else if (this.currentUserRole === UserRoleEnum.BrandAccount) {
          statusarr = [8, 11, 14, 16];
        }
        break;
    }
    valid = statusarr.includes(+CaseStatus);

    return valid;
  }

  fetchNewData(signalRobj: any): void {
    // check for every Tab opened
    for (const tab of this._navigationService.fetchedTabList) {
      {
        const obj = signalRobj.message;
        if (
          obj.Data.AssignedToAgencyUser === null ||
          obj.Data.AssignedToAgencyUser === undefined ||
          isNaN(+obj.Data.AssignedToAgencyUser)
        ) {
          if (obj.UserId !== undefined || obj.UserID !== undefined) {
            obj.Data.AssignedToAgencyUser =
              obj.UserId !== undefined ? obj.UserId : obj.UserID;
          }
        }
        const Data = obj.Data;
        const genericFilter: GenericFilter = JSON.parse(tab.filterJson);

        let ToShowNotification = false;

        // FbMessengerUnreadMessageSignalR(obj);  // need to discuss with shaiwaz
        const brandObj = this._filterService.fetchedBrandData.find(
          (brand) => +brand.brandID === +obj.BrandId
        );

        let caseIdExist = -1;

        if (this.TicketSignalRObj && this.TicketSignalRObj.length > 0) {
          caseIdExist = this.TicketSignalRObj.findIndex(
            (tobj) => tobj.CaseID === Data.CaseID
          );
        }
        if (
          brandObj &&
          +brandObj.brandID > -1 &&
          Data.CaseID > 0 &&
          caseIdExist <= -1
        ) {
          // TicketSignalRObj.indexOf(Data.CaseID) == -1
          if (
            +this.currentUser.data.user.role !== UserRoleEnum.CustomerCare &&
            +this.currentUser.data.user.role !== UserRoleEnum.BrandAccount
          ) {
            if (this.ChecksignalrQualifies(Data)) {
              if (
                genericFilter.ticketType.includes(0) ||
                genericFilter.ticketType.includes(4)
              ) {
                ToShowNotification = this.CheckCustomFilter(tab, Data, true);
              }

              if (ToShowNotification) {
                // const AutoRender = JSON.parse(
                //   localStorage.getItem('IsTicketAutoRender')
                // );
                this.TicketSignalRObj.push(Data);
                this.QualifiedSignalRObj.push(Data);
                const tabsignalRObject: TabSignalR = {
                  tab,
                  message: Data,
                  signalId: signalRobj.signalId,
                };
                this.ticketSignalCall.next(tabsignalRObject);
                // if (AutoRender.autorender) {
                // $(".signalrbtn a").click()
                // if (isAppendTicketSignalR) {
                //     GetTickteDataWithInterval();
                // }
                // } else {
                // AudioPlay();
                // console.log('print');
                // $('.signalrbtn').show();
                // }
              }
            }

            // $(".ticketsgnlrcount").html(TicketSignalRObj.length);
          }
        }

        // if (BrandList.indexOf(obj.BrandId.toString()) > -1 && ChannelGroupEnum[Data.ChannelName] == 28) {
        //     const OpenTicketID = $('#TicketWindowContainer #LogActionContainer .CloseTagWindow').attr('data-ticketid');
        //     console.log('Opened Ticket ID ' + OpenTicketID);
        //     const OpenAuthorID = $('#TicketUserProfile #locoBuzzAutorID').length > 0
        // ? $('#TicketUserProfile #locoBuzzAutorID').attr('data-authorsocialid') : undefined;
        //     const SignalRAuthorID = obj.ToUser == '' ? undefined : obj.ToUser;
        //     const authorID = Data.IsBrandPost ? SignalRAuthorID : Data.StrAuthorID;
        //     if (parseInt(OpenTicketID) == Data.CaseID || (OpenAuthorID != undefined
        // && SignalRAuthorID != undefined && OpenAuthorID == SignalRAuthorID)) {
        //         console.log('Opened Ticket ID: ' + OpenTicketID);
        //         console.log('Case Ticket ID: ' + Data.CaseID);
        //         $('.newticketsignalr a').attr('data-ticketid', Data.CaseID);
        //         $('.newticketsignalr a').attr('data-authorid', authorID);
        //         $('.newticketsignalr a').attr('data-channelgroupid', ChannelGroupEnum[Data.ChannelName]);
        //         $('.newticketsignalr').show();
        //     }
        // }
      }
    }
    this.chatbotSignalCall.next(signalRobj);
  }
  RefreshRAWSettingSignalR(signalRobj: any): void {}
  UpdateNPSAndSnetimentScoreOfAuthor(signalRobj: any): void {}
  RefreshEditRuleTicketRAWSettings(signalRobj: any): void {}
  RefreshDeleteRuleTicketRAWSettings(signalRobj: any): void {}
  BulkReopenOnHoldEscalateResponseMessageSignalR(signalRobj: any): void {}
  RefreshAgentTicketReassignement(signalRobj: any): void {}
  TeamLeaderAssignment(signalRobj: any): void {}
  AgentReminderWebsiteSignalR(signalRobj: any): void {}
  RefreshActionButtonEnableJson(signalRobj: any): void {}
  UpdateBulkReplyCountSignalR(signalRobj: any): void {}
  UserRecievedFromWhatsapp(signalRobj: any): void {}
  CloseWebsiteBotTicket(signalRobj: any): void {}
  UnreadMessageSignalR(signalRobj: any): void {}
  LogOutOnTeamUserRemove(signalRobj: any): void {}
  MakeActionableSingnal(signalRobj: any): void {}
  WhatsAppStatusUpdate(signalRobj: any): void {}
  TicketMarkedAsRead(signalRobj: any): void {
    const obj = signalRobj.message;
    if (this.checkIfBrandIdAndTicketExists(signalRobj)) {
    }
  }
  ClearAllSession(signalRobj: any): void {}
  LogOutMultipleUser(signalRobj: any): void {}

  LockUnlockTicketSignalR(signalRobj: any): void {
    const obj = signalRobj.message;
    const postObj: PostSignalR = {
      ticketId: obj.TicketID,
      message: obj,
      signalId: TicketSignalEnum.LockUnlockTicketSignalR
    };
    if (+this.currentUser.data.user.userId !== +obj.UserID)
    {
      this.openTicketDetailSignalCall.next(postObj);
    }
  }

  TicketNoteAdd(signalRobj: any): void {
    const obj = signalRobj.message;
    const postObj: PostSignalR = {
      ticketId: obj.TicketID,
      message: obj,
      signalId: TicketSignalEnum.TicketNoteAdd
    };
    this.postSignalCall.next(postObj);
  }

  NewCaseAttach(signalRobj: any): void {
    const obj = signalRobj.message;
    const Data = obj.Data;
    const brandObj = this._filterService.fetchedBrandData.find(
      (brand) => +brand.brandID === +obj.BrandID
    );
    if (brandObj && +brandObj.brandID > -1 && +obj.TicketID > 0) {
      this.mentionSignalCall.next(+obj.TicketID);
      this.chatbotSignalCall.next(signalRobj);
    }
  }
  CaseDetachFrom(signalRobj: any): void {
    const obj = signalRobj.message;
    const Data = obj.Data;
    const brandObj = this._filterService.fetchedBrandData.find(
      (brand) => +brand.brandID === +obj.BrandID
    );
    if (brandObj && +brandObj.brandID > -1 && +obj.TicketID > 0) {
      this.mentionSignalCall.next(+obj.TicketID);
      this.chatbotSignalCall.next(signalRobj);
    }
  }

  SSREInProcess(signalRobj: any): void {
    const obj = signalRobj.message;
    if (this.checkIfBrandIdAndTicketExists(signalRobj)) {
      this.removeTicketCall.next(+obj.TicketID);
      if (
        +this.currentUser.data.user.role === UserRoleEnum.SupervisorAgent ||
        +this.currentUser.data.user.role === UserRoleEnum.TeamLead ||
        +this.currentUser.data.user.role === UserRoleEnum.AGENT
      ) {
        this.InsertTicketSignalRobj(signalRobj);
      }
    }
  }
  SSREProcessCompleted(signalRobj: any): void {
    const obj = signalRobj.message;
    if (this.checkIfBrandIdAndTicketExists(signalRobj)) {
      this.removeTicketCall.next(+obj.TicketID);
      if (
        +this.currentUser.data.user.role === UserRoleEnum.SupervisorAgent ||
        +this.currentUser.data.user.role === UserRoleEnum.TeamLead ||
        +this.currentUser.data.user.role === UserRoleEnum.AGENT
      ) {
        this.InsertTicketSignalRobj(signalRobj);
      }
    }
  }
  SSREProcessFailed(signalRobj: any): void {}
  SSREReplyVerifiedOrRejected(signalRobj: any): void {
    const obj = signalRobj.message;
    if (this.checkIfBrandIdAndTicketExists(signalRobj)) {
      this.removeTicketCall.next(+obj.TicketID);
      if (
        +this.currentUser.data.user.role === UserRoleEnum.SupervisorAgent ||
        +this.currentUser.data.user.role === UserRoleEnum.TeamLead ||
        +this.currentUser.data.user.role === UserRoleEnum.AGENT
      ) {
        if (+this.currentUser.data.user.userId === +obj.VerifiedBy) {
          // if (isCustomFilterApplied) {
          this.InsertTicketSignalRobj(signalRobj);
          // }
        } else {
          this.InsertTicketSignalRobj(signalRobj);
        }
      }
    }
  }

  ShowTicketMentionTaggingResponseMessageSignalR(signalRobj: any): void {
    const data = signalRobj.message;
    if (+this.currentUser.data.user.userId === +data.UserID) {
      switch (data.ErrorObject.StatusCode) {
        case 1:
          // All mentions has been sent for tagging. No alert message
          break;
        case -1:
          this._snackBar.open(
            `Something went wrong while sending the request ${data.ErrorObject.Message}`,
            'Close',
            {
              duration: 1500,
            }
          );
          break;
        case -2:
          this._snackBar.open(
            `Something went wrong while sending the request ${data.ErrorObject.Message}`,
            'Close',
            {
              duration: 1500,
            }
          );
          break;
        case 3:
          this._snackBar.open(
            `Your request to retag mentions is being verified, meanwhile, you cannot perform any other retag operation and the current request (retag (${data.SkippedTags.length})) is skipped as the previous retag request is already under process`,
            'Close',
            {
              duration: 1500,
            }
          );
          break;
        case 4:
          this._snackBar.open(
            `Your retag operation is skipped as the previous retag request is already under process.`,
            'Close',
            {
              duration: 1500,
            }
          );
          break;
        case 5:
          // All mentions has been sent for tagging. No alert message
          break;
        case 6:
          this._snackBar.open(
            `Something went wrong while sending the request ,Server neither return successful retag nor skipped retags`,
            'Close',
            {
              duration: 1500,
            }
          );
          break;
        case 8:
          this._snackBar.open(
            `Your request to retag (${data.SkippedTags.length}) mentions has been completed`,
            'Close',
            {
              duration: 1500,
            }
          );
          break;
        case 9:
          this._snackBar.open(
            `Something went wrong while processing your request to retag (${data.SkippedTags.length}) mentions`,
            'Close',
            {
              duration: 1500,
            }
          );
          break;
        case 10:
          this._snackBar.open(
            `Your request to retag has completed partially.`,
            'Close',
            {
              duration: 1500,
            }
          );
          break;
        default:
          this._snackBar.open(
            `Something went wrong while sending the request, Server neither return successful nor failure response.`,
            'Close',
            {
              duration: 1500,
            }
          );
          break;
      }
    }
  }

  replyFailed(signalRobj: any): void {
    const obj = signalRobj.message;
    if (obj.UserID !== this.currentUser.data.user.userId) {
      return;
    }
    const brandObj = this._filterService.fetchedBrandData.find(
      (brand) => +brand.brandID === +obj.BrandID
    );

    if (brandObj && +brandObj.brandID > -1) {
      const mainURL = window.origin;
      const mentionid =
        obj.BrandID + '/' + obj.ChannelType + '/' + obj.ContentID;
      //  BrandTicketsV2.RenderTicketsInfo(0);
      const ChannelIconUrl = ChannelImage[ChannelGroup[obj.ChannelGroup]];
      let msg = '';
      const ChannelName = ChannelGroup[obj.ChannelGroup];
      const branddetails = brandObj;

      switch (obj.Mode) {
        case 'networkerror': {
          msg = `Your reply on ticket <strong>${obj.TicketID}</strong> for brand: <strong>${branddetails.brandSmallFriendlyName}</strong> failed for channel <strong>${ChannelName}</strong>. Please refresh the page to see update activity.`;
          const dialogData = new AlertDialogModel(
            'Network Error',
            msg,
            'Refresh  Page',
            'No',
            true
          );
          const fun = () => window.location.reload();
          this.showMessageDialog(dialogData, fun);
          break;
        }
        case 'tokenexpiry': {
          msg = `Your token expired for brand: <strong>${branddetails.brandSmallFriendlyName}</strong> for channel <strong>${ChannelName}</strong>.`;
          if (
            +this.currentUser.data.user.role === UserRoleEnum.SupervisorAgent
          ) {
            msg += 'Please reauthorize your account.';
          } else {
            msg += 'Please ask your supervisor to reconfigure.';
          }
          const dialogData = new AlertDialogModel(
            `Token Expired For ${ChannelName}`,
            msg,
            'Refresh  Page',
            'No',
            true
          );
          const fun = () => window.location.reload();
          this.showMessageDialog(dialogData, fun);
          break;
        }
        case 'deletedmention': {
          msg = `Your reply on ticket <strong>${obj.TicketID}</strong> for brand: <strong>${branddetails.brandSmallFriendlyName}</strong> failed for channel <strong>${ChannelName}</strong>. Please refresh the page to see update activity.`;
          const dialogData = new AlertDialogModel(
            'Replied On Deleted Mention',
            msg,
            'Refresh  Page',
            'No',
            true
          );
          const fun = () => window.location.reload();
          this.showMessageDialog(dialogData, fun);
          break;
        }
        case 'permissionissues': {
          msg = `Your reply on ticket <strong>${obj.TicketID}</strong> for brand: <strong>${branddetails.brandSmallFriendlyName}</strong> failed for channel <strong>${ChannelName}</strong> as you are not permitted to reply to ${mentionid} mention. Please refresh the page to see update activity.`;
          const dialogData = new AlertDialogModel(
            `Permission Issues For ${ChannelName}`,
            msg,
            'Refresh  Page',
            'No',
            true
          );
          const fun = () => window.location.reload();
          this.showMessageDialog(dialogData, fun);
          break;
        }
        case 'policiesviolations': {
          msg = `Your reply on ticket <strong>${obj.TicketID}</strong> for brand: <strong>${branddetails.brandSmallFriendlyName}</strong> failed for channel <strong>${ChannelName}</strong>. Please refresh the page to see update activity.`;
          const dialogData = new AlertDialogModel(
            `Policy Violation Issues For ${ChannelName}`,
            msg,
            'Refresh  Page',
            'No',
            true
          );
          const fun = () => window.location.reload();
          this.showMessageDialog(dialogData, fun);
          break;
        }
        case 'duplicate': {
          msg = `Your reply on ticket <strong>${obj.TicketID}</strong> for brand: <strong>${branddetails.brandSmallFriendlyName}</strong> failed for channel <strong>${ChannelName}</strong>. Please refresh the page to see update activity.`;
          const dialogData = new AlertDialogModel(
            `Duplicate Reply On ${ChannelName}`,
            msg,
            'Refresh  Page',
            'No',
            true
          );
          const fun = () => window.location.reload();
          this.showMessageDialog(dialogData, fun);
          break;
        }
        case 'servicenotready': {
          msg = `Your reply on ticket <strong>${obj.TicketID}</strong> for brand: <strong>${branddetails.brandSmallFriendlyName}</strong> failed for channel <strong>${ChannelName}</strong>. Please refresh the page to see update activity.`;
          const dialogData = new AlertDialogModel(
            `Service is not ready For ${ChannelName}`,
            msg,
            'Refresh  Page',
            'No',
            true
          );
          const fun = () => window.location.reload();
          this.showMessageDialog(dialogData, fun);
          break;
        }
        case 'outside24hours': {
          msg = `Your reply on ticket <strong>${obj.TicketID}</strong> for brand: <strong>${branddetails.brandSmallFriendlyName}</strong> failed for channel <strong>${ChannelName}</strong>. Please refresh the page to see update activity.`;
          const dialogData = new AlertDialogModel(
            `Replied Outside 24hrs Window For ${ChannelName}`,
            msg,
            'Refresh  Page',
            'No',
            true
          );
          const fun = () => window.location.reload();
          this.showMessageDialog(dialogData, fun);
          break;
        }
        case 'other': {
          msg = `Your reply on ticket <strong>${obj.TicketID}</strong> for brand: <strong>${branddetails.brandSmallFriendlyName}</strong> failed for channel <strong>${ChannelName}</strong> as API returned following message: <strong>${obj.ErrorObject.Message}</strong>. Please refresh the page to see update activity.`;
          const dialogData = new AlertDialogModel(
            `API Error For ${ChannelName}`,
            msg,
            'Refresh  Page',
            'No',
            true
          );
          const fun = () => window.location.reload();
          this.showMessageDialog(dialogData, fun);
          break;
        }
        case 'toomanyrequests': {
          msg = `Your reply on ticket <strong>${obj.TicketID}</strong> for brand: <strong>${branddetails.brandSmallFriendlyName}</strong> failed for channel <strong>${ChannelName}</strong> as API returned following message: <strong>Rate limit has been exhausted for reply</strong>. Please refresh the page to see update activity.`;
          const dialogData = new AlertDialogModel(
            `API Error For ${ChannelName}`,
            msg,
            'Refresh  Page',
            'No',
            true
          );
          const fun = () => window.location.reload();
          this.showMessageDialog(dialogData, fun);
          break;
        }
        case 'replyrestriction': {
          msg = `Your reply on ticket <strong>${obj.TicketID}</strong> for brand: <strong>${branddetails.brandSmallFriendlyName}</strong> failed for channel <strong>${ChannelName}</strong> as API returned following message: <strong>The Tweet author restricted who can reply to this</strong>. Please refresh the page to see update activity.`;
          const dialogData = new AlertDialogModel(
            `API Error For ${ChannelName}`,
            msg,
            'Refresh  Page',
            'No',
            true
          );
          const fun = () => window.location.reload();
          this.showMessageDialog(dialogData, fun);
          break;
        }
        default: {
          msg = `Your reply on ticket <strong>${obj.TicketID}</strong> for brand: <strong>${branddetails.brandSmallFriendlyName}</strong> failed for channel <strong>${ChannelName}</strong> as API returned following message: <strong>${obj.ErrorObject.Message}</strong>. Please refresh the page to see update activity.`;
          const dialogData = new AlertDialogModel(
            `API Error For ${ChannelName}`,
            msg,
            'Refresh  Page',
            'No',
            true
          );
          const fun = () => window.location.reload();
          this.showMessageDialog(dialogData, fun);
          break;
        }
      }
    }
  }

  showMessageDialog(dialogData: AlertDialogModel, fun): void {
    const dialogRef = this.dialog.open(AlertPopupComponent, {
      disableClose: true,
      autoFocus: false,
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        if (fun) {
          fun();
        }
      } else {
      }
    });
  }

  disableMakerChecker(signalRobj: any): void {
    const obj = signalRobj.message;
    const brandObj = this._filterService.fetchedBrandData.find(
      (brand) => +brand.brandID === +obj.BrandID
    );
    if (this.checkIfBrandIdAndTicketExists(signalRobj)) {
      if (
        (+this.currentUser.data.user.role !== UserRoleEnum.CustomerCare ||
          +this.currentUser.data.user.role !== UserRoleEnum.BrandAccount) &&
        brandObj.isEnableReplyApprovalWorkFlow
      ) {
        if (+this.currentUser.data.user.userId !== +obj.Data.SenderUserID) {
          this.removeTicketCall.next(+obj.TicketID);
          this.InsertTicketSignalRobj(signalRobj);
        }
        this.chatbotSignalCall.next(signalRobj);
      }
    }
  }

  enableMakerChecker(signalRobj: any): void {
    const obj = signalRobj.message;
    const brandObj = this._filterService.fetchedBrandData.find(
      (brand) => +brand.brandID === +obj.BrandID
    );
    if (this.checkIfBrandIdAndTicketExists(signalRobj)) {
      if (
        (+this.currentUser.data.user.role !== UserRoleEnum.CustomerCare ||
          +this.currentUser.data.user.role !== UserRoleEnum.BrandAccount) &&
        brandObj.isEnableReplyApprovalWorkFlow
      ) {
        if (+this.currentUser.data.user.userId !== +obj.Data.SenderUserID) {
          this.removeTicketCall.next(+obj.TicketID);
          this.InsertTicketSignalRobj(signalRobj);
        }
        this.chatbotSignalCall.next(signalRobj);
      }
    }
  }

  replyRejected(signalRobj: any): void {
    const obj = signalRobj.message;
    if (this.checkIfBrandIdAndTicketExists(signalRobj)) {
      this.removeTicketCall.next(+obj.TicketID);
      this.chatbotSignalCall.next(signalRobj);
      if (
        +this.currentUser.data.user.role === UserRoleEnum.NewBie ||
        +this.currentUser.data.user.role === UserRoleEnum.AGENT
      ) {
        this.InsertTicketSignalRobj(signalRobj);
        this.chatbotSignalCall.next(signalRobj);
      }
    }
  }

  replyApproved(signalRobj: any): void {
    const obj = signalRobj.message;
    if (this.checkIfBrandIdAndTicketExists(signalRobj)) {
      this.removeTicketCall.next(+obj.TicketID);
      if (
        +this.currentUser.data.user.role === UserRoleEnum.NewBie ||
        +this.currentUser.data.user.role === UserRoleEnum.AGENT
      ) {
        this.InsertTicketSignalRobj(signalRobj);
        this.chatbotSignalCall.next(signalRobj);
      }
    }
  }

  replySentForApproval(signalRobj: any): void {
    const obj = signalRobj.message;
    if (this.checkIfBrandIdAndTicketExists(signalRobj)) {
      this.removeTicketCall.next(+obj.TicketID);
      this.chatbotSignalCall.next(signalRobj);
      if (
        +this.currentUser.data.user.role === UserRoleEnum.SupervisorAgent ||
        +this.currentUser.data.user.role === UserRoleEnum.TeamLead
      ) {
        this.InsertTicketSignalRobj(signalRobj);
      }
    }
  }

  ticketReassigned(signalRobj: any): void {
    const obj = signalRobj.message;
    const Data = obj.Data;
    const brandObj = this._filterService.fetchedBrandData.find(
      (brand) => +brand.brandID === +obj.BrandID
    );

    let ticketIdExist = -1;

    if (this.TicketSignalRObj && this.TicketSignalRObj.length > 0) {
      ticketIdExist = this.TicketSignalRObj.indexOf(obj.TicketID);
    }
    if (
      brandObj &&
      +brandObj.brandID > -1 &&
      ((obj.TicketID !== undefined &&
        +obj.TicketID > 0 &&
        ticketIdExist <= -1) ||
        (Data !== undefined && +Data.CaseID > 0 && ticketIdExist <= -1))
    ) {
      if (
        +this.currentUser.data.user.role === UserRoleEnum.SupervisorAgent ||
        +this.currentUser.data.user.role === UserRoleEnum.TeamLead ||
        (+this.currentUser.data.user.role === UserRoleEnum.AGENT &&
          brandObj.autoQueuingEnabled === 0)
      ) {
        this.removeTicketCall.next(+obj.TicketID);
        this.InsertTicketSignalRobj(signalRobj);
        this.chatbotSignalCall.next(signalRobj);
      } else if (+this.currentUser.data.user.role === UserRoleEnum.AGENT) {
        this.removeTicketCall.next(+obj.TicketID);
        this.chatbotSignalCall.next(signalRobj);
        if (+this.currentUser.data.user.userId === +obj.UserId) {
          this.InsertTicketSignalRobj(signalRobj);
        }
      }
      // this.chatbotSignalCall.next(signalRobj);
    }

    //     {
    //     if (main_show_assign_userid == undefined
    //       || main_show_assign_userid == "undefined"
    //       || main_show_assign_userid == ''
    //       || main_show_assign_userid.toString() == obj.UserId.toString()
    //       || main_show_assign_userid.toString() == obj.UserID.toString()) {
    //         if (obj.UserId == login_uid.toString() || obj.UserID == login_uid.toString()) {

    //             InsertTicketSignalRobj(obj);
    //         }
    //     }
    // }
  }

  ticketApprovedByCCOrBrand(signalRobj: any): void {
    const obj = signalRobj.message;
    if (this.checkIfBrandIdAndTicketExists(signalRobj)) {
      this.chatbotSignalCall.next(signalRobj);
      this.removeTicketCall.next(+obj.TicketID);
      if (
        +this.currentUser.data.user.role !== UserRoleEnum.CustomerCare &&
        +this.currentUser.data.user.role !== UserRoleEnum.BrandAccount
      ) {
        this.InsertTicketSignalRobj(signalRobj);
      }
    }
  }

  ticketIgnoredByBrand(signalRobj: any): void {
    const obj = signalRobj.message;
    this.removeTicketCall.next(+obj.TicketID);
    if (this.checkIfBrandIdAndTicketExists(signalRobj)) {
      this.chatbotSignalCall.next(signalRobj);
      if (
        +this.currentUser.data.user.role !== UserRoleEnum.AGENT &&
        +this.currentUser.data.user.role !== UserRoleEnum.SupervisorAgent &&
        +this.currentUser.data.user.role !== UserRoleEnum.BrandAccount
      ) {
        this.InsertTicketSignalRobj(signalRobj);
      }
    }
  }

  ticketIgnoredByCC(signalRobj: any): void {
    const obj = signalRobj.message;
    this.removeTicketCall.next(+obj.TicketID);
    if (this.checkIfBrandIdAndTicketExists(signalRobj)) {
      this.chatbotSignalCall.next(signalRobj);
      if (
        +this.currentUser.data.user.role !== UserRoleEnum.CustomerCare &&
        +this.currentUser.data.user.role !== UserRoleEnum.BrandAccount
      ) {
        this.InsertTicketSignalRobj(signalRobj);
      }
    }
  }

  reOpenTicket(signalRobj: any): void {
    const obj = signalRobj.message;

    if (this.checkIfBrandIdAndTicketExists(signalRobj)) {
      if (
        +this.currentUser.data.user.role !== UserRoleEnum.BrandAccount ||
        +this.currentUser.data.user.role !== UserRoleEnum.CustomerCare
      ) {
        this.chatbotSignalCall.next(signalRobj);
        this.InsertTicketSignalRobj(signalRobj);
      }
      this.removeTicketCall.next(+obj.TicketID);
    }
  }

  ticketEscalatedToBrand(signalRobj: any): void {
    const obj = signalRobj.message;
    this.removeTicketCall.next(+obj.TicketID);
    if (this.checkIfBrandIdAndTicketExists(signalRobj)) {
      this.chatbotSignalCall.next(signalRobj);
      if (+this.currentUser.data.user.role === UserRoleEnum.BrandAccount) {
        if (+this.currentUser.data.user.userId === +obj.UserId) {
          this.InsertTicketSignalRobj(signalRobj);
        }
      }
    }
  }

  ticketEscalatedToCC(signalRobj: any): void {
    const obj = signalRobj.message;
    this.removeTicketCall.next(+obj.TicketID);
    if (this.checkIfBrandIdAndTicketExists(signalRobj)) {
      this.chatbotSignalCall.next(signalRobj);
      if (+this.currentUser.data.user.role === UserRoleEnum.CustomerCare) {
        if (+this.currentUser.data.user.userId === +obj.UserId) {
          this.InsertTicketSignalRobj(signalRobj);
        }
      }
    }
  }

  closeTicket(signalRobj: any): void {
    const obj = signalRobj.message;
    this.removeTicketCall.next(+obj.TicketID);
    if (this.checkIfBrandIdAndTicketExists(signalRobj)) {
      this.InsertTicketSignalRobj(signalRobj);
      this.chatbotSignalCall.next(signalRobj);
    }
  }

  InsertTicketSignalRobj(signalRobj: any): void {
    for (const tab of this._navigationService.fetchedTabList) {
      {
        const obj = signalRobj.message;
        if (
          obj.Data.AssignedToAgencyUser === null ||
          obj.Data.AssignedToAgencyUser === undefined ||
          isNaN(+obj.Data.AssignedToAgencyUser)
        ) {
          if (obj.UserId !== undefined || obj.UserID !== undefined) {
            obj.Data.AssignedToAgencyUser =
              obj.UserId !== undefined ? obj.UserId : obj.UserID;
          }
        }
        const Data = obj.Data;
        const genericFilter: GenericFilter = JSON.parse(tab.filterJson);

        let ToShowNotification = false;

        if (this.ChecksignalrQualifies(Data)) {
          ToShowNotification = this.CheckCustomFilter(tab, Data, true);
          if (ToShowNotification) {
            this.TicketSignalRObj.push(Data);
            this.QualifiedSignalRObj.push(Data);

            const tabsignalRObject: TabSignalR = {
              tab,
              message: obj,
              signalId: signalRobj.signalId,
            };
            this.ticketSignalCall.next(tabsignalRObject);
          }
        }
      }
    }
    // this.chatbotSignalCall.next(signalRobj);
  }

  checkIfBrandIdAndTicketExists(signalRobj: any): boolean {
    const obj = signalRobj.message;
    const Data = obj.Data;
    const brandObj = this._filterService.fetchedBrandData.find(
      (brand) => +brand.brandID === +obj.BrandID
    );

    let ticketIdExist = -1;

    if (this.TicketSignalRObj && this.TicketSignalRObj.length > 0) {
      ticketIdExist = this.TicketSignalRObj.indexOf(obj.TicketID);
    }
    if (brandObj && +brandObj.brandID > -1 && ticketIdExist <= -1) {
      return true;
    }
    return false;
  }
}
