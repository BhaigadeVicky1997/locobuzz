import { SocialAuthor } from "app/core/abstractclasses/SocialAuthor";
import { LinkedInAuthor } from "../../authors/linkedin/LinkedInAuthor";
import { Mention } from "../locobuzz/Mention";

export interface LinkedinMention extends Mention {
    concreteClassName?: string;
    parentPostSocialID?: string;
    author?: SocialAuthor | LinkedInAuthor;
}