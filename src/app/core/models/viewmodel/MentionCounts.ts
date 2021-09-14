export interface MentionCounts {
    userActivityCount?: number;
    brandActivityCount?: number;
    actionable?: number;
    nonActinable?: number;
    brandPost?: number;
    brandReply?: number;
    totalRecords?: number;
}

export interface MentionCountsResponse {
    success?: boolean;
    message?: string | null;
    data?: MentionCounts | null;
}