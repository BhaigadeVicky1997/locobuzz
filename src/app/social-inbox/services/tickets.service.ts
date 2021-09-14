import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { SocialAuthor } from 'app/core/abstractclasses/SocialAuthor';
import { ChannelGroup } from 'app/core/enums/ChannelGroup';
import { EmailAuthor } from 'app/core/models/authors/email/EmailAuthor';
import { FacebookAuthor } from 'app/core/models/authors/facebook/FacebookAuthor';
import { GenericAuthor } from 'app/core/models/authors/generic/GenericAuthor';
import { GoogleMyReviewAuthor } from 'app/core/models/authors/google/GoogleMyReviewAuthor';
import { GooglePlayStoreAuthor } from 'app/core/models/authors/google/GooglePlayStoreAuthor';
import { YoutubeAuthor } from 'app/core/models/authors/google/YoutubeAuthor';
import { InstagramAuthor } from 'app/core/models/authors/instagram/InstagramAuthor';
import { LinkedInAuthor } from 'app/core/models/authors/linkedin/LinkedInAuthor';
import { TwitterAuthor } from 'app/core/models/authors/twitter/twitterAuthor';
import { WebsiteAuthor } from 'app/core/models/authors/website/websiteAuthor';
import { WhatsAppAuthor } from 'app/core/models/authors/whatsapp/WhatsAppAuthor';
import { EmailMention } from 'app/core/models/mentions/email/EmailMention';
import { FacebookMention } from 'app/core/models/mentions/facebook/FacebookMention';
import { GoogleMyReviewMention } from 'app/core/models/mentions/google/GoogleMyReviewMention';
import { GooglePlayStoreMention } from 'app/core/models/mentions/google/GooglePlayStoreMention';
import { YoutubeMention } from 'app/core/models/mentions/google/YoutubeMention';
import { InstagramMention } from 'app/core/models/mentions/instagram/InstagramMention';
import { LinkedinMention } from 'app/core/models/mentions/linkedin/LinkedinMention';
import { BaseMention, BaseMentionObj, BaseMentionWithCommLog } from 'app/core/models/mentions/locobuzz/BaseMention';
import { Mention, MentionObj } from 'app/core/models/mentions/locobuzz/Mention';
import { NonActionableMention } from 'app/core/models/mentions/nonactionable/NonActionableMention';
import { TwitterMention } from 'app/core/models/mentions/twitter/TwitterMention';
import { WebsiteChatbotMention } from 'app/core/models/mentions/websitechatbot/WebsiteChatbotMention';
import { WhatsAppMention } from 'app/core/models/mentions/whatsapp/WhatsAppMention';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { ChannelType } from 'app/core/enums/ChannelType';
import { TicketTimings } from 'app/core/interfaces/TicketClient';
import { IApiResponse } from 'app/core/models/viewmodel/IApiResponse';
import { PostsType } from 'app/core/models/viewmodel/GenericFilter';
import { MentionCounts, MentionCountsResponse } from 'app/core/models/viewmodel/MentionCounts';
import { BulkMentionChecked } from 'app/core/models/dbmodel/TicketReplyDTO';


export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
}

/**
 * The Json object for to-do list data.
 */
