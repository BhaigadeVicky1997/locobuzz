import { TabStatus } from 'app/core/enums/TabStatusEnum';
import { Tab } from '../menu/Menu';
import { GenericFilter } from './GenericFilter';

export interface TicketFilterTabParameters {
    tabID?: number;
    categoryID?: number;
    menuID?: number;
    userID?: number;
    tabName?: string;
    tabDescription?: string;
    guid?: string;
    isEditable?: boolean;
    isPinned?: boolean;
    sortOrder?: number;
    filterJson?: GenericFilter;
    str_FilterJson?: string;
    templateID?: number;
    tabVersion?: number;
    isdeleted?: boolean;
    createdBy?: number;
    status?: TabStatus;
}

export interface TicketFilterTabParametersResponse {
    success?: boolean;
    message?: string | null;
    data?: Tab;
}

export interface CustomFilterTab {
    tab?: Tab;
    data?: TicketFilterTabParameters;
}
