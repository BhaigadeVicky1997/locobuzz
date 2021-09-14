import { Sentiment } from "app/core/enums/Sentiment";
import { TaggingSubSubCategory } from "./taggingSubSubCategory";

export interface TaggingSubCategory {
    iD?: number;
    name?: string;
    categoryID?: number;
    sentiment?: Sentiment | null;
    subSubCategories?: TaggingSubSubCategory[];
}