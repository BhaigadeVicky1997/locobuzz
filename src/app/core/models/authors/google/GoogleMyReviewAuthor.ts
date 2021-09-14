import { SocialAuthor } from "app/core/abstractclasses/SocialAuthor";

export interface GoogleMyReviewAuthor extends SocialAuthor {
    isVerifed?: boolean;
    screenname?: string;
    followersCount?: number;
    isMarkedInfluencer?: boolean;
    markedInfluencerID?: number;
    markedInfluencerCategoryName?: string;
    markedInfluencerCategoryID?: number;
    profileUrl?: string;
    canHaveUserTags?: boolean;
    canBeMarkedInfluencer?: boolean;
    canHaveConnectedUsers?: boolean;
}