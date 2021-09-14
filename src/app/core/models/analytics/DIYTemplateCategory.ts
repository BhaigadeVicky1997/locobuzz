export interface DIYTemplateCategory {
    templateCategoryID?: number;
    title?: string;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
}

export interface DIYTemplateCategoryResponse
{
    success?: boolean;
    message?: string | null;
    data?: DIYTemplateCategory[];
}