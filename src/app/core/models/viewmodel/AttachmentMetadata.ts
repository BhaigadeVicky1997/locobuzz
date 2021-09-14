import { MediaContent } from "./mediaContent";

export interface AttachmentMetadata {
    mediaContents: MediaContent[];
    mediaContentText: string;
    mediaUrls: string;
    mediaAttachments: MediaContent[];
    attachments: string;
}