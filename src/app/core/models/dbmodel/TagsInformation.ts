import { ChannelGroup } from 'app/core/enums/ChannelGroup';
import { Sentiment } from 'app/core/enums/Sentiment';

export interface TagsInformation {
    labelName: string;
    labelID: number;
    sentiment: number;
    dayCount: number;
    objectID: string;
    parentObjectID: string;
    objectCommentID: string;
    tagID: number;
    suggestResponse: string;
    priority: string;
    tagStatus: string;
    influencer: string;
    author: string;
    requestForManager: string;
    upperCategory: number;
    isDeleted: number;
    caseDetails: string;
    offlineClosure: string;
    assignToUserID: string;
    isCutomserInfoAwaited: boolean;
}

export interface CategoryTagDetails {
    tagID: number;
    channelGroup: ChannelGroup;
    shareCount: number;
    commentCount: number;
    socialID: string;
    retweetedStatusID: string;
    brandID: number;
    caseID: number;
    mentionID: string;
}

export interface TagItems {
    categoryID: number;
    category: string;
    sentiment: Sentiment | null;
    depatments: Department[];
}

export interface Department {
    departmentID: number;
    departmentName: string;
    labelID: number;
    departmentSentiment: Sentiment | null;
    subCategories: SubCategory[];
}

export interface SubCategory {
    subCategoryID: number;
    subCategoryName: string;
    subCategorySentiment: Sentiment | null;
    departmentID: number;
    labelID: number;
}

export interface TagDetails {
    tagID: number;
    existingTagID: number;
    caseGenerate: number;
    caseStatus: number;
    channelType: number;
    status: number;
}

export interface UpperCategory {
    iD: number;
    name: string;
    userID: number | null;
}

export interface TaggingRequestProcessStatus {
    tagID: number;
    requestID: number;
    taggingRequestStatus: TaggingRequestProcesStatus | null;
    isTicket: boolean;
    caseID: number;
    tweetIDORFBID: string;
    retweetedStatusID: string;
}

export enum TaggingRequestProcesStatus {
    Pending = 0,
    InProcess = 1
}