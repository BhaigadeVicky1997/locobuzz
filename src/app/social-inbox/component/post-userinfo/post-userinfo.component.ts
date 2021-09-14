import { AddAssociateChannelsComponent } from './../add-associate-channels/add-associate-channels.component';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActionTaken } from 'app/core/enums/ActionTakenEnum';
import { LogStatus } from 'app/core/enums/LogStatus';
import { CustomAuthorDetails, CustomConnectedUsers, CustomCrmColumns } from 'app/core/interfaces/AuthorDetails';
import { BaseSocialAuthor } from 'app/core/models/authors/locobuzz/BaseSocialAuthor';
import { LocobuzzCrmDetails } from 'app/core/models/crm/LocobuzzCrmDetails';
import { CommunicationLogResponse } from 'app/core/models/viewmodel/CommunicationLog';
import { BrowserModule } from '@angular/platform-browser';
import { ChannelGroup } from 'app/core/enums/ChannelGroup';
import { runInThisContext } from 'vm';
import { UpliftAndSentimentScore } from 'app/core/models/dbmodel/UpliftAndSentimentScore';
import { TicketInfo } from 'app/core/models/viewmodel/ticketInfo';
import { TicketStatus } from 'app/core/enums/ticketStatusEnum';
import { AccountService } from 'app/core/services/account.service';
import { take } from 'rxjs/operators';
import { AuthUser } from 'app/core/interfaces/User';
import { UserRoleEnum } from 'app/core/enums/userRoleEnum';
import { FilterService } from 'app/social-inbox/services/filter.service';
import { AssignToList, AssignToListWithTeam } from '../../../shared/components/filter/filter-models/assign-to.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { PostDetailService } from 'app/social-inbox/services/post-detail.service';
import { Priority } from 'app/core/enums/Priority';
import { TicketsService } from 'app/social-inbox/services/tickets.service';
import { AlertDialogModel, AlertPopupComponent } from './../../../shared/components/alert-popup/alert-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { MaplocobuzzentitiesService } from 'app/core/services/maplocobuzzentities.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { UserDetailService } from 'app/social-inbox/services/user-details.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { BaseMention } from 'app/core/models/mentions/locobuzz/BaseMention';
import { filter } from 'app/app-data/ticket';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { LoaderService } from 'app/shared/services/loader.service';
import { ReplyService } from 'app/social-inbox/services/reply.service';
import { ChannelType } from 'app/core/enums/ChannelType';
import { SubSink } from 'subsink';


@Component({
  selector: 'app-post-userinfo',
  templateUrl: './post-userinfo.component.html',
  styleUrls: ['./post-userinfo.component.scss']
})
export class PostUserinfoComponent implements OnInit, OnDestroy {
  @Input() profileInfo?: {};
  @Input() activeTab?: number = 0;
  Object = Object;
  // @Input() author: BaseSocialAuthor;
  // @Input() ticketTimeline: CommunicationLogResponse;
  // @Input() upliftAndSentimentScore: UpliftAndSentimentScore;
  // @Input() ticketSumamry: TicketInfo;
  @Output() someEvent = new EventEmitter<string>();

  author: BaseSocialAuthor;
  ticketTimeline: CommunicationLogResponse;
  upliftAndSentimentScore: UpliftAndSentimentScore;
  ticketSumamry: TicketInfo;
  userProfileLoading: boolean  = true;

  CRMDetails: LocobuzzCrmDetails;
  customAuthorDetails: CustomAuthorDetails;
  customCrmColumns: CustomCrmColumns[] = [];
  TicketData: BaseMention[] = [];
  postObj: BaseMention;
  ticketCategory: string;
  totalMention: number;
  selectedTicketID: number;
  ticketID: number;
  ticketStatus: TicketStatus;
  AssignedTo: number;
  ticketPriority: Priority;
  brand: string;
  ticketCreatedOn: string;
  userwithteam: AssignToListWithTeam[] = [];
  assignTo: AssignToList[] = [];
  personalDetailForm: FormGroup;
  imgPath: string = 'assets/social-mention/post/';
  CrmDetails: any[] = [];
  disableTicketSections = false;
  showProfile = false;
  profileName: string;
  pageImageUrl: string;
  brandImageUrl: string;
  subs = new SubSink();
  constructor(private accountService: AccountService, private filterService: FilterService,
              private _postDetailService: PostDetailService,
              private _ticketService: TicketsService,
              public dialog: MatDialog,
              private MapLocobuzz: MaplocobuzzentitiesService,
              private _snackBar: MatSnackBar,
              private _userDetailService: UserDetailService,
              private formBuilder: FormBuilder,
              private _loaderService: LoaderService,
              private _replyService: ReplyService
              ) {}
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  ngOnInit(): void {
    this.activeTab =  1;
    const profileObj: any = this._postDetailService.postDetailData;
    this.activeTab = 1;

    if (!this.profileInfo)
    {
      this.profileInfo = profileObj.profileInfo;
    }
    this.TicketData = this._ticketService.MentionListObj;
    // const object1 = {
    //   BrandID: this._postDetailService.postObj.brandInfo.brandID,
    //   BrandName: this._postDetailService.postObj.brandInfo.brandName
    // };

    // this._ticketService.checkAutoclosureEligibility(object1).subscribe((data)=>
    // {

    //   console.log('Chala');
    // });

    // console.log(this.assignTo);

    this.subs.add(this._postDetailService.currentPostObject.subscribe(
      (value) => {
        // this.userProfileLoading = true;
        if (value > 0) {
          this.postObj = this.TicketData.find(obj => obj.ticketInfo.ticketID === value) || this._postDetailService.postObj;
          // this.selectedPostID = this.postObj?.ticketInfo?.ticketID;
          this._postDetailService.postObj = this.postObj;
          this.author = {};
          this.ticketTimeline = {};
          this.upliftAndSentimentScore = {};
          this.ticketSumamry = {};
          if (this.postObj)
          {
            this.setParams();
            this.fillTicketOverview(this.filterService.fetchedAssignTo);
            this.getAuthorDetails();
            this.getTicketTimeline(null);
            this._replyService.setTicktOverview.subscribe(obj => {
              if (obj)
              {
                if (obj.ticketInfo.ticketID === this.postObj.ticketInfo.ticketID)
                {
                  if (obj.ticketInfo.status === TicketStatus.Close)
                  {
                    this.disableTicketSections = true;
                    this.ticketStatus = TicketStatus.Close;
                  }
                  else if (obj.ticketInfo.status === TicketStatus.Open)
                  {
                    this.disableTicketSections = false;
                    this.ticketStatus = TicketStatus.Open;
                  }
                }
                }
              });
            // this.getTicketSummary();
            // this.getSentimentUpliftAndNPSScore();
            // this.userProfileLoading = false;
          }
        }
      }
    ));

  }

