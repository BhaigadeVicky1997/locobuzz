import { SocialAuthor } from "app/core/abstractclasses/SocialAuthor";
import { GenericAuthor } from "../../authors/generic/GenericAuthor";
import { Mention } from "../locobuzz/Mention";

export interface NonActionableMention extends Mention {
    concreteClassName?: string;
    parentPostSocialID?: string;
    programName?: string;
    reporterName?: string;
    critical?: number;
    rating?: number;
    postid?: string;
    alexaRank?: number;
    author?: SocialAuthor | GenericAuthor;
}