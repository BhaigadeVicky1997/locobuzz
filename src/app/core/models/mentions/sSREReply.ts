export interface SSREReply {
    authorid?: string;
    replyresponseid?: string;
    replymessage?: string;
    channelType?: ChannelEnumSSRE;
    escalatedTo?: number;
    escalationMessage?: string;
}

export enum ChannelEnumSSRE {
    FACEBOOK,
    TWITTER,
    INSTAGRAM,
    LINKEDIN
}