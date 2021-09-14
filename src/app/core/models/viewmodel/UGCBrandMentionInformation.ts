import { UgcMention } from './UgcMention';

export interface UGCBrandMentionInformation {
    lstUGCMention: UgcMention[];
    totalRecords: number;
}

export interface UGCBrandMentionResponse {
    success: boolean;
    message: string | null;
    data: UGCBrandMentionInformation;
}
