import { SocialAuthor } from 'app/core/abstractclasses/SocialAuthor';
import { ActionTaken } from 'app/core/enums/ActionTakenEnum';
import { ChannelGroup } from 'app/core/enums/ChannelGroup';
import { ChannelType } from 'app/core/enums/ChannelType';
import { LogStatus } from 'app/core/enums/LogStatus';
import { MediaEnum } from 'app/core/enums/MediaTypeEnum';
import { Sentiment } from 'app/core/enums/Sentiment';
import { SsreIntent } from 'app/core/enums/ssreIntentEnum';
import { SSREMode } from 'app/core/enums/ssreLogStatusEnum';
import { WhatsAppMessageStatus } from 'app/core/enums/WhatsAppMessageStatus';
import { BaseSocialAuthor } from '../../authors/locobuzz/BaseSocialAuthor';
import { TaggingCategory } from '../../category/taggingCategory';
import { UpperCategory } from '../../category/UpperCategory';
import { AttachmentMetadata } from '../../viewmodel/attachmentMetadata';
import { BrandInfo } from '../../viewmodel/BrandInfo';
import { MakerCheckerMetadata } from '../../viewmodel/MakerCheckerMetadata';
import { MediaContent } from '../../viewmodel/mediaContent';
import { MentionMetadata } from '../../viewmodel/MentionMetadata';
import { TicketInfo } from '../../viewmodel/ticketInfo';
import { TicketInfoCrm } from '../../viewmodel/ticketInfoCrm';
import { TicketInfoSsre } from '../../viewmodel/ticketInfoSsre';
import { BaseMentionMetadata } from './BaseMentionMetaData';

export interface BaseMention {
    $type?: string;
    description?: string;
    author?: BaseSocialAuthor;
    shareCount?: number;
    canReply?: boolean;
    concreteClassName?: string;
    parentSocialID?: string;
    parentPostID?: number | null;
    parentID?: number | null;
    id?: number | null;
    socialID?: string;
    title?: string;
    isActionable?: boolean;
    channelType?: ChannelType;
    channelGroup?: ChannelGroup;
    mentionID?: string;
    url?: string;
    sentiment?: Sentiment;
    tagID?: number;
    isDeleted?: boolean;
    isDeletedFromSocial?: boolean;
    mediaType?: MediaEnum;
    mediaTypeFormat?: number;
    status?: LogStatus;
    isSendFeedback?: boolean;
    isSendAsDMLink?: boolean;
    isPrivateMessage?: boolean;
    isBrandPost?: boolean;
    updatedDateTime?: string | null;
    location?: string;
    mentionTime?: string;
    contentID?: number;
    isRead?: boolean;
    readBy?: number | null;
    readAt?: string | null;
    numberOfMentions?: string;
    languageName?: string;
    isReplied?: boolean;
    isParentPost?: boolean;
    inReplyToStatusId?: number;
    replyInitiated?: boolean;
    isMakerCheckerEnable?: boolean;
    attachToCaseid?: number | null;
    mentionsAttachToCaseid?: string;
    insertedDate?: string | null;
    mentionCapturedDate?: string | null;
    mentionTimeEpoch?: number;
    modifiedDateEpoch?: number;
    likeStatus?: boolean;
    modifiedDate?: string;
    brandInfo?: BrandInfo;
    upperCategory?: UpperCategory;
    categoryMap?: TaggingCategory[];
    retweetedStatusID?: string;
    ticketInfo?: TicketInfo;
    ticketInfoSsre?: TicketInfoSsre;
    ticketInfoCrm?: TicketInfoCrm;
    attachmentMetadata?: AttachmentMetadata;
    makerCheckerMetadata?: MakerCheckerMetadata;
    mentionMetadata?: BaseMentionMetadata;
    categoryMapText?: string;
    ticketID?: number;
    isSSRE?: boolean;
    // email mention properties
    fromMail?: string;
    toMail?: string;
    toMailList?: string[];
    bccMailList?: string[];
    ccMailList?: string[];
    replytoEmail?: string;
    messageID?: string;
    subject?: string;
    deliveredTo?: string;
    ccList?: string;
    bccList?: string;
    cc?: string;
    bcc?: string;
    emailContent?: string;
    emailContentHtml?: string;
    attachmentCount?: number;
    attachmentsName?: string;
    attachmentType?: string;
    attachmentInfo?: string;
    sentMailGUID?: string;
    brandID?: number;
    brandName?: string;
    categoryID?: number;
    categoryName?: string;
    inReplyToMail?: string;
    actionTaken?: string;
    actionTakenAt?: string;
    emailType?: number;
    createdAt?: string;
    insertedAt?: string;
    messageUID?: string;
    mailboxName?: string;
    // facebook mention properties
    parentPostSocialID?: string;
    fbPageName?: string;
    fbPageID?: number;
    rating?: number;
    caption?: string;
    isHidden?: boolean;
    isPromoted?: boolean;
    hideFromAllBrand?: boolean;
    postClicks?: number | null;
    postVideoAvgTimeWatched?: number | null;
    canReplyPrivately?: boolean;
    //  GoogleMy review mention
    packageName?: string;
    objectID?: string;
    storeCode?: string;
    // googleplaystore mention
    appID?: string;
    appFriendlyName?: string;
    // youtube mention properties
    dislikeStatus?: boolean;
    estimatedWatchedTime?: number | null;
    dislikeCount?: number | null;
    subscribersGained?: number | null;
    // instagram mention data
    instaAccountID?: number;
    instagramGraphApiID?: number;
    instagramPostType?: number;
    parentInstagramGraphApiID?: number;
    saved?: number | null;
    exists?: number | null;
    replies?: number | null;
    tapsForward?: number | null;
    tapsBack?: number | null;
    // linkedin mentions
    // non actionable mention
    programName?: string;
    reporterName?: string;
    critical?: number;
    postid?: string;
    alexaRank?: number;
    // twittermention
    inReplyToUserID?: string;
    isShared?: boolean;
    urlClicks?: number | null;
    tweetClick?: number | null;
    followingCount?: number | null;
    isDMSent?: boolean;
    taggedUsersJson?: string;
    newSelectedTaggedUsersJson?: string;
    mainTweetid?: string;
    // website chatbot
    recipientType?: number;
    countryCode?: string;
    templateID?: string;
    timeOffset?: number;
    clientID?: string;
    userID?: string;
    pageID?: string;
    conversationID?: string;
    agentID?: number;
    agentName?: string;
    messageType?: string;
    objectId?: string;
    // whatsapp mention
    whatsAppAccountID?: number;
    attachMentCount?: number;
    messageStatus?: WhatsAppMessageStatus;
    whatsAppMediaID?: string;
    whatsAppMimeType?: string;
    whatsAppFilename?: string;

