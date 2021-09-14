import { Sentiment } from "app/core/enums/Sentiment";

export interface TaggingSubSubCategory {
    iD?: number;
    name?: string;
    categoryID?: number;
    subCategoryID?: number;
    sentiment?: Sentiment | null;
}