import { SocialAuthor } from "app/core/abstractclasses/SocialAuthor";
import { GoogleMyReviewAuthor } from "../../authors/google/GoogleMyReviewAuthor";
import { Mention } from "../locobuzz/Mention";

export interface GoogleMyReviewMention extends Mention {
    concreteClassName?: string;
    packageName?: string;
    objectID?: string;
    rating?: number;
    storeCode?: string;
    author?: SocialAuthor | GoogleMyReviewAuthor;
}