import { ChannelGroup } from "../enums/ChannelGroup";
import { Sentiment } from "../enums/Sentiment";
import { CRMColumns } from "../models/crm/CRMColumns";
import { LocobuzzCrmDetails } from "../models/crm/LocobuzzCrmDetails";
import { MarkedInfluencer } from "../models/viewmodel/MarkedInfluencer";
import { UserTag } from "../models/viewmodel/UserTag";

export interface SocialAuthor {
    $type?: string;
    socialId?: string;
    isAnonymous?: boolean;
    name?: string;
    channel?: ChannelGroup;
    url?: string;
    profileImage?: string;
    nPS?: number;
    sentimentUpliftScore?: number;
    iD?: number;
    profileUrl?: string;
    picUrl?: string;
    glbMarkedInfluencerCategoryName?: string;
    glbMarkedInfluencerCategoryID?: number;
    interactionCount?: number;
    location?: string;
    locationXML?: string;
    userSentiment?: Sentiment;
    channelGroup?: ChannelGroup;
    canHaveUserTags?: boolean;
    canBeMarkedInfluencer?: boolean;
    canHaveConnectedUsers?: boolean;
    latestTicketID?: string;
    userTags?: UserTag[];
    markedInfluencers?: MarkedInfluencer[];
    connectedUsers?: SocialAuthor[];
    locoBuzzCRMDetails?: LocobuzzCrmDetails;
    previousLocoBuzzCRMDetails?: LocobuzzCrmDetails;
    cRMColumns?: CRMColumns;
}