import { SocialAuthor } from "app/core/abstractclasses/SocialAuthor";
import { TwitterAuthor } from "../../authors/twitter/twitterAuthor";
import { MentionMetadata } from "../../viewmodel/MentionMetadata";
import { Mention } from "../locobuzz/Mention";
import { TwitterMentionMetadata } from "./TwitterMentionMetadata";

export interface TwitterMention extends Mention {
    concreteClassName?: string;
    inReplyToUserID?: string;
    isShared?: boolean;
    urlClicks?: number | null;
    tweetClick?: number | null;
    followingCount?: number | null;
    isDMSent?: boolean;
    taggedUsersJson?: string;
    newSelectedTaggedUsersJson?: string;
    mainTweetid?: string;
    canReplyPrivately?: boolean;
    mentionMetadata?: MentionMetadata | TwitterMentionMetadata;
    author?: SocialAuthor | TwitterAuthor;
}