export interface SubCategory {
    subCategoryID: number;
    subCategoryName: string;
    subCategorySentiment?: any;
    departmentID: number;
    labelID: number;
}

export interface Depatment {
    departmentID: number;
    departmentName: string;
    labelID: number;
    departmentSentiment?: any;
    subCategories: SubCategory[];
}

export interface CategoryList {
    categoryID: number;
    category: string;
    sentiment?: any;
    depatments: Depatment[];
}
