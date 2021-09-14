export interface AlertMails {
    iD?: number;
    email?: string;
    recipientsType?: number;
    brandID?: number;
}

export interface AlertMailsResponse
{
    success?: boolean;
    message?: string | null;
    data?: AlertMails[] | null;
}