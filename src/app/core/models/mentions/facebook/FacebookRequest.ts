export interface FacebookRequest {
    requestBodyType?: string;
    requestBody?: any;
}

export interface MessengerAttachmentUpload {
    message?: AttachmentUploadMessage;
}

export interface AttachmentUploadMessage {
    attachment?: UploadAttachment;
}

export interface UploadAttachment {
    type?: string;
    payload?: AttachmentUploadPayload;
}

export interface AttachmentUploadPayload {
    url?: string;
    is_reusable?: boolean;
}

export interface MessengerText {
    messaging_type?: string;
    recipient?: Recipient;
    message?: Message;
}

export interface Recipient {
    id?: string;
}

export interface Message {
    text?: string;
}

export interface MessengerAttachmentSend {
    messaging_type?: string;
    recipient?: Recipient;
    message?: AttachmentSendMessage;
}

export interface AttachmentSendMessage {
    attachment?: SendAttachment;
}

export interface SendAttachment {
    type?: string;
    payload?: AttachmentSendPayload;
}

export interface AttachmentSendPayload {
    attachment_id?: string;
}

export interface CommentReply {
    byteArrayData?: string;
    reply_to_id?: string;
    text?: string;
    file_name?: string;
    content_type?: string;
}