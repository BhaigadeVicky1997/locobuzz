import { FilterEvents } from "app/core/enums/FilterEvents";
import { TabStatus } from "app/core/enums/TabStatusEnum";
import { GenericFilter } from "../viewmodel/GenericFilter";

export interface Menu {
    menuId?: number;
    parentMenuId?: number;
    menuName?: string;
    displayName?: string;
    menuURL?: string;
    userRole?: string;
    isTabbed?: boolean;
    isPinned?: boolean;
    sortOrder?: number;
    menuVersion?: number;
    filtersJson?: string;
    menuImage?: string;
    tabs?: Tab[];
    widgets?: Widget[];
}

export interface MenuResponse
{
    success?: boolean;
    message?: string | null;
    data?: Menu[] | null;
}

export interface Tab {
    tabId?: number;
    menuId?: number;
    userID?: number;
    tabName?: string;
    tabDescription?: string;
    guid?: string;
    isEditable?: boolean;
    isPinned?: boolean;
    sortOrder?: number;
    filterJson?: string;
    templateID?: number;
    tabVersion?: number;
    widgets?: Widget[];
    tabUrl?: string;
    status?: TabStatus;
    Filters?: GenericFilter;
    isdeleted?: boolean;
    createdBy?: number;
    createdDate?: string;
}

export interface TabResponse
{
    success?: boolean;
    message?: string | null;
    data?: Tab | null;
}
export interface TabResponseArray
{
    success?: boolean;
    message?: string | null;
    data?: Tab[] | null;
}


export interface TabResolved {
    tab: Tab;
    error?: any;
  }

export interface Widget {
    widgetDetailID?: number;
    categoryID?: number;
    menuID?: number;
    tabID?: number;
    userID?: number;
    widgetID?: number;
    widgetTitle?: string;
    widgetDescription?: string;
    guid?: string;
    component?: string;
    size?: string;
    rowNumber?: number;
    columnNumber?: number;
    uiJson?: string;
    filterJson?: string;
}

export interface TabSignalR
{
    tab?: Tab;
    message?: any;
    signalId?: number;
}

export interface PostSignalR
{
    ticketId?: number;
    message?: any;
    signalId?: number;
}

export interface TabEvent
{
    tab?: Tab;
    event?: FilterEvents;
    value?: any;
}