    // communication log
    note?: string;
    username?: string;
    usernames?: string[];
    postID?: number | null;
    assignedToUserID?: number | null;
    assignedToTeam?: number | null;
    assignedToTeamName?: string;
    previousAssignToUserID?: number | null;
    previousAssignedToTeam?: string;
    previousAssignedToTeamName?: string;
    assignedToUsername?: string;
    lstStatus?: LogStatus[];
    lstUserNames?: string[];
    lstUserIDs?: number[];
    lstLogIDs?: (number | null)[];
    lstAssignedtoUserNames?: string[];
    batchID?: string;
    agentPic?: string;
    assignedToAgentPic?: string;
    assignedToAccountType?: string;
    accountType?: string;
    postScheduledDateTime?: string | null;
    replyScheduledDateTime?: string | null;
    replyEscalatedToUsername?: string;
    replyUserName?: string;
    isScheduled?: boolean;
    workflowReplyDetailID?: number;
    isLastLog?: boolean | null;
    globalTicketVersion?: number;
    nextLogBatchID?: string;
    nextLogStatus?: LogStatus;
    actionTakenFrom?: ActionTaken;
    logVersion?: number;
    isHtml?: boolean;
    logText?: string;
    settingID?: string;

    // ticketSpecific
    replyUseid?: number;
    ssreMode?: SSREMode;
    ssreIntent?: SsreIntent;
    isSubscribed?: boolean;
    flrtatSeconds?: number;
    tattime?: number;
    mediaContents?: MediaContent[];
    workflowStatus?: LogStatus;
    latestResponseTime?: string;
    latestMentionActionedBySSRE?: number;


}

export interface BaseMentionObj {
    success: boolean;
    message: string | null;
    data: BaseMentionList | null;
}

export interface BaseMentionObjChat {
    success: boolean;
    message: string | null;
    data: BaseMention[] | null;
}

export interface BaseMentionList
{
    mentionList?: BaseMention[] | null;
    totalRecords?: number;
}

export interface BaseMentionWithCommLog {
    success: boolean;
    message: string | null;
    data: BaseMention[] | null;
}
