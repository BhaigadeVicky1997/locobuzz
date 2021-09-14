export interface UserInteractionEnggagement {
    brandID: number;
    brandName: string;
    brandFriendlyName: string;
    chartType: string;
    channelGroupID: number;
    channelGroupName: string;
    mentionCount: number;
    neutral: number;
    positive: number;
    negative: number;
}

export interface UserInteractionEnggagementResponse
{
    success?: boolean;
    message?: string | null;
    data?: UserInteractionEnggagement[];
}