  public get logstatusEnum(): typeof LogStatus {
    return LogStatus;
  }
  public get actionstatusEnum(): typeof ActionTaken {
    return ActionTaken;
  }
  public get channelGroupEnum(): typeof ChannelGroup {
    return ChannelGroup;
  }

  setParams(): void {
    if (this.postObj.ticketInfo.status === TicketStatus.Close)
    {
      this.disableTicketSections = true;
      this.ticketStatus = TicketStatus.Close;
    }
    else if (this.postObj.ticketInfo.status === TicketStatus.Open)
    {
      this.disableTicketSections = false;
      this.ticketStatus = TicketStatus.Open;
    }
  }

  mapCRMColumns(author: BaseSocialAuthor): void {
    for (const column of author.crmColumns.existingColumns) {
      const crmObj: CustomCrmColumns = {};
      if (!column.isDisabled && !column.isDeleted) {
        switch (column.dbColumn) {
          case 'Name':
            crmObj.id = 'PersonalDetailsName';
            crmObj.value = author.locoBuzzCRMDetails.name ? author.locoBuzzCRMDetails.name : '';
            crmObj.dbColumn = column.dbColumn;
            crmObj.dbColumnName = column.columnLable;
            break;
          case 'EmailID':
            crmObj.id = 'PersonalDetailsEmail';
            crmObj.value = author.locoBuzzCRMDetails.emailID ? author.locoBuzzCRMDetails.emailID : '';
            crmObj.dbColumn = column.dbColumn;
            crmObj.dbColumnName = column.columnLable;
            break;
          case 'AlternativeEmailID':
            crmObj.id = 'PersonalDetailsAlternateEmail';
            crmObj.value = author.locoBuzzCRMDetails.alternativeEmailID ? author.locoBuzzCRMDetails.alternativeEmailID : '';
            crmObj.dbColumn = column.dbColumn;
            crmObj.dbColumnName = column.columnLable;
            break;
          case 'PhoneNumber':
            crmObj.id = 'PersonalDetailsNumber';
            crmObj.value = author.locoBuzzCRMDetails.phoneNumber ? author.locoBuzzCRMDetails.phoneNumber : '';
            crmObj.dbColumn = column.dbColumn;
            crmObj.dbColumnName = column.columnLable;
            break;
          case 'AlternatePhoneNumber':
            crmObj.id = 'PersonalDetailsAlternateNumber';
            crmObj.value = author.locoBuzzCRMDetails.alternatePhoneNumber ? author.locoBuzzCRMDetails.alternatePhoneNumber : '';
            crmObj.dbColumn = column.dbColumn;
            crmObj.dbColumnName = column.columnLable;
            break;
          case 'Link':
            crmObj.id = 'PersonalDetailsLink';
            crmObj.value = author.locoBuzzCRMDetails.link ? author.locoBuzzCRMDetails.link : '';
            crmObj.dbColumn = column.dbColumn;
            crmObj.dbColumnName = column.columnLable;
            break;
          case 'Address1':
            crmObj.id = 'PersonalDetailsAddress1';
            crmObj.value = author.locoBuzzCRMDetails.address1 ? author.locoBuzzCRMDetails.address1 : '';
            crmObj.dbColumn = column.dbColumn;
            crmObj.dbColumnName = column.columnLable;
            break;
          case 'Address2':
            crmObj.id = 'PersonalDetailsAddress2';
            crmObj.value = author.locoBuzzCRMDetails.address2 ? author.locoBuzzCRMDetails.address2 : '';
            crmObj.dbColumn = column.dbColumn;
            crmObj.dbColumnName = column.columnLable;
            break;
          case 'City':
            crmObj.id = 'PersonalDetailsCity';
            crmObj.value = author.locoBuzzCRMDetails.city ? author.locoBuzzCRMDetails.city : '';
            crmObj.dbColumn = column.dbColumn;
            crmObj.dbColumnName = column.columnLable;
            break;
          case 'State':
            crmObj.id = 'PersonalDetailsState';
            crmObj.value = author.locoBuzzCRMDetails.state ? author.locoBuzzCRMDetails.state : '';
            crmObj.dbColumn = column.dbColumn;
            crmObj.dbColumnName = column.columnLable;
            break;
          case 'Country':
            crmObj.id = 'PersonalDetailsCountry';
            crmObj.value = author.locoBuzzCRMDetails.country ? author.locoBuzzCRMDetails.country : '';
            crmObj.dbColumn = column.dbColumn;
            crmObj.dbColumnName = column.columnLable;
            break;
          case 'ZIPCode':
            crmObj.id = 'PersonalDetailsZipcode';
            crmObj.value = author.locoBuzzCRMDetails.zipCode ? author.locoBuzzCRMDetails.zipCode : '';
            crmObj.dbColumn = column.dbColumn;
            crmObj.dbColumnName = column.columnLable;
            break;
          case 'SSN':
            crmObj.id = 'PersonalDetailsSSN';
            crmObj.value = author.locoBuzzCRMDetails.ssn ? author.locoBuzzCRMDetails.ssn : '';
            crmObj.dbColumn = column.dbColumn;
            crmObj.dbColumnName = column.columnLable;
            break;
          case 'Notes':
            crmObj.id = 'PersonalDetailsNotes';
            crmObj.value = author.locoBuzzCRMDetails.notes ? author.locoBuzzCRMDetails.notes : '';
            crmObj.dbColumn = column.dbColumn;
            crmObj.dbColumnName = column.columnLable;
            break;

        }
        this.customCrmColumns.push(crmObj);
        if (crmObj.value) {
          this.CrmDetails.push({ id: crmObj.dbColumn, value: crmObj.value });
        }
      }
    }
    this.createFormGroup(this.customCrmColumns);
    this.author = author;
  }

