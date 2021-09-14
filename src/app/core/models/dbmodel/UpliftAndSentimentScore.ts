export interface UpliftAndSentimentScore {
    id?: number;
    authorSocialID?: string;
    authorName?: string;
    brandID?: number;
    channelGroupID?: number;
    upliftSentimentScore?: number;
    npsScore?: number;
    upliftLastupdatedDatetime?: string;
    lastActivityDatetime?: string;
    npsLastRecordDate?: string;
    isNpsOn?: boolean;
}

export interface SentimentMentionData {
    mentionID: string;
    tagID: number;
    authorID: string;
    channelID: number;
    channelGroupID: number;
    brandID: number;
    sentimentType: number;
    createdDate: string;
    isBrandPost: boolean;
}

export interface UpliftAndSentimentScoreResponse
{
    success: boolean;
    message: string | null;
    data: UpliftAndSentimentScore;
}