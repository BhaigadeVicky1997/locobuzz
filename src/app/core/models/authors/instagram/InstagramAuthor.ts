import { SocialAuthor } from "app/core/abstractclasses/SocialAuthor";

export interface InstagramAuthor extends SocialAuthor {
    isVerifed?: boolean;
    screenname?: string;
    followersCount?: number;
    isMarkedInfluencer?: boolean;
    markedInfluencerID?: number;
    markedInfluencerCategoryName?: string;
    markedInfluencerCategoryID?: number;
    canHaveUserTags?: boolean;
    canBeMarkedInfluencer?: boolean;
    canHaveConnectedUsers?: boolean;
    profileUrl?: string;
}