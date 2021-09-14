import { CrmSrStatusEnums } from "app/core/enums/crmEnum";

export interface TicketInfoCrm {
    sRUpdatedDateTime: string | null;
    sRID: string;
    isPushRE: number;
    sRStatus: CrmSrStatusEnums;
    sRCreatedBy: string;
    srDescription: string;
    remarks: string;
    jioNumber: string;
    partyid: string;
    isPartyID: number;
    mapid: number | null;
    isFTR: boolean | null;
}