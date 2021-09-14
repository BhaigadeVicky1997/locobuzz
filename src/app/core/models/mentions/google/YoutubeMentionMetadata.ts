import { MentionMetadata } from "../../viewmodel/MentionMetadata";

export interface YoutubeMentionMetadata extends MentionMetadata {
    estimatedWatchedTime?: number | null;
    subscribersGained?: number | null;
}