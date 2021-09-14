interface EachOptions
{
    id: any;
    label: string;
}

interface EachData{
    options: EachOptions[];
    displayName: string;
    type: string;
    default?: any;
    URL?: string;
}

interface TreeChecklist{
    options: any;
    displayName: string;
    type: string;
}

interface BrandDateDuration{
    displayName: string;
    selectBrand: EachData;
    Duration: EachData;
}

interface TicketsMentions{
    displayName: string;
    whatToMonitor: EachData;
    Mentions: EachData;
    userActivity: EachData;
    brandActivity: EachData;
    ticketsYouWantToSee: EachData;
    myTickets: EachData;
    // ticketStatus: EachData;
    // TATBranchTime: EachData;
    TAT: EachData;
    Priority: EachData;
    mediaType: EachData;
    upperCategory: EachData;
    Category: TreeChecklist;
    Channel: TreeChecklist;
    socialProfile: EachData;
    postType?: EachData;
    Sentiments: EachData;
    autocloserEnable: EachData;
    // scheduleTicket: EachData;
    subscribeTicket: EachData;
    deleteFromSocial: EachData;
}

interface TeamCharacteristics{
    displayName: string;
    // Role: EachData;
    assigendTo: EachData;
}

interface UserCharacteristics{
    displayName: string;
    followersCount: any;
    influencerCategory: EachData;
    VerifirdNonverified: EachData;
    influencerScore?: any;
    SentimentUpliftScore: any;
    userWith: EachData;
    NPSRating: any;
}

interface Others{
    displayName: string;
    Campaign: EachData;
    actionStatuses: EachData;
    SsreStatuses: EachData;
    feedbackRequested: EachData;
    FeedbackRating: EachData;
    FeedbackType: EachData;
    ReplyStatus: EachData;
    Language: EachData;
    Countries: EachData;
}

interface Keywords{
    displayName: string;
    AND: EachData;
    Or: EachData;
    Donot: EachData;
}

interface ExcludeFilters{
    displayName: string;
    searchFilter: EachData;
}

export interface FilterData{
    brandDateDuration: BrandDateDuration;
    ticketsMentions: TicketsMentions;
    teamcharacteristics: TeamCharacteristics;
    usercharacteristics: UserCharacteristics;
    Others: Others;
    Keywords: Keywords;
    excludeFilters: ExcludeFilters;
}
