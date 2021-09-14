export interface DIYTemplate {
    templateCategoryID?: number;
    templateID?: number;
    title?: string;
    description?: string;
    isEditable?: boolean;
    templateType?: number;
    isShared?: boolean;
    GUID?: string;
}

export interface DIYTemplateResponse
{
    success?: boolean;
    message?: string | null;
    data?: DIYTemplate[];
}

export interface DIYTemplateStore
{
    templateCategoryID?: number;
    data?: DIYTemplate[];
}

export interface DIYTemplateParams {
        TemplateCategory?: number;
        SearchQuery?: string;
        OffSet?: number;
        NoOfRows?: number;
        OrderBY?: string;
}

export const TemplateFormSort =
    {
        sortBy: {
            createdDate: 'CreatedDate',
            modiFiedDate: 'UpdatedDate',
            templateName: 'Title',
            default: 'CreatedDate'
        },
        sortOrder: {
            value: ['asc', 'desc'],
            default: 'desc'
        }
    }