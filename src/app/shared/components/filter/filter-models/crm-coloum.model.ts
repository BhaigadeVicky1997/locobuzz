export interface ExistingColumn {
    orderID: number;
    isShortcutVisible?: boolean;
    dbColumn: string;
    excelColumn: string;
    columnlabel: string;
    showInFilter: boolean;
    editState: number;
    isDisabled: boolean;
    isDeleted: boolean;
    columnDataType: number;
    isCustomColumn: boolean;
}

export interface CustomColumn {
    orderID: number;
    isShortcutVisible: boolean;
    dbColumn: string;
    excelColumn: string;
    columnlabel: string;
    showInFilter: boolean;
    editState: number;
    isDisabled: boolean;
    isDeleted: boolean;
    columnDataType: number;
    isCustomColumn: boolean;
}

export interface CrmColumns {
    existingColumns: ExistingColumn[];
    customColumns: CustomColumn[];
    existingColumnsXML: string;
    customColumnsXML: string;
}
