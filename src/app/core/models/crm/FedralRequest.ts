import { NonTelecomRequest } from './NonTelecomRequest';

export interface FedralRequest extends NonTelecomRequest {


    Source: string;

    RequestType: FedralRequestType;

    FirstName: string;

    LastName: string;

    Category: string;

    LosLeadID: string;

    UCIC: string;


    City: string;

    State: string;

    Severity: string;


    Address: string;

    PostalCode: string;

    Country: string;
}

export enum FedralRequestType {
    Query = 1,
    Lead = 2
}


