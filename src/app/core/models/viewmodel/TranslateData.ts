
export interface Data {
    id: number;
    type?: any;
    token?: any;
    isActive: boolean;
    apiKey?: any;
    text?: string;
    sourceLanguage?: string;
    destinationLanguage?: string;
    tagId: number;
    brandID: number;
    tokenID: number;
    translatedText: string;
    requestUsed: number;
    isTokenAvailable: boolean;
    totalRequestCount: number;
    exceptionMessage?: any;
}

export interface TranslateData {
    success?: boolean;
    message?: any;
    data?: Data;
}

