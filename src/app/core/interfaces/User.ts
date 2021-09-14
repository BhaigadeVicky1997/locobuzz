import { Menu } from "../models/menu/Menu";

export interface AuthUser {
    success: boolean;
    message?: any;
    data?: Data;
  }

interface Data {
    code?: any;
    url?: string;
    isRedirect?: boolean;
    otherData?: any;
    user: User;
    token: string;
  }

export interface User {
    userId: number;
    username: string;
    role: number;
    firstName: string;
    lastName: string;
    fullName?: any;
    emailAddress?: string;
    categoryId?: number;
    categoryName?: string;
    categoryGroupID?: any;
    categoryGroupName?: any;
    teamID?: number;
    hiddenItems?: string;
    userPersonalization?: string;
    isDisabled?: boolean;
    isDeleted?: boolean;
    agentTicketReassignmentEnabled?: boolean;
    userAccountStatus?: string;
    isUserAssignmentDisabled: number;
    menuLandingPageName?: any;
    assignmentDisabled?: number;
    skills?: any;
    channelTypes?: any;
    playStoreRatings?: any[];
    googleReviewRatings?: any[];
    userMenuJson?: UserMenuJson;
    actionButton?: ActionButton;
    agentWorkFlowEnabled?: boolean;
    isCanPerformActionEnable?: boolean;
    GUID?: string;
    userMenu?: Menu[];
    isScheduledBreakApplicable?: boolean;
    isScheduledBreakEnabled?: boolean;
    config?: Config;
  }

export interface ActionButton {
    likeEnabled?: boolean;
    retweetEnabled?: boolean;
    hideUnhideEnabled?: boolean;
    deleteSocialEnabled?: boolean;
    deleteLocobuzzEnabled?: boolean;
    newMenuStructureEnabled?: boolean;
    allowAssignment?: boolean;
    isMakerChekerEnabled?: boolean;
    allowTicketReassignment?: boolean;
    isCategoryBulkReplyEnabled?: boolean;
    isBrandBulkReplyEnabled?: boolean;
    isBulkReplyEnabledBrandIdJson?: boolean;

  }

export interface UserMenuJson {
    userMenu?: UserMenu[];
  }

export interface UserMenu {
    id?: number;
    menuName?: string;
    urlLink?: string;
    urlLink2?: string;
    parentID?: string;
    ticketVersion?: string;
    sortOrder?: string;
    menuImage?: any;
    isDeleted?: number;
    isParent?: boolean;
    isActive?: string;
  }

  export interface Config {
    MaxMentionsOrTicketsForBulkReply?: number;
    MaxMentionsOrTicketsForBulkReplyTwitter?: number;
    MaxMentionsOrTicketsForBulkReplyFacebook?: number;
  }
