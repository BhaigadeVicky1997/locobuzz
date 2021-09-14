import { MediaEnum } from "app/core/enums/MediaTypeEnum";

export interface MediaContent {
    name?: string;
    displayName?: string;
    mediaType?: MediaEnum;
    mediaUrl?: string;
    thumbUrl?: string;
    expiryDate?: string | null;
    profilePicUrl?: string;
    errorMessage?: string;
    tempMediaID?: string;
    rating?: number;
    mediaTags?: string;
    mediaTagsList?: string[];
    keyname?: string;
}

export interface MediaContentResponse
{
    success?: boolean;
    message?: string | null;
    data?: MediaContent[];
}
