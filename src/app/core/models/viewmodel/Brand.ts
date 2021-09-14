import { CrmType } from 'app/core/enums/crmEnum';
import { FeedbackTypeEnum } from 'app/core/enums/FeedbackTypeEnum';

export interface Brand {
    brandName: string;
    brandID: string;
    brandFriendlyName: string;
    categoryID: string;
    categoryGroupName: string;
    categoryName: string;
    userID: number;
    categoryGroupID: string;
    rImageURL: string;
    orderNo: number;
    rSmallImageURL: string;
    brandSmallFriendlyName: string;
    tMainAccount: string;
    fBAccount: string;
    bColor: string;
    countryFipsCode: string;
    zoomInfo: string;
    reportImageFolder: string;
    brandGroup: string;
    isTokenExpiredCheck: boolean;
    isCompetition: boolean;
    isIndividual: boolean;
    brandGroupOrder: number;
    screenNames: string;
    brandLogicImages: string;
    brandGroupColor: string;
    autoQueuingEnabled: number;
    maxAssignmentLimit: number;
    isTicket: boolean;
    isBrandworkFlowEnabled: boolean;
    isCSDReject: boolean;
    isCSDApprove: boolean;
    clockInTime: string;
    clockOutTime: string;
    cSDClockInTime: string;
    cSDClockOutTime: string;
    credit: number;
    usedCredit: number;
    thressHold: number;
    usedThressHold: number;
    isEMTabEnabled: boolean;
    isPushCRMEnabled: boolean;
    cRMActive: boolean;
    cRMType: CrmType;
    cRMClassName: string;
    isActionableMailEnable: boolean;
    isMaskingEmailEnabled: boolean;
    isMaskingPhoneNumberEnabled: boolean;
    isFeedbackEnabled: boolean;
    feedBackType: FeedbackTypeEnum;
    maskDetailInfo: string;
    isTicketCategoryTagEnable: boolean;
    ticketCategoryType: number;
    isSignatureEnabled: boolean;
    userSignature: string;
    emailTemplate: string;
    channelGroupIds: string;
    skipPrivateChannels: boolean;
    isEnableReplyApprovalWorkFlow: boolean;
    isFoulKeywordEnabled: boolean;
    sLACounterStartInSecond: number;
    typeOfShowTimeInSecond: number;
    iSEnableShowTimeInSecond: boolean;
    signatureSymbol: string;
    isMakerCheckerFKEnabled: boolean;
    botEnableJson: string;
    isRulesAvailable: boolean;
    reachImpressionUpdatedDate: string;
    isSSREEnable: boolean;
    botEnable: BotEnableModel;
    isSLAFLRBreachEnable: boolean;
    sLAFLRBreachTime: number;
    isCategoryBulkReply: boolean;
    isBrandBulkReply: boolean;
}

export interface BotEnableModel {
    showWhatsapp: boolean;
    showMessenger: boolean;
    showWebsiteBot: boolean;
}

export interface CompetitionBrand {
    brandID: string;
    compBrandID: string;
}
