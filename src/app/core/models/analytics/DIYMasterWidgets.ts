export interface DIYMasterWidgets {
    widgetID?: number;
    widgetName?: string;
    widgetDescription?: string;
    uIJson?: string;
    isDefault?: boolean;
    isDeleted?: boolean;
    configJson?: string;
}

export interface DIYMasterWidgetsParams {
  WidgetCategory?: number;
  SearchQuery?: string;
}

export interface DIYMasterWidgetsResponse {
    success?: boolean;
    message?: string | null;
    data?: DIYMasterWidgets[];
}