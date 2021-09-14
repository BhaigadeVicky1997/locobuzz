import { ChannelGroup } from 'app/core/enums/ChannelGroup';
import { Sentiment } from 'app/core/enums/Sentiment';
import { CRMColumns } from '../../crm/CRMColumns';
import { LocobuzzCrmDetails } from '../../crm/LocobuzzCrmDetails';
import { MarkedInfluencer } from '../../viewmodel/MarkedInfluencer';
import { UserTag } from '../../viewmodel/UserTag';


export interface BaseSocialAuthor {
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
    connectedUsers?: BaseSocialAuthor[];
    locoBuzzCRMDetails?: LocobuzzCrmDetails;
    previousLocoBuzzCRMDetails?: LocobuzzCrmDetails;
    crmColumns?: CRMColumns;
    // email author
    isBrandFollowing?: boolean;
    isMarkedInfluencer?: boolean;
    markedInfluencerID?: number;
    markedInfluencerCategoryName?: string;
    markedInfluencerCategoryID?: number;
    // facebook author
    isBlocked?: boolean;
    isVerifed?: boolean;
    isMuted?: boolean;
    isUserFollowing?: boolean;
    // generic author
    screenname?: string;
    followersCount?: number;
    // googlemyreviewauthor

    // googleplaystore autor

    // youtube author
    // twitter author
    followingCount?: number;
    kloutScore?: number;
    bio?: string;
    tweetCount?: number;
    influences?: string[];
    interests?: string[];
    influencesString?: string;
    insterestsString?: string;
    // website author
    // whatsapp author

}

export interface BaseAuthorResponse {
    success: boolean;
    message: string | null;
    data: BaseSocialAuthor;
}
