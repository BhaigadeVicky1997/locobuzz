import { SocialAccountConfiguration } from 'app/core/abstractclasses/SocialAccountConfiguration';
import { ChannelGroup } from 'app/core/enums/ChannelGroup';

export interface EmailAccountConfiguration extends SocialAccountConfiguration {
    channelGroup?: ChannelGroup;
    tokenSecret?: string;
    screenName?: string;
    consumerKey?: string;
    consumerSecret?: string;
}
