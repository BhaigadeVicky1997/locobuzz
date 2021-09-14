import { CRMColumn } from "./CRMColumn";

export interface CRMColumns {
    existingColumns?: CRMColumn[];
    customColumns?: CRMColumn[];
    existingColumnsXML?: string;
    customColumnsXML?: string;
}