import { SocialAuthor } from 'app/core/abstractclasses/SocialAuthor';
import { ActionTaken } from 'app/core/enums/ActionTakenEnum';
import { ChannelGroup } from 'app/core/enums/ChannelGroup';
import { ChannelType } from 'app/core/enums/ChannelType';
import { LogStatus } from 'app/core/enums/LogStatus';
import { RadioButton } from '../customcontrols/RadioButton';
import { BrandInfo } from './BrandInfo';

export interface CommunicationLog {
    note?: string;
    iD?: number | null;
    mentionTime?: string;
    userID?: number;
    username?: string;
    usernames?: string[];
    ticketID?: number;
    mentionID?: string;
    postID?: number | null;
    tagID?: number | null;
    assignedToUserID?: number | null;
    assignedToTeam?: number | null;
    assignedToTeamName?: string;
    previousAssignToUserID?: number | null;
    previousAssignedToTeam?: string;
    previousAssignedToTeamName?: string;
    assignedToUsername?: string;
    status?: LogStatus;
    lstStatus?: LogStatus[];
    lstUserNames?: string[];
    lstUserIDs?: number[];
    lstLogIDs?: (number | null)[];
    lstAssignedtoUserNames?: string[];
    batchID?: string;
    agentPic?: string;
    assignedToAgentPic?: string;
    assignedToAccountType?: string;
    accountType?: string;
    postScheduledDateTime?: string | null;
    replyScheduledDateTime?: string | null;
    replyEscalatedToUsername?: string;
    replyUserName?: string;
    isScheduled?: boolean;
    workflowReplyDetailID?: number;
    channelType?: ChannelType;
    isLastLog?: boolean | null;
    author?: SocialAuthor;
    brandInfo?: BrandInfo;
    globalTicketVersion?: number;
    nextLogBatchID?: string;
    nextLogStatus?: LogStatus;
    actionTakenFrom?: ActionTaken;
    logVersion?: number;
    contentID?: number;
    isHtml?: boolean;
    concreteClassName?: string;
    mentionTimeEpoch?: number;
    channelGroup?: ChannelGroup;
    logText?: string;
}

export interface NoteAndMessage {
    message?: string;
    listObj?: string[];
    note?: string;
}

export interface CommunicationLogResponse
{
success?: boolean;
message?: string | null;
data?: CommunicationLog[];
ticketIds?: any[];
}

export class CommLogFilter
{
    radioButtonList?: RadioButton[] = [];
    constructor()
    {
        this.radioButtonList.push({
            name: 'Actionable',
            checked: false,
            value: 0
        });
        this.radioButtonList.push({
            name: 'Actionable & Non-Actionable',
            checked: false,
            value: 2
        });
        this.radioButtonList.push({
            name: 'Only Ticket',
            checked: false,
            value: 1
        });
    }
}

