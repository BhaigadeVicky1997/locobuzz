export interface BaseMentionMetadata {
    videoView: number;
    postClicks: number;
    postVideoAvgTimeWatched: number;
    likeCount: number | null;
    commentCount: number | null;
    reach: number | null;
    impression: number | null;
    videoViews: number;
    engagementCount: number;
    reachCountRate: number;
    impressionsCountRate: number;
    engagementCountRate: number;
    isFromAPI: boolean;
    // youtube mentionmetadata
    estimatedWatchedTime?: number | null;
    subscribersGained?: number | null;

    // twitter mention metadata
    urlClicks?: number | null;
    tweetClick?: number | null;
    followingCount?: number | null;
    shareCount?: number;
}