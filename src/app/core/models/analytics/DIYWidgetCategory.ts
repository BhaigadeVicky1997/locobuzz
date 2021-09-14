import { DIYMasterWidgets } from "./DIYMasterWidgets";

export interface DIYWidgetCategory {
    widgetGroupID: number;
    title: string;
    groupImage: string;
    sortOrder: number;
    count: number;
}

export interface DIYWidgetCategoryResponse {
    success?: boolean;
    message?: string | null;
    data?: DIYWidgetCategory[];
}

export interface DIYWidgetCategoryCustom {
    widgetGroupID?: number;
    title?: string;
    groupImage?: string;
    sortOrder?: number;
    count?: number;
    DIYMasterWidget?: DIYMasterWidgets[];
}

export interface DIYWidgetCustom
{
    widgetGroupID?: number;
    title?: string;
    groupImage?: string;
    sortOrder?: number;
    count?: number;
    expanded?: boolean;
    DIYMasterWidget?: DIYMasterWidgets[];
}