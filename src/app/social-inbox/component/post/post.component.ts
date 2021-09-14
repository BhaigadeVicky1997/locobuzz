import { TranslateData } from './../../../core/models/viewmodel/TranslateData';
import { EnrichViewComponent } from './../enrich-view/enrich-view.component';
import { PostAssigntoComponent } from './../post-assignto/post-assignto.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { locobuzzAnimations } from '@locobuzz/animations';
import { TicketStatus } from 'app/core/enums/ticketStatusEnum';
import {
  TicketClient,
} from './../../../core/interfaces/TicketClient';
import { ChannelGroup } from 'app/core/enums/ChannelGroup';
import { PostUserinfoComponent } from '../post-userinfo/post-userinfo.component';
import { ModalService } from './../../../shared/services/modal.service';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from 'app/social-inbox/services/main.service';
import { Priority } from 'app/core/enums/Priority';
import { Language } from './../../../app-data/post';

import { PostDetailComponent } from './../post-detail/post-detail.component';
import { CategoryFilterComponent } from './../category-filter/category-filter.component';


import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BaseMention } from 'app/core/models/mentions/locobuzz/BaseMention';
import { FilterService } from 'app/social-inbox/services/filter.service';
import { BrandList } from '../../../shared/components/filter/filter-models/brandlist.model';
import { PostDetailService } from 'app/social-inbox/services/post-detail.service';
import { ChannelType } from 'app/core/enums/ChannelType';
import { AccountService } from 'app/core/services/account.service';
import { AuthUser } from 'app/core/interfaces/User';
import {
  AllBrandsTicketsDTO,
  AllBrandsTicketsProfile,
  AllBrandsTicketsReply,
  AudioUrl,
  DocumentUrl,
  VideoUrl,
} from 'app/core/models/dbmodel/AllBrandsTicketsDTO';
import { SSREMode } from 'app/core/enums/ssreLogStatusEnum';
import { SsreIntent } from 'app/core/enums/ssreIntentEnum';
import { UserRoleEnum } from 'app/core/enums/userRoleEnum';
import { MediaEnum } from 'app/core/enums/MediaTypeEnum';
import * as moment from 'moment';
import { TicketsService } from 'app/social-inbox/services/tickets.service';
import { ActionTaken } from 'app/core/enums/ActionTakenEnum';
import { PostMarkinfluencerComponent } from '../post-markinfluencer/post-markinfluencer.component';
import { MimeTypes } from 'app/core/models/viewmodel/MimeTypes';
import { environment } from 'environments/environment';
import { LogStatus } from 'app/core/enums/LogStatus';
import { MaplocobuzzentitiesService } from 'app/core/services/maplocobuzzentities.service';
import { SSRELogStatus } from 'app/core/enums/SSRELogStatus';
import { take } from 'rxjs/operators';
import { MakerCheckerEnum } from 'app/core/enums/MakerCheckerEnum';
import { ReplyService } from 'app/social-inbox/services/reply.service';
import { CrmComponent } from '../crm/crm.component';

