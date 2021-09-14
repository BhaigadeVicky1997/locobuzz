export interface GroupEmailList {
    $type?: string;
    groupName?: string;
    groupID?: number;
    email_to?: string;
    email_cc?: string;
    email_bcc?: string;
    groupIDs?: string[];
    totalCount?: number;
    MatAutocompleteSelectedEvent?: string;
}

export interface GroupEmailListResponse {
    success?: boolean;
    message?: string | null;
    data?: GroupEmailList[] | null;
}