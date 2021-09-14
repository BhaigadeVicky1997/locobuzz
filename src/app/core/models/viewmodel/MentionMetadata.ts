export interface MentionMetadata {
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
}