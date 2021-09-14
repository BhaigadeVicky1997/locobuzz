import { SocialAuthor } from "app/core/abstractclasses/SocialAuthor";

export interface TwitterAuthor extends SocialAuthor {
    isVerifed?: boolean;
    screenname?: string;
    followersCount?: number;
    followingCount?: number;
    kloutScore?: number;
    bio?: string;
    tweetCount?: number;
    isBlocked?: boolean;
    isMuted?: boolean;
    isUserFollowing?: boolean;
    isBrandFollowing?: boolean;
    isMarkedInfluencer?: boolean;
    markedInfluencerID?: number;
    markedInfluencerCategoryName?: string;
    markedInfluencerCategoryID?: number;
    influences?: string[];
    interests?: string[];
    influencesString?: string;
    insterestsString?: string;
    canHaveUserTags?: boolean;
    canBeMarkedInfluencer?: boolean;
    canHaveConnectedUsers?: boolean;
    profileUrl?: string;
}