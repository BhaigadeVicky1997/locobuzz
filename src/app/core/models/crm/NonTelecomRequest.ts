export interface NonTelecomRequest {
    $type?: string;
    FullName: string;

    MobileNumber: string;

    EmailAddress: string;

    Channel: string;

    SubChannel: string;

    UserProfileurl: string;

    UserName: string;
    FollowingCount: string;
    FollowerCount: string;
    LocobuzzTicketID: string;
    ConversationLog: string;

    Remarks: string;

    CreatedBy: string;

    SrID: string;
    TagID: string;
    ChannelType: string;


    IsUserFeedback: boolean;

    LoggedInUserEmailAddress: string;
}