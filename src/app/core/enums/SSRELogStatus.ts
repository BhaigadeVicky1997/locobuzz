export enum SSRELogStatus
{
    Not_Applied = 1,
    TriedAndFailed = 2,
    TriedAndLowAccuracy = 3,
    RateLimitReached = 4,
    Successful = 5,
    SSREMakerCheckerEnabled = 6,
    SSRESuccessButReplyFailed = 7,
    SSREInProcessing = 8,
    IntentFoundStillInProgress = 9
}