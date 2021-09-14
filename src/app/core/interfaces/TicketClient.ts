export interface UserInfo
{
   name: string;
   image: string;
   screenName?: string;
   bio?: string;
   isVerified?: boolean;
   following?: number;
   followers?: number;
   location?: string;
   sentimentUpliftScore?: number;
   npsScore?: number;
   socialid?: string;
}

export interface TicketClient
{
    channelName?: string;
    channelImage?: string;
    ticketDescription?: string | string[];
    Userinfo: UserInfo;
    assignTo?: string;
    brandName?: string;
    slaBreachTime?: string;
    ticketTime?: TicketTimings;
    note?: string;
    ticketId: number;
    mentionCount: number;
    ticketStatus?: string;
    ticketPriority?: string;
    isCrmEnabled?: boolean;
    ticketCategory?: TicketCategory;
    ticketCategoryTop?: string;
    mentionCategoryTop?: string;
    brandLogo?: string;
    ticketCatColor?: string;
    mentionCatColor?: string;

}

export interface TicketTimings
{
    modifiedDate?: string;
    mentionDate?: string;
    createdDate?: string;
    years?: string;
    months?: string;
    days?: string;
    minutes?: string;
    hours?: string;
    seconds?: string;
    timetoshow?: string;
    valYears?: string;
    valMonths?: string;
    valDays?: string;
    valMinutes?: string;
    valHours?: string;
    valSeconds?: string;
}

export interface TicketCategory
{
    ticketUpperCategory?: string;
    mentionUpperCategory?: string;
}

