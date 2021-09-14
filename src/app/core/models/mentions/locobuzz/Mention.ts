import { SocialAuthor } from 'app/core/abstractclasses/SocialAuthor';
import { ChannelGroup } from 'app/core/enums/ChannelGroup';
import { ChannelType } from 'app/core/enums/ChannelType';
import { LogStatus } from 'app/core/enums/LogStatus';
import { MediaEnum } from 'app/core/enums/MediaTypeEnum';
import { Sentiment } from 'app/core/enums/Sentiment';
import { TaggingCategory } from '../../category/taggingCategory';
import { UpperCategory } from '../../category/UpperCategory';
import { AttachmentMetadata } from '../../viewmodel/attachmentMetadata';
import { BrandInfo } from '../../viewmodel/BrandInfo';
import { MakerCheckerMetadata } from '../../viewmodel/MakerCheckerMetadata';
import { MentionMetadata } from '../../viewmodel/MentionMetadata';
import { TicketInfo } from '../../viewmodel/ticketInfo';
import { TicketInfoCrm } from '../../viewmodel/ticketInfoCrm';
import { TicketInfoSsre } from '../../viewmodel/ticketInfoSsre';

export interface Mention {
    $type?: string;
    description?: string;
    author?: SocialAuthor;
    shareCount?: number;
    canReply?: boolean;
    concreteClassName?: string;
    parentSocialID?: string;
    parentPostID?: number | null;
    parentID?: number | null;
    iD?: number | null;
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
    mentionMetadata?: MentionMetadata;
    categoryMapText?: string;
    ticketID?: number;
    isSSRE?: boolean;
}

export interface MentionObj {
    success: boolean;
    message: string | null;
    data: string | null;
}

export interface MentionList
{
    mentionList?: Mention[] | null;
}
