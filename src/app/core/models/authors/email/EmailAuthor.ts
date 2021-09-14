import { SocialAuthor } from "app/core/abstractclasses/SocialAuthor";

export interface EmailAuthor extends SocialAuthor {
    isBrandFollowing?: boolean;
    isMarkedInfluencer?: boolean;
    markedInfluencerID?: number;
    profileUrl?: string;
    markedInfluencerCategoryName?: string;
    markedInfluencerCategoryID?: number;
    canHaveUserTags?: boolean;
    canBeMarkedInfluencer?: boolean;
    canHaveConnectedUsers?: boolean;
}