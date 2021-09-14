export enum PerformedAction
    {
        Reply = 1,
        ReplyClose = 2,
        ReplyEscalate = 3,
        ReplyHold = 4,
        ReplyAwaitingResponse = 5,
        Escalate = 6,
        DirectClose = 7,
        OnHoldAgent = 8,
        CustomerInfoAwaited = 9,
        Close = 10,
        CaseAttach = 11,
        ReopenCase= 12,
        /// <summary>
        /// MakerChecker Workflow
        /// </summary>
        MakerCheckerApprove= 13,
        /// <summary>
        /// MakerChecker Workflow
        /// </summary>
        MakerCheckerReject = 14,
        /// <summary>
        /// Brand / CSD Workflow
        /// </summary>
        Approve = 15,
        /// <summary>
        /// Brand / CSD Workflow
        /// </summary>
        Reject = 16,
        Assign= 17
    }