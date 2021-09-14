import { TicketClient } from 'app/core/interfaces/TicketClient';
import { BaseMention } from '../mentions/locobuzz/BaseMention';

export interface TicketHistoryDTO {
    source?: BaseMention;
    ticketClient?: TicketClient;
    isCSDUser?: boolean;
    isReadOnlySupervisor?: boolean;
    isBrandLevelBulkReply?: boolean;
    IsCategoryLevelBulkReply?: boolean;
    showAttachTicket?: boolean;
    showCreateSingleTicket?: boolean;
    showReplyButton?: boolean;
    isBrandWorkFlowEnabled?: boolean;
    addDisableClass?: string;
    deletedMentionDisable?: string;
    profileObj?: TicketSpecificProfile;
    isDMSent?: boolean;
    canReplyPrivately?: boolean;
    ticketCustomReply?: TicketCustomReply;
    isCanPerformActionEnable?: boolean;
    intentssre?: number;
    channelTypeIcon?: string;
    isCheckBoxEnable?: boolean;
    isVerified?: boolean;
    isLastNote?: boolean;
    LastNote?: string;
    ticketMentionActionBtn?: boolean;
    performActionEnabled?: boolean;
    isDeleteFromLocobuzz?: boolean;
    isDeleteFromChannel?: boolean;
    isSubscriptionActive?: string;
    isVisible?: boolean;
    actionLikeEnabled?: boolean;
    actionRetweetEnabled?: boolean;
}

export interface TicketSpecificProfile {
    profilepicurl?: string;
    profileurl?: string;
}

export interface TicketCustomReply {
    BrandPostClass?: string;
    chkTagTicket?: string;
    replyfrom?: string;
    replyImg?: string;
    isreply?: boolean;
}