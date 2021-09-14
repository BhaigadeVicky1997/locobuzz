import { ChannelGroup } from 'app/core/enums/ChannelGroup';

export interface UserLoyaltyDetails {
    nPSScore: number;
    upliftSentimentScore: number;
    likes: number;
    comments: number;
    shares: number;
    brandLoyalty: number;
    totalEngagement: number;
    channel: ChannelGroup;
}

export interface UserLoyaltyDetailsResponse
{
    success?: boolean;
    message?: string | null;
    data?: UserLoyaltyDetails;
}
