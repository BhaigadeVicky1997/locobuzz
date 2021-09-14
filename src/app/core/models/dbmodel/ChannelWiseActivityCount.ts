import { ChannelGroup } from 'app/core/enums/ChannelGroup';

export interface ChannelWiseActivityCount {
    channelGroup?: ChannelGroup;
    count?: number;
}

export interface CustomChannelWiseActivityCount {
    channelGroup?: ChannelGroup;
    count?: number;
    channelName?: string;
}

export interface ChannelWiseActivityCountResponse {
    success?: boolean;
    message?: string | null;
    data?: ChannelWiseActivityCount[];
}
