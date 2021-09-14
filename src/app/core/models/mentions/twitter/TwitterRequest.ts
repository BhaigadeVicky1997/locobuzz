export interface TwitterRequest {
    requestBodyType?: string;
}

export interface PublicTweet extends TwitterRequest {
    in_reply_to_status_id?: number | null;
    status?: string;
    auto_populate_reply_metadata?: boolean;
    exclude_reply_user_ids?: string;
}

export interface PublicTweetNoStatus extends TwitterRequest {
    in_reply_to_status_id?: number | null;
    auto_populate_reply_metadata?: boolean;
    exclude_reply_user_ids?: string;
}

export interface PublicTweetAttachment extends PublicTweet {
    media_ids?: string[];
}

export interface PublicTweetAttachmentNoStatus extends PublicTweetNoStatus {
    media_ids?: string[];
}

export interface Target {
    recipient_id?: string;
}

export interface MessageData {
    text?: string;
}

export interface MessageAttachment extends MessageData {
    attachment?: MessageDataAttachment;
}

export interface MessageDataAttachmentBase {
    type?: string;
}

export interface MessageDataAttachment extends MessageDataAttachmentBase {
    media?: MessageDataAttachmentMedia;
}

export interface MessageDataAttachmentMedia {
    id?: string;
}

export interface MessageCreate {
    target?: Target;
    message_data?: MessageData;
}

export interface EventCreateMessage extends MessageType {
    message_create?: MessageCreate;
}

export interface MessageType {
    type?: string;
}

export interface DirectMessage extends TwitterRequest {
    event?: EventCreateMessage;
}