import { MediaEnum } from 'app/core/enums/MediaTypeEnum';
import { MediaStatus } from 'app/core/enums/MediaStatusEnum';
import { BaseMention } from '../mentions/locobuzz/BaseMention';

export interface UgcMention {
    $type?: string;
    guid?: string;
    mediaID?: number;
    mediaStatus?: MediaStatus;
    rating?: number;
    mediaTags?: string[];
    mediaPath?: string;
    isDownloaded?: boolean;
    uGCMediaUrl?: string;
    uGCMediaType?: number;
    isUGC?: boolean;
    displayFileName?: string;
    durationInSeconds?: number;
    mediaTagsText?: string;
    mention?: BaseMention;
    clicked?: boolean;
    mediaType?: MediaEnum;
}
