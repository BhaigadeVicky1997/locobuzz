import { UgcMention } from './UgcMention';
import { MediaContent } from 'app/core/models/viewmodel/mediaContent';
import { BaseMention } from 'app/core/models/mentions/locobuzz/BaseMention';
import { ChannelGroup } from 'app/core/enums/ChannelGroup';

export interface ChatWindowDetails {
    totalCount?: number;
    channelgroupid?: number;
    userProfiles?: ChatWindowProfiles[];
}

export interface ChatWindowProfiles {
    authorSocialID: string;
    maskAuthorSocialID?: string;
    authorName?: string;
    url?: string;
    picUrl?: string;
    brandName: string;
    brandFriendlyName?: string;
    maskDetailInfo?: string;
    channelgroupid?: number;
    count?: number;
    brandID: number;
    userMentionDate?: string | null;
    brandMentionDate?: string | null;
    channelType?: number;
    userMentionDateEpotch?: number;
    brandMentionDateEpotch?: number;
    channelGroup?: ChannelGroup;
    chats?: Chatlog[];
    BaseMentions?: BaseMention[];
    logEnd?: boolean;
    lastChat?: string;
    notificationCount?: number;
}

export interface ChatWindowresponse {
    success: boolean;
    message: string | null;
    data: ChatWindowDetails;
}


export interface ChatItem {
    title?: string;
    description?: string;
    attachments?: MediaContent[];
    attachmentsType?: number;
    mentionTime?: string;
    ticketId?: number;

}

export interface ChatItemResponse {
        chatText?: string;
        isbrandPost?: boolean;
        channelGroupId?: number;
        author?: string;
        authorID?: string;
        userPic?: string;
        mentiontime?: string;
        attachments?: MediaContent[];
        attachmentsType?: number;
        brandID?: number;
        BrandName?: string;
        userID?: string;
        ticketId?: number;
        assignToUserID?: number;
        replyStatus?: number;
}

export interface Chatlog {
    concreteClassName: string;
    mentionTime: string;
    isBrandPost?: boolean;
    chats?: Array<ChatItem>;
    logText?: string;
}

export interface ChannelInterface {
    name: string;
    image: string;
    channelId: number;
}

export interface Category {
    CategoryID: string;
    UpperCategoryID: string;
    category: string;
    sentiment: number;
    depatments: Array<any>;
}

export interface SignalrResponseData {
    AgeingFilterType?: number;
    AgencyAssign?: any;
    AssignedToAgencyUser?: null;
    AttachmentXML?: UgcMention;
    Author?: string;
    AuthorID?: number;
    AverageRating?: number;
    BrandID?: number;
    BrandName?: string;
    CaseGenerate?: number;
    CaseID?: number;
    CaseStatus?: number;
    CategoryJson?: Array<Category>;
    CategoryName?: string;
    Channel?: number;
    ChannelGroupId?: number;
    ChannelName?: string;
    ClientID?: string;
    CommentCount?: number;
    ConversationID?: null;
    Description?: string;
    DiscardReplyStatus?: number;
    EMessage?: string;
    FBCommentID?: string;
    FBFeedID?: string;
    FavCount?: number;
    FeedName?: string;
    FollowStatus?: number;
    FollowersORLikesCount?: null;
    GooglePSReply?: null;
    GooglePSReplyDate?: string;
    ID?: null;
    InReplyToStatusId?: number;
    InfluancerCategoryId?: number;
    InfluencerCategories?: [];
    InfluencerCategoryName?: null;
    InstagramPostID?: null;
    IsBrandPost?: boolean;
    IsInfluencer?: number;
    IsMakerCheckerEnable?: boolean;
    IsRequestForManager?: number;
    IsScheduled?: boolean;
    Language?: null;
    LastReadNumber?: number;
    LikeStatus?: number;
    LinsertedDate?: string;
    LinsertedDateString?: string;
    Location?: null;
    MarkedInfluancer?: number;
    MediaType?: string;
    MediaUrls?: null;
    MentionTimeEpoch?: number;
    NewMention?: string;
    ObjectID?: number;
    OriginalTweetID?: null;
    OriginalTweetUserInfo?: null;
    PRTQueue?: boolean;
    PageID?: string;
    ParentSocialID?: string;
    PartyID?: null;
    PostID?: number;
    PostURL?: string;
    Queuetype?: number;
    RCount?: number;
    RecordDate?: string;
    ReplyStatus?: number;
    RetweetCount?: number;
    RetweetedStatusID?: number;
    SRID?: null;
    Score?: number;
    Screenname?: null;
    Sentiment?: number;
    ShareCount?: number;
    SibelCustomerID?: null;
    SocialID?: string;
    Status?: number;
    StrAuthorID?: string;
    TCount?: number;
    TagID?: number;
    TagPriority?: number;
    TagReason?: string;
    ThumbURL?: null;
    Title?: null;
    TweetID?: number;
    TweetorFBFeedID?: number;
    TypeOfResponse?: null;
    UserDescription?: null;
    UserName?: string;
    UserPic?: string;
    conversationID?: string;
    domain?: null;
    isMachineTagged?: number;
    isSRCreated?: boolean;
    isVerified?: boolean;
    sentimentType?: number;
    strObjectID?: number;
    strTwetID?: string;
}

export interface ChatBotSignalRMessage{
    $type: string;
    BrandID: string;
    Data: SignalrResponseData;
    Message: string;
    TicketID: number;
    UserId: number;
}

export interface ChatBotSignalR
{
    message?: any;
    signalId?: number;
}


