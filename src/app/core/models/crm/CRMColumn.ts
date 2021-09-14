import { CrmColumnDataType } from "app/core/enums/CrmColumnDataType";
import { EditState } from "app/core/enums/EditState";

export interface CRMColumn {
    orderID?: number;
    isShortcutVisible?: boolean | null;
    dbColumn?: string;
    excelColumn?: string;
    columnLable?: string;
    showInFilter?: boolean;
    editState?: EditState;
    isDisabled?: boolean;
    isDeleted?: boolean;
    columnDataType?: CrmColumnDataType;
    isCustomColumn?: boolean;
}