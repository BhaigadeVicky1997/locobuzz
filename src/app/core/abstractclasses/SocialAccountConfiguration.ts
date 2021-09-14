import { ChannelGroup } from '../enums/ChannelGroup';
import { UserRoleEnum } from '../enums/userRoleEnum';
import { BrandInfo } from '../models/viewmodel/BrandInfo';

export interface SocialAccountConfiguration {
    $type?: string;
    accountID?: number;
    userName?: string;
    socialID?: string;
    token?: string;
    createdDate?: string;
    active?: boolean;
    isPrimary?: boolean;
    isTokenExpired?: boolean;
    companyId?: string;
    companyName?: string;
    mapId?: number;
    isFacebookMigration?: boolean;
    userToken?: string;
    appFriendlyName?: string;
    instagramGraphApiID?: number;
    bTAID?: number;
    profileImageURL?: string;
    brandInformation?: BrandInfo;
    userRole?: UserRoleEnum;
    channelGroup?: ChannelGroup;
}
