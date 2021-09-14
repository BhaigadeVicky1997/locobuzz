import { TicketClient } from 'app/core/interfaces/TicketClient';
import { ActionButton } from 'app/core/interfaces/User';
import { BaseMention } from '../mentions/locobuzz/BaseMention';

export interface AllBrandsTicketsDTO {
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
    isAddDisableClass?: boolean;
    deletedMentionDisable?: string;
    isDeletedMentionDisable?: boolean;
    profileObj?: AllBrandsTicketsProfile;
    isDMSent?: boolean;
    canReplyPrivately?: boolean;
    ticketCustomReply?: AllBrandsTicketsReply;
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
    isVisible?: string;
    actionLikeEnabled?: boolean;
    actionRetweetEnabled?: boolean;

    SLACounterStartInSecond?: number;
    typeOfShowTimeInSecond?: number;
    iSEnableShowTimeInSecond?: number;
    timetobreach?: string;
    alreadybreached?: boolean;
    isBrandUser?: boolean;
    isCSDApprove?: boolean;
    isCSDReject?: boolean;
    isemailattachement?: boolean;
    actionButton?: ActionButton;
    isEnableDisableMakercheckerVisible?: boolean;
    isEnableReplyApprovalWorkFlow?: boolean;
    isSSREEnabled?: boolean;
    isbreached?: boolean;
    isabouttobreach?: boolean;
    isBrandWorkFlow?: boolean;
    isTicketCategoryTagEnable?: boolean;
    ssretype?: string;
    ticketPriorityClassName?: string;
    mentionTime?: string;
    fbBrandfriendlyName?: string;
    fbPageName?: string;
    GBMStoreCode?: string;
    InstaAccountID?: number;
    markedinfluencerclass?: string;
    followersCount?: number;
    followingCount?: number;
    KloutScore?: number;
    Rating?: number;
    NoRating?: number;
    NoRatingHolidayIQ?: number;
    LocationID?: string;
    StoreCode?: string;
    appFriendlyName?: string;
    profilepicurl?: string;
    profileurl?: string;
    screenName?: string;
    showEnrichment?: boolean;
    star_03Length?: number;
    star_deselected_03?: number;
    description?: string;
    htmlData?: string;
    title?: string;
    imageurls?: string[];
    videoUrls?: VideoUrl[];
    audioUrls?: AudioUrl[];
    documentUrls?: DocumentUrl[];
    makercheckerimageurls?: string[];
    makercheckervideoUrls?: VideoUrl[];
    makercheckeraudioUrls?: AudioUrl[];
    makercheckerdocumentUrls?: DocumentUrl[];
    rejectedNote?: string;
    lastReply?: string;
    isAssignVisible?: boolean;
    isDirectCloseVisible?: boolean;
    isReplyVisible?: boolean;
    isAttachTicketVisible?: boolean;
    isCreateTicketVisible?: boolean;
    isEscalateVisible?: boolean;
    isTranslationVisible?: boolean;
    isTicketAgentWorkFlowEnabled?: boolean;
    isMarkInfluencerVisible?: boolean;
    isSendEmailVisible?: boolean;
    isApproveRejectMakerChecker?: boolean;
    isMakerCheckerPreview?: boolean;
    isLiveSSRE?: boolean;
    isSSREVerified?: boolean;
    isSimulationSSRE?: boolean;
    MakerCheckerPreview?: MakerCheckerPreview;
    isSSREPreview?: boolean;
    SSREPreview?: SSREPreview;
    isTrendsVisible?: boolean;
    isCopyMoveVisible?: boolean;
    deleteSocialEnabled?: boolean;
    isworkflowApproveVisible?: boolean;
    isworkflowRejectVisible?: boolean;
    communicationLogProperty?: CommunicationLogProperty;
    tomaillist?: string;
    ismentionidVisible?: boolean;
    mentionid?: string;
    showTicketWindow?: boolean;
    showMarkactionable?: boolean;
    sendmailallmention?: boolean;
    setpriority?: boolean;
    isrejectedNote?: boolean;
    crmmobilenopopup?: boolean;
    crmcreatereqpop?: boolean;
}

export interface CommunicationLogProperty
{
    mentionId?: string;
    likeCount?: string;
    shareCount?: string;
    commentCount?: string;
    likeEnabled?: boolean;
    reTweetEnabled?: boolean;
    showLikeShareBox?: boolean;
    likeStatus?: boolean;
    retweetStatus?: boolean;
}

export interface DocumentUrl {
    thumbUrl?: string;
    fileUrl?: string;
}

export interface AudioUrl {
    thumbUrl?: string;
    fileUrl?: string;
}
export interface VideoUrl {
    thumbUrl?: string;
    fileUrl?: string;
}


export interface AllBrandsTicketsProfile {
    profilepicurl?: string;
    profileurl?: string;
}

export interface AllBrandsTicketsReply {
    BrandPostClass?: string;
    chkTagTicket?: string;
    replyfrom?: string;
    replyImg?: string;
    isreply?: boolean;
}

export interface MakerCheckerPreview {
    messageContent?: string;
    actionPerformed?: string;
}

export interface SSREPreview {
    messageContent?: string;
    actionPerformed?: string;
}

