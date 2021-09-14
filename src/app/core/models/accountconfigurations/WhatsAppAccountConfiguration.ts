import { SocialAccountConfiguration } from 'app/core/abstractclasses/SocialAccountConfiguration';
import { ChannelGroup } from 'app/core/enums/ChannelGroup';

export interface WhatsAppAccountConfiguration extends SocialAccountConfiguration {
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
}
