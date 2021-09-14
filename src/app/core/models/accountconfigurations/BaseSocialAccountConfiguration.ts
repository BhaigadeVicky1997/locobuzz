import { ChannelGroup } from 'app/core/enums/ChannelGroup';
import { ChannelType } from 'app/core/enums/ChannelType';
import { UserRoleEnum } from 'app/core/enums/userRoleEnum';
import { BrandInfo } from '../viewmodel/BrandInfo';
import { TokenJson } from '../viewmodel/TokenJson';

export interface BaseSocialAccountConfiguration {
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

    tokenSecret?: string;
    screenName?: string;
    consumerKey?: string;
    consumerSecret?: string;
    pageid?: string;

    refreshToken?: string;
    clientID?: string;
    clientSecret?: string;
    adminJson?: string;

    businessName?: string;
    authorID?: string;
    countryCode?: string;
    certificateID?: string;
    secretCode?: string;
    dokerUrl?: string;
    dokerUserName?: string;
    dokerPassword?: string;
    webhookUrl?: string;
    tokenUpdatedDate?: number;
    tokenExpiryDate?: string;
    tokenJson?: TokenJson;
    pageId?: string;
    isDataProcessStatus?: boolean;
    channelType?: ChannelType;
    description?: string;
}

export interface BaseSocialAccountConfResponse
{
    success?: boolean;
    message?: string | null;
    data?: BaseSocialAccountConfiguration[];
}

