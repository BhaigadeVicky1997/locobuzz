import { Injectable } from '@angular/core';
import { ChannelGroup } from '../enums/ChannelGroup';
import { BaseSocialAccountConfiguration } from '../models/accountconfigurations/BaseSocialAccountConfiguration';
import { EmailAccountConfiguration } from '../models/accountconfigurations/EmailAccountConfiguration';
import { FacebookAccountConfiguration } from '../models/accountconfigurations/FacebookAccountConfiguration';
import { GenericAccountConfiguration } from '../models/accountconfigurations/GenericAccountConfiguration';
import { GoogleMyReviewAccountConfiguration } from '../models/accountconfigurations/GoogleMyReviewAccountConfiguration';
import { GooglePlayStoreAccountConfiguration } from '../models/accountconfigurations/GooglePlayStoreAccountConfiguration';
import { InstagramAccountConfiguration } from '../models/accountconfigurations/InstagramAccountConfiguration';
import { LinkedinAccountConfiguration } from '../models/accountconfigurations/LinkedinAccountConfiguration';
import { TwitterAccountConfiguration } from '../models/accountconfigurations/TwitterAccountConfiguration';
import { WebsiteAccountConfiguration } from '../models/accountconfigurations/WebsiteAccountConfiguration';
import { WhatsAppAccountConfiguration } from '../models/accountconfigurations/WhatsAppAccountConfiguration';
import { YoutubeAccountConfiguration } from '../models/accountconfigurations/YoutubeAccountConfiguration';
import { EmailAuthor } from '../models/authors/email/EmailAuthor';
import { FacebookAuthor } from '../models/authors/facebook/FacebookAuthor';
import { GenericAuthor } from '../models/authors/generic/GenericAuthor';
import { GoogleMyReviewAuthor } from '../models/authors/google/GoogleMyReviewAuthor';
import { GooglePlayStoreAuthor } from '../models/authors/google/GooglePlayStoreAuthor';
import { YoutubeAuthor } from '../models/authors/google/YoutubeAuthor';
import { InstagramAuthor } from '../models/authors/instagram/InstagramAuthor';
import { LinkedInAuthor } from '../models/authors/linkedin/LinkedInAuthor';
import { TwitterAuthor } from '../models/authors/twitter/twitterAuthor';
import { WebsiteAuthor } from '../models/authors/website/websiteAuthor';
import { WhatsAppAuthor } from '../models/authors/whatsapp/WhatsAppAuthor';
import { EmailMention } from '../models/mentions/email/EmailMention';
import { FacebookMention } from '../models/mentions/facebook/FacebookMention';
import { GoogleMyReviewMention } from '../models/mentions/google/GoogleMyReviewMention';
import { GooglePlayStoreMention } from '../models/mentions/google/GooglePlayStoreMention';
import { YoutubeMention } from '../models/mentions/google/YoutubeMention';
import { InstagramMention } from '../models/mentions/instagram/InstagramMention';
import { LinkedinMention } from '../models/mentions/linkedin/LinkedinMention';
import { BaseMention } from '../models/mentions/locobuzz/BaseMention';
import { Mention } from '../models/mentions/locobuzz/Mention';
import { NonActionableMention } from '../models/mentions/nonactionable/NonActionableMention';
import { TwitterMention } from '../models/mentions/twitter/TwitterMention';
import { WebsiteChatbotMention } from '../models/mentions/websitechatbot/WebsiteChatbotMention';
import { WhatsAppMention } from '../models/mentions/whatsapp/WhatsAppMention';
import { GroupEmailList } from '../models/viewmodel/GroupEmailList';
import { Reply } from '../models/viewmodel/Reply';
import { UgcMention } from '../models/viewmodel/UgcMention';

@Injectable({
  providedIn: 'root'
})
export class MaplocobuzzentitiesService {

