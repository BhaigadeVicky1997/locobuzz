import { SocialAccountConfiguration } from 'app/core/abstractclasses/SocialAccountConfiguration';
import { ChannelGroup } from 'app/core/enums/ChannelGroup';

export interface InstagramAccountConfiguration extends SocialAccountConfiguration {
    channelGroup?: ChannelGroup;
}
