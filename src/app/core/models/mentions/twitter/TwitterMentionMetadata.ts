import { MentionMetadata } from "../../viewmodel/MentionMetadata";

export interface TwitterMentionMetadata extends MentionMetadata {
    urlClicks?: number | null;
    tweetClick?: number | null;
    followingCount?: number | null;
}