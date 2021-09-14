import { ChannelGroup } from '../enums/ChannelGroup';
import { UserTag } from '../models/viewmodel/UserTag';

export interface CustomAuthorDetails{
    screenName?: string;
    author?: string;
    profilePicUrl?: string;
    profileUrl?: string;
    isVerified?: boolean;
    followersCount?: number;
    kloutScore?: number;
    gender?: string;
    age?: number;
    influencer?: string;
    phoneNumber?: string;
    email?: string;
    Bio?: string;
    isValidAuthorSocialIntegervalue?: boolean;
    showPersonalDetails?: boolean;
    fieldsChanged?: string;
    channelGroup?: ChannelGroup;
    location?: string;
    npsScrore?: number;
    sentimentUpliftScore?: number;
    npsEmoji?: string;
    isNpsOn?: boolean;
    hasNpsUpdatedYet?: boolean;
    hasNpsUpliftUpdatedYet?: boolean;
    lastNpsUpdatedDate?: string;
    lastNpsUpliftUpdatedDate?: string;
    connectedUsers?: CustomConnectedUsers[];
    traits?: UserTag[];
    ticketIdDisable?: boolean;

}

export interface CustomConnectedUsers
{
    name?: string;
    screenName?: string;
    profilepicURL?: string;
    channelImage?: string;
    picUrl?: string;
    followers?: number;
    following?: number;
    tweets?: number;
}

export interface CustomCrmColumns
{
    id?: string;
    value?: string;
    placeholder?: string;
    dbColumnName?: string;
    dbColumn?: string;
}