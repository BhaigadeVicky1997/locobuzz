import { BrandInfo } from './BrandInfo';
import { GenericRequestParameters } from './GenericRequestParameters';
import { MediaGalleryFilter } from './MediaGalleryFilter';

export interface MediaGalleryParameters {
    param?: GenericRequestParameters;
    scheduleID?: number;
    filters?: MediaGalleryFilter;
}

export interface UpdateMediaDetailParameters {
    brandInfo?: BrandInfo;
    mediaID?: number;
    isUGC?: boolean;
    mediaRating?: number;
    mediaTags?: string[];
}
