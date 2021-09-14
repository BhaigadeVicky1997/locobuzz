export interface Campaign {
    campaignID: number;
    campaignName: string;
    brandID: number;
    brandName: string;
    brandFriendlyName: string;
    countryfipscode: string;
    categoryID: number;
    keyWords: string;
    isKeywordAdded: boolean;
    startDate: Date;
    endDate: Date;
    status: number;
    createdDate: Date;
    stopDate: Date;
    createdBy: number;
    stoppedBy: number;
    campaignSqlQuery: string;
    countryName: string;
    countryfipscode3: string;
    campaignJson?: any;
    linkedLabelID: number;
    linkedDepartmentID: number;
    linkedSubCategoryID: number;
}