  private createUserObject(authorObj: BaseSocialAuthor): void {
    // create an user object
    this.customAuthorDetails = {};
    switch (authorObj.channelGroup) {
      case ChannelGroup.Twitter: {
        this.customAuthorDetails.screenName = authorObj.screenname;
        console.log(authorObj.name);
        this.customAuthorDetails.profilePicUrl = authorObj.picUrl;
        this.customAuthorDetails.isVerified = authorObj.isVerifed;
        this.customAuthorDetails.followersCount = authorObj.followersCount;
        this.customAuthorDetails.kloutScore = authorObj.kloutScore;
        this.customAuthorDetails.profileUrl =
          'https://www.twitter.com/' + authorObj.screenname;
        break;
      }
      case ChannelGroup.Facebook: {
        this.customAuthorDetails.screenName = authorObj.name;
        this.customAuthorDetails.profilePicUrl = authorObj.picUrl;
        if (authorObj.socialId && authorObj.socialId !== '0') {
          this.customAuthorDetails.profileUrl =
            'http://www.facebook.com/' + authorObj.socialId;
          if (!authorObj.picUrl) {
            this.customAuthorDetails.profilePicUrl =
              'assets/images/agentimages/sample-image.jpg';
          }
        } else {
          this.customAuthorDetails.profilePicUrl =
            'assets/images/agentimages/sample-image.jpg';
          this.customAuthorDetails.profileUrl = undefined;
        }
        break;
      }
      case ChannelGroup.Instagram: {
        this.customAuthorDetails.screenName = authorObj.name;
        this.customAuthorDetails.profilePicUrl = authorObj.picUrl;
        this.customAuthorDetails.profileUrl = authorObj.profileUrl;
        break;
      }
      case ChannelGroup.WhatsApp: {
        this.customAuthorDetails.screenName = authorObj.name;
        this.customAuthorDetails.profilePicUrl = authorObj.picUrl;
        this.customAuthorDetails.profileUrl = authorObj.profileUrl;
        break;
      }
      case ChannelGroup.WebsiteChatBot: {
        this.customAuthorDetails.screenName = authorObj.name;
        this.customAuthorDetails.profilePicUrl = authorObj.picUrl;
        this.customAuthorDetails.profileUrl = authorObj.profileUrl;
        break;
      }
      case ChannelGroup.Youtube: {
        this.customAuthorDetails.screenName = authorObj.name;
        this.customAuthorDetails.profilePicUrl = authorObj.picUrl;
        this.customAuthorDetails.profileUrl = authorObj.profileUrl;
        break;
      }
      case ChannelGroup.LinkedIn: {
        this.customAuthorDetails.screenName = authorObj.name;
        this.customAuthorDetails.profilePicUrl = authorObj.picUrl;
        this.customAuthorDetails.profileUrl = authorObj.profileUrl;
        break;
      }
      case ChannelGroup.GooglePlayStore: {
        this.customAuthorDetails.screenName = authorObj.name;
        this.customAuthorDetails.profilePicUrl = authorObj.picUrl;
        this.customAuthorDetails.profileUrl = authorObj.profileUrl;
        break;
      }
      case ChannelGroup.Email: {
        this.customAuthorDetails.screenName = authorObj.socialId;
        break;
      }
      default: {
        this.customAuthorDetails.screenName = authorObj.name;
        this.customAuthorDetails.profilePicUrl = authorObj.picUrl;
        this.customAuthorDetails.profileUrl = authorObj.profileUrl;
        break;
      }
    }
    if (!this.customAuthorDetails.profilePicUrl) {
      this.customAuthorDetails.profilePicUrl = 'assets/images/agentimages/sample-image.jpg';
    }

    this.customAuthorDetails.isValidAuthorSocialIntegervalue = true;
    this.customAuthorDetails.showPersonalDetails = false;
    const IntegerAuthorSocialID: number = 0;
    if (authorObj && authorObj.socialId) {
      this.customAuthorDetails.isValidAuthorSocialIntegervalue = !isNaN(
        +authorObj.socialId
      );
    }

    if (
      this.customAuthorDetails.isValidAuthorSocialIntegervalue &&
      IntegerAuthorSocialID === 0
    ) {
      this.customAuthorDetails.showPersonalDetails = false;
    } else {
      this.customAuthorDetails.showPersonalDetails = true;
    }

    try {
      // Display Locobuzz previuos CRM Details
      if (
        (authorObj.locoBuzzCRMDetails.name ||
          authorObj.previousLocoBuzzCRMDetails.name) &&
        authorObj.previousLocoBuzzCRMDetails.name !==
        authorObj.locoBuzzCRMDetails.name
      ) {
        const result = authorObj.crmColumns.existingColumns.find((obj) => {
          return obj.dbColumn === 'Name';
        });
        this.customAuthorDetails.fieldsChanged = result
          ? this.customAuthorDetails.fieldsChanged + result.columnLable + ','
          : '';
      }
      if (
        (authorObj.locoBuzzCRMDetails.emailID ||
          authorObj.previousLocoBuzzCRMDetails.emailID) &&
        authorObj.previousLocoBuzzCRMDetails.emailID !==
        authorObj.locoBuzzCRMDetails.emailID
      ) {
        const result = authorObj.crmColumns.existingColumns.find((obj) => {
          return obj.dbColumn === 'EmailID';
        });
        this.customAuthorDetails.fieldsChanged = result
          ? this.customAuthorDetails.fieldsChanged + result.columnLable + ','
          : '';
      }
      if (
        (authorObj.locoBuzzCRMDetails.alternativeEmailID ||
          authorObj.previousLocoBuzzCRMDetails.alternativeEmailID) &&
        authorObj.previousLocoBuzzCRMDetails.alternativeEmailID !==
        authorObj.locoBuzzCRMDetails.alternativeEmailID
      ) {
        const result = authorObj.crmColumns.existingColumns.find((obj) => {
          return obj.dbColumn === 'AlternativeEmailID';
        });
        this.customAuthorDetails.fieldsChanged = result
          ? this.customAuthorDetails.fieldsChanged + result.columnLable + ','
          : '';
      }

      if (
        (authorObj.locoBuzzCRMDetails.phoneNumber ||
          authorObj.previousLocoBuzzCRMDetails.phoneNumber) &&
        authorObj.previousLocoBuzzCRMDetails.phoneNumber !==
        authorObj.locoBuzzCRMDetails.phoneNumber
      ) {
        const result = authorObj.crmColumns.existingColumns.find((obj) => {
          return obj.dbColumn === 'PhoneNumber';
        });
        this.customAuthorDetails.fieldsChanged = result
          ? this.customAuthorDetails.fieldsChanged + result.columnLable + ','
          : '';
      }

      if (
        (authorObj.locoBuzzCRMDetails.link ||
          authorObj.previousLocoBuzzCRMDetails.link) &&
        authorObj.previousLocoBuzzCRMDetails.link !==
        authorObj.locoBuzzCRMDetails.link
      ) {
        const result = authorObj.crmColumns.existingColumns.find((obj) => {
          return obj.dbColumn === 'Link';
        });
        this.customAuthorDetails.fieldsChanged = result
          ? this.customAuthorDetails.fieldsChanged + result.columnLable + ','
          : '';
      }

      if (
        (authorObj.locoBuzzCRMDetails.address1 ||
          authorObj.previousLocoBuzzCRMDetails.address1) &&
        authorObj.previousLocoBuzzCRMDetails.address1 !==
        authorObj.locoBuzzCRMDetails.address1
      ) {
        const result = authorObj.crmColumns.existingColumns.find((obj) => {
          return obj.dbColumn === 'Address1';
        });
        this.customAuthorDetails.fieldsChanged = result
          ? this.customAuthorDetails.fieldsChanged + result.columnLable + ','
          : '';
      }

      if (
        (authorObj.locoBuzzCRMDetails.address2 ||
          authorObj.previousLocoBuzzCRMDetails.address2) &&
        authorObj.previousLocoBuzzCRMDetails.address2 !==
        authorObj.locoBuzzCRMDetails.address2
      ) {
        const result = authorObj.crmColumns.existingColumns.find((obj) => {
          return obj.dbColumn === 'Address2';
        });
        this.customAuthorDetails.fieldsChanged = result
          ? this.customAuthorDetails.fieldsChanged + result.columnLable + ','
          : '';
      }

      if (
        (authorObj.locoBuzzCRMDetails.alternatePhoneNumber ||
          authorObj.previousLocoBuzzCRMDetails.alternatePhoneNumber) &&
        authorObj.previousLocoBuzzCRMDetails.alternatePhoneNumber !==
        authorObj.locoBuzzCRMDetails.alternatePhoneNumber
      ) {
        const result = authorObj.crmColumns.existingColumns.find((obj) => {
          return obj.dbColumn === 'AlternatePhoneNumber';
        });
        this.customAuthorDetails.fieldsChanged = result
          ? this.customAuthorDetails.fieldsChanged + result.columnLable + ','
          : '';
      }

      if (
        (authorObj.locoBuzzCRMDetails.notes ||
          authorObj.previousLocoBuzzCRMDetails.notes) &&
        authorObj.previousLocoBuzzCRMDetails.notes !==
        authorObj.locoBuzzCRMDetails.notes
      ) {
        const result = authorObj.crmColumns.existingColumns.find((obj) => {
          return obj.dbColumn === 'Notes';
        });
        this.customAuthorDetails.fieldsChanged = result
          ? this.customAuthorDetails.fieldsChanged + result.columnLable + ','
          : '';
      }

      if (
        (authorObj.locoBuzzCRMDetails.zipCode ||
          authorObj.previousLocoBuzzCRMDetails.zipCode) &&
        authorObj.previousLocoBuzzCRMDetails.zipCode !==
        authorObj.locoBuzzCRMDetails.zipCode
      ) {
        const result = authorObj.crmColumns.existingColumns.find((obj) => {
          return obj.dbColumn === 'ZIPCode';
        });
        this.customAuthorDetails.fieldsChanged = result
          ? this.customAuthorDetails.fieldsChanged + result.columnLable + ','
          : '';
      }
      if (
        (authorObj.locoBuzzCRMDetails.city ||
          authorObj.previousLocoBuzzCRMDetails.city) &&
        authorObj.previousLocoBuzzCRMDetails.city !==
        authorObj.locoBuzzCRMDetails.city
      ) {
        const result = authorObj.crmColumns.existingColumns.find((obj) => {
          return obj.dbColumn === 'City';
        });
        this.customAuthorDetails.fieldsChanged = result
          ? this.customAuthorDetails.fieldsChanged + result.columnLable + ','
          : '';
      }

      if (
        (authorObj.locoBuzzCRMDetails.state ||
          authorObj.previousLocoBuzzCRMDetails.state) &&
        authorObj.previousLocoBuzzCRMDetails.state !==
        authorObj.locoBuzzCRMDetails.state
      ) {
        const result = authorObj.crmColumns.existingColumns.find((obj) => {
          return obj.dbColumn === 'State';
        });
        this.customAuthorDetails.fieldsChanged = result
          ? this.customAuthorDetails.fieldsChanged + result.columnLable + ','
          : '';
      }

      if (
        (authorObj.locoBuzzCRMDetails.country ||
          authorObj.previousLocoBuzzCRMDetails.country) &&
        authorObj.previousLocoBuzzCRMDetails.country !==
        authorObj.locoBuzzCRMDetails.country
      ) {
        const result = authorObj.crmColumns.existingColumns.find((obj) => {
          return obj.dbColumn === 'Country';
        });
        this.customAuthorDetails.fieldsChanged = result
          ? this.customAuthorDetails.fieldsChanged + result.columnLable + ','
          : '';
      }

      if (
        (authorObj.locoBuzzCRMDetails.ssn ||
          authorObj.previousLocoBuzzCRMDetails.ssn) &&
        authorObj.previousLocoBuzzCRMDetails.ssn !==
        authorObj.locoBuzzCRMDetails.ssn
      ) {
        const result = authorObj.crmColumns.existingColumns.find((obj) => {
          return obj.dbColumn === 'SSN';
        });
        this.customAuthorDetails.fieldsChanged = result
          ? this.customAuthorDetails.fieldsChanged + result.columnLable + ','
          : '';
      }
      if (this.customAuthorDetails.fieldsChanged) {
        this.customAuthorDetails.fieldsChanged = this.customAuthorDetails.fieldsChanged.replace(
          /,\s*$/,
          ''
        );
      }
    } catch (error) {
      console.log(error);
    }
    this.customAuthorDetails.location = authorObj.location;
    this.customAuthorDetails.channelGroup = authorObj.channelGroup;
    this.customAuthorDetails.gender = authorObj.locoBuzzCRMDetails.gender;
    this.customAuthorDetails.age = authorObj.locoBuzzCRMDetails.age;
    this.customAuthorDetails.influencer = authorObj.markedInfluencerCategoryName;
    this.customAuthorDetails.email = authorObj.locoBuzzCRMDetails.emailID;
    this.customAuthorDetails.phoneNumber = authorObj.locoBuzzCRMDetails.phoneNumber;
    this.customAuthorDetails.Bio = authorObj.bio;
    this.customAuthorDetails.npsScrore = this.upliftAndSentimentScore.npsScore;
    this.customAuthorDetails.sentimentUpliftScore = this.upliftAndSentimentScore.upliftSentimentScore;
    this.customAuthorDetails.isNpsOn = this.upliftAndSentimentScore.isNpsOn;
    if (this.upliftAndSentimentScore.npsScore > 8) {
      this.customAuthorDetails.npsEmoji = 'assets/images/feedback/promoters.svg';
    }
    else if (this.upliftAndSentimentScore.npsScore > 6) {
      this.customAuthorDetails.npsEmoji = 'assets/images/feedback/passives.svg';
    }
    else if (this.upliftAndSentimentScore.npsScore >= 0) {
      this.customAuthorDetails.npsEmoji = 'assets/images/feedback/detractors.svg';
    }
    if (this.upliftAndSentimentScore.npsLastRecordDate === '0001-01-01T00:00:00') {
      this.customAuthorDetails.hasNpsUpdatedYet = false;
    }
    if (this.upliftAndSentimentScore.upliftLastupdatedDatetime === '0001-01-01T00:00:00') {
      this.customAuthorDetails.hasNpsUpliftUpdatedYet = false;
    }



    if (this.upliftAndSentimentScore.upliftSentimentScore > 70) {
      // set some color
      this.customAuthorDetails.sentimentUpliftScore
        = Math.round((+this.upliftAndSentimentScore.upliftSentimentScore + Number.EPSILON) * 100) / 100;
    }
    else if (this.upliftAndSentimentScore.upliftSentimentScore > 35) {
      // set some color
      this.customAuthorDetails.sentimentUpliftScore
        = Math.round((+this.upliftAndSentimentScore.upliftSentimentScore + Number.EPSILON) * 100) / 100;
    }
    else {
      // set some color
      this.customAuthorDetails.sentimentUpliftScore
        = Math.round((+this.upliftAndSentimentScore.upliftSentimentScore + Number.EPSILON) * 100) / 100;
    }

    // connected Users Logic
    this.customAuthorDetails.connectedUsers = [];
    for (const user of authorObj.connectedUsers) {
      const customconnectedUsers: CustomConnectedUsers = {};
      switch (user.channelGroup) {
        case ChannelGroup.Twitter: {
          customconnectedUsers.name = user.name;
          customconnectedUsers.screenName = user.screenname;
          customconnectedUsers.profilepicURL = user.picUrl;
          customconnectedUsers.followers = user.followersCount;
          customconnectedUsers.following = user.followingCount;
          customconnectedUsers.tweets = user.tweetCount;
          customconnectedUsers.channelImage = 'assets/images/channelicons/Twitter.png';
          customconnectedUsers.picUrl =
            'https://www.twitter.com/' + authorObj.screenname;
          break;
        }
        case ChannelGroup.Facebook: {
          customconnectedUsers.name = user.name;
          customconnectedUsers.profilepicURL = user.picUrl;
          customconnectedUsers.channelImage = 'assets/images/channelicons/Facebook.png';
          if (user.socialId && user.socialId !== '0') {
            customconnectedUsers.picUrl =
              'http://www.facebook.com/' + user.socialId;
            if (!user.picUrl) {
              customconnectedUsers.profilepicURL =
                'assets/images/agentimages/sample-image.jpg';
            }
          } else {
            customconnectedUsers.profilepicURL =
              'assets/images/agentimages/sample-image.jpg';
            customconnectedUsers.picUrl = undefined;
          }
          break;
        }
        case ChannelGroup.Instagram: {
          customconnectedUsers.name = user.name;
          customconnectedUsers.profilepicURL = user.picUrl;
          customconnectedUsers.picUrl = user.profileUrl;
          customconnectedUsers.channelImage = 'assets/images/channelicons/Instagram.png';
          if (!user.profileUrl) {
            customconnectedUsers.picUrl = `https://www.instagram.com/${user.screenname}`;
          }
          break;
        }
        case ChannelGroup.Youtube: {
          customconnectedUsers.name = user.name;
          customconnectedUsers.profilepicURL = user.picUrl;
          customconnectedUsers.picUrl = user.profileUrl;
          customconnectedUsers.channelImage = 'assets/images/channelicons/Youtube.png';
          if (!user.profileUrl) {
            customconnectedUsers.picUrl = `http://www.youtube.com/channel/${user.socialId}`;
          }
          break;
        }
        case ChannelGroup.LinkedIn: {
          customconnectedUsers.name = user.name;
          customconnectedUsers.profilepicURL = user.picUrl;
          customconnectedUsers.picUrl = user.profileUrl;
          customconnectedUsers.channelImage = 'assets/images/channelicons/linkedin.png';
          break;
        }
        default:
          customconnectedUsers.name = user.name;
          customconnectedUsers.profilepicURL = user.picUrl;
          customconnectedUsers.picUrl = user.profileUrl;
          customconnectedUsers.channelImage = `assets/images/channelicons/${ChannelGroup[user.channelGroup]}.png`;
          break;

      }
      this.customAuthorDetails.connectedUsers.push(customconnectedUsers);

    }

    // insert traits
    this.customAuthorDetails.traits = [];
    for (const trait of authorObj.userTags) {
      this.customAuthorDetails.traits.push({ id: trait.id, name: trait.name });
    }

    // Build an ticket summary
    let currentUser: AuthUser;
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => currentUser = user);

