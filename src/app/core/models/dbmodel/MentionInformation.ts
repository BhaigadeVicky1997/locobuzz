import { BaseMention } from '../mentions/locobuzz/BaseMention';

export interface MentionInformation {
    mentionList: BaseMention[];
    totalRecords: number;
    lastActivity: string | null;
    firstActivity: string | null;
    firstSentimentType: number;
    lastSentimentType: number;
    firstActivityEpoch: number;
    lastActivityEpoch: number;
}

export interface MentionInformationResponse {
    success?: boolean;
    message?: string | null;
    data?: MentionInformation;
}
