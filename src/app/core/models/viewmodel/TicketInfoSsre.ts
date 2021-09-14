import { SsreIntent } from "app/core/enums/ssreIntentEnum";
import { SSRELogStatus } from "app/core/enums/SSRELogStatus";
import { SSREMode } from "app/core/enums/ssreLogStatusEnum";
import { SsreTransferTo } from "app/core/enums/ssreTransferToEnum";
import { SSREReply } from "../mentions/sSREReply";

export interface TicketInfoSsre {
    ssreOriginalIntent: SsreIntent;
    ssreReplyVerifiedOrRejectedBy: string;
    latestMentionActionedBySSRE: number;
    transferTo: SsreTransferTo;
    ssreEscalatedTo: number;
    ssreEscalationMessage: string;
    intentRuleType: number;
    ssreStatus: SSRELogStatus;
    retrainTagid: number;
    retrainBy: number;
    retrainDate: string;
    ssreMode: SSREMode;
    ssreIntent: SsreIntent;
    ssreReplyType: number;
    intentFriendlyName: string;
    intentOrRuleID: number;
    latestSSREReply: string;
    ssreReplyVerifiedOrRejectedTagid: number;
    ssreReply: SSREReply;
}