import { LogStatus } from 'app/core/enums/LogStatus';
import { MakerCheckerEnum } from 'app/core/enums/MakerCheckerEnum';
import { Priority } from 'app/core/enums/Priority';
import { ReplyProcess } from 'app/core/enums/ReplyProcess';
import { SSRELogStatus } from 'app/core/enums/SSRELogStatus';
import { TicketStatus } from 'app/core/enums/ticketStatusEnum';
import { TaggingCategory } from '../category/taggingCategory';
import { UpperCategory } from '../category/UpperCategory';

export interface TicketInfo {
    ticketID?: number;
    tagID?: number;
    assignedBy?: number | null;
    assignedTo?: number | null;
    assignedToTeam?: number | null;
    assignToAgentUserName?: string;
    readByUserName?: string;
    escalatedTotUserName?: string;
    escalatedToBrandUserName?: string;
    assignedAt?: string;
    previousAssignedTo?: number;
    escalatedTo?: number | null;
    escaltedToAccountType?: number;
    escalatedToCSDTeam?: number | null;
    escalatedBy?: number | null;
    escalatedAt?: string;
    escalatedToBrand?: number | null;
    escalatedToBrandTeam?: number | null;
    escalatedToBrandBy?: number | null;
    escalatedToBrandAt?: string;
    status?: TicketStatus;
    updatedAt?: string;
    createdAt?: string;
    numberOfMentions?: number;
    ticketPriority?: Priority;
    lastNote?: string;
    latestTagID?: number;
    autoClose?: boolean;
    isAutoClosureEnabled?: boolean;
    isMakerCheckerEnable?: boolean;
    ticketPreviousStatus?: TicketStatus | null;
    gUID?: string;
    srid?: string;
    previousAssignedFrom?: number | null;
    previouAgentWorkflowWorkedAgent?: number | null;
    cSDTeamId?: number | null;
    brandTeamId?: number | null;
    teamid?: number | null;
    previousAgentAccountType?: number | null;
    ticketAgentWorkFlowEnabled?: boolean;
    makerCheckerStatus?: MakerCheckerEnum;
    messageSentforApproval?: string;
    replyScheduledDateTime?: string | null;
    requestedByUserid?: number | null;
    workFlowTagid?: number | null;
    workflowStatus?: LogStatus;
    sSREStatus?: SSRELogStatus;
    isCustomerInfoAwaited?: boolean;
    utcDateTimeOfOperation?: string | null;
    toEmailList?: string;
    cCEmailList?: string;
    bCCEmailList?: string;
    taskJsonList?: string;
    caseCreatedDate?: string;
    tatflrBreachTime?: string;
    lockUserID?: number | null;
    lockDatetime?: string | null;
    lockUserName?: string;
    isTicketLocked?: boolean;
    tattime?: number | null;
    flrtatSeconds?: number | null;
    replyEscalatedToUsername?: string;
    replyUserName?: string;
    replyUserID?: number;
    replyApprovedOrRejectedBy?: string;
    ticketProcessStatus?: ReplyProcess | null;
    ticketProcessNote?: string;
    replyUseid?: number;
    escalationMessage?: string;
    isSubscribed?: boolean;
    ticketUpperCategory?: UpperCategory;
    ticketCategoryMap?: TaggingCategory[];
    ticketCategoryMapText?: string;
    latestResponseTime?: string;
}

export interface TicketInfoResponse
{
    success?: boolean;
    message?: string | null;
    data?: TicketInfo;
}