    // for ticket ID
    this.customAuthorDetails.ticketIdDisable = false;
    if (+this.ticketSumamry.status === TicketStatus.Close
      || (+currentUser.data.user.role === UserRoleEnum.CustomerCare &&
        (+this.ticketSumamry.status === TicketStatus.PendingWithBrandWithNewMention
          || +this.ticketSumamry.status === TicketStatus.OnHoldBrandWithNewMention))
      || (+currentUser.data.user.role === UserRoleEnum.BrandAccount &&
        (+this.ticketSumamry.status === TicketStatus.PendingwithCSDWithNewMention
          || +this.ticketSumamry.status === TicketStatus.OnHoldCSDWithNewMention
          || +this.ticketSumamry.status === TicketStatus.RejectedByBrandWithNewMention))) {
      this.customAuthorDetails.ticketIdDisable = true;
    }
    else if ((+currentUser.data.user.role === UserRoleEnum.CustomerCare &&
      (+this.ticketSumamry.status === TicketStatus.PendingwithCSDWithNewMention
        || +this.ticketSumamry.status === TicketStatus.OnHoldCSDWithNewMention
        || +this.ticketSumamry.status === TicketStatus.RejectedByBrandWithNewMention))
      || (+currentUser.data.user.role === UserRoleEnum.BrandAccount &&
        (+this.ticketSumamry.status === TicketStatus.PendingWithBrandWithNewMention
          || +this.ticketSumamry.status === TicketStatus.OnHoldBrandWithNewMention))) {
      this.customAuthorDetails.ticketIdDisable = false;
    }
    else if (+currentUser.data.user.role === UserRoleEnum.ReadOnlySupervisorAgent) {
      this.customAuthorDetails.ticketIdDisable = true;
    }

