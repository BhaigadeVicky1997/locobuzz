export interface WhatsAppRequest {
    requestBodyType?: string;
    requestBody?: any;
}

export interface WhatsappText {
    body?: string;
}

export interface WhatsappTextMessage {
    recipient_type?: string;
    to?: string;
    type?: string;
    text?: WhatsappText;
}

export interface Image {
    caption?: string;
    id?: string;
}

export interface WhatsappImageMessage {
    to?: string;
    type?: string;
    recipient_type?: string;
    image?: Image;
}

export interface Video {
    caption?: string;
    id?: string;
}

export interface WhatsappVideoMessage {
    to?: string;
    type?: string;
    recipient_type?: string;
    video?: Video;
}

export interface WhatsAppMediaUpload {
    byteArrayData?: string;
}