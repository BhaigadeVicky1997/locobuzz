import { SocialAccountConfiguration } from 'app/core/abstractclasses/SocialAccountConfiguration';
import { ChannelGroup } from 'app/core/enums/ChannelGroup';

export interface LinkedinAccountConfiguration extends SocialAccountConfiguration {
    channelGroup?: ChannelGroup;
    refreshToken?: string;
    clientID?: string;
    clientSecret?: string;
}
