interface BrandDateDuration {
    selectBrand: string[];
    Duration?: any;
}

interface Mentions {
    'User Activity'?: any;
    'Brand Activity'?: any;
}

interface UserActivity {
    Actionable?: any;
    'Non Actionable'?: any;
}

interface BrandActivity {
    'Brand Replies'?: any;
    'Brand Post'?: any;
}

interface TicketsMentions {
    whatToMonitor?: any;
    Mentions: Mentions;
    userActivity: UserActivity;
    brandActivity: BrandActivity;
    ticketsYouWantToSee?: any;
    myTickets?: any;
    ticketStatus?: any;
    TATBranchTime?: any;
    Priority?: any;
    mediaType?: any;
    upperCategory?: any;
    Category?: any;
    Channel?: any;
    socialProfile?: any;
    postType?: any;
    Sentiments?: any;
    autocloserEnable?: any;
    scheduleTicket?: any;
    subscribeTicket?: any;
    deleteFromSocial?: any;
}

interface Teamcharacteristics {
    Role?: any;
    assigendTo?: any;
}

interface Usercharacteristics {
    followersCount?: any;
    influencerCategory?: any;
    VerifirdNonverified?: any;
    influencerScore?: any;
    userWith?: any;
}

interface Others {
    Campaign?: any;
    actionStatuses?: any;
    SsreStatuses?: any;
    feedbackRequested?: any;
    FeedbackRating?: any;
    FeedbackType?: any;
    NPSRating?: any;
    ReplyStatus?: any;
    Engageable?: any;
    Language?: any;
    Countries?: any;
}

interface AND {
    category?: any;
    array: any[];
}

interface Keywords {
    AND: AND;
    Or: any[];
    Donot: any[];
}

export interface FilterFilledData {
    brandDateDuration: BrandDateDuration;
    ticketsMentions: TicketsMentions;
    teamcharacteristics: Teamcharacteristics;
    usercharacteristics: Usercharacteristics;
    Others: Others;
    Keywords: Keywords;
    excludeFilters: any;
}
