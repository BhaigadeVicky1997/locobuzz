import { NonTelecomRequest } from './NonTelecomRequest'

export interface MagmaRequest extends NonTelecomRequest {

    Source: string;

    FirstName: string;

    LastName: string;

    PanCard: string;

    Product: string;

    LosLeadID: string;

    UCIC: string;
    Customer: string;
    Disposition: string;
    SubDisposition: string;
    LeadStatus: string;
    LeadStage: string;
    LeadSubStage: string;
    NewAppointmentDate: string;
    CurrentOwner: string;
    Owner: string;
}
