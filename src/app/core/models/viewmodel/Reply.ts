import { GroupEmailList } from './GroupEmailList';
import { UgcMention } from './UgcMention';

export interface Reply {
    $type?: string;
    replyText?: string;
    attachments?: string[];
    attachmentsUgc?: UgcMention[];
    taggedUsersJson?: string;
    excludedReplyUserIds?: string;
    newSelectedTaggedUsersJson?: string;
    sendFeedback?: boolean;
    sendAsPrivate?: boolean;
    sendPrivateAsLink?: boolean;
    sendUgc?: boolean;
    eligibleForAutoclosure?: boolean;
    sendToGroups?: boolean;
    groupEmailList?: GroupEmailList;
    toGroupEmails?: string[];
    ccGroupEmails?: string[];
    bccGroupEmails?: string[];
    toEmails?: string[];
    ccEmails?: string[];
    bccEmails?: string[];
    teamId?: number;
    teamLeadId?: number;
    timeOffSet?: number;
    parentSocialID?: string;
    isReplyScheduled?: boolean;
}
