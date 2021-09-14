import { SocialAuthor } from "app/core/abstractclasses/SocialAuthor";

export interface FacebookAuthor extends SocialAuthor {
    isBlocked?: boolean;
    isVerifed?: boolean;
    isMuted?: boolean;
    isUserFollowing?: boolean;
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