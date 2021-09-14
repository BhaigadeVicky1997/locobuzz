import { SocialAuthor } from "app/core/abstractclasses/SocialAuthor";

export interface GenericAuthor extends SocialAuthor {
    isVerifed?: boolean;
    screenname?: string;
    followersCount?: number;
    isMarkedInfluencer?: boolean;
    markedInfluencerID?: number;
    markedInfluencerCategoryName?: string;
    markedInfluencerCategoryID?: number;
    canBeMarkedInfluencer?: boolean;
    canHaveConnectedUsers?: boolean;
    canHaveUserTags?: boolean;
    profileUrl?: string;
}