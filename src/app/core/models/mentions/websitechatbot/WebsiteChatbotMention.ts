import { SocialAuthor } from "app/core/abstractclasses/SocialAuthor";
import { WebsiteAuthor } from "../../authors/website/websiteAuthor";
import { Mention } from "../locobuzz/Mention";

export interface WebsiteChatbotMention extends Mention {
    concreteClassName?: string;
    parentPostSocialID?: string;
    rating?: number;
    caption?: string;
    isHidden?: boolean;
    isPromoted?: boolean;
    hideFromAllBrand?: boolean;
    recipientType?: number;
    attachmentCount?: number;
    countryCode?: string;
    templateID?: string;
    timeOffset?: number;
    clientID?: string;
    userID?: string;
    pageID?: string;
    conversationID?: string;
    agentID?: number;
    agentName?: string;
    messageType?: string;
    author?: SocialAuthor | WebsiteAuthor;
    objectId?: string;
}