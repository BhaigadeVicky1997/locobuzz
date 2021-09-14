import { BrandInfo } from '../viewmodel/BrandInfo';
import { GroupEmailList } from '../viewmodel/GroupEmailList';
import { Reply } from '../viewmodel/Reply';

export interface MakerChecker {
    brandInfo: BrandInfo;
    groupEmailList: GroupEmailList;
    replies: Reply[];
    accountSocialID: string;
    timeOffset: number;
    attachmentXml: string;
    mentionsAttachToCaseid: string;
    escalatedMessage: string;
    lstAttachmentXml: string[];
    escalatedToAccountType: number;
    operationType: number;
    replyMessage: string;
    escalatedToUserID: number;
    workflowReplyDetailID: number;
    teamID: number;
    cSDTeamId: number;
    brandTeamId: number;
    assignToUserId: number;
    tagID: number;
    ticketID: number;
    attachToCaseid: number;
    accountID: number;
    userID: number;
    sendAsPrivate: boolean;
    sendPrivateAsLink: boolean;
    sendToGroups: boolean;
    isEligibleForAutoclosure: boolean;

    sendFeedback: boolean;
    scheduleDate: string | null;
}

export interface MakerCheckerResponse {
    success?: boolean;
    message?: string | null;
    data?: MakerChecker;
}