import {
  AlertDialogModel,
  AlertPopupComponent,
} from 'app/shared/components/alert-popup/alert-popup.component';
import { AttachTicketComponent } from '../attach-ticket/attach-ticket.component';
import {
  BulkMentionChecked,
  SocialHandle,
} from 'app/core/models/dbmodel/TicketReplyDTO';
import { BaseSocialAccountConfiguration } from 'app/core/models/accountconfigurations/BaseSocialAccountConfiguration';
import { MentionActions } from 'app/core/enums/MentionActions';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActionStatusEnum } from 'app/core/enums/ActionStatus';
import { CopyMoveComponent } from '../copy-move/copy-move.component';
import { VideoDialogComponent } from '../video-dialog/video-dialog.component';
import { NavigationService } from 'app/core/services/navigation.service';
import { PostSubscribeComponent } from '../post-subscribe/post-subscribe.component';
import { PostsType } from 'app/core/models/viewmodel/GenericFilter';
import { TabService } from 'app/core/services/tab.service';
import { FilterGroupService } from 'app/social-inbox/services/filter-group.service';
import { PostSignalR, Tab } from 'app/core/models/menu/Menu';
import { LocobuzzmentionService } from 'app/core/services/locobuzzmention.service';
import { PostActionType } from 'app/core/enums/PostActionType';
// import { PostSubscribeComponent, NewSrComponent } from '..';
// import { MdePopoverModule } from '@material-extended/mde';
import { ReplyInputParams } from 'app/core/models/viewmodel/ReplyInputParams';
import { SubSink } from 'subsink';
import { TicketsignalrService } from 'app/core/services/signalrservices/ticketsignalr.service';
import { TicketSignalEnum } from 'app/core/enums/TicketSignalEnum';
import { CrmType } from 'app/core/enums/crmEnum';
import { CrmService } from 'app/social-inbox/services/crm.service';
import { BandhanRequest } from 'app/core/models/crm/BandhanRequest';
import { FedralRequest } from 'app/core/models/crm/FedralRequest';
import { TitanRequest } from 'app/core/models/crm/TitanRequest';
import { MagmaRequest } from 'app/core/models/crm/MagmaRequest';
import { Sentiment } from 'app/core/enums/Sentiment';
import { NewSrComponent } from '../new-sr/new-sr.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  animations: locobuzzAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent implements OnInit, OnDestroy {
  ren: any;
  prevButtonTrigger: any;
  constructor(
    public dialog: MatDialog,
    private _bottomSheet: MatBottomSheet,
    private _postService: MainService,
    private _modalService: ModalService,
    private _filterService: FilterService,
    private _postDetailService: PostDetailService,
    private accountService: AccountService,
    private _ticketService: TicketsService,
    private _snackBar: MatSnackBar,
    private MapLocobuzz: MaplocobuzzentitiesService,
    private _replyService: ReplyService,
    private _navigationService: NavigationService,
    private _tabService: TabService,
    private _filterGroupService: FilterGroupService,
    private _locobuzzMentionService: LocobuzzmentionService,
    private _ticketSignalrService: TicketsignalrService,
    // public _MdePopover: MdePopoverModule,
    private _crmService: CrmService
  ) { }
  public get channelGroupEnum(): typeof ChannelGroup {
    return ChannelGroup;
  }
  public get getMentionAction(): typeof MentionActions {
    return MentionActions;
  }
  @Input() postData: BaseMention;
  @Input() pageType: PostsType;
  @Input() fromCall: number;
  @Input() AllCheckBoxes = false;
  @Input() openReply ? = false;
  @Output() postSelectEvent = new EventEmitter<any>();

  @ViewChild('clickTicketMenuTrigger') clickTicketMenuTrigger: MatMenuTrigger;
  @ViewChildren('checkboxes') checkboxes: QueryList<ElementRef>;
  post: TicketClient;
  imgPath: string = 'assets/social-mention/post/';
  brandImg: string = 'brand-logo.png';
  crmClass: string;
  priorityClass: string;
  statusClass: string;
  ticketPriority: string;
  userpostLink?: string;
  currentUser: AuthUser;
  brandList: BrandList[];
  currentBrand: BrandList;
  Object = Object;
  ticketHistoryData: AllBrandsTicketsDTO;
  MediaUrl: string;
  objBrandSocialAcount: BaseSocialAccountConfiguration[];
  handleNames?: SocialHandle[] = [];
  selectedHandle?: SocialHandle = {};
  mentionAction: number;
  mentionActionFlag: boolean;
  translatedData: TranslateData;
  // crm selected country code
  selected = '+91';
  showTranslated = false;
  translatedText = '';
  translateFrom: string;
  translateTo: string = 'Unknow';
  translateToForm: string = 'Unknow';
  languages = Language;
  isTranslateError = false;
  replyInputParams: ReplyInputParams = {};
  @Output() postActionClicked = new EventEmitter<any>();
  subs = new SubSink();
  // video

  videoIcon = false;
  postReplyBlock = false;
  enteredButton = false;
  isMatMenuOpen = false;
  isMatMenu2Open = false;

  ngOnInit(): void {
    console.log('post called');
    // console.log(this.postData)
    this.MediaUrl = environment.MediaUrl;
    this.translateToForm = 'en';

    this.accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.currentUser = user));
    console.log(this.postData);
    this.setOpenPostLink(this.postData);
    this.mapPostByChannel();
    this.togglePostfootClasses();

    if (this.post) {
      this.ticketHistoryData = {};
      this.ticketHistoryData.ticketClient = this.post;
      this.ticketHistoryData.deleteSocialEnabled = this.currentUser.data.user.actionButton.deleteSocialEnabled;
    }

    if (this.fromCall === 2) {
      this.setConditionsFromCommunicationLog();
    }

    this._postDetailService.postObj = this.postData;
    this.mapwithRespectiveObject(this.postData);
    this.subs.add(
      this._replyService.closeReplyBox.subscribe((obj) => {
        this.postReplyBlock = obj;
      })
    );
    this.subs.add(
      this._ticketSignalrService.postSignalCall.subscribe((postSignalObj) => {
        if (
          postSignalObj &&
          postSignalObj.ticketId &&
          this.postData.ticketInfo.ticketID === postSignalObj.ticketId
        ) {
          this.executeSignalCall(postSignalObj);
        }
      })
    );
    if (this.openReply)
    {
      if(this.postData.ticketInfo.status === TicketStatus.Open)
      {
        this.replyPost();
      }
      
    }
  }

  public get getSentiment(): typeof Sentiment {
    return Sentiment;
  }

  executeSignalCall(signalObj: PostSignalR): void {
    if (signalObj.signalId === TicketSignalEnum.TicketNoteAdd) {
      this.post.note = signalObj.message.Note;
    }
  }

  openCategoryDialog(event): void {
    this.postData.categoryMapText = null;
    this._postDetailService.postObj = this.postData;
    this._postDetailService.isBulk = false;
    this._postDetailService.categoryType = event;
    this.dialog.open(CategoryFilterComponent, {
      width: '73vw',
      disableClose: false,
    });
  }

  replyPost(): void {
    this._postDetailService.postObj = this.postData;
    this._postDetailService.isBulk = false;
    // const replyPostRef = this._bottomSheet.open(PostReplyComponent, {
    //   ariaLabel: 'Reply',
    //   panelClass: 'post-reply__wrapper',
    //   backdropClass: 'no-blur',
    // });
    const currentreplyBox = this.postReplyBlock;
    this._replyService.closeReplyBox.next(false);
    this.replyInputParams = {};
    this._replyService.checkReplyInputParams.next(this.replyInputParams);
    this.postReplyBlock = !currentreplyBox;
  }

  sendPostEmail(): void {
    this._postDetailService.postObj = this.postData;
    const currentreplyBox = this.postReplyBlock;
    this._replyService.closeReplyBox.next(false);

    this.replyInputParams = {};
    this.replyInputParams.onlySendMail = true;
    this.replyInputParams.postObj = this.postData;
    this._replyService.checkReplyInputParams.next(this.replyInputParams);
    this.postReplyBlock = !currentreplyBox;
  }

  attachTicket(): void {
    const replyPostRef = this._bottomSheet.open(AttachTicketComponent, {
      ariaLabel: 'Attach Ticket',
      panelClass: 'post-reply__wrapper',
      backdropClass: 'no-blur',
      data: { CurrentPost: this.postData },
    });
  }

  replyApproved(): void {
    const source = this.MapLocobuzz.mapMention(this.postData);
    const sourceobj = {
      Source: source,
      EscalationNote: '',
      ActionTaken: 0,
    };
    this._replyService.ReplyApproved(sourceobj).subscribe((data) => {
      console.log('reply approved successfull ', data);
      this._filterService.currentBrandSource.next(true);
      // this.dialogRef.close(true);
      this._snackBar.open('Reply Approved successfully', 'Ok', {
        duration: 2000,
      });
      // this.zone.run(() => {
    });
  }

  replyRejected(note?: string): void {
    if (note.trim()) {
      const source = this.MapLocobuzz.mapMention(this.postData);

      const rejectnote = {
        $type:
          'LocobuzzNG.Entities.Classes.CommunicationLog, LocobuzzNG.Entities',
        Note: note ? note : '',
      };

      const sourceObj = {
        Source: source,
        RejectNote: rejectnote,
        ActionTaken: ActionTaken.Locobuzz,
      };

      this._replyService.ReplyRejected(sourceObj).subscribe((data) => {
        console.log('reply reject successfull ', data);
        this._filterService.currentBrandSource.next(true);
        // this.dialogRef.close(true);
        this._snackBar.open('Reply Rejected successfully', 'Ok', {
          duration: 2000,
        });
        // this.zone.run(() => {
      });
    } else {
      this._snackBar.open('Note required ', 'Ok', {
        duration: 2000,
      });
    }
  }

  replyModified(): void {
    this._postDetailService.postObj = this.postData;
    this._postDetailService.isBulk = false;
    // const replyPostRef = this._bottomSheet.open(PostReplyComponent, {
    //   ariaLabel: 'Reply',
    //   panelClass: 'post-reply__wrapper',
    //   backdropClass: 'no-blur',
    //   data: { makerchticketId: +this.postData.ticketInfo.ticketID },
    // });
    this.replyInputParams = {};
    this.replyInputParams.makerchticketId = +this.postData.ticketInfo.ticketID;
    this.replyInputParams.postObj = this.postData;
    this._replyService.checkReplyInputParams.next(this.replyInputParams);
    this.postReplyBlock = !this.postReplyBlock;
  }

  replyEscalate(): void {
    this._postDetailService.postObj = this.postData;
    this._postDetailService.isBulk = false;
    // const replyPostRef = this._bottomSheet.open(PostReplyComponent, {
    //   ariaLabel: 'Reply',
    //   panelClass: 'post-reply__wrapper',
    //   backdropClass: 'no-blur',
    //   data: { onlyEscalation: true },
    // });
    this.replyInputParams = {};
    this.replyInputParams.postObj = this.postData;
    this.replyInputParams.onlyEscalation = true;
    this._replyService.checkReplyInputParams.next(this.replyInputParams);
    this.postReplyBlock = !this.postReplyBlock;
  }

  ssreLiveRightVerified(): void {
    const source = this.MapLocobuzz.mapMention(this.postData);
    source.ticketInfoSsre.ssreMode = SSREMode.Live;
    source.ticketInfoSsre.ssreIntent = SsreIntent.Right;
    this._replyService.SSRELiveRightVerified(source).subscribe((data) => {
      console.log('reply approved successfull ', data);
      this._filterService.currentBrandSource.next(true);
      this.ticketHistoryData.isSSREVerified = true;
      // this.dialogRef.close(true);
      this._snackBar.open('Reply Approved successfully', 'Ok', {
        duration: 2000,
      });
      // this.zone.run(() => {
    });
  }

  ssreLiveWrongKeep(): void {
    const source = this.MapLocobuzz.mapMention(this.postData);
    source.ticketInfoSsre.ssreMode = SSREMode.Live;
    source.ticketInfoSsre.ssreIntent = SsreIntent.Wrong;

    const keyObj = {
      Source: source,
      ActionTaken: ActionTaken.SSRE,
    };
    this._replyService.ssreLiveWrongKeep(keyObj).subscribe((data) => {
      console.log('reply approved successfull ', data);
      this._filterService.currentBrandSource.next(true);
      // this.dialogRef.close(true);
      this._snackBar.open('Reply Approved successfully', 'Ok', {
        duration: 2000,
      });
      // this.zone.run(() => {
    });
  }

  ssreLiveWrongDelete(): void {
    const source = this.MapLocobuzz.mapMention(this.postData);
    source.ticketInfoSsre.ssreMode = SSREMode.Live;
    source.ticketInfoSsre.ssreIntent = SsreIntent.Wrong;
    source.socialID = source.ticketInfoSsre.ssreReply.replyresponseid;
    const keyObj = {
      Source: source,
      AccountId: 0,
      AccountSocialId: source.ticketInfoSsre.ssreReply.authorid,
      ActionTaken: ActionTaken.SSRE,
    };
    this._replyService.ssreLiveWrongDelete(keyObj).subscribe((data) => {
      console.log('reply approved successfull ', data);
      this._filterService.currentBrandSource.next(true);
      // this.dialogRef.close(true);
      this._snackBar.open('Reply Approved successfully', 'Ok', {
        duration: 2000,
      });
      // this.zone.run(() => {
    });
  }

  openUserProfile(tabIndex?: number): void {
    this._postDetailService.postObj = this.postData;
    this._postDetailService.currentPostObject.next(
      this.postData.ticketInfo.ticketID
    );
    const sideModalConfig = this._modalService.getSideModalConfig('saved-tabs');
    this.dialog.open(PostUserinfoComponent, {
      ...sideModalConfig,
      width: '360px',
      data: tabIndex,
      autoFocus: false,
    });
  }

  openTicketDetail(event): void {
    this._postDetailService.postObj = this.postData;
    this._postDetailService.pagetype = this.pageType;
    this._postDetailService.ticketOpenDetail = this.postData;
    this._postDetailService.currentPostObject.next(
      this.postData.ticketInfo.ticketID
    );
    console.log(this._postDetailService.postObj);
    this.dialog.open(PostDetailComponent, {
      disableClose: true,
      autoFocus: false,
      panelClass: ['full-screen-modal'],
    });
  }

  openTicketDetailInNewTab(): void {
    this._postDetailService.postObj = this.postData;
    this._postDetailService.ticketOpenDetail = this.postData;
    this._postDetailService.refreshNewTab = false;
    this._postDetailService.openInNewTab = true;
    this._postDetailService.currentPostObject.next(
      this.postData.ticketInfo.ticketID
    );
    const tab: Tab = {};
    tab.tabName = this.postData.author.name;
    const filterObj = this._filterService.getGenericFilter();
    const brands = [];
    brands.push(this.postData.brandInfo);
    filterObj.brands = brands;
    filterObj.simpleSearch = String(this.postData.ticketInfo.ticketID);
    filterObj.postsType = PostsType.TicketHistory;
    tab.tabDescription = `Ticket Detail - ${this.postData.ticketInfo.ticketID}`;
    tab.Filters = filterObj;
    this._filterGroupService.saveNewTab(tab).subscribe((response) => {
      if (response.success) {
        this._tabService.OpenNewTab(response.tab);
      }
    });
  }

  openEnrichView(): void {
    this._postDetailService.postObj = this.postData;
    this.dialog.open(EnrichViewComponent, {
      disableClose: true,
      autoFocus: false,
      panelClass: ['full-screen-modal', 'overflow-hidden']
    });
  }

  private mapPostByChannel(): void {
    // console.log(this.postData);
    const assignToname = this._filterService.getNameByID(
      this.postData.ticketInfo.assignedTo,
      this._filterService.fetchedAssignTo
    );

    let ticketCategory = '';
    let mentionCategory = '';
    let ticketcatcolor = null;
    let mentioncatcolor = null;
    if (this.postData.ticketInfo.ticketCategoryMap != null) {
      ticketCategory = this.postData.ticketInfo.ticketCategoryMap[0].name
        ? this.postData.ticketInfo.ticketCategoryMap[0].name
        : '';
      if (ticketCategory)
        {
            ticketcatcolor = this.postData.ticketInfo.ticketCategoryMap[0].sentiment;
        }
    }
    if (this.postData.categoryMap != null) {
      mentionCategory = this.postData.categoryMap[0].name
        ? this.postData.categoryMap[0].name
        : '';
      if (mentionCategory)
        {
            mentioncatcolor = this.postData.categoryMap[0].sentiment;
        }
    }

    // const ticketCategory = this.postData.ticketInfo.ticketCategoryMap[0].name;
    // const mentionCategory =  this.postData.categoryMap[0].name;

    this.post = {
      brandName: this.postData.brandInfo.brandName,
      brandLogo: this.getBrandLogo(this.postData.brandInfo.brandID),
      channelName: this.MapChannelType(this.postData),
      channelImage: this._locobuzzMentionService.getChannelIcon(this.postData),
      ticketId: this.postData.ticketInfo.ticketID,
      mentionCount: this.postData.ticketInfo.numberOfMentions,
      note: this.postData.ticketInfo.lastNote,
      assignTo: assignToname,
      ticketStatus: TicketStatus[this.postData.ticketInfo.status],
      ticketPriority: Priority[this.postData.ticketInfo.ticketPriority],
      ticketDescription: this.postData.description,
      ticketTime: this._ticketService.calculateTicketTimes(this.postData),
      ticketCategory: {
        ticketUpperCategory: this.postData.ticketInfo.ticketUpperCategory.name,
        mentionUpperCategory: this.postData.upperCategory.name,
      },
      Userinfo: {
        name: this.postData.author.name,
        image: this.postData.author.picUrl
          ? this.postData.author.picUrl
          : 'assets/images/agentimages/sample-image.jpg',
        screenName: this.postData.author.screenname,
        bio: this.postData.author.bio,
        followers: this.postData.author.followersCount,
        following: this.postData.author.followingCount,
        location: this.postData.author.location,
        sentimentUpliftScore: this.postData.author.sentimentUpliftScore,
        npsScore: this.postData.author.nPS,
        isVerified: this.postData.author.isVerifed,
        socialid: this.postData.author.socialId,
      },
      ticketCategoryTop: ticketCategory,
      mentionCategoryTop: mentionCategory,
      ticketCatColor: ticketcatcolor,
      mentionCatColor: mentioncatcolor
    };

    this.ticketPriority = this.post.ticketPriority;

    // switch (this.postData.channelGroup) {
    //   case ChannelGroup.Twitter: {
    //     const PostData: TwitterMention = this.postData as TwitterMention;
    //     this.post.channelImage = 'twitter.svg';
    //     break;
    //   }
    //   case ChannelGroup.Facebook: {
    //     const PostData: FacebookMention = this.postData as FacebookMention;
    //     this.post.channelImage = 'facebook.svg';
    //     break;
    //   }
    //   case ChannelGroup.Instagram: {
    //     const PostData: InstagramMention = this.postData as InstagramMention;
    //     this.post.channelImage = 'instagram.svg';
    //     break;
    //   }
    //   case ChannelGroup.WhatsApp: {
    //     const PostData: WhatsAppMention = this.postData as WhatsAppMention;
    //     this.post.channelImage = 'whatsapp.svg';
    //     break;
    //   }
    //   case ChannelGroup.Email: {
    //     const PostData: EmailMention = this.postData as EmailMention;
    //     this.post.channelImage = 'twitter.svg';
    //     break;
    //   }
    //   case ChannelGroup.WebsiteChatBot: {
    //     const PostData: WebsiteChatbotMention = this
    //       .postData as WebsiteChatbotMention;
    //     this.post.channelImage = 'chatbot_whatsapp.svg';
    //     break;
    //   }
    //   case ChannelGroup.ECommerceWebsites: {
    //     this.post.channelImage = 'twitter.svg';
    //     break;
    //   }
    //   default: {
    //     this.post.channelImage = 'twitter.svg';
    //     break;
    //   }
    // }
  }

  private togglePostfootClasses(): void {
    const postdata = this._filterService.fetchedBrandData.find(
      (brand: BrandList) => +brand.brandID === this.postData.brandInfo.brandID
    );
    if (postdata) {
      if (postdata.crmActive) {
        if (this.postData.ticketInfoCrm.sRID !== null) {
          this.crmClass = 'colore__red';
          if (this.postData.ticketInfoCrm.isPartyID > 0) {
            this.crmClass = 'colore__yellow--dark';
          }
        }
      }
    }

    if (this.ticketPriority === 'Urgent') {
      this.priorityClass = 'colored__red--dark';
    } else if (this.ticketPriority === 'High') {
      this.priorityClass = 'colored__red';
    } else if (this.ticketPriority === 'Medium') {
      this.priorityClass = 'colored__yellow';
    } else if (this.ticketPriority === 'Low') {
      this.priorityClass = 'colored__grey';
    }

    if (this.post.ticketStatus === 'Open') {
      this.statusClass = 'colored__blue';
    } else if (
      this.post.ticketStatus === 'OnHoldAgent' ||
      this.post.ticketStatus === 'OnHoldCSD' ||
      this.post.ticketStatus === 'OnHoldBrand' ||
      this.post.ticketStatus === 'OnHoldBrandWithNewMention' ||
      this.post.ticketStatus === 'CustomerInfoAwaited'
    ) {
      this.statusClass = 'colored__red';
    }
  }
  private MapChannelType(obj: BaseMention): string {
    switch (obj.channelType) {
      case ChannelType.PublicTweets:
        return 'Public Tweets';
      case ChannelType.FBPageUser:
        return 'User Post';
      case ChannelType.FBPublic:
        return 'Public Post';
      case ChannelType.Twitterbrandmention:
        return 'Brand Mention';
      case ChannelType.FBComments:
        return 'Comments';
      case ChannelType.BrandTweets:
        return 'Brand Tweets';
      case ChannelType.DirectMessages:
        return 'Direct Messages';
      case ChannelType.Blogs:
        return 'Blogs';
      case ChannelType.DiscussionForums:
        return 'Discussion Forums';
      case ChannelType.News:
        return 'News';
      case ChannelType.TripAdvisor:
        return 'TripAdvisor';
      case ChannelType.FbMediaPosts:
        return 'Media Posts';
      case ChannelType.FBMediaComments:
        return 'Media Comments';
      case ChannelType.TeamBHPPosts:
        return 'Posts';
      case ChannelType.TeamBHPComments:
        return 'Comments';
      case ChannelType.TeamBHPOtherPostsComments:
        return 'Other Posts Comments';
      case ChannelType.ComplaintWebsites:
        return 'Complaint Websites';
      case ChannelType.YouTubePosts:
        return 'Posts';
      case ChannelType.YouTubeComments:
        return 'Comments';
      case ChannelType.InstagramPagePosts:
        return 'Page Posts';
      case ChannelType.InstagramUserPosts:
        return 'User Posts';
      case ChannelType.InstagramComments:
        return 'Comments';
      case ChannelType.InstagramPublicPosts:
        return 'Public Posts';
      case ChannelType.GooglePagePosts:
        return 'Page Posts';
      case ChannelType.GoogleUserPosts:
        return 'User Posts';
      case ChannelType.GooglePublicPosts:
        return 'Public Posts';
      case ChannelType.GoogleComments:
        return 'Comments';
      case ChannelType.CustomerCare:
        return 'CustomerCare';
      case ChannelType.Expedia:
        return 'Expedia';
      case ChannelType.Booking:
        return 'Booking';
      case ChannelType.ReviewWebsiteComments:
        return 'Posts';
      case ChannelType.ReviewWebsitePosts:
        return 'Comments';
      case ChannelType.ECommercePosts:
        return 'Posts';
      case ChannelType.ECommerceComments:
        return 'Comments';
      case ChannelType.HolidayIQReview:
        return 'HolidayIQ Review';
      case ChannelType.HolidayIQReview:
        return 'HolidayIQ Review';
      case ChannelType.ZomatoComment:
        return 'Comments';
      case ChannelType.ZomatoPost:
        return 'Posts';
      case ChannelType.FBMessages:
        return 'Messages';
      case ChannelType.Videos:
        return 'Videos';
      case ChannelType.GooglePlayStore:
        return 'PlayStore';
      case ChannelType.LinkedInPageUser:
        return 'Page User';
      case ChannelType.LinkedInPublic:
        return 'Public';
      case ChannelType.LinkedInComments:
        return 'Comments';
      case ChannelType.LinkedInMediaPosts:
        return 'MediaPosts';
      case ChannelType.LinkedInMediaComments:
        return 'Comments';
      case ChannelType.LinkedinMessage:
        return 'Message';
      case ChannelType.FBReviews:
        return 'Reviews';
      case ChannelType.AutomotiveIndiaPost:
        return 'AutomotiveIndia Post';
      case ChannelType.AutomotiveIndiaComment:
        return 'AutomotiveIndia Comment';
      case ChannelType.AutomotiveIndiaOtherPostsComments:
        return 'AutomotiveIndia Other Posts Comments';
      case ChannelType.MakeMyTrip:
        return 'Make My Trip';
      case ChannelType.Email:
        return 'Email';
      case ChannelType.GoogleMyReview:
        return 'GMB Reviews';
      case ChannelType.ElectronicMedia:
        return 'Electronic Media';
      case ChannelType.GMBQuestion:
        return 'GMB Questions';
      case ChannelType.GMBAnswers:
        return 'GMB Answers';
      case ChannelType.WhatsApp:
        return 'WhatsApp';
      case ChannelType.FacebookChatbot:
        return 'Facebook Chatbot';
      case ChannelType.WesiteChatbot:
        return 'Website Chatbot';
      case ChannelType.AndroidChatbot:
        return 'Android Chatbot';
      case ChannelType.IOSChatbot:
        return 'IOS Chatbot';
      case ChannelType.LineChatbot:
        return 'Line Chatbot';
      case ChannelType.WhatsAppChatbot:
        return 'WhatsApp Chatbot';

      default:
        return ChannelType[obj.channelType];
    }
  }

  private mapwithRespectiveObject(mention: BaseMention): void {
    const ActionButton = this.currentUser.data.user.actionButton;
    this.ticketHistoryData.isCSDUser = false;
    this.ticketHistoryData.isBrandUser = false;
    this.ticketHistoryData.SLACounterStartInSecond = 0;
    this.ticketHistoryData.timetobreach = '';
    this.ticketHistoryData.alreadybreached = false;
    this.ticketHistoryData.typeOfShowTimeInSecond = 0;
    this.ticketHistoryData.iSEnableShowTimeInSecond = 0;
    this.ticketHistoryData.isBrandUser = false;
    this.ticketHistoryData.isReadOnlySupervisor = false;
    this.ticketHistoryData.isBrandWorkFlowEnabled = false;
    this.ticketHistoryData.isCSDApprove = false;
    this.ticketHistoryData.isCSDReject = false;
    this.ticketHistoryData.isemailattachement = false;
    this.ticketHistoryData.isAssignVisible = false;
    this.ticketHistoryData.isDirectCloseVisible = false;
    this.ticketHistoryData.isReplyVisible = false;
    this.ticketHistoryData.isAttachTicketVisible = false;
    this.ticketHistoryData.isCreateTicketVisible = false;
    this.ticketHistoryData.isEscalateVisible = false;
    this.ticketHistoryData.isTranslationVisible = false;
    this.ticketHistoryData.isEnableReplyApprovalWorkFlow = false;
    this.ticketHistoryData.isEnableDisableMakercheckerVisible = false;
    this.ticketHistoryData.isMarkInfluencerVisible = false;
    this.ticketHistoryData.isSendEmailVisible = false;
    this.ticketHistoryData.isApproveRejectMakerChecker = false;
    this.ticketHistoryData.isLiveSSRE = false;
    this.ticketHistoryData.isSSREVerified = false;
    this.ticketHistoryData.isSimulationSSRE = false;
    this.ticketHistoryData.isMakerCheckerPreview = false;
    this.ticketHistoryData.MakerCheckerPreview = {
      messageContent: '',
      actionPerformed: '',
    };
    this.ticketHistoryData.isSSREPreview = false;
    this.ticketHistoryData.SSREPreview = {
      messageContent: '',
      actionPerformed: '',
    };
    this.ticketHistoryData.isTrendsVisible = false;
    this.ticketHistoryData.isCopyMoveVisible = false;
    this.ticketHistoryData.isDeleteFromLocobuzz = false;
    this.ticketHistoryData.isDeleteFromChannel = false;
    this.ticketHistoryData.isworkflowApproveVisible = false;
    this.ticketHistoryData.isworkflowRejectVisible = false;

    this.brandList = this._filterService.fetchedBrandData;
    this.ticketHistoryData.isSSREEnabled = false;
    this.ticketHistoryData.isbreached = false;
    this.ticketHistoryData.isabouttobreach = false;
    this.ticketHistoryData.isBrandWorkFlow = false;
    this.ticketHistoryData.isTicketCategoryTagEnable = false;
    this.ticketHistoryData.isemailattachement = false;
    this.ticketHistoryData.ssretype = '';
    this.ticketHistoryData.tomaillist = '';
    this.ticketHistoryData.ismentionidVisible = false;
    this.ticketHistoryData.mentionid = '';
    this.ticketHistoryData.showTicketWindow = false;
    this.ticketHistoryData.showMarkactionable = false;
    this.ticketHistoryData.sendmailallmention = false;
    this.ticketHistoryData.setpriority = false;
    this.ticketHistoryData.isrejectedNote = false;
    this.ticketHistoryData.crmmobilenopopup = false;
    this.ticketHistoryData.crmcreatereqpop = false;

    this.ticketHistoryData.actionButton = this.currentUser.data.user.actionButton;
    if (this.brandList) {
      const currentBrandObj = this.brandList.filter((obj) => {
        return +obj.brandID === +mention.brandInfo.brandID;
      });
      this.currentBrand =
        currentBrandObj[0] !== null ? currentBrandObj[0] : undefined;

      if (this.currentBrand) {
        if (this.currentBrand.isBrandworkFlowEnabled) {
          this.ticketHistoryData.isBrandWorkFlowEnabled = true;
          this.ticketHistoryData.isBrandWorkFlow = true;
        }
        if (this.currentBrand.isCSDApprove) {
          this.ticketHistoryData.isCSDApprove = true;
        }
        if (this.currentBrand.isCSDReject) {
          this.ticketHistoryData.isCSDReject = true;
        }
        if (this.currentBrand.isTicketCategoryTagEnable) {
          this.ticketHistoryData.isTicketCategoryTagEnable = true;
        }
        if (this.currentBrand.isEnableReplyApprovalWorkFlow) {
          this.ticketHistoryData.isEnableReplyApprovalWorkFlow = true;
        }
        if (this.currentBrand.isSSREEnable) {
          this.ticketHistoryData.isSSREEnabled = this.currentBrand.isSSREEnable;
        }

        if (this.currentBrand.isSLAFLRBreachEnable) {
          this.ticketHistoryData.SLACounterStartInSecond = this.currentBrand.slaCounterStartInSecond;
          this.ticketHistoryData.typeOfShowTimeInSecond = this.currentBrand.typeOfShowTimeInSecond;
          if (this.currentBrand.isEnableShowTimeInSecond) {
            this.ticketHistoryData.iSEnableShowTimeInSecond = 1;
          } else {
            this.ticketHistoryData.iSEnableShowTimeInSecond = 0;
          }
          if (
            +this.currentUser.data.user.role === UserRoleEnum.AGENT ||
            +this.currentUser.data.user.role === UserRoleEnum.SupervisorAgent ||
            +this.currentUser.data.user.role === UserRoleEnum.TeamLead
          ) {
            if (
              mention.ticketInfo.status === TicketStatus.Open ||
              mention.ticketInfo.status === TicketStatus.PendingwithAgent ||
              mention.ticketInfo.status === TicketStatus.CustomerInfoAwaited ||
              mention.ticketInfo.status === TicketStatus.PendingWithBrand ||
              mention.ticketInfo.status === TicketStatus.PendingwithCSD ||
              mention.ticketInfo.status ===
              TicketStatus.RejectedByBrandWithNewMention ||
              mention.ticketInfo.status === TicketStatus.RejectedByBrand ||
              mention.ticketInfo.status === TicketStatus.ApprovedByBrand ||
              mention.ticketInfo.status ===
              TicketStatus.PendingwithCSDWithNewMention ||
              mention.ticketInfo.status === TicketStatus.OnHoldAgent ||
              mention.ticketInfo.status === TicketStatus.OnHoldBrand ||
              mention.ticketInfo.status === TicketStatus.OnHoldCSD
            ) {
              if (
                mention.ticketInfo.flrtatSeconds == null ||
                mention.ticketInfo.flrtatSeconds <= 0
              ) {
                if (mention.ticketInfo.tattime > 0) {
                  this.ticketHistoryData.isbreached = true;
                } else if (mention.ticketInfo.tattime <= 0) {
                  /*&& item.TATTIME >= -SLAMinutes*/
                  this.ticketHistoryData.isabouttobreach = true;

                  setInterval(() => {
                    this.abouttobreachtimeleft(mention);
                  }, 1000);
                }
              }
            }
          }
        }
      }

      if (+this.currentUser.data.user.role === UserRoleEnum.CustomerCare) {
        this.ticketHistoryData.isCSDUser = true;
      } else if (
        +this.currentUser.data.user.role === UserRoleEnum.BrandAccount
      ) {
        this.ticketHistoryData.isBrandUser = true;
      } else if (
        +this.currentUser.data.user.role ===
        UserRoleEnum.ReadOnlySupervisorAgent
      ) {
        this.ticketHistoryData.isReadOnlySupervisor = true;
      }

      if (this.ticketHistoryData.isCSDUser) {
        if (
          this.pageType === PostsType.Tickets &&
          mention.ticketInfo.status !== TicketStatus.Close &&
          mention.ticketInfo.status !== TicketStatus.OnHoldCSD &&
          mention.ticketInfoSsre.ssreStatus !==
          SSRELogStatus.SSREInProcessing &&
          mention.ticketInfoSsre.ssreStatus !==
          SSRELogStatus.IntentFoundStillInProgress
        ) {
          this.ticketHistoryData.isAssignVisible = true;
          if (this.ticketHistoryData.isBrandWorkFlowEnabled) {
            if (this.ticketHistoryData.isCSDApprove) {
              this.ticketHistoryData.isworkflowApproveVisible = true;
            }
            if (this.ticketHistoryData.isCSDReject) {
              this.ticketHistoryData.isworkflowRejectVisible = true;
            }
            this.ticketHistoryData.isEscalateVisible = true;
          } else {
            this.ticketHistoryData.isworkflowApproveVisible = true;
            this.ticketHistoryData.isworkflowRejectVisible = true;
          }
        }
      } else if (this.ticketHistoryData.isBrandUser) {
        if (mention.ticketInfo.status !== TicketStatus.Close) {
          if (
            mention.ticketInfo.status !== TicketStatus.ApprovedByBrand &&
            mention.ticketInfo.status !== TicketStatus.RejectedByBrand
          ) {
            this.ticketHistoryData.isworkflowApproveVisible = true;
            if (this.ticketHistoryData.isBrandWorkFlowEnabled) {
              this.ticketHistoryData.isworkflowRejectVisible = true;
            }
          }
        }

        if (
          mention.ticketInfo.status !== TicketStatus.Close &&
          mention.ticketInfoSsre.ssreStatus !==
          SSRELogStatus.SSREInProcessing &&
          mention.ticketInfoSsre.ssreStatus !==
          SSRELogStatus.IntentFoundStillInProgress
        ) {
          if (mention.ticketInfo.status !== TicketStatus.ApprovedByBrand) {
            if (!this.ticketHistoryData.isReadOnlySupervisor) {
              if (
                +this.currentUser.data.user.role === UserRoleEnum.AGENT &&
                mention.makerCheckerMetadata.workflowStatus ===
                LogStatus.ReplySentForApproval
              ) {
              } else {
                this.ticketHistoryData.isDirectCloseVisible = true;
              }
            }
          }
        }
      } else {
        if (
          mention.ticketInfo.status !== TicketStatus.Close &&
          mention.ticketInfo.status !== TicketStatus.OnHoldCSD &&
          mention.ticketInfoSsre.ssreStatus !==
          SSRELogStatus.SSREInProcessing &&
          mention.ticketInfoSsre.ssreStatus !==
          SSRELogStatus.IntentFoundStillInProgress
        ) {
          if (
            this.pageType === PostsType.Tickets &&
            !this.ticketHistoryData.isReadOnlySupervisor &&
            this.currentUser.data.user.role !== UserRoleEnum.AGENT
          ) {
            this.ticketHistoryData.isAssignVisible = true;
          }
        }
        if (
          mention.ticketInfo.status !== TicketStatus.Close &&
          mention.ticketInfo.status !== TicketStatus.PendingwithCSD &&
          mention.ticketInfo.status !== TicketStatus.PendingWithBrand &&
          mention.ticketInfo.status !==
          TicketStatus.PendingwithCSDWithNewMention &&
          mention.ticketInfo.status !== TicketStatus.OnHoldCSD &&
          mention.ticketInfo.status !== TicketStatus.OnHoldCSDWithNewMention &&
          mention.ticketInfo.status !==
          TicketStatus.PendingWithBrandWithNewMention &&
          mention.ticketInfo.status !== TicketStatus.OnHoldBrand &&
          mention.ticketInfo.status !== TicketStatus.RejectedByBrand &&
          mention.ticketInfo.status !==
          TicketStatus.RejectedByBrandWithNewMention &&
          mention.ticketInfo.status !==
          TicketStatus.OnHoldBrandWithNewMention &&
          mention.ticketInfoSsre.ssreStatus !==
          SSRELogStatus.SSREInProcessing &&
          mention.ticketInfoSsre.ssreStatus !==
          SSRELogStatus.IntentFoundStillInProgress
        ) {
          if (!this.ticketHistoryData.isReadOnlySupervisor) {
            if (
              +this.currentUser.data.user.role === UserRoleEnum.AGENT &&
              mention.makerCheckerMetadata.workflowStatus ===
              LogStatus.ReplySentForApproval
            ) {
            } else {
              this.ticketHistoryData.isDirectCloseVisible = true;
            }
          }
        }
      }

      if (
        !this.ticketHistoryData.isCSDUser &&
        !this.ticketHistoryData.isBrandUser
      ) {
        if (
          mention.ticketInfo.status ===
          TicketStatus.PendingwithCSDWithNewMention ||
          mention.ticketInfo.status === TicketStatus.OnHoldCSDWithNewMention ||
          mention.ticketInfo.status ===
          TicketStatus.PendingWithBrandWithNewMention ||
          mention.ticketInfo.status ===
          TicketStatus.RejectedByBrandWithNewMention ||
          mention.ticketInfo.status === TicketStatus.OnHoldBrandWithNewMention
        ) {
          this.ticketHistoryData.isReplyVisible = true;
          this.ticketHistoryData.isCreateTicketVisible = true;
        } else if (
          mention.ticketInfo.status !== TicketStatus.PendingwithCSD &&
          mention.ticketInfo.status !== TicketStatus.PendingWithBrand &&
          mention.ticketInfo.status !== TicketStatus.OnHoldCSD &&
          mention.ticketInfo.status !== TicketStatus.OnHoldBrand
        ) {
          if (
            mention.ticketInfo.status === TicketStatus.RejectedByBrand &&
            this.ticketHistoryData.isBrandWorkFlowEnabled
          ) {
          } else {
            if (
              mention.channelGroup === ChannelGroup.Facebook ||
              mention.channelGroup === ChannelGroup.Twitter ||
              mention.channelGroup === ChannelGroup.Instagram ||
              mention.channelGroup === ChannelGroup.LinkedIn ||
              mention.channelGroup === ChannelGroup.GooglePlayStore ||
              mention.channelGroup === ChannelGroup.Youtube ||
              mention.channelGroup === ChannelGroup.Email ||
              mention.channelGroup === ChannelGroup.GoogleMyReview ||
              mention.channelGroup === ChannelGroup.WhatsApp ||
              mention.channelGroup === ChannelGroup.WebsiteChatBot
            ) {
              if (mention.isDeletedFromSocial) {
                this.ticketHistoryData.isReplyVisible = false;
              } else {
                this.ticketHistoryData.isReplyVisible = true;
              }
              this.ticketHistoryData.isAttachTicketVisible = true;
              this.ticketHistoryData.isCreateTicketVisible = true;
            }

            this.ticketHistoryData.isEscalateVisible = true;
          }
        }
      } else if (this.ticketHistoryData.isCSDUser) {
        if (this.ticketHistoryData.isBrandWorkFlowEnabled) {
          if (this.ticketHistoryData.isCSDApprove) {
            // <option value;='7' data - id;='7'> Approve < /option>;
          }
          if (this.ticketHistoryData.isCSDReject) {
            // <option value;='8' data - id;='8'> Reject < /option>;

          }
          this.ticketHistoryData.isEscalateVisible = true;
          // <option value;='10' data - id;='10'> Escalate < /option>;
        } else {
          // <option value="7" data-id="7">Approve</option>
          // <option value="8" data-id="8">Reject</option>
        }
      } else {
        this.ticketHistoryData.isReplyVisible = true;
      }

      if (this.ticketHistoryData.isReadOnlySupervisor) {
        this.ticketHistoryData.isReplyVisible = false;
        this.ticketHistoryData.isAttachTicketVisible = false;
        this.ticketHistoryData.isEscalateVisible = false;
      } else {
        if (
          mention.ticketInfo.status === TicketStatus.Close ||
          (+this.currentUser.data.user.role === UserRoleEnum.CustomerCare &&
            mention.ticketInfo.status === TicketStatus.ApprovedByBrand) ||
          (+this.currentUser.data.user.role === UserRoleEnum.BrandAccount &&
            (mention.ticketInfo.status === TicketStatus.ApprovedByBrand ||
              mention.ticketInfo.status === TicketStatus.RejectedByBrand))
        ) {
          this.ticketHistoryData.isReplyVisible = false;
          this.ticketHistoryData.isAttachTicketVisible = false;
          this.ticketHistoryData.isEscalateVisible = false;
        } else {
          if (
            +this.currentUser.data.user.role === UserRoleEnum.AGENT ||
            +this.currentUser.data.user.role === UserRoleEnum.SupervisorAgent ||
            +this.currentUser.data.user.role === UserRoleEnum.TeamLead
          ) {
            if (
              mention.ticketInfo.status !== TicketStatus.PendingwithCSD &&
              mention.ticketInfo.status !== TicketStatus.PendingWithBrand &&
              mention.ticketInfo.status !== TicketStatus.RejectedByBrand &&
              mention.ticketInfo.status !== TicketStatus.OnHoldCSD &&
              mention.ticketInfo.status !== TicketStatus.OnHoldBrand
            ) {
            } else {
              if (
                !this.ticketHistoryData.isBrandWorkFlowEnabled &&
                mention.ticketInfo.status === TicketStatus.RejectedByBrand
              ) {
              } else {
                this.ticketHistoryData.isReplyVisible = false;
                this.ticketHistoryData.isAttachTicketVisible = false;
                this.ticketHistoryData.isEscalateVisible = false;
              }
            }
          } else if (
            +this.currentUser.data.user.role === UserRoleEnum.CustomerCare
          ) {
            if (
              mention.ticketInfo.status === TicketStatus.PendingWithBrand ||
              mention.ticketInfo.status ===
              TicketStatus.PendingWithBrandWithNewMention ||
              mention.ticketInfo.status ===
              TicketStatus.OnHoldBrandWithNewMention ||
              mention.ticketInfo.status === TicketStatus.OnHoldBrand ||
              mention.ticketInfo.status === TicketStatus.PendingwithAgent ||
              mention.ticketInfo.status === TicketStatus.Rejected ||
              mention.ticketInfo.status === TicketStatus.ApprovedByBrand ||
              mention.ticketInfo.status === TicketStatus.Open ||
              mention.ticketInfo.status === TicketStatus.OnHoldAgent ||
              mention.ticketInfo.status === TicketStatus.CustomerInfoAwaited
            ) {
              this.ticketHistoryData.isReplyVisible = false;
              this.ticketHistoryData.isAttachTicketVisible = false;
              this.ticketHistoryData.isEscalateVisible = false;
            } else {
            }
          } else if (
            +this.currentUser.data.user.role === UserRoleEnum.BrandAccount
          ) {
            if (
              mention.ticketInfo.status === TicketStatus.ApprovedByBrand ||
              mention.ticketInfo.status === TicketStatus.RejectedByBrand ||
              mention.ticketInfo.status ===
              TicketStatus.RejectedByBrandWithNewMention ||
              mention.ticketInfo.status === TicketStatus.PendingwithCSD ||
              mention.ticketInfo.status === TicketStatus.Open ||
              mention.ticketInfo.status === TicketStatus.OnHoldAgent ||
              mention.ticketInfo.status === TicketStatus.OnHoldCSD ||
              mention.ticketInfo.status === TicketStatus.CustomerInfoAwaited ||
              mention.ticketInfo.status === TicketStatus.PendingwithAgent ||
              mention.ticketInfo.status === TicketStatus.Rejected ||
              mention.ticketInfo.status ===
              TicketStatus.OnHoldCSDWithNewMention ||
              mention.ticketInfo.status ===
              TicketStatus.PendingwithCSDWithNewMention
            ) {
              this.ticketHistoryData.isReplyVisible = false;
              this.ticketHistoryData.isAttachTicketVisible = false;
              this.ticketHistoryData.isEscalateVisible = false;
            } else {
            }
          }

          if (!mention.isActionable) {
            this.ticketHistoryData.isReplyVisible = false;
            this.ticketHistoryData.isAttachTicketVisible = false;
            this.ticketHistoryData.isEscalateVisible = false;
          }
        }
      }

      if (mention.description && mention.description.length > 0) {
        this.ticketHistoryData.isTranslationVisible = true;
      } else if (
        mention.channelGroup === ChannelGroup.WhatsApp &&
        mention.title.length > 0
      ) {
        this.ticketHistoryData.isTranslationVisible = true;
      }

      if (
        this.ticketHistoryData.isEnableReplyApprovalWorkFlow &&
        mention.ticketInfo.status !== TicketStatus.Close &&
        mention.ticketInfoSsre.ssreStatus !== SSRELogStatus.SSREInProcessing &&
        mention.ticketInfoSsre.ssreStatus !==
        SSRELogStatus.IntentFoundStillInProgress
      ) {
        if (
          (+this.currentUser.data.user.role === UserRoleEnum.AGENT ||
            +this.currentUser.data.user.role === UserRoleEnum.SupervisorAgent ||
            +this.currentUser.data.user.role === UserRoleEnum.TeamLead) &&
          mention.makerCheckerMetadata.workflowStatus !==
          LogStatus.ReplySentForApproval
        ) {
          this.ticketHistoryData.isEnableDisableMakercheckerVisible = true;
          if (!mention.ticketInfo.ticketAgentWorkFlowEnabled) {
            this.ticketHistoryData.isTicketAgentWorkFlowEnabled = true;
          } else {
            this.ticketHistoryData.isTicketAgentWorkFlowEnabled = false;
          }
        }
      }

      if (
        mention.channelGroup === ChannelGroup.Twitter ||
        mention.channelGroup === ChannelGroup.Facebook ||
        mention.channelGroup === ChannelGroup.Instagram ||
        mention.channelGroup === ChannelGroup.Youtube ||
        mention.channelGroup === ChannelGroup.WhatsApp
      ) {
        if (!this.ticketHistoryData.isReadOnlySupervisor) {
          this.ticketHistoryData.isMarkInfluencerVisible = true;
        }
      }

      if (
        !this.ticketHistoryData.isReadOnlySupervisor &&
        mention.ticketInfoSsre.ssreStatus !== SSRELogStatus.SSREInProcessing &&
        mention.ticketInfoSsre.ssreStatus !==
        SSRELogStatus.IntentFoundStillInProgress
      ) {
        this.ticketHistoryData.isSendEmailVisible = true;
      }

      if (
        (+this.currentUser.data.user.role === UserRoleEnum.TeamLead ||
          +this.currentUser.data.user.role === UserRoleEnum.SupervisorAgent) &&
        mention.makerCheckerMetadata.workflowStatus ===
        LogStatus.ReplySentForApproval
      ) {
        this.ticketHistoryData.isApproveRejectMakerChecker = true;
      }

      if (
        +this.currentUser.data.user.role !== UserRoleEnum.CustomerCare &&
        +this.currentUser.data.user.role !== UserRoleEnum.BrandAccount &&
        mention.makerCheckerMetadata.workflowStatus ===
        LogStatus.ReplySentForApproval
      ) {
        this.ticketHistoryData.isMakerCheckerPreview = true;

        if (+mention.makerCheckerMetadata.workflowStatus !== 0) {
          // this.ticketHistoryData.MakerCheckerPreview.workflowstatusnotzero = true;
          if (
            mention.makerCheckerMetadata.workflowStatus ===
            LogStatus.ReplySentForApproval &&
            !mention.replyScheduledDateTime
          ) {
            if (mention.isPrivateMessage && mention.isSendFeedback) {
              this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                '<span class="colored__locobuzz">' +
                mention.ticketInfo.replyUserName +
                '</span> wants to   <span class="colored__red">send a private message</span> along with a feedback form to the customer with following text.';
            } else if (mention.isPrivateMessage) {
              this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                '<span class="colored__locobuzz">' +
                mention.ticketInfo.replyUserName +
                '</span> wants to   <span class="colored__red">send a private message</span> to the customer with following text.';
            } else if (mention.isSendFeedback) {
              let action = '';
              switch (mention.ticketInfo.makerCheckerStatus) {
                case MakerCheckerEnum.ReplyClose:
                  action = 'Reply and Close';
                  break;
                case MakerCheckerEnum.ReplyEscalate:
                  action = 'Reply and Escalate';
                  break;
                case MakerCheckerEnum.ReplyAwaitingResponse:
                  action = 'Reply Awaiting Response';
                  break;
                default:
                  action = 'Reply';
                  break;
              }
              this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                '<span class="colored__locobuzz">' +
                mention.ticketInfo.replyUserName +
                '</span> wants to   <span class="colored__red">send a feedback form</span> to the customer after performing <b>' +
                action +
                '</b> action.';
            } else {
              switch (mention.ticketInfo.makerCheckerStatus) {
                case MakerCheckerEnum.DirectClose:
                  this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                    '<span class="colored__locobuzz">' +
                    mention.ticketInfo.replyUserName +
                    '</span> wants to   <span class="colored__red">directly close</span> this ticket.';
                  break;
                case MakerCheckerEnum.Escalate:
                  if (mention.replyEscalatedToUsername) {
                    this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                      '<span class="colored__locobuzz">' +
                      mention.ticketInfo.replyUserName +
                      '</span> wants to   <span class="colored__red">escalate</span> this ticket to <b> ' +
                      mention.replyEscalatedToUsername +
                      '</b>.';
                  } else if (
                    mention.makerCheckerMetadata &&
                    mention.makerCheckerMetadata.replyEscalatedTeamName
                  ) {
                    this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                      '<span class="colored__locobuzz">' +
                      mention.ticketInfo.replyUserName +
                      '</span> wants to   <span class="colored__red">escalate</span> this ticket to <b> ' +
                      mention.makerCheckerMetadata.replyEscalatedTeamName +
                      '</b>.';
                  } else {
                    this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                      '<span class="colored__locobuzz">' +
                      mention.ticketInfo.replyUserName +
                      '</span> wants to   <span class="colored__red">escalate</span> this ticket';
                  }
                  break;
                case MakerCheckerEnum.OnHoldAgent:
                  this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                    '<span class="colored__locFFobuzz">The above ticket was kept on hold by ' +
                    mention.ticketInfo.replyUserName;
                  break;
                case MakerCheckerEnum.CustomerInfoAwaited:
                  this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                    '<span class="colored__locobuzz">' +
                    mention.ticketInfo.replyUserName +
                    '</span> needs more information from customer';
                  break;
                case MakerCheckerEnum.Close:
                  this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                    '<span class="colored__locobuzz">' +
                    mention.ticketInfo.replyUserName +
                    '</span> wants to   <span class="colored__red">close</span> this ticket';
                  break;
                case MakerCheckerEnum.ReplyClose:
                  this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                    '<span class="colored__locobuzz">' +
                    mention.ticketInfo.replyUserName +
                    '</span> wants to   <span class="colored__red">close</span> this ticket and reply to the customer with following message';
                  break;
                case MakerCheckerEnum.ReplyEscalate:
                  if (mention.replyEscalatedToUsername) {
                    this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                      '<span class="colored__locobuzz">' +
                      mention.ticketInfo.replyUserName +
                      '</span> wants to   <span class="colored__red">escalate</span> this ticket to <b> ' +
                      mention.replyEscalatedToUsername +
                      '</b> and <b>reply</b> to the customer with following message';
                  } else if (
                    mention.makerCheckerMetadata &&
                    mention.makerCheckerMetadata.replyEscalatedTeamName
                  ) {
                    this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                      '<span class="colored__locobuzz">' +
                      mention.ticketInfo.replyUserName +
                      '</span> wants to   <span class="colored__red">escalate</span> this ticket to <b> ' +
                      mention.makerCheckerMetadata.replyEscalatedTeamName +
                      '</b> and <b>reply</b> to the customer with following message';
                  } else {
                    this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                      '<span class="colored__locobuzz">' +
                      mention.ticketInfo.replyUserName +
                      '</span> wants to   <span class="colored__red">escalate</span> this ticket';
                  }
                  break;
                case MakerCheckerEnum.ReplyHold:
                  this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                    '<span class="colored__locobuzz">' +
                    mention.ticketInfo.replyUserName +
                    '</span> wants to put the ticket <span class="colored__red">on hold</span> and <b>reply</b> to the customer with following message';
                  break;
                case MakerCheckerEnum.ReplyAwaitingResponse:
                  this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                    '<span class="colored__locobuzz">As more imformation is needed </span> from the customer <span class="colored__red">' +
                    mention.ticketInfo.replyUserName +
                    '</span> wants to send the following <b>reply</b>';
                  break;
                case MakerCheckerEnum.CaseAttach:
                  if (mention.mentionsAttachToCaseid) {
                    const totalmention = mention.mentionsAttachToCaseid.split(
                      ','
                    );
                    this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                      '<span class="colored__locobuzz">' +
                      mention.ticketInfo.replyUserName +
                      '</span> wants to <span class="colored__red">attach ' +
                      totalmention.length +
                      ' mentions to the following</span> <b>closed</b> ticket <b>' +
                      mention.attachToCaseid +
                      '</b>';
                  } else {
                    this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                      '<span class="colored__locobuzz">' +
                      mention.ticketInfo.replyUserName +
                      '</span> wants to <span class="colored__red">attach the ticket to the  following</span> <b>closed</b> ticket <b>' +
                      mention.attachToCaseid +
                      '</b>';
                  }
                  break;
                default:
                  this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                    '<span class="colored__locobuzz"> Following Reply Text written by ' +
                    mention.ticketInfo.replyUserName +
                    '</span>';
                  break;
              }
            }

            if (
              mention.ticketInfo.makerCheckerStatus !==
              MakerCheckerEnum.OnHoldAgent &&
              mention.ticketInfo.makerCheckerStatus !==
              MakerCheckerEnum.Close &&
              mention.ticketInfo.makerCheckerStatus !==
              MakerCheckerEnum.CustomerInfoAwaited &&
              mention.ticketInfo.makerCheckerStatus !==
              MakerCheckerEnum.DirectClose
            ) {
              if (
                mention.ticketInfo.escalationMessage &&
                (+this.currentUser.data.user.role ===
                  UserRoleEnum.CustomerCare ||
                  +this.currentUser.data.user.role ===
                  UserRoleEnum.BrandAccount)
              ) {
                this.ticketHistoryData.MakerCheckerPreview.messageContent =
                  mention.ticketInfo.escalationMessage;
              } else if (
                mention.makerCheckerMetadata &&
                mention.makerCheckerMetadata.replyMakerCheckerMessage
              ) {
                this.ticketHistoryData.MakerCheckerPreview.messageContent =
                  mention.makerCheckerMetadata.replyMakerCheckerMessage;
              }

              this.approvalSectionMedia(mention);
            }
          } else if (
            mention.makerCheckerMetadata.workflowStatus ===
            LogStatus.ReplySentForApproval &&
            mention.replyScheduledDateTime
          ) {
            if (mention.isPrivateMessage && mention.isSendFeedback) {
              this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                '<span class="colored__locobuzz">' +
                mention.ticketInfo.replyUserName +
                '</span> wants to   <span class="colored__red">send a private message</span> along with a feedback form to the customer with following text.';
            } else if (mention.isPrivateMessage) {
              this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                '<span class="colored__locobuzz">' +
                mention.ticketInfo.replyUserName +
                '</span> wants to   <span class="colored__red">send a private message</span> to the customer with following text.';
            } else if (mention.isSendFeedback) {
              let action = '';
              switch (mention.ticketInfo.makerCheckerStatus) {
                case MakerCheckerEnum.ReplyClose:
                  action = 'Reply and Close';
                  break;
                case MakerCheckerEnum.ReplyEscalate:
                  action = 'Reply and Escalate';
                  break;
                case MakerCheckerEnum.ReplyAwaitingResponse:
                  action = 'Reply Awaiting Response';
                  break;
                default:
                  action = 'Reply';
                  break;
              }
              this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                '<span class="colored__locobuzz">' +
                mention.ticketInfo.replyUserName +
                '</span> wants to   <span class="colored__red">send a feedback form</span> to the customer after performing <b>' +
                action +
                '</b> action.';
            } else {
              switch (mention.ticketInfo.makerCheckerStatus) {
                case MakerCheckerEnum.DirectClose:
                  this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                    '<span class="colored__locobuzz">' +
                    mention.ticketInfo.replyUserName +
                    '</span> wants to   <span class="colored__red">directly close</span> this ticket.';
                  break;
                case MakerCheckerEnum.Escalate:
                  if (mention.replyEscalatedToUsername) {
                    this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                      '<span class="colored__locobuzz">' +
                      mention.ticketInfo.replyUserName +
                      '</span> wants to   <span class="colored__red">escalate</span> this ticket to <b> ' +
                      mention.replyEscalatedToUsername +
                      '</b>.';
                  } else if (
                    mention.makerCheckerMetadata &&
                    mention.makerCheckerMetadata.replyEscalatedTeamName
                  ) {
                    this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                      '<span class="colored__locobuzz">' +
                      mention.ticketInfo.replyUserName +
                      '</span> wants to   <span class="colored__red">escalate</span> this ticket to <b> ' +
                      mention.makerCheckerMetadata.replyEscalatedTeamName +
                      '</b>.';
                  } else {
                    this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                      '<span class="colored__locobuzz">' +
                      mention.ticketInfo.replyUserName +
                      '</span> wants to   <span class="colored__red">escalate</span> this ticket';
                  }
                  break;
                case MakerCheckerEnum.OnHoldAgent:
                  this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                    '<span class="colored__locFFobuzz">The above ticket was kept on hold by ' +
                    mention.ticketInfo.replyUserName;
                  break;
                case MakerCheckerEnum.CustomerInfoAwaited:
                  this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                    '<span class="colored__locobuzz">' +
                    mention.ticketInfo.replyUserName +
                    '</span> needs more information from customer';
                  break;
                case MakerCheckerEnum.Close:
                  this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                    '<span class="colored__locobuzz">' +
                    mention.ticketInfo.replyUserName +
                    '</span> wants to   <span class="colored__red">close</span> this ticket';
                  break;
                case MakerCheckerEnum.ReplyClose:
                  this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                    '<span class="colored__locobuzz">' +
                    mention.ticketInfo.replyUserName +
                    '</span> wants to   <span class="colored__red">close</span> this ticket and reply to the customer with following message';
                  break;
                case MakerCheckerEnum.ReplyEscalate:
                  if (mention.replyEscalatedToUsername) {
                    this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                      '<span class="colored__locobuzz">' +
                      mention.ticketInfo.replyUserName +
                      '</span> wants to   <span class="colored__red">escalate</span> this ticket to <b> ' +
                      mention.replyEscalatedToUsername +
                      '</b> and <b>reply</b> to the customer with following message';
                  } else if (
                    mention.makerCheckerMetadata &&
                    mention.makerCheckerMetadata.replyEscalatedTeamName
                  ) {
                    this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                      '<span class="colored__locobuzz">' +
                      mention.ticketInfo.replyUserName +
                      '</span> wants to   <span class="colored__red">escalate</span> this ticket to <b> ' +
                      mention.makerCheckerMetadata.replyEscalatedTeamName +
                      '</b> and <b>reply</b> to the customer with following message';
                  } else {
                    this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                      '<span class="colored__locobuzz">' +
                      mention.ticketInfo.replyUserName +
                      '</span> wants to   <span class="colored__red">escalate</span> this ticket';
                  }
                  break;
                case MakerCheckerEnum.ReplyHold:
                  this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                    '<span class="colored__locobuzz">' +
                    mention.ticketInfo.replyUserName +
                    '</span> wants to put the ticket <span class="colored__red">on hold</span> and <b>reply</b> to the customer with following message';
                  break;
                case MakerCheckerEnum.ReplyAwaitingResponse:
                  this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                    '<span class="colored__locobuzz">As more imformation is needed </span> from the customer <span class="colored__red">' +
                    mention.ticketInfo.replyUserName +
                    '</span> wants to send the following <b>reply</b>';
                  break;
                case MakerCheckerEnum.CaseAttach:
                  if (mention.mentionsAttachToCaseid) {
                    const totalmention = mention.mentionsAttachToCaseid.split(
                      ','
                    );
                    this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                      '<span class="colored__locobuzz">' +
                      mention.ticketInfo.replyUserName +
                      '</span> wants to <span class="colored__red">attach ' +
                      totalmention.length +
                      ' mentions to the following</span> <b>closed</b> ticket <b>' +
                      mention.attachToCaseid +
                      '</b>';
                  } else {
                    this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                      '<span class="colored__locobuzz">' +
                      mention.ticketInfo.replyUserName +
                      '</span> wants to <span class="colored__red">attach the ticket to the  following</span> <b>closed</b> ticket <b>' +
                      mention.attachToCaseid +
                      '</b>';
                  }
                  break;
                default:
                  this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                    '<span class="colored__locobuzz"> Following Reply Text written by ' +
                    mention.ticketInfo.replyUserName +
                    '</span>';
                  break;
              }
            }

            // <span class="post__body--noteheaditem">
            //                                 Scheduled Reply on :
            //                                 <span data-repyscheduledatetimeepoch="@LocoBuzzHelper.ToUnixTime(item.ReplyScheduledDateTime.Value)"
            // class="text__locobuzz RepyScheduleDateTimeEpoch"></span>
            //                                 <span data-repyscheduledurationepoch="@LocoBuzzHelper.ToUnixTime(item.ReplyScheduledDateTime.Value)"
            // class="text__red RepyScheduleDurationEpoch"></span>
            //                             </span>

            if (
              mention.ticketInfo.makerCheckerStatus !==
              MakerCheckerEnum.OnHoldAgent &&
              mention.ticketInfo.makerCheckerStatus !==
              MakerCheckerEnum.Close &&
              mention.ticketInfo.makerCheckerStatus !==
              MakerCheckerEnum.CustomerInfoAwaited
            ) {
              if (
                mention.ticketInfo.escalationMessage &&
                (+this.currentUser.data.user.role ===
                  UserRoleEnum.CustomerCare ||
                  +this.currentUser.data.user.role ===
                  UserRoleEnum.BrandAccount)
              ) {
                this.ticketHistoryData.MakerCheckerPreview.messageContent =
                  mention.ticketInfo.escalationMessage;
              } else if (
                mention.makerCheckerMetadata &&
                mention.makerCheckerMetadata.replyMakerCheckerMessage
              ) {
                this.ticketHistoryData.MakerCheckerPreview.messageContent =
                  mention.makerCheckerMetadata.replyMakerCheckerMessage;
              }
              this.approvalSectionMedia(mention);
            }
          } else if (
            +mention.makerCheckerMetadata.workflowStatus ===
            LogStatus.ReplyScheduled &&
            mention.replyScheduledDateTime != null &&
            mention.ticketInfo.status === TicketStatus.Open
          ) {
            if (mention.isPrivateMessage && mention.isSendFeedback) {
              this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                '<span class="colored__locobuzz">' +
                mention.ticketInfo.replyUserName +
                '</span> wants to   <span class="colored__red">send a private message</span> along with a feedback form to the customer with following text.';
            } else if (mention.isPrivateMessage) {
              this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                '<span class="colored__locobuzz">' +
                mention.ticketInfo.replyUserName +
                '</span> wants to   <span class="colored__red">send a private message</span> to the customer with following text.';
            } else if (mention.isSendFeedback) {
              let action = '';
              switch (mention.ticketInfo.makerCheckerStatus) {
                case MakerCheckerEnum.ReplyClose:
                  action = 'Reply and Close';
                  break;
                case MakerCheckerEnum.ReplyEscalate:
                  action = 'Reply and Escalate';
                  break;
                case MakerCheckerEnum.ReplyAwaitingResponse:
                  action = 'Reply Awaiting Response';
                  break;
                default:
                  action = 'Reply';
                  break;
              }
              this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                '<span class="colored__locobuzz">' +
                mention.ticketInfo.replyUserName +
                '</span> wants to   <span class="colored__red">send a feedback form</span> to the customer after performing <b>' +
                action +
                '</b> action.';
            } else {
              switch (mention.ticketInfo.makerCheckerStatus) {
                case MakerCheckerEnum.DirectClose:
                  this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                    '<span class="colored__locobuzz">' +
                    mention.ticketInfo.replyUserName +
                    '</span> wants to   <span class="colored__red">directly close</span> this ticket.';
                  break;
                case MakerCheckerEnum.Escalate:
                  if (mention.replyEscalatedToUsername) {
                    this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                      '<span class="colored__locobuzz">' +
                      mention.ticketInfo.replyUserName +
                      '</span> wants to   <span class="colored__red">escalate</span> this ticket to <b> ' +
                      mention.replyEscalatedToUsername +
                      '</b>.';
                  } else if (
                    mention.makerCheckerMetadata &&
                    mention.makerCheckerMetadata.replyEscalatedTeamName
                  ) {
                    this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                      '<span class="colored__locobuzz">' +
                      mention.ticketInfo.replyUserName +
                      '</span> wants to   <span class="colored__red">escalate</span> this ticket to <b> ' +
                      mention.makerCheckerMetadata.replyEscalatedTeamName +
                      '</b>.';
                  } else {
                    this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                      '<span class="colored__locobuzz">' +
                      mention.ticketInfo.replyUserName +
                      '</span> wants to   <span class="colored__red">escalate</span> this ticket';
                  }
                  break;
                case MakerCheckerEnum.OnHoldAgent:
                  this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                    '<span class="colored__locFFobuzz">The above ticket was kept on hold by ' +
                    mention.ticketInfo.replyUserName;
                  break;
                case MakerCheckerEnum.CustomerInfoAwaited:
                  this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                    '<span class="colored__locobuzz">' +
                    mention.ticketInfo.replyUserName +
                    '</span> needs more information from customer';
                  break;
                case MakerCheckerEnum.Close:
                  this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                    '<span class="colored__locobuzz">' +
                    mention.ticketInfo.replyUserName +
                    '</span> wants to   <span class="colored__red">close</span> this ticket';
                  break;
                case MakerCheckerEnum.ReplyClose:
                  this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                    '<span class="colored__locobuzz">' +
                    mention.ticketInfo.replyUserName +
                    '</span> wants to   <span class="colored__red">close</span> this ticket and reply to the customer with following message';
                  break;
                case MakerCheckerEnum.ReplyEscalate:
                  if (mention.replyEscalatedToUsername) {
                    this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                      '<span class="colored__locobuzz">' +
                      mention.ticketInfo.replyUserName +
                      '</span> wants to   <span class="colored__red">escalate</span> this ticket to <b> ' +
                      mention.replyEscalatedToUsername +
                      '</b> and <b>reply</b> to the customer with following message';
                  } else if (
                    mention.makerCheckerMetadata &&
                    mention.makerCheckerMetadata.replyEscalatedTeamName
                  ) {
                    this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                      '<span class="colored__locobuzz">' +
                      mention.ticketInfo.replyUserName +
                      '</span> wants to   <span class="colored__red">escalate</span> this ticket to <b> ' +
                      mention.makerCheckerMetadata.replyEscalatedTeamName +
                      '</b> and <b>reply</b> to the customer with following message';
                  } else {
                    this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                      '<span class="colored__locobuzz">' +
                      mention.ticketInfo.replyUserName +
                      '</span> wants to   <span class="colored__red">escalate</span> this ticket';
                  }
                  break;
                case MakerCheckerEnum.ReplyHold:
                  this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                    '<span class="colored__locobuzz">' +
                    mention.ticketInfo.replyUserName +
                    '</span> wants to put the ticket <span class="colored__red">on hold</span> and <b>reply</b> to the customer with following message';
                  break;
                case MakerCheckerEnum.ReplyAwaitingResponse:
                  this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                    '<span class="colored__locobuzz">As more imformation is needed </span> from the customer <span class="colored__red">' +
                    mention.ticketInfo.replyUserName +
                    '</span> wants to send the following <b>reply</b>';
                  break;
                case MakerCheckerEnum.CaseAttach:
                  if (mention.mentionsAttachToCaseid) {
                    const totalmention = mention.mentionsAttachToCaseid.split(
                      ','
                    );
                    this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                      '<span class="colored__locobuzz">' +
                      mention.ticketInfo.replyUserName +
                      '</span> wants to <span class="colored__red">attach ' +
                      totalmention.length +
                      ' mentions to the following</span> <b>closed</b> ticket <b>' +
                      mention.attachToCaseid +
                      '</b>';
                  } else {
                    this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                      '<span class="colored__locobuzz">' +
                      mention.ticketInfo.replyUserName +
                      '</span> wants to <span class="colored__red">attach the ticket to the  following</span> <b>closed</b> ticket <b>' +
                      mention.attachToCaseid +
                      '</b>';
                  }
                  break;
                default:
                  this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
                    '<span class="colored__locobuzz"> Following Reply Text written by ' +
                    mention.ticketInfo.replyUserName +
                    '</span>';
                  break;
              }
            }

            // <span class="post__body--noteheaditem">
            //                                 Scheduled Reply on :
            //                                 <span data-repyscheduledatetimeepoch="@LocoBuzzHelper.ToUnixTime(item.ReplyScheduledDateTime.Value)"
            // class="text__locobuzz RepyScheduleDateTimeEpoch"></span>
            //                                 <span data-repyscheduledurationepoch="@LocoBuzzHelper.ToUnixTime(item.ReplyScheduledDateTime.Value)"
            // class="text__red RepyScheduleDurationEpoch"></span>
            //                             </span>

            if (
              mention.ticketInfo.makerCheckerStatus !==
              MakerCheckerEnum.OnHoldAgent &&
              mention.ticketInfo.makerCheckerStatus !==
              MakerCheckerEnum.Close &&
              mention.ticketInfo.makerCheckerStatus !==
              MakerCheckerEnum.CustomerInfoAwaited
            ) {
              if (
                mention.ticketInfo.escalationMessage &&
                (+this.currentUser.data.user.role ===
                  UserRoleEnum.CustomerCare ||
                  +this.currentUser.data.user.role ===
                  UserRoleEnum.BrandAccount)
              ) {
                this.ticketHistoryData.MakerCheckerPreview.messageContent =
                  mention.ticketInfo.escalationMessage;
              } else if (
                mention.makerCheckerMetadata &&
                mention.makerCheckerMetadata.replyMakerCheckerMessage
              ) {
                this.ticketHistoryData.MakerCheckerPreview.messageContent =
                  mention.makerCheckerMetadata.replyMakerCheckerMessage;
              }

              this.approvalSectionMedia(mention);
            }
          }
        } else if (
          mention.ticketInfo.status === TicketStatus.Open &&
          mention.replyScheduledDateTime
        ) {
          this.ticketHistoryData.MakerCheckerPreview.actionPerformed =
            '<span class="colored__locobuzz"> Following Reply Text written by ' +
            mention.replyUserName +
            '</span>';

          // <span class="post__body--noteheaditem">
          //                                 Scheduled Reply on :
          //                                 <span data-repyscheduledatetimeepoch="@LocoBuzzHelper.ToUnixTime(item.ReplyScheduledDateTime.Value)"
          // class="text__locobuzz RepyScheduleDateTimeEpoch"></span>
          //                                 <span data-repyscheduledurationepoch="@LocoBuzzHelper.ToUnixTime(item.ReplyScheduledDateTime.Value)"
          // class="text__red RepyScheduleDurationEpoch"></span>
          //                             </span>

          if (
            mention.ticketInfo.makerCheckerStatus !==
            MakerCheckerEnum.OnHoldAgent &&
            mention.ticketInfo.makerCheckerStatus !== MakerCheckerEnum.Close &&
            mention.ticketInfo.makerCheckerStatus !==
            MakerCheckerEnum.CustomerInfoAwaited
          ) {
            if (
              mention.ticketInfo.escalationMessage &&
              (+this.currentUser.data.user.role === UserRoleEnum.CustomerCare ||
                +this.currentUser.data.user.role === UserRoleEnum.BrandAccount)
            ) {
              this.ticketHistoryData.MakerCheckerPreview.messageContent =
                mention.ticketInfo.escalationMessage;
            } else if (
              this.ticketHistoryData &&
              this.ticketHistoryData.LastNote
            ) {
              this.ticketHistoryData.MakerCheckerPreview.messageContent = this.ticketHistoryData.LastNote;
            }

            this.approvalSectionMedia(mention);
          }
        }
      } else if (
        this.ticketHistoryData.isSSREEnabled &&
        +this.currentUser.data.user.role !== UserRoleEnum.CustomerCare &&
        +this.currentUser.data.user.role !== UserRoleEnum.BrandAccount &&
        mention.isSSRE &&
        mention.tagID === mention.ticketInfoSsre.latestMentionActionedBySSRE &&
        (mention.ticketInfoSsre.ssreMode === SSREMode.Live ||
          mention.ticketInfoSsre.ssreMode === SSREMode.Simulation) &&
        mention.ticketInfoSsre.ssreIntent !== SsreIntent.Wrong &&
        (mention.ticketInfoSsre.ssreStatus === SSRELogStatus.Successful ||
          mention.ticketInfoSsre.ssreStatus ===
          SSRELogStatus.SSREMakerCheckerEnabled)
      ) {
        this.ticketHistoryData.isSSREPreview = true;
        let ssreclass = '';
        let ruleorintent = '';
        let ssretype = '';
        let ssreMode = '';
        if (mention.ticketInfoSsre.intentRuleType === 1) {
          ruleorintent = 'Intent';
        } else if (mention.ticketInfoSsre.intentRuleType === 2) {
          ruleorintent = 'Rule';
        }

        if (mention.ticketInfoSsre.ssreReplyType === 3) {
          ssretype = 'Replied and Escalated';
        } else if (mention.ticketInfoSsre.ssreReplyType === 2) {
          ssretype = 'Replied and Closed';
        } else if (mention.ticketInfoSsre.ssreReplyType === 5) {
          ssretype = 'Replied and is Awaiting response from customer';
        }
        if (mention.ticketInfoSsre.ssreIntent !== SsreIntent.Right) {
          ssreclass =
            mention.ticketInfoSsre.ssreMode === SSREMode.Simulation
              ? 'post__simulation'
              : 'post__live';
          ssreMode =
            mention.ticketInfoSsre.ssreMode === SSREMode.Simulation
              ? 'Simulation'
              : 'Live';
        }

        this.ticketHistoryData.SSREPreview.actionPerformed +=
          '<p class="post__note--title">';
        if (mention.ticketInfoSsre.ssreMode === SSREMode.Live) {
          this.ticketHistoryData.SSREPreview.actionPerformed +=
            '<span class="colored__locobuzz"> SSRE </span><b>' +
            ssretype +
            '</b> this ticket with <span class="colored__locobuzz"><b>' +
            mention.ticketInfoSsre.intentFriendlyName +
            '</b></span > ' +
            ruleorintent;
        } else if (mention.ticketInfoSsre.ssreMode === SSREMode.Simulation) {
          this.ticketHistoryData.SSREPreview.actionPerformed +=
            '<span class="colored__locobuzz"> SSRE has suggested </span><b>' +
            ssretype +
            '</b> this ticket with <span class="colored__locobuzz"><b>' +
            mention.ticketInfoSsre.intentFriendlyName +
            '</b></span > ' +
            ruleorintent;
        }

        if (mention.ticketInfoSsre.ssreIntent !== SsreIntent.Right) {
          this.ticketHistoryData.SSREPreview.actionPerformed +=
            '<span class="post__ribbon ' +
            ssreclass +
            '">SSRE ' +
            ssreMode +
            '</span>';
        }

        this.ticketHistoryData.SSREPreview.actionPerformed += '</p>';

        if (mention.ticketInfoSsre.ssreReply) {
          this.ticketHistoryData.SSREPreview.messageContent =
            mention.ticketInfoSsre.ssreReply.replymessage;
        }
      } else if (
        this.ticketHistoryData.isSSREEnabled &&
        +this.currentUser.data.user.role !== UserRoleEnum.CustomerCare &&
        +this.currentUser.data.user.role !== UserRoleEnum.CustomerCare &&
        (mention.ticketInfoSsre.ssreStatus === SSRELogStatus.SSREInProcessing ||
          mention.ticketInfoSsre.ssreStatus ===
          SSRELogStatus.IntentFoundStillInProgress) &&
        mention.ticketInfo.status !== TicketStatus.Close
      ) {
        this.ticketHistoryData.isSSREPreview = true;
        this.ticketHistoryData.SSREPreview.actionPerformed +=
          '<span class="colored__locobuzz"> SSRE is working on this ticket please wait ....</span>';
      }

      if (
        this.ticketHistoryData.isSSREEnabled &&
        +this.currentUser.data.user.role !== UserRoleEnum.CustomerCare &&
        +this.currentUser.data.user.role !== UserRoleEnum.BrandAccount &&
        mention.ticketInfoSsre.latestMentionActionedBySSRE &&
        mention.tagID === mention.ticketInfoSsre.latestMentionActionedBySSRE
      ) {
        if (
          mention.isSSRE &&
          mention.ticketInfoSsre.ssreMode === SSREMode.Live &&
          (mention.ticketInfoSsre.ssreStatus === SSRELogStatus.Successful ||
            mention.ticketInfoSsre.ssreStatus ===
            SSRELogStatus.SSREMakerCheckerEnabled)
        ) {
          const instapostType = mention.instagramPostType;

          if (mention.ticketInfoSsre.ssreIntent === SsreIntent.Right) {
            this.ticketHistoryData.isLiveSSRE = false;
            this.ticketHistoryData.isSSREVerified = true;
          } else if (
            mention.ticketInfoSsre.ssreIntent === SsreIntent.NoActionTaken &&
            mention.ticketInfoSsre.ssreStatus === SSRELogStatus.Successful
          ) {
            this.ticketHistoryData.isLiveSSRE = true;
          }
        } else if (
          mention.ticketInfoSsre.ssreMode === SSREMode.Simulation &&
          (mention.ticketInfoSsre.ssreStatus === SSRELogStatus.Successful ||
            mention.ticketInfoSsre.ssreStatus ===
            SSRELogStatus.SSREMakerCheckerEnabled)
        ) {
          if (mention.ticketInfoSsre.ssreIntent === SsreIntent.Right) {
            this.ticketHistoryData.isSSREVerified = true;
            this.ticketHistoryData.isSimulationSSRE = false;
          } else if (
            mention.ticketInfoSsre.ssreIntent === SsreIntent.NoActionTaken &&
            mention.ticketInfoSsre.ssreStatus === SSRELogStatus.Successful
          ) {
            this.ticketHistoryData.isSimulationSSRE = true;
          }
        }
      }
      if (this.pageType === PostsType.Mentions) {
        this.ticketHistoryData.ismentionidVisible = true;
        this.ticketHistoryData.mentionid =
          mention.brandInfo.brandID +
          '/' +
          mention.channelType +
          '/' +
          mention.contentID;
      }

      if (
        mention.channelGroup === ChannelGroup.Twitter ||
        mention.channelGroup === ChannelGroup.Facebook ||
        mention.channelGroup === ChannelGroup.Instagram ||
        mention.channelGroup === ChannelGroup.Youtube ||
        mention.channelGroup === ChannelGroup.WhatsApp
      ) {
        if (
          mention.channelType !== ChannelType.DirectMessages &&
          mention.channelType !== ChannelType.FBMessages &&
          mention.channelType !== ChannelType.YouTubeComments &&
          mention.channelType !== ChannelType.InstagramComments &&
          mention.channelType !== ChannelType.WhatsApp
        ) {
          if (this.pageType === PostsType.Mentions) {
            this.ticketHistoryData.isTrendsVisible = true;
          }
        }
      }

      if (
        this.pageType === PostsType.Mentions &&
        (mention.channelType === ChannelType.Blogs ||
          mention.channelType === ChannelType.ComplaintWebsites ||
          mention.channelType === ChannelType.DiscussionForums ||
          mention.channelType === ChannelType.News ||
          mention.channelType === ChannelType.Videos ||
          mention.channelType === ChannelType.PublicTweets ||
          mention.channelType === ChannelType.Twitterbrandmention ||
          mention.channelType === ChannelType.TripAdvisor ||
          mention.channelType === ChannelType.HolidayIQReview ||
          mention.channelType === ChannelType.Booking ||
          mention.channelGroup === ChannelGroup.AutomotiveIndia ||
          mention.channelGroup === ChannelGroup.TeamBHP ||
          mention.channelGroup === ChannelGroup.ECommerceWebsites) &&
        !mention.isBrandPost &&
        this.brandList.length > 1
      ) {
        this.ticketHistoryData.isCopyMoveVisible = true;
      }

      // if (ActionButton.DeleteLocobuzzEnabled) {
      // this.ticketHistoryData.isDeleteFromLocobuzz = true;
      // }

      if (
        (this.pageType === PostsType.Mentions && mention.channelType === 2) ||
        mention.channelType === 8 ||
        mention.channelType === 10 ||
        mention.channelType === 17 ||
        mention.channelType === 18 ||
        mention.channelType === 19 ||
        mention.channelType === 22
      ) {
        // if (ActionButton.DeleteSocialEnabled) {
        if (
          mention.channelType === ChannelType.YouTubeComments ||
          mention.channelType === ChannelType.YouTubePosts ||
          mention.channelType === ChannelType.InstagramComments
        ) {
          if (
            mention.channelType === ChannelType.InstagramComments &&
            mention.instagramPostType === 1
          ) {
            this.ticketHistoryData.isDeleteFromChannel = true;
          } else if (mention.isBrandPost) {
            this.ticketHistoryData.isDeleteFromChannel = true;
          }
        } else {
          this.ticketHistoryData.isDeleteFromChannel = true;
        }
        // }
      }

      if (+mention.inReplyToUserID === -3) {
        mention.ticketInfo.replyUserName = 'SSRE';
      }
    }

    if (this.pageType === PostsType.Tickets) {
      this.ticketHistoryData.showTicketWindow = true;
      this.ticketHistoryData.showMarkactionable = false;
    } else if (this.pageType === PostsType.Mentions) {
      if (mention.isActionable) {
        this.ticketHistoryData.showTicketWindow = true;
        this.ticketHistoryData.showMarkactionable = false;
      } else {
        this.ticketHistoryData.showMarkactionable = true;
        this.ticketHistoryData.sendmailallmention = true;
        this.ticketHistoryData.setpriority = true;
        this.ticketHistoryData.isabouttobreach = false;
        this.ticketHistoryData.isDeleteFromLocobuzz = true;
        this.ticketHistoryData.showTicketWindow = false;
        this.ticketHistoryData.isReplyVisible = false;
        this.ticketHistoryData.isAttachTicketVisible = false;
        this.ticketHistoryData.isEscalateVisible = false;
        this.ticketHistoryData.isCopyMoveVisible = false;
        this.ticketHistoryData.isDirectCloseVisible = false;
        this.ticketHistoryData.isSendEmailVisible = false;
        this.ticketHistoryData.isTranslationVisible = false;
      }
    }

    this.ticketHistoryData.ticketPriorityClassName = '';
    if (mention.ticketInfo.ticketPriority === Priority.High) {
      this.ticketHistoryData.ticketPriorityClassName = 'TicketPriority';
    } else {
      this.ticketHistoryData.ticketPriorityClassName = 'TicketNoPriority';
    }

    this.ticketHistoryData.channelTypeIcon = this.getChannelCustomeIcon(
      mention
    );

    const mentiondate = new Date(mention.mentionTime);
    this.ticketHistoryData.mentionTime = moment(mentiondate).format(
      'MM-dd-YYYY'
    ); // this.datepipe.transform(mentiondate, 'dd-MM-yyyy');

    this.ticketHistoryData.fbBrandfriendlyName =
      mention.brandInfo.brandFriendlyName;
    this.ticketHistoryData.fbPageName = mention.fbPageName;
    this.ticketHistoryData.GBMStoreCode = mention.storeCode;

    this.ticketHistoryData.intentssre = 0;
    if (
      mention.ticketInfoSsre.ssreMode === SSREMode.Simulation &&
      mention.ticketInfoSsre.ssreIntent === SsreIntent.NoActionTaken
    ) {
      this.ticketHistoryData.intentssre = SsreIntent.Right;
    } else {
      this.ticketHistoryData.intentssre = mention.ticketInfoSsre.ssreIntent;
    }

    this.ticketHistoryData.InstaAccountID = mention.instaAccountID;
    this.ticketHistoryData.Rating = 0;

    if (mention.isDeletedFromSocial) {
      // addDisableClass = "CheckboxDisable";
      this.ticketHistoryData.deletedMentionDisable = 'DeletedMentionDisable';
    }

    if (mention.ticketInfo.ticketID === 275379) {
      const a = '';
    }

    switch (mention.channelGroup) {
      case ChannelGroup.Twitter: {
        this.ticketHistoryData.screenName = mention.author.screenname;
        // console.log(authorObj.name);
        this.ticketHistoryData.profilepicurl = mention.author.picUrl;
        this.ticketHistoryData.isVerified = mention.author.isVerifed;
        this.ticketHistoryData.followersCount = mention.author.followersCount;
        this.ticketHistoryData.KloutScore = mention.author.kloutScore;
        this.ticketHistoryData.profileurl =
          'https://www.twitter.com/' + mention.author.screenname;
        break;
      }
      case ChannelGroup.Facebook: {
        this.ticketHistoryData.screenName = mention.author.name;
        this.ticketHistoryData.profilepicurl = mention.author.picUrl;
        this.ticketHistoryData.Rating = mention.rating;
        if (mention.author.socialId && mention.author.socialId !== '0') {
          this.ticketHistoryData.profileurl =
            'http://www.facebook.com/' + mention.author.socialId;
          if (!mention.author.picUrl) {
            this.ticketHistoryData.profilepicurl =
              'assets/images/agentimages/sample-image.jpg';
          }
        } else {
          this.ticketHistoryData.profilepicurl =
            'assets/images/agentimages/sample-image.jpg';
          this.ticketHistoryData.profileurl = undefined;
        }
        break;
      }
      case ChannelGroup.Instagram: {
        this.ticketHistoryData.screenName = mention.author.name;
        this.ticketHistoryData.profilepicurl = mention.author.picUrl;
        this.ticketHistoryData.profileurl = mention.author.profileUrl;
        if (mention.author.name && !mention.author.profileUrl) {
          this.ticketHistoryData.profileurl =
            'https://www.instagram.com/' + mention.author.name;
        }
        break;
      }
      case ChannelGroup.WhatsApp: {
        this.ticketHistoryData.screenName = mention.author.name;
        this.ticketHistoryData.profilepicurl =
          'assets/images/agentimages/sample-image.jpg';
        this.ticketHistoryData.profileurl = 'javascript:void(0)';
        break;
      }
      case ChannelGroup.WebsiteChatBot: {
        this.ticketHistoryData.screenName = mention.author.name;
        this.ticketHistoryData.profilepicurl = mention.author.picUrl;
        this.ticketHistoryData.profileurl = mention.author.profileUrl;
        break;
      }
      case ChannelGroup.Youtube: {
        this.ticketHistoryData.screenName = mention.author.name;
        this.ticketHistoryData.profilepicurl = mention.author.picUrl;
        this.ticketHistoryData.profileurl = mention.author.profileUrl;
        if (
          mention.author.socialId &&
          mention.author.socialId !== '0' &&
          !mention.author.profileUrl
        ) {
          this.ticketHistoryData.profileurl =
            'https://www.youtube.com/channel/' + mention.author.socialId;
        }
        break;
      }
      case ChannelGroup.LinkedIn: {
        this.ticketHistoryData.screenName = mention.author.name;
        this.ticketHistoryData.profilepicurl = mention.author.picUrl;
        this.ticketHistoryData.profileurl = mention.author.profileUrl;
        break;
      }
      case ChannelGroup.GoogleMyReview: {
        this.ticketHistoryData.screenName = mention.author.name;
        this.ticketHistoryData.Rating = mention.rating;
        this.ticketHistoryData.StoreCode = mention.storeCode;
        this.ticketHistoryData.profilepicurl = mention.author.picUrl;
        this.ticketHistoryData.profileurl = mention.author.profileUrl;
        break;
      }
      case ChannelGroup.GooglePlayStore: {
        this.ticketHistoryData.Rating = mention.rating;
        this.ticketHistoryData.appFriendlyName = mention.appFriendlyName;
        this.ticketHistoryData.screenName = mention.author.name;
        this.ticketHistoryData.profilepicurl = mention.author.picUrl;
        this.ticketHistoryData.profileurl = mention.author.profileUrl;
        break;
      }
      case ChannelGroup.Email: {
        this.ticketHistoryData.screenName = mention.author.socialId;
        break;
      }
      case ChannelGroup.AppStoreReviews: {
        this.ticketHistoryData.profilepicurl =
          'assets/images/agentimages/sample-image.jpg';
        this.ticketHistoryData.profileurl = 'javascript:void(0)';
        break;
      }
      default: {
        this.ticketHistoryData.screenName = mention.author.name;
        this.ticketHistoryData.profilepicurl = mention.author.picUrl;
        this.ticketHistoryData.profileurl = mention.author.profileUrl;
        break;
      }
    }

    if (
      mention.channelGroup === ChannelGroup.HolidayIQ ||
      mention.channelGroup === ChannelGroup.ECommerceWebsites ||
      mention.channelGroup === ChannelGroup.AppStoreReviews
    ) {
      this.ticketHistoryData.Rating = Math.round(mention.rating);
      if (this.ticketHistoryData.Rating > 0) {
        const HolidayRating = this.ticketHistoryData.Rating.toString();
        const result = HolidayRating.split('.');

        if (result[1] === '0') {
          this.ticketHistoryData.Rating = +result[0];
        }
      }
    }

    if (!this.ticketHistoryData.profilepicurl) {
      this.ticketHistoryData.profileurl =
        'assets/images/agentimages/sample-image.jpg';
    }

    if (
      mention.channelGroup === ChannelGroup.Twitter ||
      mention.channelGroup === ChannelGroup.Facebook ||
      mention.channelGroup === ChannelGroup.Instagram ||
      mention.channelGroup === ChannelGroup.Youtube ||
      mention.channelGroup === ChannelGroup.WhatsApp ||
      mention.channelGroup === ChannelGroup.LinkedIn ||
      mention.channelGroup === ChannelGroup.GoogleMyReview ||
      mention.channelGroup === ChannelGroup.WebsiteChatBot
    ) {
      this.ticketHistoryData.showEnrichment = true;
    } else {
      this.ticketHistoryData.showEnrichment = false;
    }

    this.ticketHistoryData.star_03Length = 0;
    this.ticketHistoryData.star_deselected_03 = 0;
    this.ticketHistoryData.NoRating = 5;

    if (
      mention.channelGroup === ChannelGroup.GooglePlayStore ||
      mention.channelType === ChannelType.FBReviews ||
      mention.channelGroup === ChannelGroup.ECommerceWebsites ||
      mention.channelGroup === ChannelGroup.AppStoreReviews
    ) {
      for (let i = 1; i <= this.ticketHistoryData.Rating; i++) {
        ++this.ticketHistoryData.star_03Length;
      }
      for (
        let i = 1;
        i <= this.ticketHistoryData.NoRating - this.ticketHistoryData.Rating;
        i++
      ) {
        ++this.ticketHistoryData.star_deselected_03;
      }
    } else if (mention.channelGroup === ChannelGroup.GoogleMyReview) {
      for (let i = 1; i <= this.ticketHistoryData.Rating; i++) {
        ++this.ticketHistoryData.star_03Length;
      }
      if (this.ticketHistoryData.Rating > 0) {
        for (
          let i = 1;
          i <= this.ticketHistoryData.NoRating - this.ticketHistoryData.Rating;
          i++
        ) {
          ++this.ticketHistoryData.star_deselected_03;
        }
      }
    }
    if (mention.channelGroup === ChannelGroup.HolidayIQ) {
      this.ticketHistoryData.Rating = this.ticketHistoryData.Rating / 7;
    }

    if (mention.channelGroup === ChannelGroup.Email) {
      let tomail = mention.toMailList.toString();
      if (!tomail) {
        tomail = mention.ccMailList.toString();
      }
      if (!tomail) {
        tomail = mention.bccMailList.toString();
      }
      this.ticketHistoryData.tomaillist =
        tomail.length <= 100 ? tomail : tomail.substring(0, 100) + '...';
      if (mention.title != null) {
        if (mention.title.length > 0) {
          if (mention.title.length > 70) {
            this.ticketHistoryData.title =
              mention.title.substring(0, 70) + '...';
          } else {
            this.ticketHistoryData.title = mention.title;
          }
        }
      }
    } else if (mention.channelGroup === ChannelGroup.ECommerceWebsites) {
      if (mention.title != null) {
        if (mention.title.length > 0) {
          if (mention.title.length > 70) {
            this.ticketHistoryData.title =
              mention.title.substring(0, 70) + '...';
          } else {
            this.ticketHistoryData.title = mention.title;
          }
        }
      }
    } else if (mention.channelGroup === ChannelGroup.WhatsApp) {
      if (mention.title != null) {
        if (
          mention.title.length > 0 &&
          (mention.attachmentMetadata.mediaContents === undefined ||
            mention.attachmentMetadata.mediaContents === null ||
            mention.attachmentMetadata.mediaContents.length === 0 ||
            (mention.mediaType !== MediaEnum.OTHER &&
              mention.mediaType !== MediaEnum.HTML &&
              mention.mediaType !== MediaEnum.PDF &&
              mention.mediaType !== MediaEnum.DOC &&
              mention.mediaType !== MediaEnum.EXCEL))
        ) {
          if (mention.title.length > 70) {
            this.ticketHistoryData.title =
              mention.title.substring(0, 70) + '...';
          } else {
            this.ticketHistoryData.title = mention.title;
          }
        }
      }
    } else if (mention.channelGroup === ChannelGroup.WebsiteChatBot) {
      if (mention.title != null) {
        if (mention.title.length > 0 && mention.mediaType === MediaEnum.TEXT) {
          let messagetext = '';
          // const error = '';
          if (mention.isBrandPost) {
            messagetext = mention.title;
            if (this.isJSON(messagetext)) {
              const data = JSON.parse(messagetext);
              // load the bot messages
              messagetext = JSON.stringify(data);
            }
          } else {
            messagetext = mention.title;
            this.ticketHistoryData.description = mention.title;
          }
        }
      }
    }
    if (mention.description != null) {
      if (mention.description.length > 0) {
        if (mention.description.length > 1200) {
          if (mention.channelType === ChannelType.Email) {
            this.getEmailHtmlData();
          } else if (
            mention.channelType !== ChannelType.DirectMessages &&
            mention.channelType !== ChannelType.FBMessages
          ) {
            this.ticketHistoryData.description = mention.description;
          } else {
            this.ticketHistoryData.description = mention.description;
          }
        } else {
          if (mention.channelType === ChannelType.Email) {
            this.getEmailHtmlData();
          } else {
            this.ticketHistoryData.description = mention.description;
          }
        }
      }
    }

    if (
      mention.makerCheckerMetadata.workflowStatus !==
      LogStatus.ReplySentForApproval &&
      mention.makerCheckerMetadata.workflowStatus !== LogStatus.ReplyScheduled
    ) {
      if (mention.channelGroup === ChannelGroup.Email) {
        if (
          mention.makerCheckerMetadata.workflowStatus ===
          LogStatus.ReplyRejected &&
          this.currentUser.data.user.role !== UserRoleEnum.CustomerCare &&
          this.currentUser.data.user.role !== UserRoleEnum.BrandAccount
        ) {
          this.ticketHistoryData.isrejectedNote = true;
        } else {
          this.ticketHistoryData.isrejectedNote = false;
        }
      } else {
        if (
          mention.makerCheckerMetadata.workflowStatus ===
          LogStatus.ReplyRejected &&
          this.currentUser.data.user.role !== UserRoleEnum.CustomerCare &&
          this.currentUser.data.user.role !== UserRoleEnum.BrandAccount
        ) {
          this.ticketHistoryData.isrejectedNote = true;
        } else {
          this.ticketHistoryData.isrejectedNote = false;
        }
      }
    }
    const postCRMdata = this._filterService.fetchedBrandData.find(
      (brand: BrandList) => +brand.brandID === this.postData.brandInfo.brandID
    );
    if (postCRMdata.crmActive) {
      if (postCRMdata.crmType === CrmType.Telecom &&
        (postCRMdata.crmClassName.toLowerCase() === 'jiocrm'
          && (mention.channelGroup === ChannelGroup.Facebook || mention.channelGroup === ChannelGroup.Twitter))) {
        // if (!string.IsNullOrEmpty(item.Partyid) && (long.Parse(item.Partyid) > 0 || item.IsPartyID > 0))
        // {
        //     if (!string.IsNullOrEmpty(item.SRID))
        //     {
        //         buttonColorClass = "have-sr";
        //     }
        //     else if (item.IsPartyID > 0)
        //     {
        //         buttonColorClass = "have-party";
        //     }
        // }


        // if (mention.IsPartyID > 0)
        // {
        //    // with mapid
        // }
        // else
        // {
        //    // without mapid
        // }

        // Show mobile number popup
        this.ticketHistoryData.crmmobilenopopup = true;
      }
      else if (postCRMdata.crmType === CrmType.NonTelecom &&
        (+this.currentUser.data.user.role !== UserRoleEnum.CustomerCare
          && this.currentUser.data.user.role !== UserRoleEnum.BrandAccount)
        &&
        (
          (postCRMdata.crmClassName.toLowerCase() === 'titancrm'
            && (mention.channelGroup === ChannelGroup.WhatsApp
              || mention.channelGroup === ChannelGroup.Facebook
              || mention.channelGroup === ChannelGroup.Twitter
              || mention.channelGroup === ChannelGroup.Instagram
              || mention.channelGroup === ChannelGroup.GoogleMyReview
              || mention.channelGroup === ChannelGroup.Youtube)) ||
          (postCRMdata.crmClassName.toLowerCase() === 'magmacrm') ||
          (postCRMdata.crmClassName.toLowerCase() === 'fedralcrm') ||
          (postCRMdata.crmClassName.toLowerCase() === 'bandhancrm'))) {
        // CRM Create Request Popup
        this.ticketHistoryData.crmcreatereqpop = true;
      }
    }

    // Media Content for twitter Channels

    this.ticketHistoryData.imageurls = [];
    this.ticketHistoryData.videoUrls = [];
    this.ticketHistoryData.documentUrls = [];
    if (mention.channelGroup === ChannelGroup.Twitter) {
      if (
        mention.attachmentMetadata.mediaContents &&
        mention.attachmentMetadata.mediaContents.length > 0
      ) {
        for (const MediaContentItem of mention.attachmentMetadata
          .mediaContents) {
          if (MediaContentItem.mediaType === MediaEnum.IMAGE) {
            if (
              mention.channelType === ChannelType.DirectMessages &&
              MediaContentItem.thumbUrl
            ) {
              if (MediaContentItem.thumbUrl.includes('s3.amazonaws')) {
                // tslint:disable-next-line: max-line-length
                const mimeType = MimeTypes.getMimeTypefromString(
                  MediaContentItem.thumbUrl.split('.').pop()
                );
                const ReplaceText =
                  'https://s3.amazonaws.com/locobuzz.socialimages/';
                let ThumbUrl = MediaContentItem.thumbUrl;
                ThumbUrl = ThumbUrl.replace(ReplaceText, '');
                const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${ThumbUrl}&MimeType=${mimeType}&FileName=${MediaContentItem.name}`;
                this.ticketHistoryData.imageurls.push(backgroundUrl);
              } else {
                if (mention.isBrandPost) {
                  const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetTwitterDMImage?url=${MediaContentItem.mediaUrl}&brandsocialid=${mention.author.socialId}&brandID=${mention.brandInfo.brandID}&brandName=${mention.brandInfo.brandName}`;
                  this.ticketHistoryData.imageurls.push(backgroundUrl);
                } else {
                  const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetTwitterDMImage?url=${MediaContentItem.mediaUrl}&brandsocialid=${mention.inReplyToUserID}&brandID=${mention.brandInfo.brandID}&brandName=${mention.brandInfo.brandName}`;
                  this.ticketHistoryData.imageurls.push(backgroundUrl);
                }
              }
            } else {
              const backgroundUrl = `${MediaContentItem.thumbUrl}`;
              this.ticketHistoryData.imageurls.push(backgroundUrl);
            }
          }
          if (MediaContentItem.mediaType === MediaEnum.VIDEO) {
            if (
              mention.channelType === ChannelType.DirectMessages &&
              MediaContentItem.thumbUrl
            ) {
              let SocialOrUserId = '';
              if (mention.isBrandPost) {
                SocialOrUserId = mention.author.socialId;
              } else {
                SocialOrUserId = mention.inReplyToUserID;
              }
              if (MediaContentItem.thumbUrl.includes('s3.amazonaws')) {
                // tslint:disable-next-line: max-line-length
                const mimeType = MimeTypes.getMimeTypefromString(
                  MediaContentItem.thumbUrl.split('.').pop()
                );
                const ReplaceText =
                  'https://s3.amazonaws.com/locobuzz.socialimages/';
                let ThumbUrl = MediaContentItem.thumbUrl;
                ThumbUrl = ThumbUrl.replace(ReplaceText, '');
                const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${ThumbUrl}&MimeType=${mimeType}&FileName=${MediaContentItem.name}`;
                this.ticketHistoryData.imageurls.push(backgroundUrl);
              } else {
                const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                this.ticketHistoryData.imageurls.push(backgroundUrl);
              }
            } else {
              const backgroundUrl = `${MediaContentItem.thumbUrl}`;
              this.ticketHistoryData.imageurls.push(backgroundUrl);
            }
          }
        }
      }
    }

    // Media Content for facebook Channels
    else if (mention.channelGroup === ChannelGroup.Facebook) {
      if (
        mention.attachmentMetadata.mediaContents &&
        mention.attachmentMetadata.mediaContents.length > 0
      ) {
        if (mention.mediaType === MediaEnum.IMAGE) {
          if (mention.attachmentMetadata.mediaContents.length > 0) {
            for (const MediaContentItem of mention.attachmentMetadata
              .mediaContents) {
              if (
                mention.channelType === ChannelType.FBMessages &&
                MediaContentItem.thumbUrl
              ) {
                if (MediaContentItem.thumbUrl.includes('s3.amazonaws')) {
                  const mimeType = MimeTypes.getMimeTypefromString(
                    MediaContentItem.thumbUrl.split('.').pop()
                  );
                  const ReplaceText =
                    'https://s3.amazonaws.com/locobuzz.socialimages/';
                  let ThumbUrl = MediaContentItem.thumbUrl;
                  ThumbUrl = ThumbUrl.replace(ReplaceText, '');
                  const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${ThumbUrl}&MimeType=${mimeType}&FileName=${MediaContentItem.name}`;
                  this.ticketHistoryData.imageurls.push(backgroundUrl);
                } else {
                  const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                  this.ticketHistoryData.imageurls.push(backgroundUrl);
                }
              } else {
                const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                this.ticketHistoryData.imageurls.push(backgroundUrl);
              }
            }
          }
        } else if (mention.mediaType === MediaEnum.VIDEO) {
          if (
            mention.attachmentMetadata.mediaContents &&
            mention.attachmentMetadata.mediaContents.length > 0
          ) {
            for (const MediaContentItem of mention.attachmentMetadata
              .mediaContents) {
              if (
                MediaContentItem.thumbUrl &&
                (MediaContentItem.thumbUrl.includes('.png') ||
                  MediaContentItem.thumbUrl.includes('.jpg') ||
                  MediaContentItem.thumbUrl.includes('.jpeg') ||
                  MediaContentItem.thumbUrl.includes('.gif'))
              ) {
                if (mention.channelType === ChannelType.FBMessages) {
                  if (MediaContentItem.thumbUrl.includes('s3.amazonaws')) {
                    const mimeType = MimeTypes.getMimeTypefromString(
                      MediaContentItem.thumbUrl.split('.').pop()
                    );
                    const ReplaceText =
                      'https://s3.amazonaws.com/locobuzz.socialimages/';
                    let ThumbUrl = MediaContentItem.thumbUrl;
                    ThumbUrl = ThumbUrl.replace(ReplaceText, '');
                    const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${ThumbUrl}&MimeType=${mimeType}&FileName=${MediaContentItem.name}`;
                    this.ticketHistoryData.imageurls.push(backgroundUrl);
                  } else {
                    const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                    this.ticketHistoryData.imageurls.push(backgroundUrl);
                  }
                } else {
                  const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                  this.ticketHistoryData.imageurls.push(backgroundUrl);
                }
              } else {
                if (MediaContentItem.mediaUrl) {
                  this.ticketHistoryData.imageurls.push(
                    MediaContentItem.mediaUrl
                  );
                }
              }
            }
          }
        } else if (mention.mediaType === MediaEnum.URL) {
          if (
            mention.attachmentMetadata.mediaContents &&
            mention.attachmentMetadata.mediaContents.length > 0
          ) {
            for (const MediaContentItem of mention.attachmentMetadata
              .mediaContents) {
              if (
                MediaContentItem.mediaUrl &&
                (MediaContentItem.mediaUrl.includes('.png') ||
                  MediaContentItem.mediaUrl.includes('.jpeg') ||
                  MediaContentItem.mediaUrl.includes('.gif'))
              ) {
                const backgroundUrl = `${MediaContentItem.mediaUrl}`;
                this.ticketHistoryData.imageurls.push(backgroundUrl);
              } else {
                if (MediaContentItem.mediaUrl) {
                  this.ticketHistoryData.imageurls.push(
                    MediaContentItem.mediaUrl
                  );
                }
              }
            }
          }
        } else if (mention.mediaType === MediaEnum.AUDIO) {
          if (
            mention.attachmentMetadata.mediaContents &&
            mention.attachmentMetadata.mediaContents.length > 0
          ) {
            for (const MediaContentItem of mention.attachmentMetadata
              .mediaContents) {
              this.ticketHistoryData.imageurls.push(
                'assets/images/common/AudioMusic.svg'
              );
            }
          }
        } else if (mention.mediaType === MediaEnum.ANIMATEDGIF) {
          if (
            mention.attachmentMetadata.mediaContents &&
            mention.attachmentMetadata.mediaContents.length > 0
          ) {
            for (const MediaContentItem of mention.attachmentMetadata
              .mediaContents) {
              this.ticketHistoryData.imageurls.push(
                'assets/images/common/AudioMusic.svg'
              );
            }
          }
        } else if (mention.mediaType === MediaEnum.OTHER) {
          if (
            mention.attachmentMetadata.mediaContents &&
            mention.attachmentMetadata.mediaContents.length > 0
          ) {
            for (const MediaContentItem of mention.attachmentMetadata
              .mediaContents) {
              if (
                MediaContentItem.mediaUrl &&
                (MediaContentItem.mediaUrl.includes('.png') ||
                  MediaContentItem.mediaUrl.includes('.jpeg') ||
                  MediaContentItem.mediaUrl.includes('.jpg') ||
                  MediaContentItem.mediaUrl.includes('.gif'))
              ) {
                const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                this.ticketHistoryData.imageurls.push(backgroundUrl);
              } else if (MediaContentItem.mediaUrl) {
                if (MediaContentItem.mediaUrl.includes('.pdf')) {
                  const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                  this.ticketHistoryData.imageurls.push(
                    'assets/images/common/pdf.png'
                  );
                  // bind the  pdf url
                } else if (
                  MediaContentItem.mediaUrl.includes('.doc') ||
                  MediaContentItem.mediaUrl.includes('.docx')
                ) {
                  const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                  this.ticketHistoryData.imageurls.push(
                    'assets/images/common/word.png'
                  );
                } else if (
                  MediaContentItem.mediaUrl.includes('.xls') ||
                  MediaContentItem.mediaUrl.includes('.xlsx')
                ) {
                  const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                  this.ticketHistoryData.imageurls.push(
                    'assets/images/common/excel-file.png'
                  );
                } else if (MediaContentItem.mediaUrl.includes('.mp3')) {
                  const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                  this.ticketHistoryData.imageurls.push(
                    'assets/images/common/AudioMusic.png)'
                  );
                } else {
                  this.ticketHistoryData.imageurls.push(
                    MediaContentItem.mediaUrl
                  );
                }
              } else {
                if (MediaContentItem.mediaUrl) {
                  this.ticketHistoryData.imageurls.push(
                    MediaContentItem.mediaUrl
                  );
                }
              }
            }
          }
        }
      }
    } else if (
      mention.channelGroup === ChannelGroup.Email &&
      mention.attachmentMetadata.mediaContents &&
      mention.attachmentMetadata.mediaContents.length > 0
    ) {
      this.ticketHistoryData.isemailattachement = true;
    }
    // for whatsApp channel media
    else if (mention.channelGroup === ChannelGroup.WhatsApp) {
      if (mention.mediaType === MediaEnum.IMAGE) {
        if (
          mention.attachmentMetadata.mediaContents &&
          mention.attachmentMetadata.mediaContents.length > 0
        ) {
          for (const MediaContentItem of mention.attachmentMetadata
            .mediaContents) {
            const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}`;
            this.ticketHistoryData.imageurls.push(backgroundUrl);
          }
        }
      } else if (mention.mediaType === MediaEnum.VIDEO) {
        if (
          mention.attachmentMetadata.mediaContents &&
          mention.attachmentMetadata.mediaContents.length > 0
        ) {
          for (const MediaContentItem of mention.attachmentMetadata
            .mediaContents) {
            const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}`;
            const vidurl: VideoUrl = {};
            vidurl.fileUrl = backgroundUrl;
            vidurl.thumbUrl = backgroundUrl;
            this.ticketHistoryData.videoUrls.push(vidurl);
          }
        }
      } else if (mention.mediaType === MediaEnum.AUDIO) {
        if (
          mention.attachmentMetadata.mediaContents &&
          mention.attachmentMetadata.mediaContents.length > 0
        ) {
          for (const MediaContentItem of mention.attachmentMetadata
            .mediaContents) {
            const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}`;
            const audurl: AudioUrl = {};
            audurl.fileUrl = backgroundUrl;
            audurl.thumbUrl = backgroundUrl;
            this.ticketHistoryData.audioUrls.push(audurl);
          }
        }
      } else if (mention.mediaType === MediaEnum.PDF) {
        if (
          mention.attachmentMetadata.mediaContents &&
          mention.attachmentMetadata.mediaContents.length > 0
        ) {
          for (const MediaContentItem of mention.attachmentMetadata
            .mediaContents) {
            const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}&FileName=${MediaContentItem.name}`;
            const docurl: DocumentUrl = {};
            docurl.fileUrl = backgroundUrl;
            docurl.thumbUrl = 'assets/images/common/pdf.png';
            this.ticketHistoryData.documentUrls.push(docurl);
          }
        }
      } else if (mention.mediaType === MediaEnum.DOC) {
        if (
          mention.attachmentMetadata.mediaContents &&
          mention.attachmentMetadata.mediaContents.length > 0
        ) {
          for (const MediaContentItem of mention.attachmentMetadata
            .mediaContents) {
            const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}&FileName=${MediaContentItem.name}`;
            const docurl: DocumentUrl = {};
            docurl.fileUrl = backgroundUrl;
            docurl.thumbUrl = 'assets/images/common/word.png';
            this.ticketHistoryData.documentUrls.push(docurl);
          }
        }
      } else if (mention.mediaType === MediaEnum.EXCEL) {
        if (
          mention.attachmentMetadata.mediaContents &&
          mention.attachmentMetadata.mediaContents.length > 0
        ) {
          for (const MediaContentItem of mention.attachmentMetadata
            .mediaContents) {
            const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}&FileName=${MediaContentItem.name}`;
            const docurl: DocumentUrl = {};
            docurl.fileUrl = backgroundUrl;
            docurl.thumbUrl = 'assets/images/common/excel-file.png';
            this.ticketHistoryData.documentUrls.push(docurl);
          }
        }
      } else if (mention.mediaType === MediaEnum.URL) {
        if (
          mention.attachmentMetadata.mediaContents &&
          mention.attachmentMetadata.mediaContents.length > 0
        ) {
          for (const MediaContentItem of mention.attachmentMetadata
            .mediaContents) {
            if (
              MediaContentItem.mediaUrl &&
              (MediaContentItem.mediaUrl.includes('.png') ||
                MediaContentItem.mediaUrl.includes('.jpeg') ||
                MediaContentItem.mediaUrl.includes('.gif'))
            ) {
              this.ticketHistoryData.imageurls.push(MediaContentItem.mediaUrl);
            } else {
              if (MediaContentItem.mediaUrl) {
                this.ticketHistoryData.imageurls.push(
                  MediaContentItem.mediaUrl
                );
              }
            }
          }
        }
      } else if (
        mention.mediaType === MediaEnum.OTHER ||
        mention.mediaType === MediaEnum.HTML
      ) {
        if (
          mention.attachmentMetadata.mediaContents &&
          mention.attachmentMetadata.mediaContents.length > 0
        ) {
          for (const MediaContentItem of mention.attachmentMetadata
            .mediaContents) {
            if (
              MediaContentItem.mediaUrl &&
              (MediaContentItem.mediaUrl.includes('.png') ||
                MediaContentItem.mediaUrl.includes('.jpeg') ||
                MediaContentItem.mediaUrl.includes('.gif'))
            ) {
              const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}&FileName=${MediaContentItem.name}`;
              this.ticketHistoryData.imageurls.push(backgroundUrl);
            } else if (
              MediaContentItem.mediaUrl &&
              MediaContentItem.mediaUrl.includes('.mp4')
            ) {
              const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}&FileName=${MediaContentItem.name}`;
              const vidurl: VideoUrl = {};
              vidurl.fileUrl = backgroundUrl;
              vidurl.thumbUrl = backgroundUrl;
              this.ticketHistoryData.imageurls.push(backgroundUrl);
            } else if (
              MediaContentItem.mediaUrl &&
              MediaContentItem.mediaUrl.includes('.mp3')
            ) {
              const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}&FileName=${MediaContentItem.name}`;
              const audurl: AudioUrl = {};
              audurl.fileUrl = backgroundUrl;
              audurl.thumbUrl = backgroundUrl;
              this.ticketHistoryData.audioUrls.push(audurl);
            } else if (MediaContentItem.mediaUrl) {
              if (MediaContentItem.mediaUrl.includes('.pdf')) {
                const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}&FileName=${MediaContentItem.name}`;
                const docurl: DocumentUrl = {};
                docurl.fileUrl = backgroundUrl;
                docurl.thumbUrl = 'assets/images/common/pdf.png';
                this.ticketHistoryData.documentUrls.push(docurl);
              } else if (
                MediaContentItem.mediaUrl.includes('.doc') ||
                MediaContentItem.mediaUrl.includes('.docx')
              ) {
                const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}`;
                const docurl: DocumentUrl = {};
                docurl.fileUrl = backgroundUrl;
                docurl.thumbUrl = 'assets/images/common/word.png';
                this.ticketHistoryData.documentUrls.push(docurl);
              } else if (
                MediaContentItem.mediaUrl.includes('.xls') ||
                MediaContentItem.mediaUrl.includes('.xlsx')
              ) {
                const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}&FileName=${MediaContentItem.name}`;
                const docurl: DocumentUrl = {};
                docurl.fileUrl = backgroundUrl;
                docurl.thumbUrl = 'assets/images/common/excel-file.png';
                this.ticketHistoryData.documentUrls.push(docurl);
              } else {
                const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}&FileName=${MediaContentItem.name}`;
                this.ticketHistoryData.imageurls.push(backgroundUrl);
              }
            } else {
              if (MediaContentItem.mediaUrl) {
                const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}&FileName=${MediaContentItem.name}`;
                this.ticketHistoryData.imageurls.push(backgroundUrl);
              }
            }
          }
        }
      }
    } else if (
      mention.channelGroup === ChannelGroup.WebsiteChatBot &&
      mention.mediaType !== MediaEnum.TEXT
    ) {
      let messagetext = '';
      // const error = '';
      let data = null;
      if (
        mention.attachmentMetadata.mediaContents &&
        mention.attachmentMetadata.mediaContents.length > 0
      ) {
        for (const media of mention.attachmentMetadata.mediaContents) {
          messagetext = media.name;
          if (mention.isBrandPost) {
            if (this.isJSON(messagetext)) {
              data = JSON.parse(messagetext);
              // load bot data
              // messagetext = BotInboxMessageDetails.MessageLoader(data);
            } else {
              if (media.mediaType === MediaEnum.IMAGE) {
                this.ticketHistoryData.imageurls.push(messagetext);
              } else if (media.mediaType === MediaEnum.VIDEO) {
                const vidurl: VideoUrl = {};
                vidurl.fileUrl = messagetext;
                vidurl.thumbUrl = messagetext;
                this.ticketHistoryData.imageurls.push(messagetext);
              } else if (
                media.mediaType === MediaEnum.EXCEL ||
                media.mediaType === MediaEnum.DOC ||
                media.mediaType === MediaEnum.PDF ||
                media.mediaType === MediaEnum.FILE ||
                media.mediaType === MediaEnum.OTHER
              ) {
                let name = '';
                try {
                  name = messagetext;
                } catch (Exception) { }
                const docurl: DocumentUrl = {};
                docurl.fileUrl = messagetext;
                docurl.thumbUrl = 'assets/images/common/attachement-blured.png';
                this.ticketHistoryData.documentUrls.push(docurl);
              } else if (messagetext === 'get_started_ping') {
                messagetext = 'Get Started';
              } else {
                messagetext = messagetext;
              }
            }
          } else {
            if (this.isJSON(messagetext)) {
              // load chatbot messages media
              // data = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(messagetext);
              // messagetext = BotInboxMessageDetails.MessageLoader(data);
            } else {
              if (media.mediaType === MediaEnum.IMAGE) {
                this.ticketHistoryData.imageurls.push(messagetext);
              } else if (media.mediaType === MediaEnum.VIDEO) {
                const vidurl: VideoUrl = {};
                vidurl.fileUrl = messagetext;
                vidurl.thumbUrl = messagetext;
                this.ticketHistoryData.videoUrls.push(vidurl);
              } else if (
                media.mediaType === MediaEnum.EXCEL ||
                media.mediaType === MediaEnum.DOC ||
                media.mediaType === MediaEnum.PDF ||
                media.mediaType === MediaEnum.FILE ||
                media.mediaType === MediaEnum.OTHER
              ) {
                let name = '';
                try {
                  name = messagetext;
                } catch (Exception) { }
                const docurl: DocumentUrl = {};
                docurl.fileUrl = messagetext;
                docurl.thumbUrl = 'assets/images/common/attachement-blured.png';
                this.ticketHistoryData.documentUrls.push(docurl);
              } else if (messagetext === 'get_started_ping') {
                messagetext = 'Get Started';
              } else {
                messagetext = messagetext;
              }
            }
          }
        }
      } else {
      }
    } else if (mention.channelGroup === ChannelGroup.Instagram) {
      if (
        mention.attachmentMetadata.mediaContents &&
        mention.attachmentMetadata.mediaContents.length > 0
      ) {
        if (mention.mediaType === MediaEnum.IMAGE) {
          if (mention.attachmentMetadata.mediaContents.length > 0) {
            for (const MediaContentItem of mention.attachmentMetadata
              .mediaContents) {
              this.ticketHistoryData.imageurls.push(MediaContentItem.mediaUrl);
            }
          }
        } else if (mention.mediaType === MediaEnum.VIDEO) {
          for (const MediaContentItem of mention.attachmentMetadata
            .mediaContents) {
            if (
              MediaContentItem.mediaUrl &&
              MediaContentItem.mediaUrl.includes('.mp4')
            ) {
              const vidurl: VideoUrl = {};
              vidurl.fileUrl = MediaContentItem.mediaUrl;
              vidurl.thumbUrl = MediaContentItem.mediaUrl;
              this.ticketHistoryData.videoUrls.push(vidurl);
            } else if (
              (MediaContentItem.thumbUrl &&
                MediaContentItem.thumbUrl.includes('.png')) ||
              MediaContentItem.thumbUrl.includes('.jpg') ||
              MediaContentItem.thumbUrl.includes('.jpeg') ||
              MediaContentItem.thumbUrl.includes('.gif')
            ) {
              this.ticketHistoryData.imageurls.push(MediaContentItem.thumbUrl);
            } else {
              if (MediaContentItem.mediaUrl) {
                this.ticketHistoryData.imageurls.push(
                  MediaContentItem.mediaUrl
                );
              }
            }
          }
        }
      }
    } else if (mention.channelGroup === ChannelGroup.LinkedIn) {
      if (
        mention.attachmentMetadata.mediaContents &&
        mention.attachmentMetadata.mediaContents.length > 0
      ) {
        for (const MediaContentItem of mention.attachmentMetadata
          .mediaContents) {
          if (MediaContentItem.mediaType === MediaEnum.IMAGE) {
            this.ticketHistoryData.imageurls.push(MediaContentItem.mediaUrl);
          } else if (MediaContentItem.mediaType === MediaEnum.ANIMATEDGIF) {
            this.ticketHistoryData.imageurls.push(MediaContentItem.mediaUrl);
          } else if (MediaContentItem.mediaType === MediaEnum.VIDEO) {
            const vidurl: VideoUrl = {};
            vidurl.fileUrl = MediaContentItem.mediaUrl;
            vidurl.thumbUrl = MediaContentItem.mediaUrl;
            this.ticketHistoryData.videoUrls.push(vidurl);
          }
        }
      }
    } else if (mention.channelGroup === ChannelGroup.Youtube) {
      if (mention.mediaType === MediaEnum.VIDEO) {
        if (
          mention.attachmentMetadata.mediaContents &&
          mention.attachmentMetadata.mediaContents.length > 0
        ) {
          for (const MediaContentItem in mention.attachmentMetadata
            .mediaContents) {
            // Youtube video logic is remaining
            // List<string>
            //     YoutubeVideoID = MediaContentItem.MediaUrl.Split('=').ToList();
            // var VideoID = "";
            // VideoID = YoutubeVideoID[YoutubeVideoID.Count - 1];
            // <div class="fine_bg youtubeVideo">
            //     <iframe src="https://www.youtube.com/embed/@VideoID?rel=0" allowfullscreen></iframe>
            // </div>
          }
        }
      }
    } else if (mention.mediaType === MediaEnum.OTHER) {
      if (
        mention.attachmentMetadata.mediaContents &&
        mention.attachmentMetadata.mediaContents.length > 0
      ) {
        for (const MediaContentItem of mention.attachmentMetadata
          .mediaContents) {
          if (
            MediaContentItem.mediaUrl &&
            (MediaContentItem.mediaUrl.includes('.png') ||
              MediaContentItem.mediaUrl.includes('.jpeg') ||
              MediaContentItem.mediaUrl.includes('.gif'))
          ) {
            this.ticketHistoryData.imageurls.push(MediaContentItem.mediaUrl);
          } else if (
            MediaContentItem.mediaUrl &&
            MediaContentItem.mediaUrl.includes('.mp4')
          ) {
            const vidurl: VideoUrl = {};
            vidurl.fileUrl = MediaContentItem.mediaUrl;
            vidurl.thumbUrl = MediaContentItem.mediaUrl;
            this.ticketHistoryData.videoUrls.push(vidurl);
          } else if (MediaContentItem.mediaUrl) {
            if (MediaContentItem.mediaUrl.includes('.pdf')) {
              const docurl: DocumentUrl = {};
              docurl.fileUrl = MediaContentItem.mediaUrl;
              docurl.thumbUrl = 'assets/images/common/pdf.png';
              this.ticketHistoryData.documentUrls.push(docurl);
            } else if (
              MediaContentItem.mediaUrl.includes('.doc') ||
              MediaContentItem.mediaUrl.includes('.docx')
            ) {
              const docurl: DocumentUrl = {};
              docurl.fileUrl = MediaContentItem.mediaUrl;
              docurl.thumbUrl = 'assets/images/common/word.png';
              this.ticketHistoryData.documentUrls.push(docurl);
            } else if (
              MediaContentItem.mediaUrl.includes('.xls') ||
              MediaContentItem.mediaUrl.includes('.xlsx')
            ) {
              const docurl: DocumentUrl = {};
              docurl.fileUrl = MediaContentItem.mediaUrl;
              docurl.thumbUrl = 'assets/images/common/excel-file.png';
              this.ticketHistoryData.documentUrls.push(docurl);
            } else {
              this.ticketHistoryData.imageurls.push(MediaContentItem.mediaUrl);
            }
          } else {
            if (MediaContentItem.mediaUrl) {
              this.ticketHistoryData.imageurls.push(MediaContentItem.mediaUrl);
            }
          }
        }
      }
    }
    if (mention.mediaType === MediaEnum.POLL) {
      // Twitter Polls remaining
    }

    if (
      mention.makerCheckerMetadata.workflowStatus !==
      LogStatus.ReplySentForApproval &&
      mention.makerCheckerMetadata.workflowStatus !== LogStatus.ReplyScheduled
    ) {
      if (mention.channelGroup === ChannelGroup.Email) {
        if (
          mention.makerCheckerMetadata.workflowStatus ===
          LogStatus.ReplyRejected &&
          +this.currentUser.data.user.role !== UserRoleEnum.CustomerCare &&
          +this.currentUser.data.user.role !== UserRoleEnum.BrandAccount
        ) {
          this.ticketHistoryData.rejectedNote =
            mention.ticketInfo !== null && mention.ticketInfo.lastNote
              ? mention.ticketInfo.lastNote
                .replace('\n', '')
                .replace('<p>', '')
                .replace('</p>', '')
              : '';
        } else {
          if (
            mention.ticketInfo.lastNote &&
            mention.makerCheckerMetadata.workflowStatus !==
            LogStatus.ReplyTextModified
          ) {
            this.ticketHistoryData.LastNote = mention.ticketInfo.lastNote;
          }

          if (mention.latestResponseTime) {
            this.ticketHistoryData.lastReply = mention.latestResponseTime;
          }
        }
      } else {
        if (
          mention.makerCheckerMetadata.workflowStatus ===
          LogStatus.ReplyRejected &&
          +this.currentUser.data.user.role !== UserRoleEnum.CustomerCare &&
          +this.currentUser.data.user.role !== UserRoleEnum.BrandAccount
        ) {
          this.ticketHistoryData.rejectedNote = mention.ticketInfo.lastNote;
        } else {
          if (
            mention.ticketInfo.lastNote &&
            mention.makerCheckerMetadata.workflowStatus !==
            LogStatus.ReplyTextModified
          ) {
            this.ticketHistoryData.LastNote = mention.ticketInfo.lastNote;
          }

          if (mention.latestResponseTime) {
            this.ticketHistoryData.LastNote = mention.ticketInfo.lastNote;
          }
        }
      }
    }

    // TattTime
    if (this.ticketHistoryData.isabouttobreach) {
      // const aabouttobreachminutes = -mention.tattime;
      // <span class="actionbtnsContainer">Modified on: </span>
      // <span href="javascrip:void(0)" data-title="Last Modified" data-toggle="tooltip" title="Last Modified"
      // rel="tooltip" data-placement="bottom" class="ModifiedDate lineinticketl">
      // <div style="display:inline"
      // data-time="@(Convert.ToDouble((item.ModifiedDate - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalSeconds))">
      // @item.ModifiedDate.ToString("dd-MMM-yyyy hh:mm:ss")</div>
      // </span>
      // <span class="actionbtnsContainer" id="spnabouttobreach" data-title="About to Breach" data-toggle="tooltip"
      // title="Ticket First Response time about to breach" rel="tooltip" data-placement="bottom">
      //     <img class="breach__icon" src="~/images/about_to_breach.svg" />
      // </span>
      // <span class="actionbtnsContainer" id="spnbreached" data-title="About to Breach" data-toggle="tooltip"
      // title="Ticket First Response time already breached" rel="tooltip" data-placement="bottom" style="display:none">
      //     <img class="breach__icon" src="~/images/breached.svg" />
      // </span>
      // <span href="javascrip:void(0)" class="ModifiedDate">
      //     <div class="breach__timestamp" style="display:inline" data-ticketid="@item.TicketInfo.TicketID"
      // data-slatime="@aabouttobreachminutes" data-slacounterstartinsecond="@SLACounterStartInSecond"
      //          data-typeofshowtimeinsecond="@TypeOfShowTimeInSecond" data-isenableshowtimeinsecond="@ISEnableShowTimeInSecond"
      // data-breachtime="@(Convert.ToDouble((item.TATFLRBreachTime - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalSeconds))">
      // <span id="spnabouttobreachtime">@aabouttobreachminutes</span></div>
      //     </span>
    } else {
      // <span class="actionbtnsContainer">Modified on: </span>
      // <span href="javascrip:void(0)" data-title="Last Modified" data-toggle="tooltip" title="Last Modified"
      // rel="tooltip" data-placement="bottom" class="ModifiedDate">
      // <div style="display:inline"
      // data-time="@(Convert.ToDouble((item.ModifiedDate - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalSeconds))">
      // @item.ModifiedDate.ToString("dd-MMM-yyyy hh:mm:ss")</div>
      // </span>

      if (this.ticketHistoryData.isbreached) {
        // <span class="actionbtnsContainer breach__div" data-title="About to Breach" data-toggle="tooltip"
        // title="Ticket First Response time already breached" rel="tooltip" data-placement="bottom" style="padding-top:0">
        //     <img class="breach__icon" src="~/images/breached.svg" />
        // </span>
      }
    }

    // var OrderedList = Model.OrderBy(o => o.MentionTime);
    // var latestMention = OrderedList.Where(w => w.ConcreteClassName ==
    // "LocoBuzzRespondDashboardMVCBLL.Classes.ChannelClasses.TicketTwitter").LastOrDefault();//.TagID;
  }

  getChannelCustomeIcon(mention: BaseMention): string {
    let channeltypeicon = '';
    if (mention.channelGroup === ChannelGroup.Twitter) {
      if (mention.channelType === ChannelType.DirectMessages) {
        channeltypeicon = '~/images/channelsv/Twitter_DM.svg';
      } else if (mention.channelType === ChannelType.PublicTweets) {
        channeltypeicon = 'assets/images/channelsv/Public_Tweet.svg';
        // tslint:disable-next-line: max-line-length
        // <img src='~/images/channelsv/Public_Tweet.svg' title='Twitter Public Tweet' alt='Twitter Public Tweet' />
      } else if (
        mention.channelType === ChannelType.BrandTweets &&
        !mention.isBrandPost
      ) {
        channeltypeicon = 'assets/images/channelsv/Brand_Mention.svg';
        // <img src='~/images/channelsv/Brand_Mention.svg' title='Twitter Tweet' alt='Twitter Tweet' />
      } else if (
        mention.channelType === ChannelType.Twitterbrandmention &&
        !mention.isBrandPost
      ) {
        channeltypeicon = 'assets/images/channelsv/Brand_Mention.svg';
        // tslint:disable-next-line: max-line-length
        // <img src='~/images/channelsv/Brand_Mention.svg' title='Twitter Brand Mentions' alt='Twitter Brand Mentions' />
      } else {
        channeltypeicon = 'assets/images/channelsv/Brand_Tweet.svg';
        // <img src='~/images/channelsv/Brand_Tweet.svg' alt='Twitter Mention' title='Twitter Mention' />
      }
    } else if (mention.channelGroup === ChannelGroup.Facebook) {
      if (mention.channelType === ChannelType.FBComments) {
        channeltypeicon = 'assets/images/channelsv/FB_Comment.svg';
      } else if (mention.channelType === ChannelType.FBMediaComments) {
        channeltypeicon =
          'assets/images/channelsv/FB_Public_Post_Comment_1.svg';
      } else if (mention.channelType === ChannelType.FBMessages) {
        channeltypeicon = 'assets/images/channelsv/Facebook_DM.svg';
      } else if (mention.channelType === ChannelType.FBReviews) {
        channeltypeicon = 'assets/images/channelsv/FB_Review.svg';
      } else if (mention.channelType === ChannelType.FBPublic) {
        channeltypeicon = 'assets/images/channelsv/FB_Public_post_1.svg';
      } else if (
        mention.channelType === ChannelType.FBPageUser &&
        !mention.isBrandPost
      ) {
        channeltypeicon = 'assets/images/channelsv/FB_User_Post.svg';
      } else {
        channeltypeicon = 'assets/images/channelicons/facebook.png';
      }
    } else if (mention.channelGroup === ChannelGroup.WhatsApp) {
      channeltypeicon = 'assets/images/channelicons/WhatsApp.png';
    } else if (mention.channelGroup === ChannelGroup.LinkedIn) {
      if (mention.channelType === ChannelType.LinkedInPageUser) {
        channeltypeicon = 'assets/images/channelicons/linkedinicon.png';
      } else {
        channeltypeicon = 'assets/images/channelicons/linkedin.png';
      }
    } else if (mention.channelGroup === ChannelGroup.GooglePlus) {
      if (mention.channelType === ChannelType.GoogleComments) {
        channeltypeicon = 'assets/images/channelicons/googlepluscomment.png';
      } else {
        channeltypeicon = 'assets/images/channelicons/googlePlus.png';
      }
    } else if (mention.channelGroup === ChannelGroup.Instagram) {
      if (mention.channelType === ChannelType.InstagramComments) {
        channeltypeicon = 'assets/images/channelicons/Instagram_Comment.png';
      } else {
        channeltypeicon = 'assets/images/channelicons/instagram.png';
      }
    } else if (mention.channelGroup === ChannelGroup.GoogleMyReview) {
      if (mention.channelType === ChannelType.GMBQuestion) {
        channeltypeicon = 'assets/images/channelicons/GMBQuestion.png';
      } else if (mention.channelType === ChannelType.GMBAnswers) {
        channeltypeicon = 'assets/images/channelicons/GMBQuestion.png';
      } else {
        channeltypeicon = 'assets/images/channelicons/GoogleMyReview.png';
      }
    } else if (mention.channelGroup === ChannelGroup.AppStoreReviews) {
      channeltypeicon = 'assets/images/channelicons/AppStoreReviews.svg';
    } else if (mention.channelGroup === ChannelGroup.WebsiteChatBot) {
      channeltypeicon = 'assets/images/channelicons/WebsiteChatBot.svg';
    } else {
      channeltypeicon = `assets/images/channelicons/${ChannelGroup[mention.channelGroup]
        }.png`;
    }
    return channeltypeicon;
  }

  getTicketCustomReply(mention: BaseMention): AllBrandsTicketsReply {
    const ticketReplyObj: AllBrandsTicketsReply = {};
    if (
      mention.channelGroup === ChannelGroup.Facebook ||
      mention.channelGroup === ChannelGroup.Twitter ||
      mention.channelGroup === ChannelGroup.Instagram ||
      mention.channelGroup === ChannelGroup.Youtube ||
      mention.channelGroup === ChannelGroup.LinkedIn
    ) {
      if (mention.isBrandPost) {
        ticketReplyObj.BrandPostClass = 'TicketPostReply';
        ticketReplyObj.chkTagTicket = 'chkTagTicket_BrandPost';
        if (mention.replyUseid === -1 || mention.replyUseid > 0) {
          ticketReplyObj.replyfrom = 'This reply was sent from Locobuzz';
          ticketReplyObj.replyImg = '/images/locobuzz-icon.svg';
          ticketReplyObj.isreply = true;
        } else if (mention.replyUseid === -2) {
          ticketReplyObj.replyfrom = `This reply was sent from ${ChannelGroup[mention.channelGroup]
            }`;
          ticketReplyObj.replyImg = '/images/social-generic.svg';
          ticketReplyObj.isreply = true;
        }
      }
    }
    if (
      mention.channelGroup === ChannelGroup.WhatsApp ||
      mention.channelGroup === ChannelGroup.WebsiteChatBot ||
      mention.channelGroup === ChannelGroup.GooglePlus
    ) {
      ticketReplyObj.BrandPostClass = 'TicketPostReply';
      ticketReplyObj.chkTagTicket = 'chkTagTicket_BrandPost';
      ticketReplyObj.replyfrom = `This reply was sent from ${ChannelGroup[mention.channelGroup]
        }`;
      ticketReplyObj.replyImg = '/images/locobuzz-icon.svg';
      if (mention.isBrandPost) {
        if (mention.mainTweetid) {
          ticketReplyObj.replyfrom = 'This reply was sent from Locobuzz';
          ticketReplyObj.replyImg = '/images/locobuzz-icon.svg';
        }
      }
    }
    return ticketReplyObj;
  }

  getchannelSpecificProfile(mention: BaseMention): AllBrandsTicketsProfile {
    const profileObj: AllBrandsTicketsProfile = {};
    if (mention.channelGroup === ChannelGroup.Facebook) {
      profileObj.profilepicurl = 'https://graph.facebook.com/';
      if (mention.author.socialId && mention.author.socialId !== '0') {
        profileObj.profileurl =
          'http://www.facebook.com/' + mention.author.socialId;
        profileObj.profilepicurl = mention.author.picUrl;
        if (!profileObj.profilepicurl) {
          profileObj.profilepicurl =
            'assets/images/agentimages/sample-image.jpg';
        }
      } else {
        profileObj.profilepicurl = '/images/AgentImages/sample-image.jpg';
        profileObj.profileurl = 'javascript:void(0)';
      }
    }
    if (mention.channelGroup === ChannelGroup.WhatsApp) {
      if (mention.author.socialId && mention.author.socialId !== '0') {
        profileObj.profilepicurl = '/images/AgentImages/sample-image.jpg';
        profileObj.profileurl = 'javascript:void(0)';
      } else {
        profileObj.profilepicurl = '/images/AgentImages/sample-image.jpg';
        profileObj.profileurl = 'javascript:void(0)';
      }
    } else {
      profileObj.profilepicurl = mention.author.picUrl;
      if (!profileObj.profilepicurl) {
        profileObj.profilepicurl = 'assets/images/agentimages/sample-image.jpg';
        profileObj.profileurl = 'javascript:void(0)';
      }
    }

    return profileObj;
  }

  isJSON(val: any): boolean {
    if (typeof val != 'string') {
      val = JSON.stringify(val);
    }

    try {
      JSON.parse(val);
      return true;
    } catch (e) {
      return false;
    }
  }
  changePriority(event, priority): void {
    const object = {
      brandInfo: this.postData.brandInfo,
      ticketInfo: this.postData.ticketInfo,
      actionFrom: ActionTaken.Locobuzz,
    };

    object.ticketInfo.ticketPriority = event;
    console.log(object);

    this._ticketService.changeTicketPriority(object).subscribe(
      (data) => {
        const data1 = JSON.parse(JSON.stringify(data));
        if (data1.success) {
          this.ticketPriority = priority;
          this._snackBar.open('Ticket Priority Succesfully Changed', 'Close', {
            duration: 1500,
          });
        }

        this.togglePostfootClasses();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  assignTicket(): void {
    this._postDetailService.postObj = this.postData;
    this.dialog.open(PostAssigntoComponent, {
      autoFocus: false,
      width: '650px',
    });
  }

  markInfluencer(): void {
    this._postDetailService.postObj = this.postData;
    this.dialog.open(PostMarkinfluencerComponent, {
      autoFocus: false,
      width: '650px',
    });
  }

  setOpenPostLink(mention: BaseMention): void {
    if (mention.channelGroup === ChannelGroup.LinkedIn) {
      if (mention.parentPostSocialID != null) {
        try {
          const userpost = mention.parentPostSocialID.split('-');
          this.userpostLink = `https://www.linkedin.com/feed/update/${userpost[2]}`;
        } catch (Exception) {
          const userpost = mention.parentPostSocialID.split('-');
          const LinkedInParentPostSocialID =
            userpost.length === 3
              ? userpost[2]
              : userpost.length === 2
                ? userpost[1]
                : userpost.length === 1
                  ? userpost[0]
                  : '';
          this.userpostLink = `https://www.linkedin.com/feed/update/${LinkedInParentPostSocialID}`;
        }
      } else {
        try {
          const userpost = mention.socialID.split('-');
          this.userpostLink = `https://www.linkedin.com/feed/update/${userpost[2]}`;
        } catch (Exception) {
          const userpost = mention.socialID.split('-');
          const LinkedInParentPostSocialID =
            userpost.length === 3
              ? userpost[2]
              : userpost.length === 2
                ? userpost[1]
                : userpost.length === 1
                  ? userpost[0]
                  : '';
          this.userpostLink = `https://www.linkedin.com/feed/update/${LinkedInParentPostSocialID}`;
        }
      }
    } else if (mention.channelGroup === ChannelGroup.Youtube) {
      if (mention.channelType === ChannelType.YouTubeComments) {
        this.userpostLink = `http://www.youtube.com/watch?v=${mention.parentPostSocialID}&lc=${mention.socialID}`;
      } else {
        this.userpostLink = `http://www.youtube.com/watch?v=${mention.socialID}`;
      }
    } else if (mention.channelGroup === ChannelGroup.Twitter) {
      if (mention.channelType !== 17) {
        this.userpostLink = `http://twitter.com/${mention.author.screenname}/status/${mention.socialID}`;
      }
    } else if (mention.channelGroup === ChannelGroup.Facebook) {
      if (mention.channelType !== 40) {
        this.userpostLink = `http://www.facebook.com/${mention.socialID}`;
      }
    } else if (mention.channelType !== ChannelType.Email) {
      if (mention.url) {
        this.userpostLink = mention.url;
      }
    }

    // @if ((Convert.ToInt32(Identity.Current.AccountType) == (int)UserRoleEnum.TeamLead
    // || Convert.ToInt32(Identity.Current.AccountType) == (int)UserRoleEnum.SupervisorAgent)
    // && mention.WorkflowStatus == LogStatus.ReplySentForApproval)
    // {
    //     <a class="urldetails post__footer--icon post__footer--approve ticket__trigger"
    // onclick="BrandTickets.ConfrimApprovalofTickets(this,1)"
    //        data-BrandID="@item.BrandInfo.BrandID" data-BrandName="@item.BrandInfo.BrandName"
    // data-BrandFriendlyName="@item.BrandInfo.BrandFriendlyName"
    //        data-tagID="@item.TagID" data-TicketID="@item.TicketInfo.TicketID"
    // data-status="@(Convert.ToInt32(item.TicketInfo.Status))" data-assignedTo="@item.TicketInfo.AssignedTo"
    // data-EscalatedTo="@item.TicketInfo.EscalatedTo" data-IsCsdUser="@IsCSDUser" data-lastnote="@item.TicketInfo.LastNote">
    //         Approve
    //     </a>
    //     <a class="urldetails post__footer--icon post__footer--reject ticket__trigger"
    // onclick="BrandTickets.RejectTicket(this,1)"
    //        data-BrandID="@item.BrandInfo.BrandID" data-BrandName="@item.BrandInfo.BrandName"
    // data-BrandFriendlyName="@item.BrandInfo.BrandFriendlyName"
    //        data-tagID="@item.TagID" data-TicketID="@item.TicketInfo.TicketID"
    // data-status="@(Convert.ToInt32(item.TicketInfo.Status))"
    // data-assignedTo="@item.TicketInfo.AssignedTo" data-EscalatedTo="@item.TicketInfo.EscalatedTo" data-IsCsdUser="@IsCSDUser">
    //         Reject
    //     </a>
  }

  enableMakerChecker(status): void {
    this._postDetailService.postObj = this.postData;
    const source = this.MapLocobuzz.mapMention(this._postDetailService.postObj);
    const object = {
      Source: source,
      Ismakercheckerstatus: status,
      actionFrom: 0,
    };

    this._ticketService.enableTicketMakerChecker(object).subscribe((data) => {
      if (JSON.parse(JSON.stringify(data)).success) {
        console.log('Maker Checker', data);
        if (status) {
          this._snackBar.open('Maker Checker Enabled', '', {
            duration: 1000,
          });
          this.ticketHistoryData.isTicketAgentWorkFlowEnabled = false;
        } else {
          this._snackBar.open('Maker Checker Disabled', '', {
            duration: 1000,
          });
          this.ticketHistoryData.isTicketAgentWorkFlowEnabled = true;
        }
      } else {
        this._snackBar.open('Error Occured', '', {
          duration: 1000,
        });
      }
    });
  }

  translateText(): void {
    this._postDetailService.postObj = this.postData;
    const object = {
      brandInfo: {
        BrandID: this._postDetailService.postObj.brandInfo.brandID,
        BrandName: this._postDetailService.postObj.brandInfo.brandName,
      },
      model: {
        DestinationLanguage: this.translateToForm,
        TagId: this._postDetailService.postObj.ticketInfo.tagID,
        Text: this._postDetailService.postObj.description,
      },
      StartDateEpoch: this._filterService.filterForm.controls.brandDateDuration
        .value.Duration.StartDate,
      EndDateEpoch: this._filterService.filterForm.controls.brandDateDuration
        .value.Duration.EndDate,
    };

    if (this._filterService._filterFilledData !== undefined) {
      object.StartDateEpoch = this._filterService._filterFilledData.brandDateDuration.Duration.StartDate;
      object.EndDateEpoch = this._filterService._filterFilledData.brandDateDuration.Duration.EndDate;
    }

    console.log(JSON.stringify(object));
    this._ticketService
      .translateText(object)
      .subscribe((data: TranslateData) => {
        this.translatedData = data;
        this.showTranslated = true;
        this.purifyTranslated();
        console.log('Translate Text', this.translatedData);
      });
  }

  setTranslateTo(name, val): void {
    this.translateTo = name;
    this.translateToForm = val;
    this.translateText();
  }

  purifyTranslated(): void {
    if (
      this.translatedData.data.translatedText !== '' &&
      this.translatedData.data.translatedText !== null
    ) {
      for (const each of Object.keys(Language)) {
        if (
          this.translatedData.data.sourceLanguage === Language[each].PassingName
        ) {
          this.translateFrom = Language[each].DisplayName;
        }
        if (
          this.translatedData.data.destinationLanguage ===
          Language[each].PassingName
        ) {
          this.translateTo = Language[each].DisplayName;
        }
      }
      this.translatedText = this.translatedData.data.translatedText;
      this.isTranslateError = false;
    } else if (
      this.translatedData.data.requestUsed >=
      this.translatedData.data.totalRequestCount
    ) {
      this.translatedText =
        'You have reached the daily limit of ' +
        this.translatedData.data.totalRequestCount +
        ' requests for translation.';
      this.isTranslateError = true;
    } else if (
      this.translatedData.data.exceptionMessage !== '' &&
      this.translatedData.data.exceptionMessage != null
    ) {
      this.translatedText = this.translatedData.data.exceptionMessage;
      this.isTranslateError = true;
    } else {
      this.translatedText = 'No Translation Found.';
      this.isTranslateError = true;
    }
  }

  postSelect(checked, id): void {

    if (checked) {
      const obj: BulkMentionChecked = {
        guid: this._navigationService.currentSelectedTab.guid,
        mention: this.postData,
      };

      this._ticketService.bulkMentionChecked.push(obj);
    } else {
      const mentionIndex = this._ticketService.bulkMentionChecked.findIndex(
        (obj) => obj.mention.tagID === this.postData.tagID
      );
      if (mentionIndex > -1) {
        this._ticketService.bulkMentionChecked.splice(mentionIndex, 1);
      }
    }

    const CheckedTickets = this._ticketService.bulkMentionChecked.filter(
      (obj) => obj.guid === this._navigationService.currentSelectedTab.guid
    );
    if (CheckedTickets.length > 1) {
      // if ($('#DefinedFilterDropdown .selected .opt').text() == "SSRE") {
      //     $("#btnbulkapprovereject").css("display", "none");
      //     $("#btnBulkAssignment").css("display", "none");
      //     $("#btnBulkReopen").css("display", "none");
      //     $("#btnBulkEscalate").css("display", "none");
      //     $("#btnBulkOnHold").css("display", "none");
      //     $("#btnBulkDirectClose").css("display", "none");
      //     $("#btnBulkTagging").css("display", "none");
      //     $("#btnBulkReplyTicketListing").css("display", "none");
      // }

      const forapproval = CheckedTickets.map(
        (s) =>
          s.mention.makerCheckerMetadata.workflowStatus ===
          LogStatus.ReplySentForApproval
      ).filter(this.onlyUnique);
      if (forapproval.length > 1) {
        // show makerchecker approve and reject
        this._replyService.bulkActionButtons.btnbulkreplyapproved = true;
        this._replyService.bulkActionButtons.btnbulkreplyrejected = true;
      } else {
        // hide makerchecker approve/reject
        this._replyService.bulkActionButtons.btnbulkreplyapproved = false;
        this._replyService.bulkActionButtons.btnbulkreplyrejected = false;
      }

       // var total = $(this).find('input[class=chkTicket]:checked').length;
       // $("#idSelectedTickets").html(CheckedTickets);
       // $("#TicketCheckAllBlock").show(100);
    } else {
       // $("#TicketCheckAllBlock").hide(100);
    }

    // if ($(this).find('input[class=chkTicket]').length == CheckedTickets) {
    //     $('#chkTicketAll').prop("checked", true);
    // } else {
    //     $('#chkTicketAll').prop("checked", false);
    // }

    this.ShowHideButtonsFromTicketStatus();
    this.postSelectEvent.emit([checked, id]);
  }

  abouttobreachtimeleft(mention: BaseMention): void {
    const utcdate = moment.utc();
    const breachtimeutc = moment.utc(mention.ticketInfo.tatflrBreachTime);
    const h = moment.utc(new Date(null));
    const timeString = breachtimeutc.diff(h, 'seconds');
    const ticketid = mention.ticketInfo.ticketID;
    const slacounterstartinsecond = this.ticketHistoryData
      .SLACounterStartInSecond;
    const isenableshowtimeinsecond = this.ticketHistoryData
      .iSEnableShowTimeInSecond;
    const typeofshowtimeinsecond = this.ticketHistoryData
      .typeOfShowTimeInSecond;
    const currenttime = moment();
    const abouttobreach = moment.utc(+timeString * 1000).local();
    let timetobreach = moment(abouttobreach, 'DD/MM/YYYY').from(
      moment(currenttime, 'DD/MM/YYYY')
    );

    const diffTime = +abouttobreach - +currenttime;
    let duration = moment.duration(diffTime, 'milliseconds');
    const interval = 1000;

    const timeminandsec = +slacounterstartinsecond / 60;
    let mincounter = Math.round(timeminandsec);

    if (mincounter === 0) {
      mincounter = 3;
    }

    duration = moment.duration(+duration - +interval, 'milliseconds');

    if (isenableshowtimeinsecond === 1) {
      if (typeofshowtimeinsecond === 0) {
        // always show
        if (
          duration.hours() > 0 &&
          duration.minutes() > 0 &&
          duration.seconds() > 0
        ) {
          timetobreach =
            duration.hours() +
            'h ' +
            duration.minutes() +
            'm ' +
            duration.seconds() +
            's';
        } else if (
          duration.hours() <= 0 &&
          duration.minutes() > 0 &&
          duration.seconds() > 0
        ) {
          timetobreach = duration.minutes() + 'm ' + duration.seconds() + 's';
        } else if (
          duration.hours() <= 0 &&
          duration.minutes() <= 0 &&
          duration.seconds() > 0
        ) {
          timetobreach = duration.seconds() + 's';
        } else if (
          duration.hours() < 0 &&
          duration.minutes() < 0 &&
          duration.seconds() < 0
        ) {
          timetobreach =
            -duration.hours() +
            'h ' +
            -duration.minutes() +
            'm ' +
            -duration.seconds() +
            's ago';
        } else if (
          duration.hours() === 0 &&
          duration.minutes() < 0 &&
          duration.seconds() < 0
        ) {
          timetobreach =
            -duration.minutes() + 'm' + -duration.seconds() + 's ago';
        } else if (
          duration.hours() === 0 &&
          duration.minutes() === 0 &&
          duration.seconds() < 0
        ) {
          timetobreach = -duration.seconds() + 's ago';
        }
      } else {
        // below min counter
        if (
          duration.hours() === 0 &&
          duration.minutes() < mincounter &&
          duration.seconds() > 0
        ) {
          if (
            duration.hours() > 0 &&
            duration.minutes() > 0 &&
            duration.seconds() > 0
          ) {
            timetobreach =
              duration.hours() +
              'h ' +
              duration.minutes() +
              'm ' +
              duration.seconds() +
              's';
          } else if (
            duration.hours() <= 0 &&
            duration.minutes() > 0 &&
            duration.seconds() > 0
          ) {
            timetobreach = duration.minutes() + 'm ' + duration.seconds() + 's';
          } else if (
            duration.hours() <= 0 &&
            duration.minutes() <= 0 &&
            duration.seconds() > 0
          ) {
            timetobreach = duration.seconds() + 's';
          } else if (
            duration.hours() < 0 &&
            duration.minutes() < 0 &&
            duration.seconds() < 0
          ) {
            timetobreach =
              -duration.hours() +
              'h ' +
              -duration.minutes() +
              'm ' +
              -duration.seconds() +
              's ago';
          } else if (
            duration.hours() === 0 &&
            duration.minutes() < 0 &&
            duration.seconds() < 0
          ) {
            timetobreach =
              -duration.minutes() + 'm ' + -duration.seconds() + 's ago';
          } else if (
            duration.hours() === 0 &&
            duration.minutes() === 0 &&
            duration.seconds() < 0
          ) {
            timetobreach = -duration.seconds() + 's ago';
          }
        }
      }
    }
    this.ticketHistoryData.timetobreach = timetobreach;

    if (timetobreach.indexOf('ago') > -1) {
      this.ticketHistoryData.alreadybreached = true;
    }
  }

  ssreLiveWrongPopupLogic(): void {
    let message = `By choosing to the delete action, please note that the reply to customers previously published by the SSRE will also be erased from your configured platforms as well.`;

    if (
      this.ticketHistoryData.deleteSocialEnabled &&
      (this.postData.channelType === ChannelType.FBPageUser ||
        this.postData.channelType === ChannelType.FBComments ||
        this.postData.channelType === ChannelType.BrandTweets ||
        this.postData.channelType === ChannelType.YouTubePosts ||
        this.postData.channelType === ChannelType.YouTubeComments ||
        (this.postData.channelType === ChannelType.InstagramComments &&
          this.postData.instagramPostType === 1))
    ) {
      const dialogData = new AlertDialogModel(
        'Do you want to delete the SSRE reply?',
        message,
        'Keep SSRE Reply',
        'Delete SSRE Reply'
      );
      const dialogRef = this.dialog.open(AlertPopupComponent, {
        disableClose: true,
        autoFocus: false,
        data: dialogData,
      });

      dialogRef.afterClosed().subscribe((dialogResult) => {
        if (dialogResult) {
          this.ssreLiveWrongKeep();
        } else {
          this.ssreLiveWrongDelete();
        }
      });
    } else {
      message = '';
      const dialogData = new AlertDialogModel(
        `You don't have an access to delete the reply!`,
        message,
        'Continue'
      );
      const dialogRef = this.dialog.open(AlertPopupComponent, {
        disableClose: true,
        autoFocus: false,
        data: dialogData,
      });

      dialogRef.afterClosed().subscribe((dialogResult) => {
        if (dialogResult) {
          this.ssreLiveWrongKeep();
        } else {
        }
      });
    }
  }

  directCloseTicket(): void {
    const message =
      '';
    const dialogData = new AlertDialogModel(
      'Are you sure want to close this ticket?',
      message,
      'Yes',
      'No'
    );
    const dialogRef = this.dialog.open(AlertPopupComponent, {
      disableClose: true,
      autoFocus: false,
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        // this.ssreLiveWrongKeep();
        this.closeThisTicket();
      } else {
        // this.ssreLiveWrongDelete();
      }
    });
  }
  closeThisTicket(): void {
    const performActionObj = this._replyService.BuildReply(
      this.postData,
      ActionStatusEnum.DirectClose
    );
    this._replyService.Reply(performActionObj).subscribe((data) => {
      if (data) {
        console.log('closed successfull ', data);
        // this._filterService.currentBrandSource.next(true);
        // this.dialogRef.close(true);
        const ObjPost = {
          post: this.postData,
          operation: PostActionType.Close,
        };
        this.postActionClicked.emit(ObjPost);
        this.postData.ticketInfo.status = TicketStatus.Close;
        this._replyService.setTicktOverview.next(this.postData);
        this._bottomSheet.dismiss();
        this._snackBar.open('Ticket Closed successfully', 'Ok', {
          duration: 2000,
        });
      } else {
        this._snackBar.open('Some error occured', 'Ok', {
          duration: 2000,
        });
      }
      // this.zone.run(() => {
    });
  }

  ssreSimulationWrongPopupLogic(): void {
    this._postDetailService.postObj = this.postData;
    this._postDetailService.isBulk = false;
    // const replyPostRef = this._bottomSheet.open(PostReplyComponent, {
    //   ariaLabel: 'Reply',
    //   panelClass: 'post-reply__wrapper',
    //   backdropClass: 'no-blur',
    //   data: { SSREMode: SSREMode.Simulation, SsreIntent: SsreIntent.Wrong },
    // });
    this.replyInputParams = {};
    this.replyInputParams.SSREMode = SSREMode.Simulation;
    this.replyInputParams.SsreIntent = SsreIntent.Wrong;
    this.replyInputParams.postObj = this.postData;
    this._replyService.checkReplyInputParams.next(this.replyInputParams);
    this.postReplyBlock = !this.postReplyBlock;
  }
  ssreSimulationRightPopupLogic(): void {
    this._postDetailService.postObj = this.postData;
    this._postDetailService.isBulk = false;
    // const replyPostRef = this._bottomSheet.open(PostReplyComponent, {
    //   ariaLabel: 'Reply',
    //   panelClass: 'post-reply__wrapper',
    //   backdropClass: 'no-blur',
    //   data: { SSREMode: SSREMode.Simulation, SsreIntent: SsreIntent.Right },
    // });
    this.replyInputParams = {};
    this.replyInputParams.SSREMode = SSREMode.Simulation;
    this.replyInputParams.SsreIntent = SsreIntent.Right;
    this.replyInputParams.postObj = this.postData;
    this._replyService.checkReplyInputParams.next(this.replyInputParams);
    this.postReplyBlock = !this.postReplyBlock;
  }

  callReplyEvent(status): void {
    this.postReplyBlock = status;
  }

  setSocialHandle(socialObj: SocialHandle): void {
    this.selectedHandle = socialObj;
  }

  setMentionFlag(type, mentionflag): void {
    this.mentionAction = type;
    this.mentionActionFlag = mentionflag;
    // this.selectedHandle = null;
    // get handlenames
    this.GetBrandAccountInformation();

  }
  submitActionHandle(): void {
    if (this.mentionAction) {
      switch (this.mentionAction) {
        case MentionActions.LikeUnlike:
          this.setLikeDislike(this.selectedHandle);
          break;
        case MentionActions.RetweetUntweet:
          this.setTweetRetweet(this.selectedHandle);
          break;
        case MentionActions.Dislike:
          // this.blockUnblockAuthor(this.selectedHandle);
          break;
        default:
          break;
      }
    }
  }

  setLikeDislike(handle: SocialHandle): void {
    const key = this.constructMentionObj();
    key.Account.AccountID = handle.accountId;
    key.Account.SocialID = handle.socialId;
    key.IsLike = !this.mentionActionFlag;

    this._ticketService.likeDislikeMention(key).subscribe((data) => {
      if (data.success) {
        this._snackBar.open('Action Completed Successfully', 'Ok', {
          duration: 1000,
        });
      } else {
        this._snackBar.open('Error Occured', 'Close', {
          duration: 1000,
        });
      }
    });
  }
  setTweetRetweet(handle: SocialHandle): void {
    const key = this.constructMentionObj();
    key.Account.AccountID = handle.accountId;
    key.Account.SocialID = handle.socialId;
    key.IsRetweet = !this.mentionActionFlag;

    this._ticketService.retweetUnRetweetMention(key).subscribe((data) => {
      if (data.success) {
        this._snackBar.open('Action Completed Successfully', 'Ok', {
          duration: 1000,
        });
      } else {
        this._snackBar.open('Error Occured', 'Close', {
          duration: 1000,
        });
      }
    });
  }

  setConditionsFromCommunicationLog(): void {
    let IsCSDUser = false;
    let IsReadOnlySupervisor = false;
    this.ticketHistoryData.communicationLogProperty = {};
    this.ticketHistoryData.communicationLogProperty.likeCount = '0';
    this.ticketHistoryData.communicationLogProperty.shareCount = '0';
    this.ticketHistoryData.communicationLogProperty.commentCount = '0';
    this.ticketHistoryData.communicationLogProperty.showLikeShareBox = true;
    this.ticketHistoryData.communicationLogProperty.likeStatus = false;
    this.ticketHistoryData.communicationLogProperty.retweetStatus = false;
    this.ticketHistoryData.communicationLogProperty.reTweetEnabled = false;

    if (
      +this.currentUser.data.user.role === UserRoleEnum.CustomerCare ||
      +this.currentUser.data.user.role === UserRoleEnum.BrandAccount
    ) {
      IsCSDUser = true;
    }

    if (
      +this.currentUser.data.user.role === UserRoleEnum.ReadOnlySupervisorAgent
    ) {
      IsReadOnlySupervisor = true;
    }
    this.ticketHistoryData.isAddDisableClass = false;
    this.ticketHistoryData.isDeletedMentionDisable = false;
    if (this.postData.isDeletedFromSocial) {
      // addDisableClass = "CheckboxDisable";
      this.ticketHistoryData.isDeletedMentionDisable = true;
    }

    if (!this.postData.isActionable) {
      this.ticketHistoryData.isAddDisableClass = true;
    }
    this.ticketHistoryData.communicationLogProperty.mentionId = `${this.postData.brandInfo.brandID}/${this.postData.channelType}/${this.postData.id}`;
    const ActionButton = this.currentUser.data.user.actionButton;
    this.ticketHistoryData.communicationLogProperty.likeEnabled =
      ActionButton.likeEnabled;
    if (this.postData.channelGroup === ChannelGroup.Twitter) {
      if (this.postData.channelType !== ChannelType.DirectMessages) {
        if (ActionButton.likeEnabled) {
          this.ticketHistoryData.communicationLogProperty.likeStatus = true;
          if (this.postData.likeStatus) {
            if (+this.postData.mentionMetadata.likeCount > 0) {
              this.ticketHistoryData.communicationLogProperty.likeCount = this.kFormatter(
                +this.postData.mentionMetadata.likeCount
              );
            }
          } else {
            if (+this.postData.mentionMetadata.likeCount > 0) {
              this.ticketHistoryData.communicationLogProperty.likeCount = this.kFormatter(
                +this.postData.mentionMetadata.likeCount
              );
            }
          }
        }

        if (ActionButton.retweetEnabled) {
          this.ticketHistoryData.communicationLogProperty.reTweetEnabled = true;
          if (this.postData.isShared) {
            if (+this.postData.mentionMetadata.shareCount > 0) {
              this.ticketHistoryData.communicationLogProperty.shareCount = this.kFormatter(
                +this.postData.mentionMetadata.shareCount
              );
            }
            this.ticketHistoryData.communicationLogProperty.retweetStatus = true;
          } else {
            if (+this.postData.mentionMetadata.shareCount > 0) {
              this.ticketHistoryData.communicationLogProperty.shareCount = this.kFormatter(
                +this.postData.mentionMetadata.shareCount
              );
            }
          }
        }
      }
      if (this.postData.mentionMetadata.commentCount > 0) {
        if (this.postData.channelType === ChannelType.BrandTweets) {
          this.ticketHistoryData.communicationLogProperty.commentCount = this.kFormatter(
            +this.postData.mentionMetadata.commentCount
          );
        } else {
          this.ticketHistoryData.communicationLogProperty.commentCount = this.kFormatter(
            +this.postData.mentionMetadata.commentCount
          );
        }
      }
    }
    if (this.postData.channelGroup === ChannelGroup.Facebook) {
      if (!IsReadOnlySupervisor) {
        if (
          this.postData.channelType !== ChannelType.FBMessages &&
          ActionButton.likeEnabled
        ) {
          if (this.postData.likeStatus) {
            if (+this.postData.mentionMetadata.likeCount > 0) {
              this.ticketHistoryData.communicationLogProperty.likeCount = this.kFormatter(
                +this.postData.mentionMetadata.likeCount
              );
            }
            this.ticketHistoryData.communicationLogProperty.likeStatus = true;
          } else {
            if (+this.postData.mentionMetadata.likeCount > 0) {
              this.ticketHistoryData.communicationLogProperty.likeCount = this.kFormatter(
                +this.postData.mentionMetadata.likeCount
              );
            }
          }
        }
        if (this.postData.mentionMetadata.shareCount > 0) {
          this.ticketHistoryData.communicationLogProperty.shareCount = this.kFormatter(
            +this.postData.mentionMetadata.shareCount
          );
        }
        if (this.postData.mentionMetadata.commentCount > 0) {
          if (this.postData.channelType !== ChannelType.FBPublic) {
            this.ticketHistoryData.communicationLogProperty.commentCount = this.kFormatter(
              +this.postData.mentionMetadata.commentCount
            );
          } else {
            this.ticketHistoryData.communicationLogProperty.commentCount = this.kFormatter(
              +this.postData.mentionMetadata.commentCount
            );
          }
        }
      } else {
        this.ticketHistoryData.communicationLogProperty.showLikeShareBox = false;
      }
    }
    if (this.postData.channelGroup === ChannelGroup.Youtube) {
      if (ActionButton.likeEnabled) {
        if (this.postData.channelType === ChannelType.YouTubePosts) {
          if (this.postData.likeStatus) {
            this.ticketHistoryData.communicationLogProperty.likeStatus = true;
            // <strong><i class="fa fa-thumbs-up"></i></strong>
          } else {
            // <strong><i class="fa fa-thumbs-up"></i></strong>
          }
          if (this.postData.dislikeStatus) {
            // <strong><i class="fa fa-thumbs-down"></i></strong>
          } else {
            // <strong><i class="fa fa-thumbs-down"></i></strong>
          }
        }
        if (this.postData.mentionMetadata.commentCount > 0) {
          this.ticketHistoryData.communicationLogProperty.commentCount = this.kFormatter(
            +this.postData.mentionMetadata.commentCount
          );
        }
      }
    }
    if (this.postData.channelGroup === ChannelGroup.Instagram) {
      if (ActionButton.likeEnabled) {
        if (this.postData.channelType === ChannelType.InstagramPagePosts) {
          if (this.postData.likeStatus) {
            if (+this.postData.mentionMetadata.likeCount > 0) {
              this.ticketHistoryData.communicationLogProperty.likeCount = this.kFormatter(
                +this.postData.mentionMetadata.likeCount
              );
            }
            this.ticketHistoryData.communicationLogProperty.likeStatus = true;
          } else {
            if (+this.postData.mentionMetadata.likeCount > 0) {
              this.ticketHistoryData.communicationLogProperty.likeCount = this.kFormatter(
                +this.postData.mentionMetadata.likeCount
              );
            }
          }
        }
        if (this.postData.mentionMetadata.commentCount > 0) {
          this.ticketHistoryData.communicationLogProperty.commentCount = this.kFormatter(
            +this.postData.mentionMetadata.commentCount
          );
        }
      }
    }
  }

  kFormatter(num): any {
    return Math.abs(num) > 999
      ? Math.sign(num) * +(Math.abs(num) / 1000).toFixed(1) + 'k'
      : Math.sign(num) * Math.abs(num);
  }

  // CRM Search dialog

  openCrmDialog() {
    const dialogRef = this.dialog.open(CrmComponent);
  }

  private GetBrandAccountInformation(): void {
    const obj = {
      Brand: this.postData.brandInfo,
      ChannelGroup: this.postData.channelGroup,
    };

    // call api to get socialaccountlist

    this._replyService.GetBrandAccountInformation(obj).subscribe((data) => {
      console.log(data);
      // this.zone.run(() => {
      if (data) {
        this.objBrandSocialAcount = data.filter((x) => {
          return x.channelGroup === obj.ChannelGroup;
        });
        if (this.objBrandSocialAcount) {
          this.objBrandSocialAcount.forEach((item) => {
            this.handleNames = [];
            this.handleNames.push({
              handleId: item.socialID,
              handleName: item.userName,
              accountId: item.accountID,
              socialId: item.socialID,
              profilepic: item.profileImageURL
                ? item.profileImageURL
                : 'assets/images/channelsv/Brand_Tweet.svg',
            });
          });
        }
      }
    });
  }

  private constructMentionObj(): any {
    this.postData = this.MapLocobuzz.mapMention(this.postData);
    const {
      $type,
      socialID,
      parentSocialID,
      brandInfo,
      channelGroup,
    } = this.postData;
    const BrandInfoObj = {
      BrandID: this.postData.brandInfo.brandID,
      BrandName: this.postData.brandInfo.brandName,
    };
    const source = {
      $type,
      SocialID: socialID,
      ParentSocialID: parentSocialID,
      BrandInfo: BrandInfoObj,
      ChannelGroup: channelGroup,
    };

    const accountObj = this.MapLocobuzz.mapAccountConfiguration(this.postData);

    const account = {
      $type: accountObj.$type,
      BrandInformation: BrandInfoObj,
      AccountID: '',
      SocialID: '',
    };

    const mentionObj = {
      Source: source,
      Account: account,
    };

    return mentionObj;
  }

  getEmailHtmlData(): void {
    this._postDetailService.postObj = this.postData;
    const source = this.MapLocobuzz.mapMention(this._postDetailService.postObj);
    const object = {
      BrandInfo: source.brandInfo,
      TagId: source.tagID,
    };

    this._ticketService.getEmailHtmlData(object).subscribe((data) => {
      if (data.success) {
        if (this.postData.ticketInfo.ticketID === 244436) {
          const a = '';
        }
        this.ticketHistoryData.htmlData = data.data;
      }
    });
  }

  approvalSectionMedia(mention: BaseMention): void {
    this.ticketHistoryData.makercheckerimageurls = [];
    this.ticketHistoryData.makercheckervideoUrls = [];
    this.ticketHistoryData.makercheckerdocumentUrls = [];
    if (mention.channelGroup === ChannelGroup.Twitter) {
      if (
        mention.attachmentMetadata.mediaContents &&
        mention.attachmentMetadata.mediaContents.length > 0
      ) {
        for (const MediaContentItem of mention.attachmentMetadata
          .mediaContents) {
          if (MediaContentItem.mediaType === MediaEnum.IMAGE) {
            if (
              mention.channelType === ChannelType.DirectMessages &&
              MediaContentItem.thumbUrl
            ) {
              if (MediaContentItem.thumbUrl.includes('s3.amazonaws')) {
                // tslint:disable-next-line: max-line-length
                const mimeType = MimeTypes.getMimeTypefromString(
                  MediaContentItem.thumbUrl.split('.').pop()
                );
                const ReplaceText =
                  'https://s3.amazonaws.com/locobuzz.socialimages/';
                let ThumbUrl = MediaContentItem.thumbUrl;
                ThumbUrl = ThumbUrl.replace(ReplaceText, '');
                const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${ThumbUrl}&MimeType=${mimeType}&FileName=${MediaContentItem.name}`;
                this.ticketHistoryData.makercheckerimageurls.push(
                  backgroundUrl
                );
              } else {
                if (mention.isBrandPost) {
                  const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetTwitterDMImage?url=${MediaContentItem.mediaUrl}&brandsocialid=${mention.author.socialId}&brandID=${mention.brandInfo.brandID}&brandName=${mention.brandInfo.brandName}`;
                  this.ticketHistoryData.makercheckerimageurls.push(
                    backgroundUrl
                  );
                } else {
                  const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetTwitterDMImage?url=${MediaContentItem.mediaUrl}&brandsocialid=${mention.inReplyToUserID}&brandID=${mention.brandInfo.brandID}&brandName=${mention.brandInfo.brandName}`;
                  this.ticketHistoryData.makercheckerimageurls.push(
                    backgroundUrl
                  );
                }
              }
            } else {
              const backgroundUrl = `${MediaContentItem.thumbUrl}`;
              this.ticketHistoryData.makercheckerimageurls.push(backgroundUrl);
            }
          }
          if (MediaContentItem.mediaType === MediaEnum.VIDEO) {
            if (
              mention.channelType === ChannelType.DirectMessages &&
              MediaContentItem.thumbUrl
            ) {
              let SocialOrUserId = '';
              if (mention.isBrandPost) {
                SocialOrUserId = mention.author.socialId;
              } else {
                SocialOrUserId = mention.inReplyToUserID;
              }
              if (MediaContentItem.thumbUrl.includes('s3.amazonaws')) {
                // tslint:disable-next-line: max-line-length
                const mimeType = MimeTypes.getMimeTypefromString(
                  MediaContentItem.thumbUrl.split('.').pop()
                );
                const ReplaceText =
                  'https://s3.amazonaws.com/locobuzz.socialimages/';
                let ThumbUrl = MediaContentItem.thumbUrl;
                ThumbUrl = ThumbUrl.replace(ReplaceText, '');
                const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${ThumbUrl}&MimeType=${mimeType}&FileName=${MediaContentItem.name}`;
                this.ticketHistoryData.makercheckerimageurls.push(
                  backgroundUrl
                );
              } else {
                const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                this.ticketHistoryData.makercheckerimageurls.push(
                  backgroundUrl
                );
              }
            } else {
              const backgroundUrl = `${MediaContentItem.thumbUrl}`;
              this.ticketHistoryData.makercheckerimageurls.push(backgroundUrl);
            }
          }
        }
      }
    } else if (mention.channelGroup === ChannelGroup.Facebook) {
      if (
        mention.attachmentMetadata.mediaContents &&
        mention.attachmentMetadata.mediaContents.length > 0
      ) {
        if (mention.mediaType === MediaEnum.IMAGE) {
          if (mention.attachmentMetadata.mediaContents.length > 0) {
            for (const MediaContentItem of mention.attachmentMetadata
              .mediaContents) {
              if (
                mention.channelType === ChannelType.FBMessages &&
                MediaContentItem.thumbUrl
              ) {
                if (MediaContentItem.thumbUrl.includes('s3.amazonaws')) {
                  const mimeType = MimeTypes.getMimeTypefromString(
                    MediaContentItem.thumbUrl.split('.').pop()
                  );
                  const ReplaceText =
                    'https://s3.amazonaws.com/locobuzz.socialimages/';
                  let ThumbUrl = MediaContentItem.thumbUrl;
                  ThumbUrl = ThumbUrl.replace(ReplaceText, '');
                  const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${ThumbUrl}&MimeType=${mimeType}&FileName=${MediaContentItem.name}`;
                  this.ticketHistoryData.makercheckerimageurls.push(
                    backgroundUrl
                  );
                } else {
                  const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                  this.ticketHistoryData.makercheckerimageurls.push(
                    backgroundUrl
                  );
                }
              } else {
                const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                this.ticketHistoryData.makercheckerimageurls.push(
                  backgroundUrl
                );
              }
            }
          }
        } else if (mention.mediaType === MediaEnum.VIDEO) {
          if (
            mention.attachmentMetadata.mediaContents &&
            mention.attachmentMetadata.mediaContents.length > 0
          ) {
            for (const MediaContentItem of mention.attachmentMetadata
              .mediaContents) {
              if (
                MediaContentItem.thumbUrl &&
                (MediaContentItem.thumbUrl.includes('.png') ||
                  MediaContentItem.thumbUrl.includes('.jpg') ||
                  MediaContentItem.thumbUrl.includes('.jpeg') ||
                  MediaContentItem.thumbUrl.includes('.gif'))
              ) {
                if (mention.channelType === ChannelType.FBMessages) {
                  if (MediaContentItem.thumbUrl.includes('s3.amazonaws')) {
                    const mimeType = MimeTypes.getMimeTypefromString(
                      MediaContentItem.thumbUrl.split('.').pop()
                    );
                    const ReplaceText =
                      'https://s3.amazonaws.com/locobuzz.socialimages/';
                    let ThumbUrl = MediaContentItem.thumbUrl;
                    ThumbUrl = ThumbUrl.replace(ReplaceText, '');
                    const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${ThumbUrl}&MimeType=${mimeType}&FileName=${MediaContentItem.name}`;
                    this.ticketHistoryData.makercheckerimageurls.push(
                      backgroundUrl
                    );
                  } else {
                    const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                    this.ticketHistoryData.makercheckerimageurls.push(
                      backgroundUrl
                    );
                  }
                } else {
                  const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                  this.ticketHistoryData.makercheckerimageurls.push(
                    backgroundUrl
                  );
                }
              } else {
                if (MediaContentItem.mediaUrl) {
                  this.ticketHistoryData.makercheckerimageurls.push(
                    MediaContentItem.mediaUrl
                  );
                }
              }
            }
          }
        } else if (mention.mediaType === MediaEnum.URL) {
          if (
            mention.attachmentMetadata.mediaContents &&
            mention.attachmentMetadata.mediaContents.length > 0
          ) {
            for (const MediaContentItem of mention.attachmentMetadata
              .mediaContents) {
              if (
                MediaContentItem.mediaUrl &&
                (MediaContentItem.mediaUrl.includes('.png') ||
                  MediaContentItem.mediaUrl.includes('.jpeg') ||
                  MediaContentItem.mediaUrl.includes('.gif'))
              ) {
                const backgroundUrl = `${MediaContentItem.mediaUrl}`;
                this.ticketHistoryData.makercheckerimageurls.push(
                  backgroundUrl
                );
              } else {
                if (MediaContentItem.mediaUrl) {
                  this.ticketHistoryData.makercheckerimageurls.push(
                    MediaContentItem.mediaUrl
                  );
                }
              }
            }
          }
        } else if (mention.mediaType === MediaEnum.AUDIO) {
          if (
            mention.attachmentMetadata.mediaContents &&
            mention.attachmentMetadata.mediaContents.length > 0
          ) {
            for (const MediaContentItem of mention.attachmentMetadata
              .mediaContents) {
              this.ticketHistoryData.makercheckerimageurls.push(
                'assets/images/common/AudioMusic.svg'
              );
            }
          }
        } else if (mention.mediaType === MediaEnum.ANIMATEDGIF) {
          if (
            mention.attachmentMetadata.mediaContents &&
            mention.attachmentMetadata.mediaContents.length > 0
          ) {
            for (const MediaContentItem of mention.attachmentMetadata
              .mediaContents) {
              this.ticketHistoryData.makercheckerimageurls.push(
                'assets/images/common/AudioMusic.svg'
              );
            }
          }
        } else if (mention.mediaType === MediaEnum.OTHER) {
          if (
            mention.attachmentMetadata.mediaContents &&
            mention.attachmentMetadata.mediaContents.length > 0
          ) {
            for (const MediaContentItem of mention.attachmentMetadata
              .mediaContents) {
              if (
                MediaContentItem.mediaUrl &&
                (MediaContentItem.mediaUrl.includes('.png') ||
                  MediaContentItem.mediaUrl.includes('.jpeg') ||
                  MediaContentItem.mediaUrl.includes('.jpg') ||
                  MediaContentItem.mediaUrl.includes('.gif'))
              ) {
                const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                this.ticketHistoryData.makercheckerimageurls.push(
                  backgroundUrl
                );
              } else if (MediaContentItem.mediaUrl) {
                if (MediaContentItem.mediaUrl.includes('.pdf')) {
                  const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                  this.ticketHistoryData.makercheckerimageurls.push(
                    'assets/images/common/pdf.png'
                  );
                  // bind the  pdf url
                } else if (
                  MediaContentItem.mediaUrl.includes('.doc') ||
                  MediaContentItem.mediaUrl.includes('.docx')
                ) {
                  const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                  this.ticketHistoryData.makercheckerimageurls.push(
                    'assets/images/common/word.png'
                  );
                } else if (
                  MediaContentItem.mediaUrl.includes('.xls') ||
                  MediaContentItem.mediaUrl.includes('.xlsx')
                ) {
                  const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                  this.ticketHistoryData.makercheckerimageurls.push(
                    'assets/images/common/excel-file.png)'
                  );
                } else if (MediaContentItem.mediaUrl.includes('.mp3')) {
                  const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                  this.ticketHistoryData.makercheckerimageurls.push(
                    'assets/images/common/AudioMusic.png)'
                  );
                } else {
                  this.ticketHistoryData.makercheckerimageurls.push(
                    MediaContentItem.mediaUrl
                  );
                }
              } else {
                if (MediaContentItem.mediaUrl) {
                  this.ticketHistoryData.makercheckerimageurls.push(
                    MediaContentItem.mediaUrl
                  );
                }
              }
            }
          }
        }
      }
    } else if (mention.channelGroup === ChannelGroup.GoogleMyReview) {
      if (
        mention.attachmentMetadata.mediaContents &&
        mention.attachmentMetadata.mediaContents.length > 0
      ) {
        if (mention.mediaType === MediaEnum.IMAGE) {
          if (mention.attachmentMetadata.mediaContents.length > 0) {
            for (const MediaContentItem of mention.attachmentMetadata
              .mediaContents) {
              if (
                mention.channelType === ChannelType.FBMessages &&
                MediaContentItem.thumbUrl
              ) {
                if (MediaContentItem.thumbUrl.includes('s3.amazonaws')) {
                  const mimeType = MimeTypes.getMimeTypefromString(
                    MediaContentItem.thumbUrl.split('.').pop()
                  );
                  const ReplaceText =
                    'https://s3.amazonaws.com/locobuzz.socialimages/';
                  let ThumbUrl = MediaContentItem.thumbUrl;
                  ThumbUrl = ThumbUrl.replace(ReplaceText, '');
                  const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${ThumbUrl}&MimeType=${mimeType}&FileName=${MediaContentItem.name}`;
                  this.ticketHistoryData.makercheckerimageurls.push(
                    backgroundUrl
                  );
                } else {
                  const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                  this.ticketHistoryData.makercheckerimageurls.push(
                    backgroundUrl
                  );
                }
              } else {
                const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                this.ticketHistoryData.makercheckerimageurls.push(
                  backgroundUrl
                );
              }
            }
          }
        }
      }
    } else if (mention.channelGroup === ChannelGroup.GooglePlayStore) {
      if (
        mention.attachmentMetadata.mediaContents &&
        mention.attachmentMetadata.mediaContents.length > 0
      ) {
        if (mention.mediaType === MediaEnum.IMAGE) {
          if (mention.attachmentMetadata.mediaContents.length > 0) {
            for (const MediaContentItem of mention.attachmentMetadata
              .mediaContents) {
              if (
                mention.channelType === ChannelType.FBMessages &&
                MediaContentItem.thumbUrl
              ) {
                if (MediaContentItem.thumbUrl.includes('s3.amazonaws')) {
                  const mimeType = MimeTypes.getMimeTypefromString(
                    MediaContentItem.thumbUrl.split('.').pop()
                  );
                  const ReplaceText =
                    'https://s3.amazonaws.com/locobuzz.socialimages/';
                  let ThumbUrl = MediaContentItem.thumbUrl;
                  ThumbUrl = ThumbUrl.replace(ReplaceText, '');
                  const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${ThumbUrl}&MimeType=${mimeType}&FileName=${MediaContentItem.name}`;
                  this.ticketHistoryData.makercheckerimageurls.push(
                    backgroundUrl
                  );
                } else {
                  const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                  this.ticketHistoryData.makercheckerimageurls.push(
                    backgroundUrl
                  );
                }
              } else {
                const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                this.ticketHistoryData.makercheckerimageurls.push(
                  backgroundUrl
                );
              }
            }
          }
        }
      }
    } else if (mention.channelGroup === ChannelGroup.LinkedIn) {
      if (
        mention.attachmentMetadata.mediaContents &&
        mention.attachmentMetadata.mediaContents.length > 0
      ) {
        if (mention.mediaType === MediaEnum.IMAGE) {
          if (mention.attachmentMetadata.mediaContents.length > 0) {
            for (const MediaContentItem of mention.attachmentMetadata
              .mediaContents) {
              if (
                mention.channelType === ChannelType.FBMessages &&
                MediaContentItem.thumbUrl
              ) {
                if (MediaContentItem.thumbUrl.includes('s3.amazonaws')) {
                  const mimeType = MimeTypes.getMimeTypefromString(
                    MediaContentItem.thumbUrl.split('.').pop()
                  );
                  const ReplaceText =
                    'https://s3.amazonaws.com/locobuzz.socialimages/';
                  let ThumbUrl = MediaContentItem.thumbUrl;
                  ThumbUrl = ThumbUrl.replace(ReplaceText, '');
                  const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${ThumbUrl}&MimeType=${mimeType}&FileName=${MediaContentItem.name}`;
                  this.ticketHistoryData.makercheckerimageurls.push(
                    backgroundUrl
                  );
                } else {
                  const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                  this.ticketHistoryData.makercheckerimageurls.push(
                    backgroundUrl
                  );
                }
              } else {
                const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                this.ticketHistoryData.makercheckerimageurls.push(
                  backgroundUrl
                );
              }
            }
          }
        }
      }
    } else if (mention.channelGroup === ChannelGroup.Instagram) {
      if (
        mention.attachmentMetadata.mediaContents &&
        mention.attachmentMetadata.mediaContents.length > 0
      ) {
        if (mention.mediaType === MediaEnum.IMAGE) {
          if (mention.attachmentMetadata.mediaContents.length > 0) {
            for (const MediaContentItem of mention.attachmentMetadata
              .mediaContents) {
              this.ticketHistoryData.makercheckerimageurls.push(
                MediaContentItem.mediaUrl
              );
            }
          }
        } else if (mention.mediaType === MediaEnum.VIDEO) {
          for (const MediaContentItem of mention.attachmentMetadata
            .mediaContents) {
            if (
              MediaContentItem.mediaUrl &&
              MediaContentItem.mediaUrl.includes('.mp4')
            ) {
              const vidurl: VideoUrl = {};
              vidurl.fileUrl = MediaContentItem.mediaUrl;
              vidurl.thumbUrl = MediaContentItem.mediaUrl;
              this.ticketHistoryData.makercheckervideoUrls.push(vidurl);
            } else if (
              (MediaContentItem.thumbUrl &&
                MediaContentItem.thumbUrl.includes('.png')) ||
              MediaContentItem.thumbUrl.includes('.jpg') ||
              MediaContentItem.thumbUrl.includes('.jpeg') ||
              MediaContentItem.thumbUrl.includes('.gif')
            ) {
              this.ticketHistoryData.makercheckerimageurls.push(
                MediaContentItem.thumbUrl
              );
            } else {
              if (MediaContentItem.mediaUrl) {
                this.ticketHistoryData.makercheckerimageurls.push(
                  MediaContentItem.mediaUrl
                );
              }
            }
          }
        }
      }
    } else if (mention.channelGroup === ChannelGroup.Youtube) {
      if (mention.mediaType === MediaEnum.VIDEO) {
        if (
          mention.attachmentMetadata.mediaContents &&
          mention.attachmentMetadata.mediaContents.length > 0
        ) {
          for (const MediaContentItem in mention.attachmentMetadata
            .mediaContents) {
            // Youtube video logic is remaining
            // List<string>
            //     YoutubeVideoID = MediaContentItem.MediaUrl.Split('=').ToList();
            // var VideoID = "";
            // VideoID = YoutubeVideoID[YoutubeVideoID.Count - 1];
            // <div class="fine_bg youtubeVideo">
            //     <iframe src="https://www.youtube.com/embed/@VideoID?rel=0" allowfullscreen></iframe>
            // </div>
          }
        }
      }
    } else if (mention.channelGroup === ChannelGroup.WhatsApp) {
      if (mention.mediaType === MediaEnum.IMAGE) {
        if (
          mention.attachmentMetadata.mediaContents &&
          mention.attachmentMetadata.mediaContents.length > 0
        ) {
          for (const MediaContentItem of mention.attachmentMetadata
            .mediaContents) {
            const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}`;
            this.ticketHistoryData.makercheckerimageurls.push(backgroundUrl);
          }
        }
      } else if (mention.mediaType === MediaEnum.VIDEO) {
        if (
          mention.attachmentMetadata.mediaContents &&
          mention.attachmentMetadata.mediaContents.length > 0
        ) {
          for (const MediaContentItem of mention.attachmentMetadata
            .mediaContents) {
            const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}`;
            const vidurl: VideoUrl = {};
            vidurl.fileUrl = backgroundUrl;
            vidurl.thumbUrl = backgroundUrl;
            this.ticketHistoryData.makercheckervideoUrls.push(vidurl);
          }
        }
      } else if (mention.mediaType === MediaEnum.AUDIO) {
        if (
          mention.attachmentMetadata.mediaContents &&
          mention.attachmentMetadata.mediaContents.length > 0
        ) {
          for (const MediaContentItem of mention.attachmentMetadata
            .mediaContents) {
            const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}`;
            const audurl: AudioUrl = {};
            audurl.fileUrl = backgroundUrl;
            audurl.thumbUrl = backgroundUrl;
            this.ticketHistoryData.audioUrls.push(audurl);
          }
        }
      } else if (mention.mediaType === MediaEnum.PDF) {
        if (
          mention.attachmentMetadata.mediaContents &&
          mention.attachmentMetadata.mediaContents.length > 0
        ) {
          for (const MediaContentItem of mention.attachmentMetadata
            .mediaContents) {
            const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}&FileName=${MediaContentItem.name}`;
            const docurl: DocumentUrl = {};
            docurl.fileUrl = backgroundUrl;
            docurl.thumbUrl = 'assets/images/common/pdf.png';
            this.ticketHistoryData.makercheckerdocumentUrls.push(docurl);
          }
        }
      } else if (mention.mediaType === MediaEnum.DOC) {
        if (
          mention.attachmentMetadata.mediaContents &&
          mention.attachmentMetadata.mediaContents.length > 0
        ) {
          for (const MediaContentItem of mention.attachmentMetadata
            .mediaContents) {
            const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}&FileName=${MediaContentItem.name}`;
            const docurl: DocumentUrl = {};
            docurl.fileUrl = backgroundUrl;
            docurl.thumbUrl = 'assets/images/common/word.png';
            this.ticketHistoryData.makercheckerdocumentUrls.push(docurl);
          }
        }
      } else if (mention.mediaType === MediaEnum.EXCEL) {
        if (
          mention.attachmentMetadata.mediaContents &&
          mention.attachmentMetadata.mediaContents.length > 0
        ) {
          for (const MediaContentItem of mention.attachmentMetadata
            .mediaContents) {
            const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}&FileName=${MediaContentItem.name}`;
            const docurl: DocumentUrl = {};
            docurl.fileUrl = backgroundUrl;
            docurl.thumbUrl = 'assets/images/common/excel-file.png';
            this.ticketHistoryData.makercheckerdocumentUrls.push(docurl);
          }
        }
      } else if (mention.mediaType === MediaEnum.URL) {
        if (
          mention.attachmentMetadata.mediaContents &&
          mention.attachmentMetadata.mediaContents.length > 0
        ) {
          for (const MediaContentItem of mention.attachmentMetadata
            .mediaContents) {
            if (
              MediaContentItem.mediaUrl &&
              (MediaContentItem.mediaUrl.includes('.png') ||
                MediaContentItem.mediaUrl.includes('.jpeg') ||
                MediaContentItem.mediaUrl.includes('.gif'))
            ) {
              this.ticketHistoryData.makercheckerimageurls.push(
                MediaContentItem.mediaUrl
              );
            } else {
              if (MediaContentItem.mediaUrl) {
                this.ticketHistoryData.makercheckerimageurls.push(
                  MediaContentItem.mediaUrl
                );
              }
            }
          }
        }
      } else if (
        mention.mediaType === MediaEnum.OTHER ||
        mention.mediaType === MediaEnum.HTML
      ) {
        if (
          mention.attachmentMetadata.mediaContents &&
          mention.attachmentMetadata.mediaContents.length > 0
        ) {
          for (const MediaContentItem of mention.attachmentMetadata
            .mediaContents) {
            if (
              MediaContentItem.mediaUrl &&
              (MediaContentItem.mediaUrl.includes('.png') ||
                MediaContentItem.mediaUrl.includes('.jpeg') ||
                MediaContentItem.mediaUrl.includes('.gif'))
            ) {
              const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}&FileName=${MediaContentItem.name}`;
              this.ticketHistoryData.makercheckerimageurls.push(backgroundUrl);
            } else if (
              MediaContentItem.mediaUrl &&
              MediaContentItem.mediaUrl.includes('.mp4')
            ) {
              const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}&FileName=${MediaContentItem.name}`;
              const vidurl: VideoUrl = {};
              vidurl.fileUrl = backgroundUrl;
              vidurl.thumbUrl = backgroundUrl;
              this.ticketHistoryData.makercheckerimageurls.push(backgroundUrl);
            } else if (
              MediaContentItem.mediaUrl &&
              MediaContentItem.mediaUrl.includes('.mp3')
            ) {
              const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}&FileName=${MediaContentItem.name}`;
              const audurl: AudioUrl = {};
              audurl.fileUrl = backgroundUrl;
              audurl.thumbUrl = backgroundUrl;
              this.ticketHistoryData.audioUrls.push(audurl);
            } else if (MediaContentItem.mediaUrl) {
              if (MediaContentItem.mediaUrl.includes('.pdf')) {
                const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}&FileName=${MediaContentItem.name}`;
                const docurl: DocumentUrl = {};
                docurl.fileUrl = backgroundUrl;
                docurl.thumbUrl = 'assets/images/common/pdf.png';
                this.ticketHistoryData.makercheckerdocumentUrls.push(docurl);
              } else if (
                MediaContentItem.mediaUrl.includes('.doc') ||
                MediaContentItem.mediaUrl.includes('.docx')
              ) {
                const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}`;
                const docurl: DocumentUrl = {};
                docurl.fileUrl = backgroundUrl;
                docurl.thumbUrl = 'assets/images/common/word.png';
                this.ticketHistoryData.makercheckerdocumentUrls.push(docurl);
              } else if (
                MediaContentItem.mediaUrl.includes('.xls') ||
                MediaContentItem.mediaUrl.includes('.xlsx')
              ) {
                const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}&FileName=${MediaContentItem.name}`;
                const docurl: DocumentUrl = {};
                docurl.fileUrl = backgroundUrl;
                docurl.thumbUrl = 'assets/images/common/excel-file.png';
                this.ticketHistoryData.makercheckerdocumentUrls.push(docurl);
              } else {
                const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}&FileName=${MediaContentItem.name}`;
                this.ticketHistoryData.makercheckerimageurls.push(
                  backgroundUrl
                );
              }
            } else {
              if (MediaContentItem.mediaUrl) {
                const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${MediaContentItem.mediaUrl}&MimeType=${MediaContentItem.thumbUrl}&FileName=${MediaContentItem.name}`;
                this.ticketHistoryData.makercheckerimageurls.push(
                  backgroundUrl
                );
              }
            }
          }
        }
      }
    } else if (
      mention.channelGroup === ChannelGroup.Email &&
      mention.attachmentMetadata.mediaContents &&
      mention.attachmentMetadata.mediaContents.length > 0
    ) {
      this.ticketHistoryData.isemailattachement = true;
    } else if (
      mention.channelGroup === ChannelGroup.AutomotiveIndia ||
      mention.channelGroup === ChannelGroup.Blogs ||
      mention.channelGroup === ChannelGroup.Booking ||
      mention.channelGroup === ChannelGroup.ComplaintWebsites ||
      mention.channelGroup === ChannelGroup.DiscussionForums ||
      mention.channelGroup === ChannelGroup.ECommerceWebsites ||
      mention.channelGroup === ChannelGroup.Expedia ||
      mention.channelGroup === ChannelGroup.GooglePlus ||
      mention.channelGroup === ChannelGroup.HolidayIQ ||
      mention.channelGroup === ChannelGroup.MakeMyTrip ||
      mention.channelGroup === ChannelGroup.News ||
      mention.channelGroup === ChannelGroup.ReviewWebsites ||
      mention.channelGroup === ChannelGroup.TeamBHP ||
      mention.channelGroup === ChannelGroup.TripAdvisor ||
      mention.channelGroup === ChannelGroup.Videos ||
      mention.channelGroup === ChannelGroup.Zomato
    ) {
      if (
        mention.attachmentMetadata.mediaContents &&
        mention.attachmentMetadata.mediaContents.length > 0
      ) {
        if (mention.mediaType === MediaEnum.IMAGE) {
          if (mention.attachmentMetadata.mediaContents.length > 0) {
            for (const MediaContentItem of mention.attachmentMetadata
              .mediaContents) {
              if (
                mention.channelType === ChannelType.FBMessages &&
                MediaContentItem.thumbUrl
              ) {
                if (MediaContentItem.thumbUrl.includes('s3.amazonaws')) {
                  const mimeType = MimeTypes.getMimeTypefromString(
                    MediaContentItem.thumbUrl.split('.').pop()
                  );
                  const ReplaceText =
                    'https://s3.amazonaws.com/locobuzz.socialimages/';
                  let ThumbUrl = MediaContentItem.thumbUrl;
                  ThumbUrl = ThumbUrl.replace(ReplaceText, '');
                  const backgroundUrl = `${this.MediaUrl}/api/WebHook/GetPrivateMediaS3?keyName=${ThumbUrl}&MimeType=${mimeType}&FileName=${MediaContentItem.name}`;
                  this.ticketHistoryData.makercheckerimageurls.push(
                    backgroundUrl
                  );
                } else {
                  const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                  this.ticketHistoryData.makercheckerimageurls.push(
                    backgroundUrl
                  );
                }
              } else {
                const backgroundUrl = `${MediaContentItem.thumbUrl}`;
                this.ticketHistoryData.makercheckerimageurls.push(
                  backgroundUrl
                );
              }
            }
          }
        }
      }
    }
  }

  createTicketCall(): void {
    if (this.postData.ticketInfo.ticketID) {
      this._ticketService
        .getMentionCountByTicektID(this.postData.ticketInfo.ticketID)
        .subscribe((data) => {
          if (data.success) {
            if (+data.data === 1) {
              this.clickTicketMenuTrigger.closeMenu();
              this._snackBar.open(
                'Ticket does not have multiple mentions',
                'Ok',
                {
                  duration: 1000,
                }
              );
            } else {
              this.clickTicketMenuTrigger.openMenu();
            }
          } else {
            this.clickTicketMenuTrigger.closeMenu();
            this._snackBar.open('Error Occured', 'Close', {
              duration: 1000,
            });
          }
        });
    }
  }

  createTicket(note?): void {
    const performActionObj = this._replyService.BuildReply(
      this.postData,
      ActionStatusEnum.CreateTicket,
      note
    );

    this._replyService.Reply(performActionObj).subscribe((data) => {
      if (data) {
        // this._filterService.currentBrandSource.next(true);
        this._bottomSheet.dismiss();
        this._snackBar.open('Ticket created successfully', 'Ok', {
          duration: 2000,
        });
      } else {
        this._snackBar.open('Some error occured', 'Ok', {
          duration: 2000,
        });
      }
      // this.zone.run(() => {
    });
  }

  openCopy_Move() {
    const dialogRef = this.dialog.open(CopyMoveComponent, {
      width: '650px',
    });
  }

  workFlowRejected(note): void {
    const performActionObj = this._replyService.BuildReply(
      this.postData,
      ActionStatusEnum.Reject,
      note
    );

    this._replyService.Reply(performActionObj).subscribe((data) => {
      if (data) {
        console.log('closed successfull ', data);
        this._filterService.currentBrandSource.next(true);
        // this.dialogRef.close(true);
        this._bottomSheet.dismiss();
        this._snackBar.open('Ticket Rejected successfully', 'Ok', {
          duration: 2000,
        });
      } else {
        this._snackBar.open('Some error occured', 'Ok', {
          duration: 2000,
        });
      }
      // this.zone.run(() => {
    });
  }

  workFlowApproved(note): void {
    const performActionObj = this._replyService.BuildReply(
      this.postData,
      ActionStatusEnum.Approve,
      note
    );

    this._replyService.Reply(performActionObj).subscribe((data) => {
      if (data) {
        console.log('closed successfull ', data);
        this._filterService.currentBrandSource.next(true);
        // this.dialogRef.close(true);
        this._bottomSheet.dismiss();
        this._snackBar.open('Ticket Approved successfully', 'Ok', {
          duration: 2000,
        });
      } else {
        this._snackBar.open('Some error occured', 'Ok', {
          duration: 2000,
        });
      }
      // this.zone.run(() => {
    });
  }
  getBrandLogo(brandID): string {
    const brandimage = this._filterService.fetchedBrandData.filter(
      (obj) => +obj.brandID === +brandID
    )[0];
    if (brandimage.rImageURL) {
      return brandimage.rImageURL;
    } else {
      return 'assets/social-mention/post/default_brand.svg';
    }
  }

  vidoPlayDialog() {
    const dialogRef = this.dialog.open(VideoDialogComponent, {
      width: '650px',
    });
  }

  openSubscribePopup(): void {
    this.dialog.open(PostSubscribeComponent, {
      autoFocus: false,
      width: '800px',
      data: this.postData,
      disableClose: true,
    });
  }

  ShowHideButtonsFromTicketStatus(): void {
    switch (this.currentUser.data.user.role) {
      case UserRoleEnum.AGENT:
      case UserRoleEnum.SupervisorAgent:
      case UserRoleEnum.TeamLead:
        // AgentBulkReply.show();
        this._replyService.bulkActionButtons.btnbulkreply = true;
        // AgentBulkDrectClose.show();
        this._replyService.bulkActionButtons.btnbulkdirectclose = true;
        // AgentBulkOnHold.show();
        this._replyService.bulkActionButtons.btnbulkonhold = true;
        // AgentBulkEscalate.show();
        this._replyService.bulkActionButtons.btnbulkescalae = true;
        // AgentBulkReopen.show();
        this._replyService.bulkActionButtons.btnbulkreopen = true;
        // AgentBulkAssign.show();
        this._replyService.bulkActionButtons.btnbulkassign = true;
        break;
      case UserRoleEnum.CustomerCare:
        // CsdBulkApprove.show();
        this._replyService.bulkActionButtons.btnbulkapprove = true;
        // CsdBulkReject.show();
        this._replyService.bulkActionButtons.btnbulkreject = true;
        // CsdBulkOnHold.show();
        this._replyService.bulkActionButtons.btnbulkonhold = true;
        // CsdBulkEscalate.show();
        this._replyService.bulkActionButtons.btnbulkescalae = true;
      // break;
      case UserRoleEnum.BrandAccount:
        this._replyService.bulkActionButtons.btnbulkapprove = true;
        this._replyService.bulkActionButtons.btnbulkreject = true;
        this._replyService.bulkActionButtons.btnbulkonhold = true;
        // BrandBulkApprove.show();
        // BrandBulkReject.show();
        // BrandBulkOnHold.show();
        break;
      default:
        break;
    }

    const OpenTickets = [];
    const PendingTickets = [];
    const AwaitingTickets = [];
    const ClosedTickets = [];
    const OnHoldTickets = [];
    const AwaitingFromCustomerTickets = [];
    const WithNewMentionsTickets = [];
    const SentForApprovalTickets = [];

    const SelectedTickets = this._ticketService.bulkMentionChecked.filter(
      (obj) => obj.guid === this._navigationService.currentSelectedTab.guid
    );

    for (const checkedticket of SelectedTickets) {
      const TicketID = checkedticket.mention.ticketInfo.ticketID;
      const ticketStatus = checkedticket.mention.ticketInfo.status;
      const WorflowStatus =
        checkedticket.mention.makerCheckerMetadata.workflowStatus;
      if (WorflowStatus === LogStatus.ReplySentForApproval) {
        SentForApprovalTickets.push(TicketID);
      }
      switch (this.currentUser.data.user.role) {
        case UserRoleEnum.AGENT:
        case UserRoleEnum.SupervisorAgent:
        case UserRoleEnum.TeamLead:
          switch (ticketStatus) {
            case TicketStatus.Open:
              OpenTickets.push(TicketID);
              break;
            case TicketStatus.PendingwithCSDWithNewMention:
            case TicketStatus.OnHoldCSDWithNewMention:
            case TicketStatus.PendingWithBrandWithNewMention:
            case TicketStatus.RejectedByBrandWithNewMention:
            case TicketStatus.OnHoldBrandWithNewMention:
              WithNewMentionsTickets.push(TicketID);
              break;
            case TicketStatus.PendingwithCSD:
            case TicketStatus.OnHoldCSD:
            case TicketStatus.PendingWithBrand:
            case TicketStatus.RejectedByBrand:
            case TicketStatus.OnHoldBrand:
              AwaitingTickets.push(TicketID);
              break;
            case TicketStatus.PendingwithAgent:
            case TicketStatus.Rejected:
            case TicketStatus.ApprovedByBrand:
              PendingTickets.push(TicketID);
              break;
            case TicketStatus.Close:
              ClosedTickets.push(TicketID);
              break;
            case TicketStatus.OnHoldAgent:
              OnHoldTickets.push(TicketID);
              break;
            case TicketStatus.CustomerInfoAwaited:
              AwaitingFromCustomerTickets.push(TicketID);
              break;
          }
          break;
        case UserRoleEnum.CustomerCare:
          switch (ticketStatus) {
            case TicketStatus.PendingwithCSD:
            case TicketStatus.RejectedByBrand:
            case TicketStatus.ApprovedByBrand:
              OpenTickets.push(TicketID);
              break;
            case TicketStatus.OnHoldCSD:
              OnHoldTickets.push(TicketID);
              break;
          }
          break;

        case 8:
          switch (ticketStatus) {
            case TicketStatus.PendingWithBrand:
              OpenTickets.push(TicketID);
              break;
            case TicketStatus.OnHoldBrand:
              OnHoldTickets.push(TicketID);
              break;
          }
          break;
        default:
          break;
      }
    }

    switch (this.currentUser.data.user.role) {
      case UserRoleEnum.AGENT:
        if (OpenTickets.length > 0) {
          this._replyService.bulkActionButtons.btnbulkreopen = false;
           // AgentBulkReopen.hide();
        }
        if (PendingTickets.length > 0) {
          this._replyService.bulkActionButtons.btnbulkreopen = false;
           // AgentBulkReopen.hide();
        }
        if (ClosedTickets.length > 0) {
          this._replyService.bulkActionButtons.btnbulkdirectclose = false;
          this._replyService.bulkActionButtons.btnbulkescalae = false;
          this._replyService.bulkActionButtons.btnbulkonhold = false;
          this._replyService.bulkActionButtons.btnbulkreply = false;
          this._replyService.bulkActionButtons.btnbulkassign = false;
          // AgentBulkDrectClose.hide();
          // AgentBulkEscalate.hide();
          // AgentBulkOnHold.hide();
          // AgentBulkReply.hide();
          // AgentBulkAssign.hide();
        }
        if (OnHoldTickets.length > 0) {
           // AgentBulkOnHold.hide();
          this._replyService.bulkActionButtons.btnbulkonhold = false;
        }
        if (AwaitingTickets.length > 0) {
          this._replyService.bulkActionButtons.btnbulkescalae = false;
          this._replyService.bulkActionButtons.btnbulkassign = false;
          // AgentBulkEscalate.hide();
          // AgentBulkAssign.hide();
        }
        if (WithNewMentionsTickets.length > 0) {
          this._replyService.bulkActionButtons.btnbulkdirectclose = false;
          this._replyService.bulkActionButtons.btnbulkescalae = false;
          this._replyService.bulkActionButtons.btnbulkonhold = false;
          this._replyService.bulkActionButtons.btnbulkreply = false;
          this._replyService.bulkActionButtons.btnbulkassign = false;
          // AgentBulkDrectClose.hide();
          // AgentBulkEscalate.hide();
          // AgentBulkOnHold.hide();
          // AgentBulkReopen.hide();
          // AgentBulkAssign.hide();
        }
        if (SentForApprovalTickets.length > 0) {
          this._replyService.bulkActionButtons.btnbulkdirectclose = false;
          this._replyService.bulkActionButtons.btnbulkescalae = false;
          this._replyService.bulkActionButtons.btnbulkonhold = false;
          this._replyService.bulkActionButtons.btnbulkreply = false;
          this._replyService.bulkActionButtons.btnbulkassign = false;
          this._replyService.bulkActionButtons.btnbulkreopen = false;
          // AgentBulkDrectClose.hide();
          // AgentBulkEscalate.hide();
          // AgentBulkOnHold.hide();
          // AgentBulkReply.hide();
          // AgentBulkReopen.hide();
          // AgentBulkAssign.hide();
        }
        break;
      case UserRoleEnum.SupervisorAgent:
      case UserRoleEnum.TeamLead:
        if (OpenTickets.length > 0) {
          // AgentBulkReopen.hide();
          this._replyService.bulkActionButtons.btnbulkreopen = false;
        }
        if (PendingTickets.length > 0) {
          // AgentBulkReopen.hide();
          this._replyService.bulkActionButtons.btnbulkreopen = false;
        }
        if (ClosedTickets.length > 0) {
          // AgentBulkDrectClose.hide();
          // AgentBulkEscalate.hide();
          // AgentBulkOnHold.hide();
          // AgentBulkReply.hide();
          // AgentBulkAssign.hide();
          this._replyService.bulkActionButtons.btnbulkdirectclose = false;
          this._replyService.bulkActionButtons.btnbulkescalae = false;
          this._replyService.bulkActionButtons.btnbulkonhold = false;
          this._replyService.bulkActionButtons.btnbulkreply = false;
          this._replyService.bulkActionButtons.btnbulkassign = false;
        }
        if (OnHoldTickets.length > 0) {
          // AgentBulkOnHold.hide();
          this._replyService.bulkActionButtons.btnbulkonhold = false;
        }
        if (AwaitingTickets.length > 0) {
          // AgentBulkEscalate.hide();
          // AgentBulkAssign.hide();
          this._replyService.bulkActionButtons.btnbulkescalae = false;
          this._replyService.bulkActionButtons.btnbulkassign = false;
        }
        if (WithNewMentionsTickets.length > 0) {
          // AgentBulkDrectClose.hide();
          // AgentBulkEscalate.hide();
          // AgentBulkOnHold.hide();
          // AgentBulkReopen.hide();
          // //AgentBulkAssign.hide();
          this._replyService.bulkActionButtons.btnbulkdirectclose = false;
          this._replyService.bulkActionButtons.btnbulkescalae = false;
          this._replyService.bulkActionButtons.btnbulkonhold = false;
          this._replyService.bulkActionButtons.btnbulkreopen = false;
          this._replyService.bulkActionButtons.btnbulkassign = false;
        }
        if (SentForApprovalTickets.length > 0) {
          // AgentBulkReply.hide();
          this._replyService.bulkActionButtons.btnbulkreply = false;
        }
        break;
      case UserRoleEnum.CustomerCare:
        if (OnHoldTickets.length > 0) {
          // CsdBulkOnHold.hide();
          this._replyService.bulkActionButtons.btnbulkonhold = false;
        }
        break;
      case UserRoleEnum.BrandAccount:
        if (OnHoldTickets.length > 0) {
          // BrandBulkOnHold.hide();
          this._replyService.bulkActionButtons.btnbulkonhold = false;
        }
        break;
      default:
        break;
    }
  }

  onlyUnique(value, index, self): boolean {
    return self.indexOf(value) === index;
  }

  makeactionable(): void {
    const source = this.MapLocobuzz.mapMention(this.postData);
    const sourceobj = {
      Source: source,
      NonActionableAuthorName: 'Anonymous',
      actionTaken: 0,
    };
    this._replyService.MarkActionable(sourceobj).subscribe((data) => {
      console.log('mention marked actionable ', data);
      this.openTicketDetail(data.ticketID);
      this.ticketHistoryData.showMarkactionable = false;
      this.ticketHistoryData.showTicketWindow = true;
      // this.dialogRef.close(true);

      // this.zone.run(() => {
    });
  }
  ngOnDestroy(): void {
    // this._postDetailService.currentPostObject.unsubscribe();
    this.subs.unsubscribe();
  }

  getRequestPopup(): void {
    const BrandIds = [];
    BrandIds.push(this.postData.brandInfo.brandID);
    const postCRMdata = this._filterService.fetchedBrandData.find(
      (brand: BrandList) => +brand.brandID === this.postData.brandInfo.brandID
    );
    const TicketParams = {
      UtcOffset: -330,
      Accounttype: +this.currentUser.data.user.role,
      BrandFriendlyName: this.postData.brandInfo.brandFriendlyName,
      BrandIds,
      NoOfRows: 50,
      RecordOffset: 0,
      TicketID: this.postData.ticketInfo.ticketID,
      AuthorID: this.postData.author.socialId,
      ChannelGroupID: this.postData.channelGroup,
      ChannelType: this.postData.channelType,
      SocialID: this.postData.socialID,
      PostType: 1,
      IsTakeOver: null,
      From: 0,
      To: 50,
      TagID: this.postData.tagID
    };

    const sourceobj = {
      AuthorName: this.postData.author.name,
      AuthorFullName: '',
      AuthorProfileURL: this.postData.author.profileUrl,
      AuthorFollowerCount: this.postData.author.followersCount,
      AuthorFollowingCount: this.postData.author.followingCount,
      TimeOffset: new Date().getTimezoneOffset(),
      TicketParams,
      BrandID: this.postData.brandInfo.brandID,
      BrandName: this.postData.brandInfo.brandName,
      SrID: this.postData.ticketInfo.srid,
      AuthorProfilePicUrl: this.postData.author.picUrl,
      CRMClassName: postCRMdata.crmClassName,
      ChannelType: this.postData.channelType,
      IsRequestPopup: false,
      EndDateEpoch: this.postData.mentionTimeEpoch
    };

    this._crmService.GetBrandCrmRequestDetails(sourceobj).subscribe((data) => {

      if (postCRMdata.crmClassName.toLowerCase() === 'bandhancrm') {
        let FirstName = '';
        let LastName = '';
        if (data.details.authorDetails) {
          const PersonalDetailsName = data.details.authorDetails.locoBuzzCRMDetails.name;
          let names = PersonalDetailsName.split(' ');
          if (names.length === 0) {
            names = PersonalDetailsName.split('.');
          }
          if (names.length === 0) {
            names = PersonalDetailsName.split('_');
          }

          if (names.length > 1) {
            FirstName = names[0];
            LastName = names[1];
          }
          else if (names.length === 1) {
            FirstName = names[0];
          }
        }
        let bandhanrequest: BandhanRequest;
        bandhanrequest = {

          UserProfileurl: data.details.userProfileurl,
          FollowingCount: data.details.authorDetails.followingCount,
          FollowerCount: (data.details.authorDetails) ? data.details.authorDetails.followersCount : 0,
          LocobuzzTicketID: data.details.locobuzzTicketID,
          MobileNumber: (data.details.authorDetails) ? data.details.authorDetails.locoBuzzCRMDetails.phoneNumber : '',
          EmailAddress: (data.details.authorDetails) ? data.details.authorDetails.locoBuzzCRMDetails.emailID : '',
          FirstName,
          LastName,
          RequestType: data.details.requestType,
          UCIC: (data.details.authorDetails) ? data.details.authorDetails.socialID : '',
          ConversationLog: data.details.conversationLog,
          Remarks: data.details.remarks,
          Channel: data.details.channel,
          TagID: data.details.tagID,
          ChannelType: data.details.channelType,
          ProductGroup: data.details.productgroup,
          QueryType: data.details.querytype,
          QueryName: data.details.queryname,
          SubChannel: data.details.subChannel,
          UserName: data.details.userName,
          FullName: data.details.fullname,
          CreatedBy: data.details.createdBy,
          SrID: data.details.srID,
          IsUserFeedback: data.details.isUserFeedback,
          LoggedInUserEmailAddress: data.details.loggedInUserEmailAddress,
          Source: data.details.source,
          LosLeadID: '',
          AuthorDetails: (data.details.authorDetails) ? data.details.authorDetails : ''

        };
        this._crmService.bandhanrequest = bandhanrequest;
      }
      else if (postCRMdata.crmClassName.toLowerCase() === 'fedralcrm') {

        let FirstName = '';
        let LastName = '';
        if (data.details.authorDetails) {
          const PersonalDetailsName = data.details.authorDetails.locoBuzzCRMDetails.name;
          let names = PersonalDetailsName.split(' ');
          if (names.length === 0) {
            names = PersonalDetailsName.split('.');
          }
          if (names.length === 0) {
            names = PersonalDetailsName.split('_');
          }

          if (names.length > 1) {
            FirstName = names[0];
            LastName = names[1];
          }
          else if (names.length === 1) {
            FirstName = names[0];
          }
        }
        let fedralrequest: FedralRequest;
        fedralrequest = {
          Source: data.details.source,
          LocobuzzTicketID: data.details.locobuzzTicketID,
          MobileNumber: (data.details.authorDetails) ? data.details.authorDetails.locoBuzzCRMDetails.phoneNumber : '',
          EmailAddress: (data.details.authorDetails) ? data.details.authorDetails.locoBuzzCRMDetails.emailID : '',
          FirstName,
          LastName,
          Category: '',
          RequestType: data.details.requestType,
          UCIC: (data.details.authorDetails) ? data.details.authorDetails.socialID : '',
          ConversationLog: data.details.conversationLog,
          Remarks: '',
          Channel: data.details.channel,
          TagID: data.details.tagID,
          ChannelType: data.details.channelType,
          Severity: '',
          City: '',
          State: '',
          Address: '',
          PostalCode: '',
          Country: '',
          UserProfileurl: data.details.userProfileurl,
          FollowingCount: (data.details.authorDetails) ? data.details.authorDetails.followingCount : '',
          FollowerCount: (data.details.authorDetails) ? data.details.authorDetails.followersCount : '',
          SubChannel: data.details.subChannel,
          UserName: data.details.userName,
          FullName: data.details.fullname,
          CreatedBy: data.details.createdBy,
          SrID: data.details.srID,
          IsUserFeedback: data.details.isUserFeedback,
          LoggedInUserEmailAddress: data.details.loggedInUserEmailAddress,
          LosLeadID: '',
        };
        this._crmService.fedralrequest = fedralrequest;

      }
      else if (postCRMdata.crmClassName.toLowerCase() === 'magmacrm') {
        let FirstName = '';
        let LastName = '';
        if (data.details.authorDetails) {
          const PersonalDetailsName = data.details.authorDetails.locoBuzzCRMDetails.name;
          let names = PersonalDetailsName.split(' ');
          if (names.length === 0) {
            names = PersonalDetailsName.split('.');
          }
          if (names.length === 0) {
            names = PersonalDetailsName.split('_');
          }

          if (names.length > 1) {
            FirstName = names[0];
            LastName = names[1];
          }
          else if (names.length === 1) {
            FirstName = names[0];
          }
        }
        let magmarequest: MagmaRequest;
        magmarequest = {
          Source: data.details.source,
          LocobuzzTicketID: data.details.locobuzzTicketID,
          MobileNumber: (data.details.authorDetails) ? data.details.authorDetails.locoBuzzCRMDetails.phoneNumber : '',
          EmailAddress: (data.details.authorDetails) ? data.details.authorDetails.locoBuzzCRMDetails.emailID : '',
          PanCard: data.details.panCard,
          FirstName,
          LastName,
          Product: data.details.product,
          UCIC: (data.details.authorDetails) ? data.details.authorDetails.socialID : '',
          ConversationLog: data.details.conversationLog,
          Remarks: data.details.remarks,
          Channel: data.details.channel,
          TagID: data.details.tagID,
          ChannelType: data.details.channelType,
          UserProfileurl: data.details.userProfileurl,
          FollowingCount: (data.details.authorDetails) ? data.details.authorDetails.followingCount : '',
          FollowerCount: (data.details.authorDetails) ? data.details.authorDetails.followersCount : '',
          SubChannel: data.details.subChannel,
          UserName: data.details.userName,
          FullName: data.details.fullname,
          CreatedBy: data.details.createdBy,
          SrID: data.details.srID,
          IsUserFeedback: data.details.isUserFeedback,
          LoggedInUserEmailAddress: data.details.loggedInUserEmailAddress,
          LosLeadID: data.details.losLeadID,
          Customer: data.details.customer,
          Disposition: data.details.disposition,
          SubDisposition: data.details.subDisposition,
          LeadStatus: data.details.leadStatus,
          LeadStage: data.details.leadStage,
          LeadSubStage: data.details.leadSubStage,
          NewAppointmentDate: data.details.newAppointmentDate,
          CurrentOwner: data.details.currentOwner,
          Owner: data.details.owner

        };
        this._crmService.magmarequest = magmarequest;
      }
      else if (postCRMdata.crmClassName.toLowerCase() === 'titancrm') {
        let FirstName = '';
        let LastName = '';
        if (data.details.authorDetails) {
          const PersonalDetailsName = data.details.authorDetails.locoBuzzCRMDetails.name;
          let names = PersonalDetailsName.split(' ');
          if (names.length === 0) {
            names = PersonalDetailsName.split('.');
          }
          if (names.length === 0) {
            names = PersonalDetailsName.split('_');
          }

          if (names.length > 1) {
            FirstName = names[0];
            LastName = names[1];
          }
          else if (names.length === 1) {
            FirstName = names[0];
          }
        }
        let titanrequest: TitanRequest;
        titanrequest = {
          CaseSource: (data.details.caseSource) ? data.details.caseSource : '',
          UserName: (data.details.username) ? data.details.username : '',
          LocobuzzTicketID: (data.details.locobuzzTicketID) ? data.details.locobuzzTicketID : '',
          Channel: (data.details.channel) ? data.details.channel : '',
          SubChannel: (data.details.subChannel) ? data.details.subChannel : '',
          UserProfileurl: (data.details.userProfileurl) ? data.details.userProfileurl : '',
          FollowingCount: (data.details.authorDetails) ? data.details.authorDetails.followingCount : '',
          FollowerCount: (data.details.authorDetails) ? data.details.authorDetails.followersCount : '',
          ConversationLog: data.details.conversationLog,
          FullName: (data.details.fullname) ? data.details.fullname : '',
          MobileNumber: (data.details.authorDetails) ? data.details.authorDetails.locoBuzzCRMDetails.phoneNumber : '',
          EmailAddress: (data.details.authorDetails) ? data.details.authorDetails.locoBuzzCRMDetails.emailID : '',
          CustomerId: (data.details.customerId) ? data.details.customerId : '',
          StoreLocation: (data.details.storeLocation) ? data.details.storeLocation : '',
          Remarks: (data.details.remarks) ? data.details.remarks : '',
          QueryType: '',
          FunctionalArea: '',
          DomainArea: '',
          TagID: data.details.tagID,
          ChannelType: data.details.channelType,
          LoggedInUserEmailAddress: (data.details.loggedInUserEmailAddress) ? data.details.loggedInUserEmailAddress : '',
          CreatedBy: (data.details.createdBy) ? data.details.createdBy : '',
          SrID: (data.details.srID) ? data.details.srID : '',
          IsUserFeedback: data.details.isUserFeedback
        };
        this._crmService.titanrequest = titanrequest;
      }

      this._postDetailService.postObj = this.postData;
      if (this.postData.ticketInfo.srid) {

        const dialogRef = this.dialog.open(CrmComponent, {
          width: '1000px',
        });
      }
      else {
        const dialogRef = this.dialog.open(NewSrComponent, {
          width: '1000px',
        });
      }
    });


  }

  openAttachmentPreview(): void {
    if (this.postData.attachmentMetadata) {
      const attachments = this.postData.attachmentMetadata.mediaContents;
      if (attachments.length > 0) {
        const attachmentDialog = this.dialog.open(VideoDialogComponent, {
          panelClass: 'overlay_bgColor',
          data: attachments,
          autoFocus: false
        });
      }
    }
  }
  buttonEnter(trigger) {
    setTimeout(() => {
      if(this.prevButtonTrigger && this.prevButtonTrigger != trigger){
        this.prevButtonTrigger.closeMenu();
        this.prevButtonTrigger = trigger;
        trigger.openMenu();
      }
      else if (!this.isMatMenuOpen) {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger
        trigger.openMenu()
      }
      else {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger
      }
    })
  }

  buttonLeave(trigger, button) {
    setTimeout(() => {
      if (this.enteredButton && !this.isMatMenuOpen) {
        trigger.closeMenu();
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } if (!this.isMatMenuOpen) {
        trigger.closeMenu();
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
        
      } else {
        this.enteredButton = false;
        
      }
    }, 1000)
  }
  menuenter() {
    this.isMatMenuOpen = true;
    if (this.isMatMenu2Open) {
      this.isMatMenu2Open = false;
    }
   }
   menuLeave(trigger, button) {
    setTimeout(() => {
      if (!this.isMatMenu2Open && !this.enteredButton) {
        this.isMatMenuOpen = false;
        trigger.closeMenu();
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } else {
        this.isMatMenuOpen = false;
      }
    }, 80)
  }
}
