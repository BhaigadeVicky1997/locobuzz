import { SocialAccountConfiguration } from 'app/core/abstractclasses/SocialAccountConfiguration';
import { ChannelGroup } from 'app/core/enums/ChannelGroup';

export interface GoogleMyReviewAccountConfiguration extends SocialAccountConfiguration {
    channelGroup?: ChannelGroup;
    refreshToken?: string;
    clientID?: string;
    clientSecret?: string;
    adminJson?: string;
}
