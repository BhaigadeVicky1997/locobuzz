import { DIYDashboradStatus } from 'app/core/enums/DIYDashboradStatusEnum';

export interface DIYDashboardDetail {
    templateID?: number;
    categoryID?: number;
    title?: string;
    description?: string;
    isEditable?: boolean;
    filterJson?: string;
    userID?: number;
    version?: number;
    isDeleted?: boolean;
    createdBy?: number;
    uiJson?: string;
    gUID?: string;
    status?: DIYDashboradStatus;
    isActive?: boolean;
}