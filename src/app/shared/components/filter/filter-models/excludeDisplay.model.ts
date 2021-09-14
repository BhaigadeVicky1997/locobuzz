export class EachOptions
{
    id: any;
    label: string;
}

class EachData{
    options: EachOptions[];
    displayName: string;
    type: string;
    default: any;
}

interface TreeChecklist{
    options: any;
    displayName: string;
    type: string;
}

export class ExcludeDisplay {
    whatToMonitor?: EachData;
    Mentions?: EachData;
    userActivity?: EachData;
    brandActivity?: EachData;
    ticketsYouWantToSee?: EachData;
    myTickets?: EachData;
    ticketStatus?: EachData;
    TATBranchTime?: EachData;
    Priority?: EachData;
    mediaType?: EachData;
    upperCategory?: EachData;
    Category?: TreeChecklist;
    Channel?: TreeChecklist;
    socialProfile?: EachData;
    postType?: EachData;
    Sentiments?: EachData;
    autocloserEnable?: EachData;
    scheduleTicket?: EachData;
    subscribeTicket?: EachData;
    deleteFromSocial?: EachData;
    Role?: EachData;
    assigendTo?: EachData;
    followersCount?: EachData;
    influencerCategory?: EachData;
    VerifirdNonverified?: EachData;
    influencerScore?: EachData;
    userWith?: EachData;
    Campaign?: EachData;
    actionStatuses?: EachData;
    SsreStatuses?: EachData;
    feedbackRequested?: EachData;
    FeedbackRating?: EachData;
    FeedbackType?: EachData;
    NPSRating?: EachData;
    ReplyStatus?: EachData;
    Engageable?: EachData;
    Language?: EachData;
    Countries?: EachData;
}
