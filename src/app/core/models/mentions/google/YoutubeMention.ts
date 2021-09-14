import { SocialAuthor } from "app/core/abstractclasses/SocialAuthor";
import { YoutubeAuthor } from "../../authors/google/YoutubeAuthor";
import { MentionMetadata } from "../../viewmodel/MentionMetadata";
import { Mention } from "../locobuzz/Mention";
import { YoutubeMentionMetadata } from "./YoutubeMentionMetadata";

export interface YoutubeMention extends Mention {
    concreteClassName?: string;
    parentPostSocialID?: string;
    dislikeStatus?: boolean;
    estimatedWatchedTime?: number | null;
    dislikeCount?: number | null;
    subscribersGained?: number | null;
    mentionMetadata?: MentionMetadata | YoutubeMentionMetadata;
    author?: SocialAuthor | YoutubeAuthor;
}