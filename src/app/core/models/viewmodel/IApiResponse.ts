export interface IApiResponse<T>
{
    success?: boolean;
    message?: string | null;
    data?: T | null;
}

export interface IApiResponseArray<T>
{
    success?: boolean;
    message?: string | null;
    data?: T[] | null;
}

export interface IApiResponseMessage
{
    success?: boolean;
    message?: string | null;
    data?: APICustomMessage | null;
}

export interface APICustomMessage
{
    status?: boolean;
    message?: string | null;
}