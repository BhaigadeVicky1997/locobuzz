import { BaseSocialAuthor } from '../authors/locobuzz/BaseSocialAuthor';
import { NonTelecomRequest } from './NonTelecomRequest';

export interface BandhanRequest extends NonTelecomRequest {
    // [Name("Source")]
    Source: string;
    // [Name("RequestType")]
    RequestType: BandhanRequestType;
    // [Name("FirstName")]
    FirstName: string;
    // [Name("LastName")]
    LastName: string;
    // [Name("CaseID")]
    LosLeadID: string;
    // [Name("SocialAuthorID")]
    UCIC: string;

    // [Name("Product")]
    ProductGroup: string;
    // [Name("Category")]
    QueryType: string;
    QueryName: string;

    AuthorDetails: BaseSocialAuthor;
}

export enum BandhanRequestType {
    Query = 1,
    Lead = 2
}