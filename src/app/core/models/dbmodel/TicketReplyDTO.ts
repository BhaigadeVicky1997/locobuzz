import { ActionStatusEnum, ClientStatusEnum } from 'app/core/enums/ActionStatus';
import { ChannelType } from 'app/core/enums/ChannelType';
import { ActionStatus } from 'app/shared/components/filter/filter-models/actionstatus.model';
import { BaseMention } from '../mentions/locobuzz/BaseMention';
import { BrandQueueData } from '../viewmodel/BrandQueueData';
import { GroupEmailList } from '../viewmodel/GroupEmailList';
import { LocoBuzzAgent } from '../viewmodel/LocoBuzzAgent';
import { TaggedUser } from '../viewmodel/TaggedUser';
import { MakerChecker } from './MakerCheckerDB';

export interface TicketReplyDto
{
    isCSDUser?: boolean;
    isBrandUser?: boolean;
    maxlength?: number;
    isBrandworkFlowEnabled?: boolean;
    isEnableReplyApprovalWorkFlow?: boolean;
    isSSREEnabled?: boolean;
    isCSDApprove?: boolean;
    isCSDReject?: boolean;
    replyOptions?: CustomDropdownValue[];

    showTemplateMessage?: boolean;
    showCannedResponse?: boolean;
    showUGC?: boolean;
    showHandle?: boolean;
    apiWarningMessage?: string;
    handleNames?: SocialHandle[];
    brandUserIds?: string[];
    taggedUsers?: TaggedUser[];
    agentUsersList?: LocoBuzzAgent[];
    autoQueueConfig?: BrandQueueData[];
    groupEmailList?: GroupEmailList[];
    makerCheckerData?: MakerChecker;
}

export class ReplyOptions {
    replyOption: CustomDropdownValue[] = [];
    constructor(){
        this.replyOption = [
            {id: 15 , value: 'Reply'},
            {id: 16 , value: 'Acknowledge'},
            {id: 6, value: ' Create Ticket'},
            {id: 1, value: ' Direct Close'},
            {id: 3, value: ' Reply & Close'},
            {id: 5, value: ' Reply & Escalate'},
            {id: 13 , value: 'Reply & On Hold'},
            {id: 14 , value: 'Reply & Awaiting response from Customer'},
            {id: 9, value: ' Attach Ticket'},
            {id: 4, value: ' Escalate'},
            {id: 7, value: ' Approve'},
            {id: 8, value:  ' Reject'},
            {id: 10 , value: 'Escalate'},
            {id: 11 , value: 'Approve'},
            {id: 12 , value: 'Reject'}

        ];
    }

    static GetActionEnum(): object {
        return {
            DirectClose: 1,
            Reply: 2,
            ReplyAndClose: 3,
            Escalate: 4,
            ReplyAndEscalate: 5,
            CreateTicket: 6,
            Approve: 7,
            Reject: 8,
            AttachTicket: 9,
            EscalateToBrand: 10,
            BrandApproved: 11,
            BrandReject: 12,
            ReplyAndOnHold: 13,
            ReplyAndAwaitingCustomerResponse: 14,
            ReplyNewMentionCameAfterEsalatedorOnHold: 15,
            Acknowledge: 16,
        };
    }
}

export class TicketsCommunicationLog {
        Note?: string;
        TicketID?: number;
        TagID?: string;
        AssignedToUserID?: number;
        Channel?: string;
        Status?: ClientStatusEnum;
        type?: string;
        AssignedToTeam?: number;
        constructor(status: ClientStatusEnum) {
            this.Note = null;
            this.TicketID = 0;
            this.TagID = null;
            this.AssignedToUserID = 0;
            this.AssignedToTeam =  0;
            this.Channel = null;
            this.Status = status;
            this.type = 'CommunicationLog';
        }
}

export interface CustomDropdownValue
{
    id?: number;
    value?: string;
}

export interface SocialHandle
{
    handleName?: string;
    handleId?: string;
    accountId?: number;
    socialId?: string;
    profilepic?: string;
}

export interface BulkMentionChecked
{
    guid?: string;
    mention?: BaseMention;
}

export interface ReplyLinkCheckbox {
    socialId?: string;
    channelType?: ChannelType;
    replyScreenName?: string;
    name?: string;
    replyLinkId?: Replylinks;
    checked?: boolean;
    disabled?: boolean;
}

export enum Replylinks
{
    SendFeedback = 1,
    SendAsDM = 2,
    SendDMLink = 3,
    SendToGroups = 4,
    SendForApproval = 5,
    PreviousMailTrail = 6
}

export interface CustomResponse {
        success?: boolean;
        message?: string | null;
        data?: object | null;
}
export class TextAreaCount{
    id?: number;
    text?: string;
    isSelected?: boolean;
    postCharacters?: number;
    maxPostCharacters?: number;
    showPost?: boolean;
    showTotal?: boolean;
    totalCharacters?: number;
    showAddNewReply?: boolean;
    showAttachmentText?: boolean;
    showSpan?: boolean;
    spanCount?: string;
    constructor() {
        this.id = 0;
        this.maxPostCharacters = 280;
        this.text = '';
        this.isSelected = true;
        this.postCharacters = 0;
        this.showPost =  false;
        this.showTotal = false;
        this.totalCharacters = 0;
        this.showAddNewReply = false;
        this.showAttachmentText = false;
        this.showSpan = false;
        this.spanCount = '';
    }
}

