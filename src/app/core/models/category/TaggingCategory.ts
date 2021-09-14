import { Sentiment } from "app/core/enums/Sentiment";
import { TaggingSubCategory } from "./taggingSubCategory";

export interface TaggingCategory {
    iD?: number;
    name?: string;
    upperCategoryID?: number;
    sentiment?: Sentiment | null;
    isTicket?: boolean;
    subCategories?: TaggingSubCategory[];
}