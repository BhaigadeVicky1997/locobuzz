import { SocialAuthor } from "app/core/abstractclasses/SocialAuthor";
import { WhatsAppMessageStatus } from "app/core/enums/WhatsAppMessageStatus";
import { WhatsAppAuthor } from "../../authors/whatsapp/WhatsAppAuthor";
import { Mention } from "../locobuzz/Mention";

export interface WhatsAppMention extends Mention {
    $type: string;
    concreteClassName?: string;
    parentPostSocialID?: string;
    caption?: string;
    isHidden?: boolean;
    isPromoted?: boolean;
    hideFromAllBrand?: boolean;
    whatsAppAccountID?: number;
    recipientType?: number;
    attachMentCount?: number;
    messageStatus?: WhatsAppMessageStatus;
    whatsAppMediaID?: string;
    whatsAppMimeType?: string;
    whatsAppFilename?: string;
    countryCode?: string;
    templateID?: string;
    timeOffset?: number;
    author?: SocialAuthor | WhatsAppAuthor;
}