const TREE_DATA = {
  DebitCardIssue: {
    'Auto Detected': null,
    'Transfer Issue': null,
    'Wrong Pin': null
  },
  InternetBanking: [
    'Auto Detected',
    'Transfer Issue',
    'Wrong Pin'
  ]
};

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);
  ticketsFound: number;
  get data(): TodoItemNode[] { return this.dataChange.value; }
  MentionListObj: BaseMention[] = [];
  testingMentionObj: BaseMention[] = [];
  public selectedPostList: number[] = [];
  public bulkMentionChecked: BulkMentionChecked[] = [];
  public postSelectTrigger: BehaviorSubject<any> = new BehaviorSubject <number>(0);
  ticketStatusChange = new BehaviorSubject<boolean>(false);
  constructor(private _http: HttpClient) {
    this.initialize();
  }
  initialize(): void {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    const data = this.buildFileTree(TREE_DATA, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: { [key: string]: any }, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /** Add an item to to-do list */
  insertItem(parent: TodoItemNode, name: string): void {
    if (parent.children) {
      parent.children.push({ item: name } as TodoItemNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: TodoItemNode, name: string): void {
    node.item = name;
    this.dataChange.next(this.data);
  }

  GetTickets(filterObj): Observable<BaseMention[]>{

    // const AuthToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjYzY3Y2E5Zi01MmRmLTQwMTItOWUxMS1mODc0MmVmZjQ5MmMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzQ2NCIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IkFrc2hheSIsImV4cCI6MTYxMDE5MzI2MCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.UnQElv_aLTBCDyX_3AODjnSSDpBh8s1SvJejPzl3Dxk';
    // const Theaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   Authorization: `Bearer ${AuthToken}`
    // });
    return  this._http.post<BaseMentionObj>(environment.baseUrl + '/Tickets/List', filterObj).pipe(
      map(response => {
          if (response.success)
          {
            const MentionList: BaseMention[] = response.data.mentionList;
            this.ticketsFound = response.data.totalRecords;
            this.MentionListObj = response.data.mentionList;
            this.testingMentionObj = MentionList.slice(3);
            return MentionList;
          }
      })
    );

  }

  GetTicketsByTicketIds(filterObj): Observable<BaseMention[]>{
    // const AuthToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjYzY3Y2E5Zi01MmRmLTQwMTItOWUxMS1mODc0MmVmZjQ5MmMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzQ2NCIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IkFrc2hheSIsImV4cCI6MTYxMDE5MzI2MCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.UnQElv_aLTBCDyX_3AODjnSSDpBh8s1SvJejPzl3Dxk';
    // const Theaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   Authorization: `Bearer ${AuthToken}`
    // });
    return  this._http.post<BaseMentionObj>(environment.baseUrl + '/Tickets/List', filterObj).pipe(
      map(response => {
          if (response.success)
          {
            const MentionList: BaseMention[] = response.data.mentionList;
            return MentionList;
          }
      })
    );

  }



  getMentionList(key): Observable<BaseMention[]>
  {
    return  this._http.post<BaseMentionObj>(environment.baseUrl + '/Tickets/MentionList', key).pipe(
      map(response => {
          if (response.success)
          {
            const MentionList: BaseMention[] = response.data.mentionList;
            this.ticketsFound = response.data.totalRecords;
            this.MentionListObj = response.data.mentionList;
            return MentionList;
          }
      })
    );
  }

  getMentionCount(key): Observable<MentionCounts>
  {
    return  this._http.post<MentionCountsResponse>(environment.baseUrl + '/Mention/GetMentionCounts', key).pipe(
      map(response => {
          if (response.success)
          {
            return response.data;
          }
      })
    );
  }



  MapMention(mention: any): Mention
  {
    switch (mention.ChannelGroup)
    {
    case ChannelGroup.Twitter:
      mention as TwitterMention;
      mention.author as TwitterAuthor;
      break;
    case ChannelGroup.Facebook :
      mention as FacebookMention;
      mention.author as FacebookAuthor;
      break;
    case ChannelGroup.Instagram:
      mention as InstagramMention;
      mention.author as InstagramAuthor;
      break;
    case ChannelGroup.Youtube :
      mention as YoutubeMention;
      mention.author as YoutubeAuthor;
      break;
    case ChannelGroup.LinkedIn :
      mention as LinkedinMention;
      mention.author as LinkedInAuthor;
      break;
    case ChannelGroup.GooglePlus:
      mention as NonActionableMention;
      break;
    case ChannelGroup.GooglePlayStore:
      mention as GooglePlayStoreMention;
      mention.author as GooglePlayStoreAuthor;
      break;
    case ChannelGroup.AutomotiveIndia:
      mention as NonActionableMention;
      mention.author as GenericAuthor;
      break;
    case ChannelGroup.Blogs:
      mention as NonActionableMention;
      mention.author as GenericAuthor;
      break;
    case ChannelGroup.Booking:
      mention as NonActionableMention;
      mention.author as GenericAuthor;
      break;
    case ChannelGroup.ComplaintWebsites:
      mention as NonActionableMention;
      mention.author as GenericAuthor;
      break;
    case ChannelGroup.CustomerCare:
      mention as NonActionableMention;
      mention.author as GenericAuthor;
      break;
    case ChannelGroup.DiscussionForums:
      mention as NonActionableMention;
      mention.author as GenericAuthor;
      break;
    case ChannelGroup.ECommerceWebsites:
      mention as NonActionableMention;
      mention.author as GenericAuthor;
      break;
    case ChannelGroup.Expedia :
      mention as NonActionableMention;
      mention.author as GenericAuthor;
      break;
    case ChannelGroup.HolidayIQ :
      mention as NonActionableMention;
      mention.author as GenericAuthor;
      break;
    case ChannelGroup.MakeMyTrip :
      mention as NonActionableMention;
      mention.author as GenericAuthor;
      break;
    case ChannelGroup.MyGov :
      mention as NonActionableMention;
      mention.author as GenericAuthor;
      break;
    case ChannelGroup.News :
      mention as NonActionableMention;
      mention.author as GenericAuthor;
      break;
    case ChannelGroup.ReviewWebsites :
      mention as NonActionableMention;
      mention.author as GenericAuthor;
      break;
    case ChannelGroup.TeamBHP :
      mention as NonActionableMention;
      mention.author as GenericAuthor;
      break;
    case ChannelGroup.TripAdvisor:
      mention as NonActionableMention;
      mention.author as GenericAuthor;
      break;
    case ChannelGroup.Videos:
      mention as NonActionableMention;
      mention.author as GenericAuthor;
      break;
    case ChannelGroup.Zomato:
      mention as NonActionableMention;
      mention.author as GenericAuthor;
      break;
    case ChannelGroup.Email :
      mention as EmailMention;
      mention.author as EmailAuthor;
      break;
    case ChannelGroup.GoogleMyReview :
      mention as GoogleMyReviewMention;
      mention.author as GoogleMyReviewAuthor;
      break;
    case ChannelGroup.WhatsApp :
      mention as WhatsAppMention;
      mention.author as WhatsAppAuthor;
      break;
    case ChannelGroup.WebsiteChatBot :
      mention as WebsiteChatbotMention;
      mention.author as WebsiteAuthor;
      break;
    case ChannelGroup.AppStoreReviews :
      mention as NonActionableMention;
      mention.author as GenericAuthor;
      break;
    default:
      mention as NonActionableMention;
      mention.author as GenericAuthor;
      break;

    }
    return mention;
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
      channeltypeicon = `assets/images/channelicons/${
        ChannelGroup[mention.channelGroup]
      }.png`;
    }
    return channeltypeicon;
  }

  calculateTicketTimes(obj: BaseMention): TicketTimings {
    const tickettiming: TicketTimings = {};

    const end = moment();
    const start = moment.utc(obj.mentionTime).local().format();

    tickettiming.createdDate = obj.ticketInfo.caseCreatedDate ? moment.utc(obj.ticketInfo.caseCreatedDate).local().format('MMMM Do YYYY, h:mm:ss a') : '';
    tickettiming.modifiedDate = obj.modifiedDate ? moment.utc(obj.modifiedDate).local().format('MMMM Do YYYY, h:mm:ss a') : '';
    tickettiming.mentionDate = obj.mentionTime ? moment.utc(obj.mentionTime).local().format('MMMM Do YYYY, h:mm:ss a') : '';

    const duration = moment.duration(moment(end).diff(moment(start)));

     // Get Days
    const days = Math.floor(duration.asDays()); // .asDays returns float but we are interested in full days only
    const daysFormatted = days ? `${days}d ` : ''; // if no full days then do not display it at all
    // console.log(`%c ${daysFormatted}`, 'background:pink');
    tickettiming.days = daysFormatted;
    tickettiming.valDays = String(days);
     // Get Hours
    const hours = duration.hours();
    const hoursFormatted = `${hours}h `;
    // console.log(`%c ${hoursFormatted}`, 'background:yellow');
    tickettiming.hours = hoursFormatted;
    tickettiming.valHours = String(hours);

     // Get Minutes
    const minutes = duration.minutes();
    const minutesFormatted = `${minutes}m`;
    // console.log(`%c ${minutesFormatted}`, 'background:green');
    tickettiming.minutes = minutesFormatted;
    tickettiming.valMinutes = String(minutes);

    const seconds = duration.seconds();
    const secondsFormatted = `${minutes}s`;
    // console.log(`%c ${secondsFormatted}`, 'background:green');
    tickettiming.seconds = secondsFormatted;
    tickettiming.valSeconds = String(seconds);

    tickettiming.timetoshow = days ? tickettiming.days : hours ?
                              tickettiming.hours : minutes ? tickettiming.minutes : tickettiming.seconds;

    return tickettiming;
   }

  GetTicketHistory(filterObj): Observable<BaseMention[]>
  {
    // const key =

    // {
    //   brandInfo: {
    //     brandID: mentionObj.brandInfo.brandID,
    //     brandName: mentionObj.brandInfo.brandName,
    //     categoryGroupID: 0,
    //     categoryID: 0,
    //     categoryName: 'string',
    //     mainBrandID: 0,
    //     compititionBrandIDs: [
    //       0
    //     ],
    //     brandFriendlyName: 'string',
    //     brandLogo: 'string',
    //     isBrandworkFlowEnabled: true,
    //     brandGroupName: 'string'
    //   },
    //   // startDateEpcoh: 1605033000,
    //   startDateEpcoh: 1608057000,
    //   // endDateEpoch: 1608229798,
    //   endDateEpoch: moment().utc().unix(),
    //   ticketId: mentionObj.ticketInfo.ticketID,
    //   to: 1,
    //   from: 5,
    //   authorId: mentionObj.author.socialId,
    //   isActionableData: 0,
    //   channel: mentionObj.channelGroup,
    //   IsPlainLogText: false
    // };


    const authtoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjYzY3Y2E5Zi01MmRmLTQwMTItOWUxMS1mODc0MmVmZjQ5MmMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzQ2NCIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IkFrc2hheSIsImV4cCI6MTYxMDE5MzI2MCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.UnQElv_aLTBCDyX_3AODjnSSDpBh8s1SvJejPzl3Dxk';
    const Theaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authtoken}`
    });
    return  this._http.post<BaseMentionWithCommLog>(environment.baseUrl + '/Tickets/GetUserHistory', filterObj).pipe(
      map(response => {
          if (response.success)
          {
            const MentionList: BaseMention[] = response.data;
            return MentionList;
          }
      })
    );

  }

  changeTicketPriority(key): Observable<object>
  {
    const Theaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDBlMTZlOS00NjlhLTRmNjQtYWFmNS1kMGYxZGFkMGQ1NGQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzUzNiIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkaXR5YSIsImV4cCI6MTYxMTM5NDA1OCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.fBErJVWFaWEv3Dx2kN_PpmxxiKKYevrv9mxF_YxGmMo'  
    });

    return this._http.post(environment.baseUrl + '/Tickets/ChangeTicketPriority', key, {headers: Theaders});
  }

  getBrandInfluencerList(key): Observable<object>
  {
    return this._http.post(environment.baseUrl + '/Tickets/GetBrandInfluencer', key);
  }

  insertUpdateInfluencer(key): Observable<object>
  {

    const Theaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDBlMTZlOS00NjlhLTRmNjQtYWFmNS1kMGYxZGFkMGQ1NGQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzUzNiIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkaXR5YSIsImV4cCI6MTYxMTM5NDA1OCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.fBErJVWFaWEv3Dx2kN_PpmxxiKKYevrv9mxF_YxGmMo'  
    });
    // let key = {"InfluencerCategoryID":"12091","InfluencerCategoryName":"Youtuber","ChannelType":"Twitter","AuthorSocialID":"1151024303506251776","ScreenName":"loco55672477","BrandName":"wrong","BrandID":7121}

    return this._http.post(environment.baseUrl + '/Tickets/InsertUpdateInfluencer', key, {headers: Theaders});
  }

  addTicketNotes(key): Observable<object>
  {
    // const Theaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDBlMTZlOS00NjlhLTRmNjQtYWFmNS1kMGYxZGFkMGQ1NGQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzUzNiIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkaXR5YSIsImV4cCI6MTYxMTM5NDA1OCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.fBErJVWFaWEv3Dx2kN_PpmxxiKKYevrv9mxF_YxGmMo'  
    // });
    // let key = {"brandInfo":{"BrandID":"7121","BrandName":"wrong","BrandFriendlyName":"Wrong Brand","CategoryID":0,"CategoryName":"","BrandGroupName":"","BColor":"","CampaignName":""},"communicationLog":{"Note":"helo note added 14 jan 5 18","TicketID":"233916","TagID":"288425","AssignedToUserID":null,"Channel":"7","Status":"NotesAdded","type":"CommunicationLog","MentionTime":"01/14/2021 06:45:26"}}

    return this._http.post(environment.baseUrl + '/Tickets/AddTicketNotes', key);
  }

  getAllfoulkeywordsOrEmailsList(): Observable<object>{

    const Theaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDBlMTZlOS00NjlhLTRmNjQtYWFmNS1kMGYxZGFkMGQ1NGQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzUzNiIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkaXR5YSIsImV4cCI6MTYxMTM5NDA1OCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.fBErJVWFaWEv3Dx2kN_PpmxxiKKYevrv9mxF_YxGmMo'  
    });
    let key = {"brandInfo":{"BrandID":"7121","BrandName":"wrong","BrandFriendlyName":"Wrong Brand","CategoryID":0,"CategoryName":"","BrandGroupName":"","BColor":"","CampaignName":""},"fag":0}
    return this._http.post(environment.baseUrl + '/Tickets/GetAllfoulkeywordsOrEmailsList', key, {headers: Theaders});

  }


  searchByNameUsers(key): Observable<object>{

    // const Theaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDBlMTZlOS00NjlhLTRmNjQtYWFmNS1kMGYxZGFkMGQ1NGQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzUzNiIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkaXR5YSIsImV4cCI6MTYxMTM5NDA1OCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.fBErJVWFaWEv3Dx2kN_PpmxxiKKYevrv9mxF_YxGmMo'  
    // });
    // let key = {"BrandInfo":{"BrandID":"7121","BrandName":"wrong","BrandFriendlyName":"Wrong Brand","CategoryID":3398,"CategoryName":"LocobuzzTestDB","BrandGroupName":"","BColor":"","CampaignName":""},"ChannelGroup":"Twitter","SearchText":"harish","Offset":0,"NoOfRows":10}
    
    return this._http.post(environment.baseUrl + '/Tickets/GetSearchByNameUsers', key);

  }

  SaveMapSocialUsers(key): Observable<object>
  {
    // const Theaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDBlMTZlOS00NjlhLTRmNjQtYWFmNS1kMGYxZGFkMGQ1NGQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzUzNiIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkaXR5YSIsImV4cCI6MTYxMTM5NDA1OCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.fBErJVWFaWEv3Dx2kN_PpmxxiKKYevrv9mxF_YxGmMo'  
    // });
    // let key = {"BrandInfo":{"BrandID":"7121","BrandName":"wrong","BrandFriendlyName":"Wrong Brand","CategoryID":0,"CategoryName":"","BrandGroupName":"","BColor":"","CampaignName":""},"Author":{ "$type":"LocobuzzNG.Entities.Classes.Authors.Facebook.FacebookAuthor, LocobuzzNG.Entities", "isBlocked": false, "isVerifed": false, "isMuted": false, "isUserFollowing": false, "isBrandFollowing": false, "isMarkedInfluencer": false, "markedInfluencerID": 0, "profileUrl": null, "markedInfluencerCategoryName": null, "markedInfluencerCategoryID": 0, "canHaveUserTags": false, "canBeMarkedInfluencer": false, "canHaveConnectedUsers": false, "socialId": "2548554771896041", "isAnonymous": false, "name": "Shivam Bhattacharya", "channel": 0, "url": "", "profileImage": null, "nps": 0, "sentimentUpliftScore": 0.0, "id": 0, "picUrl": "https://platform-lookaside.fbsbx.com/platform/profilepic/?psid=2548554771896041&height=50&width=50&ext=1613302347&hash=AeSeY5EuK7obkBVGeIY", "glbMarkedInfluencerCategoryName": null, "glbMarkedInfluencerCategoryID": 0, "interactionCount": 0, "location": null, "locationXML": null, "userSentiment": 0, "channelGroup": 2, "latestTicketID": "233931", "userTags": [], "markedInfluencers": [], "connectedUsers": [], "locoBuzzCRMDetails": { "id": 0, "name": null, "emailID": null, "alternativeEmailID": null, "phoneNumber": null, "link": null, "address1": null, "address2": null, "notes": null, "city": null, "state": null, "country": null, "zipCode": null, "alternatePhoneNumber": null, "ssn": null, "customCRMColumnXml": null, "gender": null, "age": 0, "dob": null, "modifiedByUser": null, "modifiedTime": null, "modifiedDateTime": "0001-01-01T00:00:00", "modifiedTimeEpoch": 0.0, "timeoffset": 0, "dobString": null, "isInserted": false }, "previousLocoBuzzCRMDetails": null, "crmColumns": null },"MapAuthorSocialID":"136540912","Mapchannelgroupid":"1"}
    
    
    return this._http.post(environment.baseUrl + '/Tickets/SaveMapSocialUsers', key);

  }

  SaveLocoBuzzCRMDetail(key): Observable<object>
  {

    const Theaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDBlMTZlOS00NjlhLTRmNjQtYWFmNS1kMGYxZGFkMGQ1NGQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzUzNiIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkaXR5YSIsImV4cCI6MTYxMTM5NDA1OCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.fBErJVWFaWEv3Dx2kN_PpmxxiKKYevrv9mxF_YxGmMo'  
    });

    return this._http.post(environment.baseUrl + '/Tickets/SaveLocoBuzzCRMDetail', key, {headers: Theaders});
  }

  searchEmails(): Observable<object>
  {
    const Theaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDBlMTZlOS00NjlhLTRmNjQtYWFmNS1kMGYxZGFkMGQ1NGQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzUzNiIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkaXR5YSIsImV4cCI6MTYxMTM5NDA1OCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.fBErJVWFaWEv3Dx2kN_PpmxxiKKYevrv9mxF_YxGmMo'  
    });
    return this._http.get(environment.baseUrl + '/Tickets/SearchEmails?query=harish', {headers: Theaders});
  }

  saveSubscription(): Observable<object>
  {
    const Theaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDBlMTZlOS00NjlhLTRmNjQtYWFmNS1kMGYxZGFkMGQ1NGQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzUzNiIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkaXR5YSIsImV4cCI6MTYxMTM5NDA1OCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.fBErJVWFaWEv3Dx2kN_PpmxxiKKYevrv9mxF_YxGmMo'  
    });
    const key = {"TagID":288451,"TicketID":"233916","BrandID":"7121","BrandName":"","ID":"30038","EmailAddress":"harishkumar.jaiswal2@locobuzz.com,dipak.sharma3@locobuzz.com","Subject":"Ticket status update regarding Ticket ID 233916","ActivityType":2,"IsSubscribe":true,"Channel":"0","IsModified":true,"SendOnlyNewUpdates":true}
    return this._http.post(environment.baseUrl + '/Tickets/SaveSubscription', key, {headers: Theaders});

  }

  enableTicketMakerChecker(key): Observable<object>
  {
    // const Theaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDBlMTZlOS00NjlhLTRmNjQtYWFmNS1kMGYxZGFkMGQ1NGQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzUzNiIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkaXR5YSIsImV4cCI6MTYxMTM5NDA1OCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.fBErJVWFaWEv3Dx2kN_PpmxxiKKYevrv9mxF_YxGmMo'  
    // });
    // let key = {"Source":{"$type":"LocobuzzNG.Entities.Classes.Mentions.FacebookMention, LocobuzzNG.Entities","parentPostSocialID":"101146514678678_235540547905940","fbPageName":"BittuLoco2030","fbPageID":101146514678678,"rating":0.0,"caption":null,"isHidden":false,"isPromoted":false,"hideFromAllBrand":false,"postClicks":null,"postVideoAvgTimeWatched":null,"canReplyPrivately":true,"mentionMetadata":{"videoView":0,"postClicks":0,"postVideoAvgTimeWatched":0,"likeCount":0,"commentCount":0,"reach":null,"impression":null,"videoViews":0,"engagementCount":0,"reachCountRate":0,"impressionsCountRate":0,"engagementCountRate":0,"isFromAPI":false},"author":{"$type":"LocobuzzNG.Entities.Classes.Authors.Facebook.FacebookAuthor, LocobuzzNG.Entities","isBlocked":false,"isVerifed":false,"isMuted":false,"isUserFollowing":false,"isBrandFollowing":false,"isMarkedInfluencer":false,"markedInfluencerID":0,"profileUrl":null,"markedInfluencerCategoryName":"Youtuber","markedInfluencerCategoryID":12092,"canHaveUserTags":false,"canBeMarkedInfluencer":false,"canHaveConnectedUsers":false,"socialId":"1446965598761128","isAnonymous":false,"name":"Harishkumar Jaiswal","channel":0,"url":null,"profileImage":null,"nps":0,"sentimentUpliftScore":0.0,"id":0,"picUrl":"https://s3.amazonaws.com/locobuzz.socialimages/1446965598761128.jpg","glbMarkedInfluencerCategoryName":"Youtuber","glbMarkedInfluencerCategoryID":12092,"interactionCount":0,"location":null,"locationXML":null,"userSentiment":0,"channelGroup":2,"latestTicketID":"213787","userTags":[],"markedInfluencers":[],"connectedUsers":[],"locoBuzzCRMDetails":{"id":0,"name":null,"emailID":null,"alternativeEmailID":null,"phoneNumber":null,"link":null,"address1":null,"address2":null,"notes":null,"city":null,"state":null,"country":null,"zipCode":null,"alternatePhoneNumber":null,"ssn":null,"customCRMColumnXml":null,"gender":null,"age":0,"dob":null,"modifiedByUser":null,"modifiedTime":null,"modifiedDateTime":"0001-01-01T00:00:00","modifiedTimeEpoch":0.0,"timeoffset":0,"dobString":null,"isInserted":false},"previousLocoBuzzCRMDetails":null,"crmColumns":null},"description":"not good","shareCount":0,"canReply":true,"parentSocialID":"235540547905940_245752053551456","parentPostID":20435,"parentID":null,"id":null,"socialID":"235540547905940_246195620173766","title":null,"isActionable":true,"channelType":8,"channelGroup":2,"mentionID":null,"url":null,"sentiment":0,"tagID":267364,"isDeleted":false,"isDeletedFromSocial":false,"mediaType":1,"mediaTypeFormat":1,"status":0,"isSendFeedback":false,"isSendAsDMLink":false,"isPrivateMessage":false,"isBrandPost":false,"updatedDateTime":null,"location":null,"mentionTime":"2020-12-17T07:09:42","contentID":11022,"isRead":true,"readBy":33084,"readAt":"2020-12-17T12:58:40.98","numberOfMentions":"7","languageName":null,"isReplied":false,"isParentPost":false,"inReplyToStatusId":43384,"replyInitiated":false,"isMakerCheckerEnable":false,"attachToCaseid":null,"mentionsAttachToCaseid":null,"insertedDate":"2020-12-17T08:22:15.053","mentionCapturedDate":null,"mentionTimeEpoch":0.0,"modifiedDateEpoch":0.0,"likeStatus":false,"modifiedDate":"2021-01-15T07:30:41.663","brandInfo":{"brandID":7121,"brandName":"wrong","categoryGroupID":0,"categoryID":0,"categoryName":null,"mainBrandID":0,"compititionBrandIDs":null,"brandFriendlyName":"Wrong Brand","brandLogo":null,"isBrandworkFlowEnabled":false,"brandGroupName":null},"upperCategory":{"id":0,"name":null,"userID":null,"brandInfo":null},"categoryMap":[{"id":33773,"name":"miscellaneous","upperCategoryID":0,"sentiment":1,"isTicket":false,"subCategories":[]}],"retweetedStatusID":null,"ticketInfo":{"ticketID":213787,"tagID":267364,"assignedBy":null,"assignedTo":null,"assignedToTeam":null,"assignToAgentUserName":null,"readByUserName":"v1gaurang sup","escalatedTotUserName":null,"escalatedToBrandUserName":null,"assignedAt":"0001-01-01T00:00:00","previousAssignedTo":0,"escalatedTo":null,"escaltedToAccountType":0,"escalatedToCSDTeam":null,"escalatedBy":null,"escalatedAt":"0001-01-01T00:00:00","escalatedToBrand":null,"escalatedToBrandTeam":null,"escalatedToBrandBy":null,"escalatedToBrandAt":"0001-01-01T00:00:00","status":0,"updatedAt":"0001-01-01T00:00:00","createdAt":"0001-01-01T00:00:00","numberOfMentions":7,"ticketPriority":2,"lastNote":"k","latestTagID":267364,"autoClose":false,"isAutoClosureEnabled":false,"isMakerCheckerEnable":false,"ticketPreviousStatus":null,"guid":null,"srid":null,"previousAssignedFrom":null,"previouAgentWorkflowWorkedAgent":null,"csdTeamId":null,"brandTeamId":null,"teamid":null,"previousAgentAccountType":null,"ticketAgentWorkFlowEnabled":false,"makerCheckerStatus":7,"messageSentforApproval":null,"replyScheduledDateTime":null,"requestedByUserid":null,"workFlowTagid":null,"workflowStatus":0,"ssreStatus":0,"isCustomerInfoAwaited":false,"utcDateTimeOfOperation":null,"toEmailList":null,"ccEmailList":null,"bccEmailList":null,"taskJsonList":null,"caseCreatedDate":"2020-12-17T08:22:15.053","tatflrBreachTime":"2020-12-17T08:38:15.053","lockUserID":null,"lockDatetime":null,"lockUserName":null,"isTicketLocked":false,"tattime":45980,"flrtatSeconds":null,"replyEscalatedToUsername":null,"replyUserName":null,"replyUserID":0,"replyApprovedOrRejectedBy":null,"ticketProcessStatus":null,"ticketProcessNote":null,"replyUseid":0,"escalationMessage":null,"isSubscribed":false,"ticketUpperCategory":{"id":0,"name":null,"userID":null,"brandInfo":null},"ticketCategoryMap":[{"id":53912,"name":"Done","upperCategoryID":0,"sentiment":null,"isTicket":false,"subCategories":[{"id":42548,"name":"Numbers","categoryID":0,"sentiment":0,"subSubCategories":[]}]}],"ticketCategoryMapText":"<CategoryMap>\r\n<Category><ID>53912</ID><Name>Done</Name><SubCategory><ID>42548</ID><Name>Numbers</Name><Sentiment>0</Sentiment></SubCategory></Category></CategoryMap>\r\n","latestResponseTime":null},"ticketInfoSsre":{"ssreOriginalIntent":0,"ssreReplyVerifiedOrRejectedBy":"v1local pari agent","latestMentionActionedBySSRE":0,"transferTo":2,"ssreEscalatedTo":0,"ssreEscalationMessage":null,"intentRuleType":0,"ssreStatus":1,"retrainTagid":0,"retrainBy":0,"retrainDate":"0001-01-01T00:00:00","ssreMode":0,"ssreIntent":1,"ssreReplyType":0,"intentFriendlyName":null,"intentOrRuleID":0,"latestSSREReply":null,"ssreReplyVerifiedOrRejectedTagid":267364,"ssreReply":{"authorid":null,"replyresponseid":null,"replymessage":null,"channelType":0,"escalatedTo":0,"escalationMessage":null}},"ticketInfoCrm":{"srUpdatedDateTime":null,"srid":null,"isPushRE":0,"srStatus":0,"srCreatedBy":null,"srDescription":null,"remarks":null,"jioNumber":null,"partyid":null,"isPartyID":0,"mapid":10076,"isFTR":null},"attachmentMetadata":{"mediaContents":[],"mediaContentText":"<Attachments></Attachments>","mediaUrls":null,"mediaAttachments":[],"attachments":"<Attachments></Attachments>"},"makerCheckerMetadata":{"workflowReplyDetailID":0,"replyMakerCheckerMessage":null,"isSendGroupMail":false,"replyStatus":null,"replyEscalatedTeamName":null,"workflowStatus":0,"isTakeOver":null},"categoryMapText":"<CategoryMap>\r\n<Category><ID>33773</ID><Name>miscellaneous</Name><Sentiment>1</Sentiment></Category></CategoryMap>\r\n","ticketID":0,"isSSRE":false},"Ismakercheckerstatus":true}
    return this._http.post(environment.baseUrl + '/Tickets/EnableTicketMakerChecker', key);

  }

  translateText(key): Observable<object>
  {
    const Theaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDBlMTZlOS00NjlhLTRmNjQtYWFmNS1kMGYxZGFkMGQ1NGQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzUzNiIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkaXR5YSIsImV4cCI6MTYxMTM5NDA1OCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.fBErJVWFaWEv3Dx2kN_PpmxxiKKYevrv9mxF_YxGmMo'  
    });
    // let key = {"brandInfo":{"BrandID":"7121","BrandName":"wrong"},"model":{"TagId":"202693","Text":"@Daenery91712253  wassupp dany"},"StartDateEpoch":1610908200,"EndDateEpoch":1610994598}
    return this._http.post(environment.baseUrl + '/Tickets/TranslateText', key, {headers: Theaders});

  }

  ticketReassignToUser(key): Observable<object>
  {
    const Theaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDBlMTZlOS00NjlhLTRmNjQtYWFmNS1kMGYxZGFkMGQ1NGQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzUzNiIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkaXR5YSIsImV4cCI6MTYxMTM5NDA1OCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.fBErJVWFaWEv3Dx2kN_PpmxxiKKYevrv9mxF_YxGmMo'  
    });
    return this._http.post(environment.baseUrl + '/Tickets/TicketReassignToUser', key, {headers: Theaders});
  }


  deleteFromSocial(): Observable<object>
  {
    const Theaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDBlMTZlOS00NjlhLTRmNjQtYWFmNS1kMGYxZGFkMGQ1NGQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzUzNiIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkaXR5YSIsImV4cCI6MTYxMTM5NDA1OCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.fBErJVWFaWEv3Dx2kN_PpmxxiKKYevrv9mxF_YxGmMo'  
    });

   let key = {"Source":{"$type":"LocobuzzNG.Entities.Classes.Mentions.TwitterMention, LocobuzzNG.Entities","SocialID":"1347063270276911106","Author":null,"BrandInfo":{"BrandID":7121,"BrandName":"wrong"},"ChannelGroup":1,"ChannelType":10,"ContentId":12083,"TagId":277761},"Account":{"$type":"LocobuzzNG.Entities.Classes.AccountConfigurations.TwitterAccountConfiguration, LocobuzzNG.Entities","SocialID":"1054251559826141184","BrandInformation":{"BrandID":7121,"BrandName":"wrong"},"ChannelGroup":1}}
    return this._http.post(environment.baseUrl + '/Mention/DeleteFromSocial', key, {headers: Theaders} )
  }


  deleteFromLocobuzz(): Observable<object>
  {
    const Theaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDBlMTZlOS00NjlhLTRmNjQtYWFmNS1kMGYxZGFkMGQ1NGQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzUzNiIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkaXR5YSIsImV4cCI6MTYxMTM5NDA1OCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.fBErJVWFaWEv3Dx2kN_PpmxxiKKYevrv9mxF_YxGmMo'  
    });

    let key = {"BrandInfo":{"BrandID":7121,"BrandName":"wrong"},"DeleteParameter":{"ChannelType":1,"ContentId":20148,"TagId":277473}}

    return this._http.post(environment.baseUrl + '/Mention/DeleteFromLocobuzz', key, {headers: Theaders});
  }

  makeActionable(): Observable<object>
  {
    const Theaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDBlMTZlOS00NjlhLTRmNjQtYWFmNS1kMGYxZGFkMGQ1NGQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzUzNiIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkaXR5YSIsImV4cCI6MTYxMTM5NDA1OCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.fBErJVWFaWEv3Dx2kN_PpmxxiKKYevrv9mxF_YxGmMo'  
    });

    let key = {"source":{"$type":"LocobuzzNG.Entities.Classes.Mentions.InstagramMention, LocobuzzNG.Entities","concreteClassName":"LocobuzzNG.Entities.Classes.Mentions.InstagramMention","parentPostSocialID":"2482051833051525612_17841416607413700","instaAccountID":61,"isPromoted":false,"caption":null,"instagramGraphApiID":18131020900157748,"instagramPostType":1,"parentInstagramGraphApiID":0,"saved":null,"exists":null,"replies":null,"tapsForward":null,"tapsBack":null,"author":{"$type":"LocobuzzNG.Entities.Classes.Authors.Instagram.InstagramAuthor, LocobuzzNG.Entities","isVerifed":false,"screenname":"dipa_locobuzz","followersCount":0,"isMarkedInfluencer":false,"markedInfluencerID":0,"markedInfluencerCategoryName":null,"markedInfluencerCategoryID":0,"canHaveUserTags":false,"canBeMarkedInfluencer":false,"canHaveConnectedUsers":false,"profileUrl":null,"socialId":"dipa_locobuzz","isAnonymous":false,"name":"dipa_locobuzz","channel":0,"url":"https://www.instagram.com/p/CJyBP3fJLHs/","profileImage":null,"nps":0,"sentimentUpliftScore":0,"id":0,"picUrl":null,"glbMarkedInfluencerCategoryName":null,"glbMarkedInfluencerCategoryID":0,"interactionCount":0,"location":null,"locationXML":null,"userSentiment":0,"channelGroup":3,"latestTicketID":"0","userTags":[],"markedInfluencers":[],"connectedUsers":[],"locoBuzzCRMDetails":{"id":0,"name":null,"emailID":null,"alternativeEmailID":null,"phoneNumber":null,"link":null,"address1":null,"address2":null,"notes":null,"city":null,"state":null,"country":null,"zipCode":null,"alternatePhoneNumber":null,"ssn":null,"customCRMColumnXml":null,"gender":null,"age":0,"dob":null,"modifiedByUser":null,"modifiedTime":null,"modifiedDateTime":"0001-01-01T00:00:00","modifiedTimeEpoch":0,"timeoffset":0,"dobString":null,"isInserted":false},"previousLocoBuzzCRMDetails":null,"crmColumns":null,"lastActivity":null,"firstActivity":null},"description":"add comment before del diy gun","shareCount":0,"canReply":false,"parentSocialID":"","parentPostID":30179,"parentID":null,"id":null,"socialID":"18185877718012057","title":null,"isActionable":false,"channelType":22,"channelGroup":3,"mentionID":null,"url":"https://www.instagram.com/p/CJyBP3fJLHs/","sentiment":1,"tagID":288236,"isDeleted":false,"isDeletedFromSocial":true,"mediaType":1,"mediaTypeFormat":1,"status":10,"isSendFeedback":false,"isSendAsDMLink":false,"isPrivateMessage":false,"isBrandPost":false,"updatedDateTime":"2021-01-11T10:41:12.327","location":null,"mentionTime":"2021-01-11T09:13:16","contentID":61201,"isRead":false,"readBy":null,"readAt":null,"numberOfMentions":null,"languageName":null,"isReplied":false,"isParentPost":false,"inReplyToStatusId":61,"replyInitiated":false,"isMakerCheckerEnable":false,"attachToCaseid":null,"mentionsAttachToCaseid":null,"insertedDate":null,"mentionCapturedDate":null,"mentionTimeEpoch":0,"modifiedDateEpoch":0,"likeStatus":false,"modifiedDate":"0001-01-01T00:00:00","brandInfo":{"brandID":7121,"brandName":"wrong","categoryGroupID":0,"categoryID":0,"categoryName":null,"mainBrandID":0,"compititionBrandIDs":null,"brandFriendlyName":"Wrong Brand","brandLogo":null,"isBrandworkFlowEnabled":false,"brandGroupName":null},"upperCategory":{"id":0,"name":null,"userID":null,"brandInfo":null},"categoryMap":[{"id":53918,"name":"hello category","upperCategoryID":0,"sentiment":1,"isTicket":false,"subCategories":[]},{"id":53916,"name":"mahmud","upperCategoryID":0,"sentiment":null,"isTicket":false,"subCategories":[{"id":42552,"name":"random works again","categoryID":0,"sentiment":0,"subSubCategories":[]}]},{"id":33746,"name":"test","upperCategoryID":0,"sentiment":null,"isTicket":false,"subCategories":[{"id":42549,"name":"test-1","categoryID":0,"sentiment":null,"subSubCategories":[{"id":52418,"name":"test-2","categoryID":0,"subCategoryID":0,"sentiment":0}]}]}],"retweetedStatusID":null,"ticketInfo":{"ticketID":0,"tagID":288236,"assignedBy":null,"assignedTo":null,"assignedToTeam":null,"assignToAgentUserName":null,"readByUserName":null,"escalatedTotUserName":null,"escalatedToBrandUserName":null,"assignedAt":"0001-01-01T00:00:00","previousAssignedTo":0,"escalatedTo":null,"escaltedToAccountType":0,"escalatedToCSDTeam":null,"escalatedBy":null,"escalatedAt":"0001-01-01T00:00:00","escalatedToBrand":null,"escalatedToBrandTeam":null,"escalatedToBrandBy":null,"escalatedToBrandAt":"0001-01-01T00:00:00","status":0,"updatedAt":"0001-01-01T00:00:00","createdAt":"0001-01-01T00:00:00","numberOfMentions":0,"ticketPriority":0,"lastNote":null,"latestTagID":0,"autoClose":false,"isAutoClosureEnabled":false,"isMakerCheckerEnable":false,"ticketPreviousStatus":null,"guid":null,"srid":null,"previousAssignedFrom":null,"previouAgentWorkflowWorkedAgent":null,"csdTeamId":null,"brandTeamId":null,"teamid":null,"previousAgentAccountType":null,"ticketAgentWorkFlowEnabled":false,"makerCheckerStatus":0,"messageSentforApproval":null,"replyScheduledDateTime":null,"requestedByUserid":null,"workFlowTagid":null,"workflowStatus":0,"ssreStatus":0,"isCustomerInfoAwaited":false,"utcDateTimeOfOperation":null,"toEmailList":null,"ccEmailList":null,"bccEmailList":null,"taskJsonList":null,"caseCreatedDate":"0001-01-01T00:00:00","tatflrBreachTime":"0001-01-01T00:00:00","lockUserID":null,"lockDatetime":null,"lockUserName":null,"isTicketLocked":false,"tattime":null,"flrtatSeconds":null,"replyEscalatedToUsername":null,"replyUserName":null,"replyUserID":0,"replyApprovedOrRejectedBy":null,"ticketProcessStatus":null,"ticketProcessNote":null,"replyUseid":0,"escalationMessage":null,"isSubscribed":false,"ticketUpperCategory":{"id":0,"name":null,"userID":null,"brandInfo":null},"ticketCategoryMap":null,"ticketCategoryMapText":"<CategoryMap>\r\n</CategoryMap>\r\n","latestResponseTime":null},"ticketInfoSsre":{"ssreOriginalIntent":0,"ssreReplyVerifiedOrRejectedBy":null,"latestMentionActionedBySSRE":0,"transferTo":0,"ssreEscalatedTo":0,"ssreEscalationMessage":null,"intentRuleType":0,"ssreStatus":0,"retrainTagid":0,"retrainBy":0,"retrainDate":"0001-01-01T00:00:00","ssreMode":0,"ssreIntent":0,"ssreReplyType":0,"intentFriendlyName":null,"intentOrRuleID":0,"latestSSREReply":null,"ssreReplyVerifiedOrRejectedTagid":0,"ssreReply":{"authorid":null,"replyresponseid":null,"replymessage":null,"channelType":0,"escalatedTo":0,"escalationMessage":null}},"ticketInfoCrm":{"srUpdatedDateTime":"2021-01-11T10:41:12.327","srid":null,"isPushRE":0,"srStatus":0,"srCreatedBy":null,"srDescription":null,"remarks":null,"jioNumber":null,"partyid":null,"isPartyID":0,"mapid":null,"isFTR":null},"attachmentMetadata":{"mediaContents":[],"mediaContentText":"<Attachments></Attachments>","mediaUrls":null,"mediaAttachments":[],"attachments":"<Attachments></Attachments>"},"makerCheckerMetadata":{"workflowReplyDetailID":0,"replyMakerCheckerMessage":null,"isSendGroupMail":false,"replyStatus":null,"replyEscalatedTeamName":null,"workflowStatus":0,"isTakeOver":null},"mentionMetadata":{"videoView":0,"postClicks":0,"postVideoAvgTimeWatched":0,"likeCount":null,"commentCount":null,"reach":0,"impression":0,"videoViews":0,"engagementCount":0,"reachCountRate":0,"impressionsCountRate":0,"engagementCountRate":0,"isFromAPI":false},"categoryMapText":"<CategoryMap>\r\n<Category><ID>53918</ID><Name>hello category</Name><Sentiment>1</Sentiment></Category><Category><ID>53916</ID><Name>mahmud</Name><SubCategory><ID>42552</ID><Name>random works again</Name><Sentiment>0</Sentiment></SubCategory></Category><Category><ID>33746</ID><Name>test</Name><SubCategory><ID>42549</ID><Name>test-1</Name><SubSubCategory><ID>52418</ID><Name>test-2</Name><Sentiment>0</Sentiment></SubSubCategory></SubCategory></Category></CategoryMap>\r\n","ticketID":0,"isSSRE":false,"settingID":61},"NonActionalbleAuthorName":"Anonymous","actionTaken":0}
    return this._http.post(environment.baseUrl + '/Mention/MarkActionable', key, {headers: Theaders});

  }


  forwardEmail(): Observable<object>
  {
    const Theaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDBlMTZlOS00NjlhLTRmNjQtYWFmNS1kMGYxZGFkMGQ1NGQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzUzNiIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkaXR5YSIsImV4cCI6MTYxMTM5NDA1OCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.fBErJVWFaWEv3Dx2kN_PpmxxiKKYevrv9mxF_YxGmMo'  
    });

    return this._http.post(environment.baseUrl + '/Tickets/ForwardEmail', {headers: Theaders});

  }


  blockUnblockAuthor(): Observable<object>
  {
    const Theaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDBlMTZlOS00NjlhLTRmNjQtYWFmNS1kMGYxZGFkMGQ1NGQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzUzNiIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkaXR5YSIsImV4cCI6MTYxMTM5NDA1OCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.fBErJVWFaWEv3Dx2kN_PpmxxiKKYevrv9mxF_YxGmMo'  
    });

    let key = {"Author":{"$type":"LocobuzzNG.Entities.Classes.Authors.Twitter.TwitterAuthor, LocobuzzNG.Entities","SocialId":"1265888991275937792","name":"Joe'eeeee","screenname":"Joe51893106","ChannelGroup":1},"BrandInfo":{"BrandID":"7121","BrandName":"wrong"},"Account":{"$type":"LocobuzzNG.Entities.Classes.AccountConfigurations.TwitterAccountConfiguration, LocobuzzNG.Entities","AccountID":10798,"SocialID":"1054251559826141184","BrandInformation":{"BrandID":"7121","BrandName":"wrong"}},"IsBlock":false}
    return this._http.post(environment.baseUrl + '/Author/BlockUnblockAuthor', key, {headers: Theaders});

  }

  muteUnmuteAuthor(): Observable<object>
  {
    const Theaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDBlMTZlOS00NjlhLTRmNjQtYWFmNS1kMGYxZGFkMGQ1NGQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzUzNiIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkaXR5YSIsImV4cCI6MTYxMTM5NDA1OCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.fBErJVWFaWEv3Dx2kN_PpmxxiKKYevrv9mxF_YxGmMo'  
    });

    let key = {"Author":{"$type":"LocobuzzNG.Entities.Classes.Authors.Twitter.TwitterAuthor, LocobuzzNG.Entities","SocialId":"1265888991275937792","name":"Joe'eeeee","screenname":"Joe51893106","ChannelGroup":1},"BrandInfo":{"BrandID":"7121","BrandName":"wrong"},"Account":{"$type":"LocobuzzNG.Entities.Classes.AccountConfigurations.TwitterAccountConfiguration, LocobuzzNG.Entities","AccountID":10798,"SocialID":"1054251559826141184","BrandInformation":{"BrandID":"7121","BrandName":"wrong"}},"IsMute":false}
    return this._http.post(environment.baseUrl + '/Author/MuteUnmuteAuthor', key, {headers: Theaders});

  }

  followUnfollowAuthor(): Observable<object>
  {
    const Theaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDBlMTZlOS00NjlhLTRmNjQtYWFmNS1kMGYxZGFkMGQ1NGQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzUzNiIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkaXR5YSIsImV4cCI6MTYxMTM5NDA1OCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.fBErJVWFaWEv3Dx2kN_PpmxxiKKYevrv9mxF_YxGmMo'  
    });

    let key = {"Author":{"$type":"LocobuzzNG.Entities.Classes.Authors.Twitter.TwitterAuthor, LocobuzzNG.Entities","SocialId":"1265888991275937792","name":"Joe'eeeee","screenname":"Joe51893106","ChannelGroup":1},"BrandInfo":{"BrandID":"7121","BrandName":"wrong"},"Account":{"$type":"LocobuzzNG.Entities.Classes.AccountConfigurations.TwitterAccountConfiguration, LocobuzzNG.Entities","AccountID":10798,"SocialID":"1054251559826141184","BrandInformation":{"BrandID":"7121","BrandName":"wrong"}},"IsFollow":false}
    return this._http.post(environment.baseUrl + '/Author/FollowUnfollowAuthor', key, {headers: Theaders});

  }


  likeDislikeMention(keyObj): Observable<IApiResponse<any>>
  {
      return this._http.post<IApiResponse<any>>(
        environment.baseUrl + '/Mention/LikeDislikeMention',
        keyObj
      ).pipe(
        map(response => {
          return response;
        })
      );

  }


  retweetUnRetweetMention(keyObj): Observable<IApiResponse<any>>
  {
    return this._http.post<IApiResponse<any>>(
      environment.baseUrl + '/Mention/RetweetUnretweetMention',
      keyObj
    ).pipe(
      map(response => {
        return response;
      })
    );

  }

  hideUnhideMention(): Observable<object>
  {
    const Theaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDBlMTZlOS00NjlhLTRmNjQtYWFmNS1kMGYxZGFkMGQ1NGQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzUzNiIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkaXR5YSIsImV4cCI6MTYxMTM5NDA1OCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.fBErJVWFaWEv3Dx2kN_PpmxxiKKYevrv9mxF_YxGmMo'  
    });

    let key = {"Source":{"$type":"LocobuzzNG.Entities.Classes.Mentions.FacebookMention, LocobuzzNG.Entities","ChannelGroup":2,"ChannelType":8,"TagID":203788,"BrandInfo":{"BrandID":"7121","BrandName":"wrong"},"SocialID":"192524738874188_193950238731638"},"Account":{"$type":"LocobuzzNG.Entities.Classes.AccountConfigurations.FacebookAccountConfiguration, LocobuzzNG.Entities","AccountID":31810,"SocialID":"101146514678678","BrandInformation":{"BrandID":"7121","BrandName":"wrong"}},"IsHidden":false,"IsHiddenFromAllBrand":false}
    return this._http.post(environment.baseUrl + '/Mention/HideUnhideMention', key, {headers: Theaders});

  }

  getBlockAuthorListTwitter(): Observable<object>
  {
    const Theaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDBlMTZlOS00NjlhLTRmNjQtYWFmNS1kMGYxZGFkMGQ1NGQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzUzNiIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkaXR5YSIsImV4cCI6MTYxMTM5NDA1OCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.fBErJVWFaWEv3Dx2kN_PpmxxiKKYevrv9mxF_YxGmMo'  
    });

    let key = {"Brand":{"BrandID":7121,"BrandName":"wrong"},"ChannelGroup":1}
    return this._http.post(environment.baseUrl + '/Account/ConfiguredBrandChannelAccount', key, {headers: Theaders});


  }


  changeTicketStatus(key): Observable<object>
  {
    const Theaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDBlMTZlOS00NjlhLTRmNjQtYWFmNS1kMGYxZGFkMGQ1NGQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzUzNiIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkaXR5YSIsImV4cCI6MTYxMTM5NDA1OCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.fBErJVWFaWEv3Dx2kN_PpmxxiKKYevrv9mxF_YxGmMo'  
    });

    return this._http.post(environment.baseUrl + '/Tickets/ChangeTicketStatus', key, {headers: Theaders});

  }


  checkAutoclosureEligibility(key): Observable<object>
  {
    const Theaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2ODJjNjQ1YS0wZTM5LTQwYzctODRmYS1jMWQ4YTkyZDliM2QiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzUzNiIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkaXR5YSIsImV4cCI6MTYxMTc0MjA2NywiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.QAas4sGjKnkDXN8E50V1Hxfwm8ZfvspzZ9A_TCbw3cs'  
    });

    return this._http.post(environment.baseUrl + '/Tickets/CheckAutoclouserEligibility', key, {headers: Theaders});
  }


  inActiveInfluencer(key): Observable<object>
  {
    return this._http.post(environment.baseUrl + '/Tickets/InActiveInfluencer', key);
  }
  
  getCannedResponseCategories(key): Observable<object>{
    return this._http.post(environment.baseUrl + '/Account/GetCannedResponseCategoryList', key)
  }

  getCannedResponse(key): Observable<object>{
    return this._http.post(environment.baseUrl + '/Account/GetCannedResponseListByCatgeoryID', key)
  }

  replyAutoSuggest(key): Observable<object>{
    return this._http.post(environment.baseUrl + '/Tickets/ReplySuggestion', key)
  }  

  getEmailHtmlData(keyObj): Observable<IApiResponse<any>>
  {
    return this._http.post<IApiResponse<any>>(
      environment.baseUrl + '/Tickets/GetEmailHtmlContentByTagID',
      keyObj
    ).pipe(
      map(response => {
        return response;
      })
    );

  }

  getMentionCountByTicektID(ticketid): Observable<IApiResponse<any>>
  {
    return this._http.post<IApiResponse<any>>(
      environment.baseUrl + `/Tickets/GetMentionCountByTicektID?TicketID=${ticketid}`,
      {}
    ).pipe(
      map(response => {
        return response;
      })
    );

  }

  getAuthorTickets(keyObj): Observable<IApiResponse<any>>
  {
    return this._http.post<IApiResponse<any>>(
      environment.baseUrl + `/Tickets/GetAuthorTickets`,
      keyObj
    ).pipe(
      map(response => {
        return response;
      })
    );

  }

  lockUnlockTicket(keyObj): Observable<IApiResponse<any>>
  {
      return this._http.post<IApiResponse<any>>(
        environment.baseUrl + '/Tickets/LockUnlockCase',
        keyObj
      ).pipe(
        map(response => {
          return response;
        })
      );

  }
  getTicketLock(keyObj): Observable<IApiResponse<any>>
  {
      return this._http.post<IApiResponse<any>>(
        environment.baseUrl + '/Tickets/GetTicketLockedDetails',
        keyObj
      ).pipe(
        map(response => {
          return response;
        })
      );

  }

  markTicketAsRead(keyObj): Observable<IApiResponse<any>>
  {
    return this._http.post<IApiResponse<any>>(
      environment.baseUrl + '/Tickets/MarkAsCaseRead',
      keyObj
    ).pipe(
      map(response => {
        return response;
      })
    );
  }

}
