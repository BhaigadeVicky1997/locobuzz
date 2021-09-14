import { SocialAuthor } from 'app/core/abstractclasses/SocialAuthor';
import { BrandInfo } from './BrandInfo';

export interface GenericRequestParameters {
    brandInfo?: BrandInfo;
    startDateEpcoh?: number;
    endDateEpoch?: number;
    ticketId?: number;
    tagID?: number;
    to?: number;
    from?: number;
    authorId?: string;
    author?: SocialAuthor;
    isActionableData?: number;
    channel?: number;
    isPlainLogText?: boolean;
    targetBrandName?: string;
    targetBrandID?: number;
    isCopy?: boolean;
    oFFSET?: number;
    noOfRows?: number;
    isParentPost?: boolean;
    timeOffset?: number;
    interval?: number;
    chartType?: string;
    startDate?: string | null;
    endDate?: string | null;
}