    console.log('coonected users', authorObj.connectedUsers);

  }

  GetTicketTimelineByTicketId(tickeId): void {
    this.someEvent.next(tickeId);
  }

  copyMessage(val: string): void {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }


  fillTicketOverview(list): void {
    this.ticketCategory = this._postDetailService.postObj.ticketInfo.ticketCategoryMap ?
    this._postDetailService.postObj.ticketInfo.ticketCategoryMap[0].name : null;
    this.totalMention = this._postDetailService.postObj.ticketInfo.numberOfMentions;
    this.brand = this._postDetailService.postObj.brandInfo.brandName;
    this.brandImageUrl = this.getBrandLogo(this._postDetailService.postObj.brandInfo.brandID);
    this.ticketID = this._postDetailService.postObj.ticketInfo.ticketID;
    this.selectedTicketID = this.ticketID;
    this.ticketStatus = this._postDetailService.postObj.ticketInfo.status;
    this.ticketPriority = this._postDetailService.postObj.ticketInfo.ticketPriority;
    if (this.postObj.channelGroup === ChannelGroup.Facebook)
    {
      this.showProfile =  true;
      this.profileName = this.postObj.fbPageName;
    }

    const mentiondate = new Date(this._postDetailService.postObj.ticketInfo.caseCreatedDate);
    // console.log(`%c ${mentiondate}`, 'background:yellow');
    const end = moment();
    const start = moment.utc(this._postDetailService.postObj.ticketInfo.caseCreatedDate).local().format();
    const localdate = moment.utc(this._postDetailService.postObj.ticketInfo.caseCreatedDate).local().format('MMMM Do YYYY, h:mm:ss a');
    // console.log(`%c ${this._postDetailService.postObj.ticketInfo.caseCreatedDate}`, 'background:yellow');
    // console.log(`%c ${localdate}`, 'background:pink');

    const duration = moment.duration(moment(end).diff(moment(start)));

    // Get Days
    const days = Math.floor(duration.asDays()); // .asDays returns float but we are interested in full days only
    const daysFormatted = days ? `${days}d ` : ''; // if no full days then do not display it at all
    console.log(`%c ${daysFormatted}`, 'background:pink');
    // Get Hours
    const hours = duration.hours();
    const hoursFormatted = `${hours}h `;
    console.log(`%c ${hoursFormatted}`, 'background:yellow');

    // Get Minutes
    const minutes = duration.minutes();
    const minutesFormatted = `${minutes}m`;
    console.log(`%c ${minutesFormatted}`, 'background:green');


    this.ticketCreatedOn = localdate;
    this.AssignedTo = this._postDetailService.postObj.ticketInfo.assignedTo;
    for (const item of list) {

      for (const subItem of item.authorizedBrandsList) {
        if (subItem === this._postDetailService.postObj.brandInfo.brandID) {
          this.assignTo.push(item);
          if (this.userwithteam.length > 0)
        {
          for (const userObj of this.userwithteam)
          {
            if (userObj.teamID === item.teamID){
              userObj.user.push(item);
            }
          }
        }else{
          const userof: AssignToListWithTeam = {
            teamID: item.teamID,
            teamName: item.teamName,
            user: [item]
          };
          this.userwithteam.push(userof);
        }
        }
      }

    }
    console.log(this.userwithteam);
  }

  getBrandLogo(brandID): string {
    const brandimage = this.filterService.fetchedBrandData.filter(
      (obj) => +obj.brandID === +brandID
    )[0];
    if (brandimage.rImageURL) {
      return brandimage.rImageURL;
    } else {
      return 'assets/social-mention/post/default_brand.svg';
    }
  }


  changeTicketStatus(event): void {

    const sourceObject = this.MapLocobuzz.mapMention(this._postDetailService.postObj);
    const object = {
      IsEligibleForAutoclosure: false,
      IsReplyApproved: false,
      ActionTaken: 0,
      source: sourceObject
    };

    if (event.value === TicketStatus.CustomerInfoAwaited) {

      const message = `Enable Auto Closure`;
      const dialogData = new AlertDialogModel('Autoclosure', message, 'Yes', 'No');
      const dialogRef = this.dialog.open(AlertPopupComponent, {
        disableClose: true,
        autoFocus: false,
        data: dialogData
      });


      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {

          object.IsEligibleForAutoclosure = true;

        }
        else {
          object.IsEligibleForAutoclosure = false;

        }

        object.source.ticketInfo.status = event.value;
        console.log(object);
        this._ticketService.changeTicketStatus(object).subscribe((data) => {
          if (JSON.parse(JSON.stringify(data)).success) {
            this._postDetailService.postObj.ticketInfo.status = event.value;
            this._snackBar.open('Ticket Status Changed', 'Ok', {
              duration: 1000
            });
            this._ticketService.ticketStatusChange.next(true);
          }
          else {
            this._snackBar.open('Error Occured', 'Close', {
              duration: 1000
            });
          }
          console.log(data);
        }, error => {
          console.log(error);
        });


      });


    }
    else {
      object.IsEligibleForAutoclosure = false;
      object.source.ticketInfo.status = event.value;
      this._ticketService.changeTicketStatus(object).subscribe((data) => {
        if (JSON.parse(JSON.stringify(data)).success) {
          this._postDetailService.postObj.ticketInfo.status = event.value;
          this.postObj.ticketInfo.status = event.value;
          this.setParams();
          this._snackBar.open('Ticket Status Changed', 'Ok', {
            duration: 1000
          });
          this._ticketService.ticketStatusChange.next(true);
        }
        else {
          this._snackBar.open('Error Occured', 'Close', {
            duration: 1000
          });
        }
      }, error => {
        console.log(error);
      });
    }




  }

  changePriority(event): void {

    const object = {
      brandInfo: this._postDetailService.postObj.brandInfo,
      ticketInfo: this._postDetailService.postObj.ticketInfo,
      actionFrom: ActionTaken.Locobuzz
    };

    object.ticketInfo.ticketPriority = Priority[event.value] as unknown as Priority;

    this._ticketService.changeTicketPriority(object).subscribe(data => {
      if (JSON.parse(JSON.stringify(data)).success) {
        this._postDetailService.postObj.ticketInfo.ticketPriority = Priority[event.value] as unknown as Priority;
        this._snackBar.open('Ticket Priority Changed', 'Ok', {
          duration: 1000
        });
      }
      else {
        this._snackBar.open('Error Occured', 'Ok', {
          duration: 1000
        });
      }

    }, (error) => {
      console.log(error);
    });



  }

  changeAssignTo(event): void {
    const object = {
      brandInfo: this._postDetailService.postObj.brandInfo,
      ticketInfo: this._postDetailService.postObj.ticketInfo,
      channelType: this._postDetailService.postObj.channelType
    };

    object.ticketInfo.assignedTo = event.value;
    console.log(event.value);
    this._ticketService.ticketReassignToUser(object).subscribe((data) => {
      console.log('Assign To Data' , data);
      if (JSON.parse(JSON.stringify(data)).success) {
        this._postDetailService.postObj.ticketInfo.assignedTo = event.value;

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



  }


  // getSentimentUpliftAndNPSScore(): void {
  //   const filterObj = this.filterService.getGenericRequestFilter(this._postDetailService.postObj);
  //   this._userDetailService
  //     .GetSentimentUpliftAndNPSScore(filterObj)
  //     .subscribe((data) => {
  //       this.upliftAndSentimentScore.upliftSentimentScore = data.upliftSentimentScore;
  //       this.upliftAndSentimentScore.upliftLastupdatedDatetime = data.upliftLastupdatedDatetime;
  //       this.upliftAndSentimentScore.npsLastRecordDate = data.npsLastRecordDate;
  //       this.upliftAndSentimentScore.npsScore = data.npsScore;

  //       console.log('Uplift&NPS Score', data);
  //     });
  // }

  private createFormGroup(formdetails): void {
    console.log(formdetails);
    const object = {};
    for (const item of formdetails) {
      object[item.dbColumn] = new FormControl(item.value);
    }

    this.personalDetailForm = this.formBuilder.group(object);
    console.log(object);

  }

  onSubmit(): void {

    console.log(this.personalDetailForm.value);
    // tslint:disable-next-line: forin
    for (const column in this.personalDetailForm.value) {
      const value = this.personalDetailForm.value[column];
      switch (column) {
        case 'Name':
          this.author.locoBuzzCRMDetails.name = value;
          break;
        case 'EmailID':
          this.author.locoBuzzCRMDetails.emailID = value;
          break;
        case 'AlternativeEmailID':
          this.author.locoBuzzCRMDetails.alternativeEmailID = value;
          break;
        case 'PhoneNumber':
          this.author.locoBuzzCRMDetails.phoneNumber = value;
          break;
        case 'AlternatePhoneNumber':
          this.author.locoBuzzCRMDetails.alternatePhoneNumber = value;
          break;
        case 'Link':
          this.author.locoBuzzCRMDetails.link = value;
          break;
        case 'Address1':
          this.author.locoBuzzCRMDetails.address1 = value;
          break;
        case 'Address2':
          this.author.locoBuzzCRMDetails.address2 = value;
          break;
        case 'City':
          this.author.locoBuzzCRMDetails.city = value;
          break;
        case 'State':
          this.author.locoBuzzCRMDetails.state = value;
          break;
        case 'Country':
          this.author.locoBuzzCRMDetails.country = value;
          break;
        case 'ZIPCode':
          this.author.locoBuzzCRMDetails.zipCode = value;
          break;
        case 'SSN':
          this.author.locoBuzzCRMDetails.ssn = value;
          break;
        case 'Notes':
          this.author.locoBuzzCRMDetails.notes = value;
          break;

      }

    }

    this._postDetailService.postObj.author = this.author;
    const sourceObject =  this.MapLocobuzz.mapMention(this._postDetailService.postObj);
    const object =
    {
      brandInfo: sourceObject.brandInfo,
      authorInfo: sourceObject.author,
      ticketID: sourceObject.ticketInfo.ticketID
    };
    console.log('Object Data');
    console.log(JSON.stringify(object));

    this._ticketService.SaveLocoBuzzCRMDetail(object).subscribe((data) =>
    {
      console.log('Api worked', data)
      if (JSON.parse(JSON.stringify(data)).success)
      {
        console.log('Truell Api worked')

        this._snackBar.open('Details Saved', 'Ok',
        {
          duration: 1500
        });

      }
    });

    console.log(this.personalDetailForm);
  }

  openAssociateDialog(): void {
    this.dialog.open(AddAssociateChannelsComponent, {
      autoFocus: false,
      width: '650px'
    });
  }

  private getAuthorDetails(): void {
    const filterObj = this.filterService.getGenericRequestFilter(this.postObj);
    this._userDetailService.GetAuthorDetails(filterObj).subscribe((data) => {
      console.log('User Details', data);
      this.author = {};
      // this.author = data;
      this.mapCRMColumns(data);
      this.getTicketSummary();
      // this._loaderService.togglComponentLoader({
      //   status: false,
      //   section: 'Profile'
      // });
    });
  }

  private getTicketTimeline(ticketId?: number): void {
    this._loaderService.togglComponentLoader({
      section: 'Timeline',
      status: true
    });
    const filterObj = this.filterService.getGenericRequestFilter(this.postObj);
    filterObj.isPlainLogText = false;
    if (ticketId) {
      filterObj.ticketId = ticketId;
    }
    this._userDetailService.GetTicketTimeline(filterObj).subscribe((data) => {
      this.ticketTimeline = {};
      this.ticketTimeline = data;
      console.log('Ticket Timeline', data);
      this._loaderService.togglComponentLoader({
        section: 'Timeline',
        status: false
      });
    });
  }

  public CallTicketTimeLine(ticketId): void {
    this.getTicketTimeline(+ticketId);
  }

  private getTicketSummary(): void {
    const filterObj = this.filterService.getGenericRequestFilter(this.postObj);
    this._userDetailService.GetTicketSummary(filterObj).subscribe((data) => {
      console.log('Ticket Summary', data);
      this.ticketSumamry = {};
      this.ticketSumamry = data;
      this.getSentimentUpliftAndNPSScore();
    });
  }

  private getSentimentUpliftAndNPSScore(): void {
    const filterObj = this.filterService.getGenericRequestFilter(this.postObj);
    this._userDetailService
      .GetSentimentUpliftAndNPSScore(filterObj)
      .subscribe((data) => {
        this.upliftAndSentimentScore = {};
        this.upliftAndSentimentScore = data;
        this.createUserObject(this.author);
        console.log('Uplift&NPS Score', data);
        this.userProfileLoading = false;
      });
  }


}
