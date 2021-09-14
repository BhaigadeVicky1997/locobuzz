import { SocialAccountConfiguration } from 'app/core/abstractclasses/SocialAccountConfiguration';
import { ChannelGroup } from 'app/core/enums/ChannelGroup';

export interface TwitterAccountConfiguration extends SocialAccountConfiguration {
    channelGroup?: ChannelGroup;
    tokenSecret?: string;
    screenName?: string;
    consumerKey?: string;
    consumerSecret?: string;
}
