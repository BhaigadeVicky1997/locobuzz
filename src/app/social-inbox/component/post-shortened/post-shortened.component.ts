import { LocobuzzmentionService } from './../../../core/services/locobuzzmention.service';
import { FilterService } from 'app/social-inbox/services/filter.service';
import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Priority } from 'app/core/enums/Priority';
import { TicketStatus } from 'app/core/enums/ticketStatusEnum';
import { TicketClient } from 'app/core/interfaces/TicketClient';
import { BaseMention } from 'app/core/models/mentions/locobuzz/BaseMention';
import { PostDetailService } from 'app/social-inbox/services/post-detail.service';
import { TicketsService } from 'app/social-inbox/services/tickets.service';
import { ChannelType } from 'app/core/enums/ChannelType';



@Component({
  selector: 'app-post-shortened',
  templateUrl: './post-shortened.component.html',
  styleUrls: ['./post-shortened.component.scss']
})
export class PostShortenedComponent implements OnInit {
  @Input() postShortenedData: BaseMention;
  data: TicketClient;
  constructor(public postDetailService: PostDetailService,
              private _filterService: FilterService,
              private _locobuzzmentionService: LocobuzzmentionService,
              private _ticketsService: TicketsService) { }

  @HostListener('click', ['$event'])
  onClick(event): void {
    console.log('click event', event
    );
    console.log(this.postShortenedData.ticketInfo.ticketID);
    this.postDetailService.currentPostObject.next(this.postShortenedData.ticketInfo.ticketID);
 }

  ngOnInit(): void {
    // console.log(this.postShortenedData);
    this.mapShortData();
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

  private mapShortData(): void
  {
    const assignToname = this._filterService.getNameByID(this.postShortenedData.ticketInfo.assignedTo, this._filterService.fetchedAssignTo);
    this.data = {
      ticketId: this.postShortenedData.ticketInfo.ticketID,
      brandLogo: this.getBrandLogo(this.postShortenedData.brandInfo.brandID),
      channelName: this.MapChannelType(this.postShortenedData),
      mentionCount:  this.postShortenedData.ticketInfo.numberOfMentions,
      note: this.postShortenedData.note,
      assignTo: assignToname,
      ticketStatus: TicketStatus[this.postShortenedData.ticketInfo.status],
      ticketPriority: Priority[this.postShortenedData.ticketInfo.ticketPriority],
      ticketDescription: this.postShortenedData.description,
      ticketCategory: {
        ticketUpperCategory: this.postShortenedData.ticketInfo.ticketUpperCategory.name,
        mentionUpperCategory: this.postShortenedData.upperCategory.name,
      },
      Userinfo: {
        name: this.postShortenedData.author.name,
        image:  this.postShortenedData.author.picUrl ? this.postShortenedData.author.picUrl
        : 'assets/images/agentimages/sample-image.jpg',
        screenName: this.postShortenedData.author.screenname,
        bio: this.postShortenedData.author.bio,
        followers: this.postShortenedData.author.followersCount,
        following: this.postShortenedData.author.followingCount,
        location: this.postShortenedData.author.location,
        sentimentUpliftScore: this.postShortenedData.author.sentimentUpliftScore,
        npsScore: this.postShortenedData.author.nPS,
        isVerified: this.postShortenedData.author.isVerifed,
      },
      ticketTime: this._ticketsService.calculateTicketTimes(this.postShortenedData),
      channelImage: this._locobuzzmentionService.getChannelIcon(this.postShortenedData),
      ticketCategoryTop: '',
      mentionCategoryTop: ''
    };
  }

}
