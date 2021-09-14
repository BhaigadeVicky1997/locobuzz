import { SocialAccountConfiguration } from 'app/core/abstractclasses/SocialAccountConfiguration';
import { ChannelGroup } from 'app/core/enums/ChannelGroup';

export interface FacebookAccountConfiguration extends SocialAccountConfiguration {
    channelGroup?: ChannelGroup;
    pageid?: string;
}
