import { NonTelecomRequest } from './NonTelecomRequest';

export interface TitanRequest extends NonTelecomRequest {

    CaseSource: string;

    CustomerId: string;

    StoreLocation: string;

    QueryType: string;

    FunctionalArea: string;

    DomainArea: string;
}
