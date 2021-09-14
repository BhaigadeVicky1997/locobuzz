import { MatDialog } from '@angular/material/dialog';
import { EnrichViewComponent } from './../enrich-view/enrich-view.component';
import { AddAssociateChannelsComponent } from './../add-associate-channels/add-associate-channels.component';
import { PostDetailService } from 'app/social-inbox/services/post-detail.service';
import { UserDetailService } from 'app/social-inbox/services/user-details.service';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseSocialAuthor } from 'app/core/models/authors/locobuzz/BaseSocialAuthor';
import { CustomAuthorDetails, CustomConnectedUsers, CustomCrmColumns } from 'app/core/interfaces/AuthorDetails';
import { ChannelGroup } from 'app/core/enums/ChannelGroup';
import { AccountService } from 'app/core/services/account.service';
import { TicketInfo } from 'app/core/models/viewmodel/ticketInfo';
import { UserRoleEnum } from 'app/core/enums/userRoleEnum';
import { TicketStatus } from 'app/core/enums/ticketStatusEnum';
import { take } from 'rxjs/operators';
import { AuthUser } from 'app/core/interfaces/User';
import { UpliftAndSentimentScore } from 'app/core/models/dbmodel/UpliftAndSentimentScore';
import { FilterService } from 'app/social-inbox/services/filter.service';
import { BaseMention } from 'app/core/models/mentions/locobuzz/BaseMention';
import { MaplocobuzzentitiesService } from 'app/core/services/maplocobuzzentities.service';
import { ReplyService } from 'app/social-inbox/services/reply.service';
import { BaseSocialAccountConfiguration } from 'app/core/models/accountconfigurations/BaseSocialAccountConfiguration';
import { SocialHandle } from 'app/core/models/dbmodel/TicketReplyDTO';
import { AuthorActions } from 'app/core/enums/AuthorActions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from './../../../shared/services/loader.service';
import { PostMarkinfluencerComponent } from '../post-markinfluencer/post-markinfluencer.component';

@Component({
  selector: 'app-post-userprofile',
  templateUrl: './post-userprofile.component.html',
  styleUrls: ['./post-userprofile.component.scss']
})
export class PostUserprofileComponent implements OnInit {
  @Input() author?: BaseSocialAuthor;
  @Input() upliftAndSentimentScore?: UpliftAndSentimentScore;
  @Input() ticketSumamry?: TicketInfo;
  @Input() showActions?: boolean = true;
  customAuthorDetails: CustomAuthorDetails;
  postObj: BaseMention;
  objBrandSocialAcount: BaseSocialAccountConfiguration[];
  CrmDetails: any[] = [];
  currentUser: AuthUser;
  customCrmColumns: CustomCrmColumns[] = [];
  handleNames?: SocialHandle[] = [];
  selectedHandle?: SocialHandle = {};
  authorAction: number;
  authorActionFlag: boolean;
  constructor(private accountService: AccountService,
              private filterService: FilterService,
              private _userDetailService: UserDetailService,
              private _postDetailService: PostDetailService,
              private dialog: MatDialog,
              private _mapLocobuzzEntity: MaplocobuzzentitiesService,
              private replyService: ReplyService,
              private _snackBar: MatSnackBar,
              private _loaderService: LoaderService
            ) { }

  public get channelGroupEnum(): typeof ChannelGroup {
    return ChannelGroup;
  }

  public get userRoleEnum(): typeof UserRoleEnum {
    return UserRoleEnum;
  }

  public get getAuthorAction(): typeof AuthorActions {
    return AuthorActions;
  }

  ngOnInit(): void {
    console.log(this.showActions);
    this.postObj = this._postDetailService.postObj;
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.currentUser = user);
    if (this.author && this.ticketSumamry && this.upliftAndSentimentScore)
    {
      this.mapCRMColumns(this.author);
      this.createUserObject(this.author);
    }
    else{
      //
      this.getAuthorDetails();
    }
    this.GetBrandAccountInformation();

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

