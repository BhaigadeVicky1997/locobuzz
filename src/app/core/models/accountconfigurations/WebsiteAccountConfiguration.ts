import { SocialAccountConfiguration } from 'app/core/abstractclasses/SocialAccountConfiguration';
import { ChannelGroup } from 'app/core/enums/ChannelGroup';
import { ChannelType } from 'app/core/enums/ChannelType';
import { TokenJson } from '../viewmodel/TokenJson';

export interface WebsiteAccountConfiguration extends SocialAccountConfiguration {
    channelGroup?: ChannelGroup;
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
    refreshToken?: string;
    pageid?: string;
    tokenJson?: TokenJson;
    pageId?: string;
    isDataProcessStatus?: boolean;
    channelType?: ChannelType;
    description?: string;
}
