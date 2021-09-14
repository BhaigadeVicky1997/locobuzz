export interface SignalMessage {
    signalId?: number;
    message?: any;
  }

export interface SignalRMessage {
    Message: string;
    BrandId: number;
    Channel: string;
    DataCount: number;
    IsNonActionable: number;
    ActionableCount: number;
    Data: SignalRData;
    RTCount: string;
}

export interface SignalRData {
    UserPic: string;
    ID: string;
    BrandName: string;
    CategoryName: string;
    FeedName: string;
    Title: string;
    Description: string;
    PostURL: string;
    RecordDate: string;
    TagID: number;
    Channel: number;
    ChannelGroupId: number;
    Author: string;
    AuthorID: number;
    PostID: number;
    FollowersORLikesCount: string;
    CommentCount: number;
    TweetID: number;
    MediaType: string;
    Screenname: string;
    UserName: string;
    ObjectID: number;
    strTwetID: string;
    strObjectID: string;
    FBFeedID: string;
    RCount: number;
    BrandID: number;
    ThumbURL: string;
    FBCommentID: string;
    TCount: number;
    IsInfluencer: number;
    AverageRating: number;
    SibelCustomerID: null;
    NewMention: string;
    StrAuthorID: string;
    AgencyAssign: null;
    CaseGenerate: number;
    CaseID: number;
    ChannelName: string;
    LikeStatus: number;
    FollowStatus: number;
    isMachineTagged: number;
    TagPriority: number;
    TagReason: string;
    IsRequestForManager: number;
    Status: number;
    CaseStatus: number;
    EMessage: string;
    conversationID: string;
    Sentiment: number;
    sentimentType: number;
    Score: number;
    domain: string;
    LinsertedDate: string;
    AssignedToAgencyUser: string;
    Location: string;
    LastReadNumber: number;
    PartyID: null;
    isSRCreated: boolean;
    SRID: null;
    GooglePSReply: null;
    GooglePSReplyDate: string;
    IsBrandPost: boolean;
    FavCount: number;
    RetweetCount: number;
    OriginalTweetID: string;
    LinsertedDateString: string;
    isVerified: boolean;
    InstagramPostID: null;
    TypeOfResponse: null;
    AgeingFilterType: number;
    ShareCount: number;
    TweetorFBFeedID: number;
    PRTQueue: boolean;
    MarkedInfluancer: number;
    RetweetedStatusID: number;
    InReplyToStatusId: number;
    MediaUrls: string;
    UserDescription: string;
    AttachmentXML: string;
    CategoryJson: string;
    InfluancerCategoryId: number;
    InfluencerCategoryName: null;
    Queuetype: number;
    IsMakerCheckerEnable: boolean;
    ReplyStatus: number;
    DiscardReplyStatus: number;
    IsScheduled: boolean;
    InfluencerCategories: any[];
    OriginalTweetUserInfo: OriginalTweetUserInfo;
    Language: null;
}

export interface OriginalTweetUserInfo {
    AuthorName: string;
    AuthorSocialID: string;
    Bio: string;
    ChannelGroupID: number;
    FollowersCount: number;
    FollowingCount: number;
    Influences: null;
    Interests: null;
    IsBlocked: boolean;
    IsBrandFollowing: boolean;
    IsMuted: boolean;
    IsUserFollowing: boolean;
    IsUserPrivate: boolean;
    IsVerified: boolean;
    FavouriteCount: number;
    LocationsXml: null;
    PageAccessToken: null;
    PicUrl: string;
    ScreenName: string;
    SetForUpdate: boolean;
    SocialJoinDate: null;
    TweetCount: number;
    Url: null;
    UserSentiment: number;
}