  constructor() { }

  
  mapMention(baseMention: BaseMention): Mention {
    switch (baseMention.channelGroup)
    {
    case ChannelGroup.Twitter: {
      let postData: TwitterMention = baseMention as TwitterMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.TwitterMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as TwitterAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.TwitterAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.Facebook : {
      let postData: FacebookMention = baseMention as FacebookMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.FacebookMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as FacebookAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.FacebookAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.Instagram: {
      let postData: InstagramMention = baseMention as InstagramMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.InstagramMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as InstagramAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.InstagramAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.Youtube : {
      let postData: YoutubeMention = baseMention as YoutubeMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.YoutubeMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as YoutubeAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.YoutubeAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.LinkedIn : {
      let postData: LinkedinMention = baseMention as LinkedinMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.LinkedinMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as LinkedInAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.LinkedInAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.GooglePlus: {
      let postData: NonActionableMention = baseMention as NonActionableMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.NonActionableMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as GenericAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.GenericAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.GooglePlayStore: {
      let postData: GooglePlayStoreMention = baseMention as GooglePlayStoreMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.GooglePlayStoreMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as GooglePlayStoreAuthor;
      // tslint:disable-next-line: max-line-length
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.GooglePlayStoreAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.AutomotiveIndia: {
      let postData: NonActionableMention = baseMention as NonActionableMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.NonActionableMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as GenericAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.GenericAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.Blogs: {
      let postData: NonActionableMention = baseMention as NonActionableMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.NonActionableMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as GenericAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.GenericAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.Booking: {
      let postData: NonActionableMention = baseMention as NonActionableMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.NonActionableMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as GenericAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.GenericAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.ComplaintWebsites: {
      let postData: NonActionableMention = baseMention as NonActionableMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.NonActionableMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as GenericAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.GenericAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.CustomerCare: {
      let postData: NonActionableMention = baseMention as NonActionableMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.NonActionableMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as GenericAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.GenericAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.DiscussionForums: {
      let postData: NonActionableMention = baseMention as NonActionableMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.NonActionableMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as GenericAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.GenericAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.ECommerceWebsites: {
      let postData: NonActionableMention = baseMention as NonActionableMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.NonActionableMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as GenericAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.GenericAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.Expedia : {
      let postData: NonActionableMention = baseMention as NonActionableMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.NonActionableMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as GenericAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.GenericAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.HolidayIQ : {
      let postData: NonActionableMention = baseMention as NonActionableMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.NonActionableMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as GenericAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.GenericAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.MakeMyTrip : {
      let postData: NonActionableMention = baseMention as NonActionableMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.NonActionableMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as GenericAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.GenericAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.MyGov : {
      let postData: NonActionableMention = baseMention as NonActionableMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.NonActionableMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as GenericAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.GenericAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.News : {
      let postData: NonActionableMention = baseMention as NonActionableMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.NonActionableMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as GenericAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.GenericAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.ReviewWebsites : {
      let postData: NonActionableMention = baseMention as NonActionableMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.NonActionableMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as GenericAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.GenericAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.TeamBHP : {
      let postData: NonActionableMention = baseMention as NonActionableMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.NonActionableMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as GenericAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.GenericAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.TripAdvisor: {
      let postData: NonActionableMention = baseMention as NonActionableMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.NonActionableMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as GenericAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.GenericAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.Videos: {
      let postData: NonActionableMention = baseMention as NonActionableMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.NonActionableMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as GenericAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.GenericAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.Zomato: {
      let postData: NonActionableMention = baseMention as NonActionableMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.NonActionableMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as GenericAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.GenericAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.Email : {
      let postData: EmailMention =  baseMention as EmailMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.EmailMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as EmailAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.EmailAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.GoogleMyReview : {
      let postData: GoogleMyReviewMention =  baseMention as GoogleMyReviewMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.GoogleMyReviewMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as GoogleMyReviewAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.GoogleMyReviewAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.WhatsApp : {
      let postData: WhatsAppMention =  baseMention as WhatsAppMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.WhatsAppMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as WhatsAppAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.WhatsAppAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.WebsiteChatBot : {
      let postData: WebsiteChatbotMention =  baseMention as WebsiteChatbotMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.WebsiteChatbotMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as WebsiteAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.WebsiteAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    case ChannelGroup.AppStoreReviews : {
      let postData: NonActionableMention = baseMention as NonActionableMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.NonActionableMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as GenericAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.GenericAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    default: {
      let postData: NonActionableMention = baseMention as NonActionableMention;
      postData = {$type: 'LocobuzzNG.Entities.Classes.Mentions.NonActionableMention, LocobuzzNG.Entities', ...postData};
      postData.author = baseMention.author as GenericAuthor;
      postData.author = {$type: 'LocobuzzNG.Entities.Classes.Authors.GenericAuthor, LocobuzzNG.Entities', ...postData.author};
      return postData;
    }
    }
  }

  mapReplyObject(replyObj: Reply[]): Reply[] {


    replyObj.forEach(obj => {

      const replyData: Reply = obj as Reply;
      obj = {$type: 'LocobuzzNG.Entities.Classes.ViewModel.Reply, LocobuzzNG.Entities', ...replyData};

      replyData.attachmentsUgc.forEach(attachment => {
        const attachData: UgcMention = attachment as UgcMention;
        attachment = {$type: 'LocobuzzNG.Entities.Classes.ViewModel.UgcMention, LocobuzzNG.Entities', ...attachData};
      });

      const emailData: GroupEmailList = obj.groupEmailList as GroupEmailList;
      obj.groupEmailList = {$type: 'LocobuzzNG.Entities.Classes.ViewModel.GroupEmailList, LocobuzzNG.Entities', ...emailData};

    });

    return replyObj;

  }

  mapUgcMention(ugcmention: UgcMention[]): UgcMention[] {
    const UgcMentionList: UgcMention[] = [];
    ugcmention.forEach(obj => {
      const replyData: UgcMention = obj as UgcMention;
      obj = {$type: 'LocobuzzNG.Entities.Classes.ViewModel.UgcMention, LocobuzzNG.Entities', ...replyData};
      obj.uGCMediaUrl =  obj.mediaPath;
      obj.uGCMediaType = obj.mediaType;
      UgcMentionList.push(obj);
      obj.mention = null;
      obj.mediaTags = null;
      obj.mediaTagsText = null;

    });

    // for (let i = 0; i <= ugcmention.length; i++)
    // {
    //   ugcmention[i].$type = 'LocobuzzNG.Entities.Classes.ViewModel.UgcMention, LocobuzzNG.Entities';
    // }
    return UgcMentionList;
  }

  mapAccountConfiguration(baseMention: BaseMention): any
  {
    switch (baseMention.channelGroup)
    {
    case ChannelGroup.Twitter: {
      let postData: TwitterAccountConfiguration = {};
      postData = {$type: 'LocobuzzNG.Entities.Classes.AccountConfigurations.TwitterAccountConfiguration, LocobuzzNG.Entities',
      ...postData};
      return postData;
    }
    case ChannelGroup.Facebook : {
      let postData: FacebookAccountConfiguration = {};
      postData = {$type: 'LocobuzzNG.Entities.Classes.AccountConfigurations.FacebookAccountConfiguration, LocobuzzNG.Entities',
       ...postData};
      return postData;
    }
    case ChannelGroup.Instagram: {
      let postData: InstagramAccountConfiguration = {};
      postData = {$type: 'LocobuzzNG.Entities.Classes.AccountConfigurations.InstagramAccountConfiguration, LocobuzzNG.Entities',
       ...postData};
      return postData;
    }
    case ChannelGroup.Youtube : {
      let postData: YoutubeAccountConfiguration = {};
      postData = {$type: 'LocobuzzNG.Entities.Classes.AccountConfigurations.YoutubeAccountConfiguration, LocobuzzNG.Entities',
       ...postData};
      return postData;
    }
    case ChannelGroup.LinkedIn : {
      let postData: LinkedinAccountConfiguration = {};
      postData = {$type: 'LocobuzzNG.Entities.Classes.AccountConfigurations.LinkedinAccountConfiguration, LocobuzzNG.Entities',
       ...postData};
      return postData;
    }
    case ChannelGroup.GooglePlayStore: {
      let postData: GooglePlayStoreAccountConfiguration = {};
      postData = {$type: 'LocobuzzNG.Entities.Classes.AccountConfigurations.GooglePlayStoreAccountConfiguration, LocobuzzNG.Entities',
       ...postData};
      return postData;
    }
    case ChannelGroup.Email : {
      let postData: EmailAccountConfiguration = {};
      postData = {$type: 'LocobuzzNG.Entities.Classes.AccountConfigurations.EmailAccountConfiguration, LocobuzzNG.Entities',
       ...postData};
      return postData;
    }
    case ChannelGroup.GoogleMyReview : {
      let postData: GoogleMyReviewAccountConfiguration = {};
      postData = {$type: 'LocobuzzNG.Entities.Classes.AccountConfigurations.GoogleMyReviewAccountConfiguration, LocobuzzNG.Entities',
       ...postData};
      return postData;
    }
    case ChannelGroup.WhatsApp : {
      let postData: WhatsAppAccountConfiguration = {};
      postData = {$type: 'LocobuzzNG.Entities.Classes.AccountConfigurations.WhatsAppAccountConfiguration, LocobuzzNG.Entities',
       ...postData};
      return postData;
    }
    case ChannelGroup.WebsiteChatBot : {
      let postData: WebsiteAccountConfiguration = {};
      postData = {$type: 'LocobuzzNG.Entities.Classes.AccountConfigurations.WhatsAppAccountConfiguration, LocobuzzNG.Entities',
      ...postData};
      return postData;
    }
    default: {
      let postData: GenericAccountConfiguration = {};
      postData = {$type: 'LocobuzzNG.Entities.Classes.AccountConfigurations.GenericAccountConfiguration, LocobuzzNG.Entities',
      ...postData};
      return postData;
    }
  }
}
}
