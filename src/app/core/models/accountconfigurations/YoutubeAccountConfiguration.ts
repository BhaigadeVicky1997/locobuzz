import { SocialAccountConfiguration } from 'app/core/abstractclasses/SocialAccountConfiguration';
import { ChannelGroup } from 'app/core/enums/ChannelGroup';

export interface YoutubeAccountConfiguration extends SocialAccountConfiguration {
    channelGroup?: ChannelGroup;
    refreshToken?: string;
}
