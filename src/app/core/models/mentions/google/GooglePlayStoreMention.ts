import { SocialAuthor } from "app/core/abstractclasses/SocialAuthor";
import { GooglePlayStoreAuthor } from "../../authors/google/GooglePlayStoreAuthor";
import { Mention } from "../locobuzz/Mention";

export interface GooglePlayStoreMention extends Mention {
    concreteClassName?: string;
    packageName?: string;
    rating?: number;
    appID?: string;
    appFriendlyName?: string;
    author?: SocialAuthor | GooglePlayStoreAuthor;
}