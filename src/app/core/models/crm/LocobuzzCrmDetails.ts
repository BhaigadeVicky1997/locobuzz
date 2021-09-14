export interface LocobuzzCrmDetails {
    iD?: number;
    name?: string;
    emailID?: string;
    alternativeEmailID?: string;
    phoneNumber?: string;
    link?: string;
    address1?: string;
    address2?: string;
    notes?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    alternatePhoneNumber?: string;
    ssn?: string;
    customCRMColumnXml?: string;
    gender?: string;
    age?: number;
    dOB?: string | null;
    modifiedByUser?: string;
    modifiedTime?: string;
    modifiedDateTime?: string;
    modifiedTimeEpoch?: number;
    timeoffset?: number;
    dOBString?: string;
    isInserted?: boolean;
}