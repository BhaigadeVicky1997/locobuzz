import { PostsType } from 'app/core/models/viewmodel/GenericFilter';
import { EachFilters } from './each-filter.model';
export class Brand {
    brandID?: number;
    brandName?: string;
    categoryGroupID?: number;
    mainBrandID?: number;
    compititionBrandIDs?: number[];
    brandFriendlyName?: string;
    brandLogo?: string;
    isBrandworkFlowEnabled?: boolean;
    brandGroupName?: string;
}


export class ApiReply {
    categoryID?: number;
    categoryName?: string;
    brands?: Brand[];
    startDateEpoch?: number;
    endDateEpoch?: number;
    isCustom?: number;
    userID?: number;
    filters?: EachFilters[];
    notFilters?: any[];
    isAdvance?: boolean;
    query?: string;
    orderBYColumn?: string;
    orderBY?: string;
    IsRawOrderBy?: boolean;
    offset?: number;
    noOfRows?: number;
    userRole?: number;
    isRawOrderBy?: boolean;
    oFFSET?: number;
    ticketType?: number[];
    isAwaitingForTlApprovalChecked?: number[];
    SimpleSearch?: string;
    postsType?: PostsType;
}
