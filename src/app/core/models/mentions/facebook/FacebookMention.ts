import { SocialAuthor } from "app/core/abstractclasses/SocialAuthor";
import { FacebookAuthor } from "../../authors/facebook/FacebookAuthor";
import { MentionMetadata } from "../../viewmodel/MentionMetadata";
import { Mention } from "../locobuzz/Mention";
import { FacebookMentionMetadata } from "./FacebookMentionMetadata";

export interface FacebookMention extends Mention {
    concreteClassName?: string;
    parentPostSocialID?: string;
    fbPageName?: string;
    fbPageID?: number;
    rating?: number;
    caption?: string;
    isHidden?: boolean;
    isPromoted?: boolean;
    hideFromAllBrand?: boolean;
    postClicks?: number | null;
    postVideoAvgTimeWatched?: number | null;
    canReplyPrivately?: boolean;
    mentionMetadata?: MentionMetadata | FacebookMentionMetadata;
    author?: SocialAuthor | FacebookAuthor;
}