    if (authorObj.connectedUsers.length === 0)
    {
      const customconnectedUsers: CustomConnectedUsers = {};
      switch (authorObj.channelGroup) {
        case ChannelGroup.Twitter: {
          customconnectedUsers.name = authorObj.name;
          customconnectedUsers.screenName = authorObj.screenname;
          customconnectedUsers.profilepicURL = authorObj.picUrl;
          customconnectedUsers.followers = authorObj.followersCount;
          customconnectedUsers.following = authorObj.followingCount;
          customconnectedUsers.tweets = authorObj.tweetCount;
          customconnectedUsers.channelImage = 'assets/images/channelicons/Twitter.png';
          customconnectedUsers.picUrl =
            'https://www.twitter.com/' + authorObj.screenname;
          break;
        }
        case ChannelGroup.Facebook: {
          customconnectedUsers.name = authorObj.name;
          customconnectedUsers.profilepicURL = authorObj.picUrl;
          customconnectedUsers.channelImage = 'assets/images/channelicons/Facebook.png';
          if (authorObj.socialId && authorObj.socialId !== '0') {
            customconnectedUsers.picUrl =
              'http://www.facebook.com/' + authorObj.socialId;
            if (!authorObj.picUrl) {
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
          customconnectedUsers.name = authorObj.name;
          customconnectedUsers.profilepicURL = authorObj.picUrl;
          customconnectedUsers.picUrl = authorObj.profileUrl;
          customconnectedUsers.channelImage = 'assets/images/channelicons/Instagram.png';
          if (!authorObj.profileUrl) {
            customconnectedUsers.picUrl = `https://www.instagram.com/${authorObj.screenname}`;
          }
          break;
        }
        case ChannelGroup.Youtube: {
          customconnectedUsers.name = authorObj.name;
          customconnectedUsers.profilepicURL = authorObj.picUrl;
          customconnectedUsers.picUrl = authorObj.profileUrl;
          customconnectedUsers.channelImage = 'assets/images/channelicons/Youtube.png';
          if (!authorObj.profileUrl) {
            customconnectedUsers.picUrl = `http://www.youtube.com/channel/${authorObj.socialId}`;
          }
          break;
        }
        case ChannelGroup.LinkedIn: {
          customconnectedUsers.name = authorObj.name;
          customconnectedUsers.profilepicURL = authorObj.picUrl;
          customconnectedUsers.picUrl = authorObj.profileUrl;
          customconnectedUsers.channelImage = 'assets/images/channelicons/linkedin.png';
          break;
        }
        default:
          customconnectedUsers.name = authorObj.name;
          customconnectedUsers.profilepicURL = authorObj.picUrl;
          customconnectedUsers.picUrl = authorObj.profileUrl;
          customconnectedUsers.channelImage = `assets/images/channelicons/${ChannelGroup[authorObj.channelGroup]}.png`;
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
    // let currentUser: AuthUser;
    // this.accountService.currentUser$.pipe(take(1)).subscribe(user => currentUser = user);

    // for ticket ID
    this.customAuthorDetails.ticketIdDisable = false;
    if (+this.ticketSumamry.status === TicketStatus.Close
      || (+this.currentUser.data.user.role === UserRoleEnum.CustomerCare &&
        (+this.ticketSumamry.status === TicketStatus.PendingWithBrandWithNewMention
          || +this.ticketSumamry.status === TicketStatus.OnHoldBrandWithNewMention))
      || (+this.currentUser.data.user.role === UserRoleEnum.BrandAccount &&
        (+this.ticketSumamry.status === TicketStatus.PendingwithCSDWithNewMention
          || +this.ticketSumamry.status === TicketStatus.OnHoldCSDWithNewMention
          || +this.ticketSumamry.status === TicketStatus.RejectedByBrandWithNewMention))) {
      this.customAuthorDetails.ticketIdDisable = true;
    }
    else if ((+this.currentUser.data.user.role === UserRoleEnum.CustomerCare &&
      (+this.ticketSumamry.status === TicketStatus.PendingwithCSDWithNewMention
        || +this.ticketSumamry.status === TicketStatus.OnHoldCSDWithNewMention
        || +this.ticketSumamry.status === TicketStatus.RejectedByBrandWithNewMention))
      || (+this.currentUser.data.user.role === UserRoleEnum.BrandAccount &&
        (+this.ticketSumamry.status === TicketStatus.PendingWithBrandWithNewMention
          || +this.ticketSumamry.status === TicketStatus.OnHoldBrandWithNewMention))) {
      this.customAuthorDetails.ticketIdDisable = false;
    }
    else if (+this.currentUser.data.user.role === UserRoleEnum.ReadOnlySupervisorAgent) {
      this.customAuthorDetails.ticketIdDisable = true;
    }

    console.log('conected users', authorObj.connectedUsers);

    this._postDetailService.setMarkInfluencer.subscribe(postObj => {
      if (postObj)
      {
        if (postObj.ticketInfo.ticketID === this.postObj.ticketInfo.ticketID)
        {
          if (postObj.author.markedInfluencerCategoryID)
          {
            this.customAuthorDetails.influencer = postObj.author.markedInfluencerCategoryName;
          }
          else
          {
            this.customAuthorDetails.influencer = null;
          }
        }
      }
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

  mapCRMColumns(author: BaseSocialAuthor): void {
    for (const column of author.crmColumns.existingColumns) {
      const crmObj: CustomCrmColumns = {};
      if (!column.isDisabled && !column.isDeleted) {
        switch (column.dbColumn) {
          case 'Name':
            crmObj.id = 'PersonalDetailsName';
            crmObj.value = author.locoBuzzCRMDetails.name;
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
  }

  openEnrichView(): void {
    this.dialog.open(EnrichViewComponent, {
      disableClose: true,
      autoFocus: false,
      panelClass: ['full-screen-modal', 'overflow-hidden']
    });
  }

  private getAuthorDetails(): void {
    this._loaderService.togglComponentLoader({
      section: 'profile',
      status: true
    })
    const filterObj = this.filterService.getGenericRequestFilter(this.postObj);
    this._userDetailService.GetAuthorDetails(filterObj).subscribe((data) => {
      console.log('User Details', data);
      this.author = {};
      this.author = data;
      this.mapCRMColumns(data);
      this.getTicketSummary();
      this._loaderService.togglComponentLoader({
        section: 'profile',
        status: false
      });
    });
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
        console.log(data);
        this.upliftAndSentimentScore = {};
        this.upliftAndSentimentScore = data;
        
        this.createUserObject(this.author);
        console.log('Uplift&NPS Score', data);
      });
  }

  openAssociateDialog(): void {
    this.dialog.open(AddAssociateChannelsComponent, {
      autoFocus: false,
      width: '550px'
    });
  }

  private GetBrandAccountInformation(): void {
    const obj = {
      Brand: this.postObj.brandInfo,
      ChannelGroup: this.postObj.channelGroup,
    };

    // call api to get socialaccountlist

    this.replyService.GetBrandAccountInformation(obj).subscribe((data) => {
      console.log(data);
      // this.zone.run(() => {
      if (data)
        {
          this.objBrandSocialAcount = data.filter(x => {
            return x.channelGroup === obj.ChannelGroup;
          });
          if (this.objBrandSocialAcount) {
            this.objBrandSocialAcount.forEach((item) => {
              this.handleNames.push({
                handleId: item.socialID,
                handleName: item.userName,
                accountId: item.accountID,
                socialId: item.socialID,
                profilepic: item.profileImageURL ? item.profileImageURL : 'assets/images/channelsv/Brand_Tweet.svg'
              });
            });
          }
        }
    });
  }

  setSocialHandle(socialObj: SocialHandle): void {
    this.selectedHandle = socialObj;
  }
  setAuthorFlag(type, authorflag): void {
    this.authorAction = type;
    this.authorActionFlag = authorflag;
    // this.selectedHandle = null;
  }

  submitActionHandle(): void {
      if (this.authorAction)
      {
        switch (this.authorAction)
        {
          case AuthorActions.FollowUnFollow:
            this.followUnfollowAuthor(this.selectedHandle);
            break;
          case AuthorActions.MuteUnMute:
            this.muteUnmuteAuthor(this.selectedHandle);
            break;
          case AuthorActions.BlockUnBlock:
            this.blockUnblockAuthor(this.selectedHandle);
            break;
          case AuthorActions.HideUnHide:
            break;
          default:
            break;
        }
      }
  }

  private followUnfollowAuthor(socialObj: SocialHandle): void {
    const keyObj = this.constructAuthorObj();
    keyObj.Account.AccountID = socialObj.accountId;
    keyObj.Account.SocialID = socialObj.socialId;
    keyObj.IsFollow = !this.authorActionFlag;

    this._userDetailService.followUnfollowAuthor(keyObj).subscribe((data) => {
      if (data.success)
      {
        this._snackBar.open('Action Completed Successfully', 'Ok', {
          duration: 1000
        });
      }
      else {
        this._snackBar.open('Error Occured', 'Close', {
          duration: 1000
        });
      }
    });
  }

  private muteUnmuteAuthor(socialObj: SocialHandle): void {
    const keyObj = this.constructAuthorObj();
    keyObj.Account.AccountID = socialObj.accountId;
    keyObj.Account.SocialID = socialObj.socialId;
    keyObj.IsMute = !this.authorActionFlag;

    this._userDetailService.muteUnmuteAuthor(keyObj).subscribe((data) => {
      if (data.success)
      {
        this._snackBar.open('Action Completed Successfully', 'Ok', {
          duration: 1000
        });
      }
      else {
        this._snackBar.open('Error Occured', 'Close', {
          duration: 1000
        });
      }
    });
  }

  private blockUnblockAuthor(socialObj: SocialHandle): void {
    const keyObj = this.constructAuthorObj();
    keyObj.Account.AccountID = socialObj.accountId;
    keyObj.Account.SocialID = socialObj.socialId;
    keyObj.IsBlock = !this.authorActionFlag;

    this._userDetailService.blockUnblockAuthor(keyObj).subscribe((data) => {
      if (data.success)
      {
        this._snackBar.open('Action Completed Successfully', 'Ok', {
          duration: 1000
        });
      }
      else {
        this._snackBar.open('Error Occured', 'Close', {
          duration: 1000
        });
      }
    });
  }

  private constructAuthorObj(): any {
     this.postObj = this._mapLocobuzzEntity.mapMention(this.postObj);
     const { $type, socialId, name, screenname, channelGroup} = this.postObj.author;
     const author = {
       $type,
       SocialId: socialId,
       name,
       screenname,
       ChannelGroup: channelGroup
     };

     const BrandInfoObj = {
       BrandID: this.postObj.brandInfo.brandID,
       BrandName: this.postObj.brandInfo.brandName
     }

     const accountObj = this._mapLocobuzzEntity.mapAccountConfiguration(this.postObj);

     accountObj.BrandInformation = BrandInfoObj;


     const authorObj = {
         Author: author,
         BrandInfo: this.postObj.brandInfo,
         Account: accountObj
     };

     return authorObj;

  }

  markInfluencer(): void {
    this._postDetailService.postObj = this.postObj;
    this.dialog.open(PostMarkinfluencerComponent, {
      autoFocus: false,
      width: '650px',
    });
  }



}
