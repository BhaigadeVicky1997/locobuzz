import { LogStatus } from "app/core/enums/LogStatus";

export interface MakerCheckerMetadata {
    workflowReplyDetailID: number;
    replyMakerCheckerMessage: string;
    isSendGroupMail: boolean;
    replyStatus: number | null;
    replyEscalatedTeamName: string;
    workflowStatus: LogStatus;
    isTakeOver: boolean | null;
}