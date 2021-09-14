export enum TicketSignalEnum
{
    FetchNewData = 1,
    CloseTicket = 116,
    TicketEscalatedToCC = 103,
    TicketEscalatedToBrand = 107,
    ReOpenTicket = 121,
    TicketIgnoredByCC = 104,
    TicketIgnoredByBrand = 108,
    TicketApprovedByCCOrBrand = 105,
    TicketReassigned = 106,
    ReplySentForApproval = 111,
    ReplyApproved = 112,
    ReplyRejected = 113,
    EnableMakerChecker =  119,
    DisableMakerChecker = 120,
    ReplyFailed = 117,
    ReplyThreadComplete = 118,
    TicketTaggingCategoryChangeSignalR = 1751,
    TicketMentionTaggingResponseMessageSignalR = 1752,
    SSREInProcess = 122,
    SSREProcessCompleted = 123,
    SSREProcessFailed = 124,
    SSREReplyVerifiedOrRejected = 125,
    NewCaseAttach = 26,
    CaseDetachFrom = 27,
    TicketNoteAdd = 109,
    LockUnlockTicketSignalR= 110,
    LogOutMultipleUser = 201,
    ClearAllSession = 202,
    TicketMarkedAsRead = 203,
    LogOutOnTeamUserRemove = 204,
    MakeActionableSingnal = 902,
    WhatsAppStatusUpdate = 1004,
    UserRecievedFromWhatsapp = 1746,
    CloseWebsiteBotTicket = 1747,
    UnreadMessageSignalR = 1748,
    AgentReminderWebsiteSignalR = 1749,
    RefreshActionButtonEnableJson = 1750,
    UpdateBulkReplyCountSignalR = 1753,
    BulkReopenOnHoldEscalateResponseMessageSignalR = 1754,
    RefreshAgentTicketReassignement = 1755,
    TeamLeaderAssignment = 1890,
    RefreshRAWSettingSignalR = 1777,
    UpdateNPSAndSnetimentScoreOfAuthor = 1116,
    RefreshEditRuleTicketRAWSettings = 1778,
    RefreshDeleteRuleTicketRAWSettings = 1779
}