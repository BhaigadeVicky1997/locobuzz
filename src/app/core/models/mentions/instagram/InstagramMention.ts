import { SocialAuthor } from "app/core/abstractclasses/SocialAuthor";
import { InstagramAuthor } from "../../authors/instagram/InstagramAuthor";
import { Mention } from "../locobuzz/Mention";

export interface InstagramMention extends Mention {
    concreteClassName?: string;
    parentPostSocialID?: string;
    instaAccountID?: number;
    isPromoted?: boolean;
    caption?: string;
    instagramGraphApiID?: number;
    instagramPostType?: number;
    parentInstagramGraphApiID?: number;
    saved?: number | null;
    exists?: number | null;
    replies?: number | null;
    tapsForward?: number | null;
    tapsBack?: number | null;
    author?: SocialAuthor | InstagramAuthor;
}