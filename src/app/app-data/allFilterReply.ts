export const allFilterReply =
{
    whatToMonitor: {
        name: 'What you want to monitor?',
        adname: 'What you want to monitor?',
        type: 4,
        operator: 'in',
        value: [],
        advanceType: 'integer'
    },
    Mentions: {
        name: 'isbrandactivity',
        adname: 'isbrandactivity',
        type: 2,
        operator: 'in',
        value: [1,2],
        advanceType: 'integer'
    },
    userActivity: {
        name: 'isactionable',
        adname: 'isactionable',
        type: 2,
        operator: 'in',
        value: [1,0],
        advanceType: 'integer'
    },
    brandActivity: {
        name: 'brandpostorreply',
        adname: 'brandpostorreply',
        type: 2,
        operator: 'in',
        value: [1,0],
        advanceType: 'integer'
    },
    ticketsYouWantToSee: {
        name: 'users',
        adname: 'users',
        type: 2,
        operator: 'in',
        value: [],
        advanceType: 'integer'
    },
    myTickets: {
        name: 'TicketType',
        adname: 'TicketType',
        type: 0,
        operator: 'equal',
        value: [],
        advanceType: 'integer'
    },
    // ticketStatus: {
    //     name: 'CD.CaseStatus',
    //     adname: 'CD.CaseStatus',
    //     type: 2,
    //     operator: 'in',
    //     value: [],
    //     advanceType: 'integer'
    // },
    // TATBranchTime: {
    //     name: 'isflrtatbreachtime',
    //     adname: 'isflrtatbreachtime',
    //     type: 0,
    //     operator: 'equal',
    //     value: [],
    //     advanceType: 'integer',
    // },
    TAT: {
        name: 'TATBreached',
        adname: 'TATBreached',
        type: 0,
        operator: 'equal',
        value: [],
        advanceType: 'integer'
    },
    Priority: {
        name: 'CD.Priority',
        adname: 'CD.Priority',
        type: 2,
        operator: 'in',
        value: [],
        advanceType: 'integer',
    },
    mediaType: {
        name: 'Main.MediaEnum',
        adname: 'Main.MediaEnum',
        type: 2,
        operator: 'in',
        value: [],
        advanceType: 'integer'
    },
    // API
    upperCategory: {
        Ticketsname: 'CDM.UpperCategoryID',
        Mentionname: 'Main.UpperCategoryID',
        Ticketsadname: 'CDM.UpperCategoryID',
        Mentionadname: 'Main.UpperCategoryID',
        type: 2,
        operator: 'in',
        value: [],
        advanceType: 'integer'
    },
    // API
    Category: {
        TicketsCname: 'TCL.LabelID',
        TicketsDname: 'TCD.DepartmentID',
        TicketsSname: 'TCS.SubCategoryID',
        adTicketsCname: 'TCL.LabelID',
        adTicketsDname: 'TCD.DepartmentID',
        adTicketsSname: 'TCS.SubCategoryID',
        MentionCname: 'TL.LabelID',
        MentionDname: 'TD.DepartmentID',
        MentionSname: 'TS.SubCategoryID',
        adMentionCname: 'TL.LabelID',
        adMentionDname: 'TD.DepartmentID',
        adMentionSname: 'TS.SubCategoryID',
        type: 2,
        operator: 'in',
        advanceType: 'integer',
        value: {},
    },
    // API
    Channel: {
        gname: 'MC.ChannelGroupID',
        tname: 'MAIN.ChannelType',
        adGname: 'MC.ChannelGroupID',
        adTname: 'MAIN.ChannelType',
        type: 2,
        operator: 'in',
        advanceType: 'integer',
        value: {},
    },
    // API
    socialProfile: {
        name: 'socialprofiles',
        adname: 'socialprofiles',
        type: 2,
        operator: 'in',
        value: [],
        advanceType: 'integer'
    },
    // postType: {
    //     name: 'isbrandactivity',
    //     adname: 'isbrandactivity',
    //     type: 0,
    //     operator: 'equal',
    //     value: [],
    //     advanceType: 'integer'
    // },
    Sentiments: {
        name: 'Main.SentimentType',
        adname: 'Main.SentimentType',
        type: 2,
        operator: 'in',
        value: [],
        advanceType: 'integer'
    },
    autocloserEnable: {
        name: 'CD.isCustomerInfoAwaited',
        adname: 'CD.isCustomerInfoAwaited',
        type: 4,
        operator: 'equal',
        value: [],
        advanceType: 'integer'
    },
    // scheduleTicket: {
    //     name: 'Schedule ticket',
    //     adname: 'Schedule ticket',
    //     type: 4,
    //     operator: 'equal',
    //     value: [],
    //     advanceType: 'integer',
    // },
    subscribeTicket: {
        name: 'CDSD.IsSubscribe',
        adname: 'CDSD.IsSubscribe',
        type: 4,
        operator: 'equal',
        value: [],
        advanceType: 'integer'
    },
    deleteFromSocial: {
        name: 'Main.isDeletedFromSocial',
        adname: 'Main.isDeletedFromSocial',
        type: 4,
        operator: 'equal',
        value: [],
        advanceType: 'integer'
    },
    Role: {
        name: 'Role',
        adname: 'Role',
        type: 0,
        operator: 'equal',
        value: [],
        advanceType: 'integer'
    },
    // API
    assigendTo: {
        name: 'users',
        adname: 'users',
        type: 2,
        operator: 'in',
        value: [],
        advanceType: 'integer'
    },
    authorName: {
        name: 'main.Author',
        adname: 'main.Author',
        type: 1,
        operator: 'equal',
        value: [],
        advanceType: 'integer',
    },
    followersCount: {
        name: 'followercount',
        adname: 'followercount',
        type: 5,
        operator: 'between',
        value: [],
        advanceType: 'integer',

    },
    influencerCategory: {
        name: 'minflu.InfluencerCategory',
        adname: 'minflu.InfluencerCategory',
        type: 1,
        operator: 'equal',
        value: [],
        advanceType: 'integer'
    },
    VerifirdNonverified: {
        name: 'main.isverified',
        adname: 'main.isverified',
        type: 4,
        operator: 'equal',
        value: [],
        advanceType: 'integer'
    },
    // influencerScore: {
    //     name: 'influencer Score',
    //     adname: 'influencer Score',
    //     type: 0,
    //     operator: 'in',
    //     value: [],
    //     advanceType: 'integer'
    // },
    SentimentUpliftScore: {
        name: 'MUI.UpliftSentimentScore',
        adname: 'MUI.UpliftSentimentScore',
        type: 5,
        operator: 'in',
        value: [],
        advanceType: 'number'
    },
    // API
    userWith: {
        name: 'UserWith',
        adname: 'UserWith',
        type: 0,
        operator: 'equal',
        value: [],
        advanceType: 'integer'
    },
    Campaign: {
        name : 'campaigns',
        adname : 'campaigns',
        type: 2,
        operator: 'in',
        value: [],
        advanceType: 'integer'
    },
    // API
    actionStatuses: {
        name: 'TicketActionStatus',
        adname: 'TicketActionStatus',
        type: 2,
        operator: 'equal',
        value: [],
        advanceType: 'integer'
    },
    // API
    SsreStatuses: {
        name : 'SSREStatus',
        adname : 'SSREStatus',
        type: 2,
        operator: 'equal',
        value: [],
        advanceType: 'integer'
    },
    feedbackRequested: {
        name: 'CD.IsFeedBackSent',
        adname: 'CD.IsFeedBackSent',
        type: 4,
        operator: 'equal',
        value: [],
        advanceType: 'integer'
    },
    FeedbackRating: {
        name: 'MUI.FeedbackRating',
        adname: 'MUI.FeedbackRating',
        type: 2,
        operator: 'in',
        value: [],
        advanceType: 'integer'
    },
    FeedbackType: {
        name: 'FeedbackType',
        adname: 'FeedbackType',
        type: 0,
        operator: 'equal',
        value: [],
        advanceType: 'integer'
    },
    NPSRating: {
        name: 'MUI.FeedbackRating',
        adname: 'MUI.FeedbackRating',
        type: 5,
        operator: 'equal',
        value: [],
        advanceType: 'integer'
    },
    ReplyStatus: {
        name: 'isreplied',
        adname: 'isreplied',
        type: 4,
        operator: 'equal',
        value: [],
        advanceType: 'boolean'
    },
    // API
    Language: {
        name: 'Main.Lang',
        adname: 'Main.Lang',
        type: 2,
        operator: 'in',
        value: [],
        advanceType: 'integer'
    },
    // API
    Countries: {
        name: 'Main.countryfipscode',
        adname: 'Main.countryfipscode',
        type: 2,
        operator: 'in',
        value: [],
        advanceType: 'integer'
    }
};

enum FilterDataType
{
    Integer,
    String,
    Array,
    DateTime,
    Boolean,
    Between
}
