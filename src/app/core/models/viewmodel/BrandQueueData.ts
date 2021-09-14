export interface BrandQueueData {
    autoQueueingEnabled: boolean;
    queueRole: number;
    ticketAssignMentLimit: number;
    lIFOFIFO: string;
    noOfDays: number;
    isVerifed: boolean;
    isInflunecer: boolean;
    isRemoveAssignTicket: boolean;
    followerCount: number;
    engagementCount: number;
    keyWords: string;
    sqlQuery: string;
    isSkillBasedEnforced: boolean;
    viewAs: ViewAs;
}

export interface BrandQueueResponse
{
    success: boolean;
    message: string | null;
    data: BrandQueueData[];
}

export enum ViewAs {
    Individual,
    Teams,
    Both
}