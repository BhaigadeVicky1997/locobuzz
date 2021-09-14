import { ChannelImage } from 'app/core/enums/ChannelImgEnum';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { ChannelGroup } from '../enums/ChannelGroup';
import { ChannelType } from '../enums/ChannelType';
import { TicketTimings } from '../interfaces/TicketClient';
import { BaseMention } from '../models/mentions/locobuzz/BaseMention';

@Injectable({
  providedIn: 'root'
})
export class LocobuzzmentionService {

  constructor() { }

  getChannelCustomeIcon(mention: BaseMention): string {
    let channeltypeicon = '';
    if (mention.channelGroup === ChannelGroup.Twitter) {
      if (mention.channelType === ChannelType.DirectMessages) {
        channeltypeicon = 'assets/images/channelsv/Twitter_DM.svg';
      } else if (mention.channelType === ChannelType.PublicTweets) {
        channeltypeicon = 'assets/images/channelsv/Public_Tweet.svg';
      } else if (
        mention.channelType === ChannelType.BrandTweets &&
        !mention.isBrandPost
      ) {
        channeltypeicon = 'assets/images/channelsv/Brand_Mention.svg';
      } else if (
        mention.channelType === ChannelType.Twitterbrandmention &&
        !mention.isBrandPost
      ) {
        channeltypeicon = 'assets/images/channelsv/Brand_Mention.svg';
      } else {
        channeltypeicon = 'assets/images/channelsv/Brand_Tweet.svg';
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
        channeltypeicon = 'assets/images/channelicons/GMBAnswer.svg';
      } else {
        channeltypeicon = 'assets/images/channelicons/GoogleMyReview.png';
      }
    } else if (mention.channelGroup === ChannelGroup.AppStoreReviews) {
      channeltypeicon = 'assets/images/channelicons/AppStoreReviews.svg';
    } else if (mention.channelGroup === ChannelGroup.WebsiteChatBot) {
      channeltypeicon = 'assets/images/channelicons/WebsiteChatBot.svg';
    }
    else if (mention.channelGroup === ChannelGroup.Youtube) {
      channeltypeicon = 'assets/images/channelicons/Youtube.svg';
    }
    else if (mention.channelGroup === ChannelGroup.Email) {
      channeltypeicon = 'assets/images/channelicons/Email.svg';
    } else {
      channeltypeicon = `assets/images/channelicons/${
        ChannelGroup[mention.channelGroup]
      }.png`;
    }
    return channeltypeicon;
  }

  getChannelIcon(mention: BaseMention): string {
    const channeltypeicon = ChannelImage[ChannelGroup[mention.channelGroup]];
    // if (mention.channelGroup === ChannelGroup.Twitter)
    // {
    //     channeltypeicon = 'assets/images/channelsv/Brand_Tweet.svg';
    // } else if (mention.channelGroup === ChannelGroup.Facebook)
    // {
    //     channeltypeicon = 'assets/images/channelicons/Facebook.png';
    // } else if (mention.channelGroup === ChannelGroup.WhatsApp)
    // {
    //   channeltypeicon = 'assets/images/channelicons/WhatsApp.png';
    // } else if (mention.channelGroup === ChannelGroup.LinkedIn)
    // {
    //     channeltypeicon = 'assets/images/channelicons/linkedin.png';
    // } else if (mention.channelGroup === ChannelGroup.GooglePlus)
    // {
    //     channeltypeicon = 'assets/images/channelicons/googlePlus.png';
    // } else if (mention.channelGroup === ChannelGroup.Instagram)
    // {
    //     channeltypeicon = 'assets/images/channelicons/Instagram.svg';
    // } else if (mention.channelGroup === ChannelGroup.GoogleMyReview)
    // {
    //     channeltypeicon = 'assets/images/channelicons/GoogleMyReview.png';
    // } else if (mention.channelGroup === ChannelGroup.AppStoreReviews)
    // {
    //   channeltypeicon = 'assets/images/channelicons/AppStoreReviews.svg';
    // } else if (mention.channelGroup === ChannelGroup.WebsiteChatBot)
    // {
    //   channeltypeicon = 'assets/images/channelicons/WebsiteChatBot.svg';
    // }
    // else if (mention.channelGroup === ChannelGroup.Youtube) {
    //   channeltypeicon = 'assets/images/channelicons/Youtube.svg';
    // }
    // else if (mention.channelGroup === ChannelGroup.Email) {
    //   channeltypeicon = 'assets/images/channelicons/Email.svg';
    // } else {
    //   channeltypeicon = `assets/images/channelicons/${
    //     ChannelGroup[mention.channelGroup]
    //   }.png`;
    // }
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

     // get Years
    const years = Math.floor(duration.asYears());
    const yearsFormatted = years ? `${years}y` : '';
    tickettiming.years = yearsFormatted;
    tickettiming.valYears = String(years);

     // get Months
    const months = Math.floor(duration.asMonths());
    const monthsFormatted = months ? `${months}m` : '';
    tickettiming.months = monthsFormatted;
    tickettiming.valMonths = String(months);

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

    tickettiming.timetoshow =  years ? tickettiming.years : months ? tickettiming.months : days ? tickettiming.days : hours ?
                              tickettiming.hours : minutes ? tickettiming.minutes : tickettiming.seconds;

    return tickettiming;
   }

  convertUTCDatetoLocal(dateObj: string): string {
    if (dateObj)
    {
      return dateObj = dateObj ? moment.utc(dateObj).local().format('MMMM Do YYYY, h:mm:ss a') : '';
    }
  }
}
