import { UserRoleEnum } from 'app/core/enums/userRoleEnum';
import { BrandInfo } from './BrandInfo';

export interface GenericFilter {
    categoryID: number;
    categoryName: string;
    brands: BrandInfo[];
    startDateEpoch: number;
    endDateEpoch: number;
    userID: number;
    userRole: UserRoleEnum;
    orderBYColumn: string;
    orderBY: string;
    isCustom: number;
    isRawOrderBy: boolean;
    oFFSET: number;
    noOfRows: number;
    filters: Filter[];
    notFilters: Filter[];
    isAdvance: boolean;
    query: string;
    ticketType?: number[];
    isAwaitingForTlApprovalChecked?: number[];
    simpleSearch?: string;
    postsType: PostsType;
}

export interface Filter {
    name: string;
    value: any;
    weight?: number;
    type: FilterDataType;
}

export enum FilterDataType {
    Integer,
    String,
    Array,
    DateTime,
    Boolean
}

export enum Operator {
    Equal,
    NotEqual,
    In,
    NotIn,
    Not,
    Contains,
    NotContains
}

export enum PostsType
{
    Tickets = 1,
    Mentions = 2,
    TicketHistory = 3
}
