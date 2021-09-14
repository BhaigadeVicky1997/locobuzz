export interface AssignToList {
    agentID: number;
    agentName: string;
    userRole: number;
    logIn_Status: number;
    isUserAssignmentDisabled: number;
    selectedBrandID?: any;
    isDisabled: boolean;
    authorizedBrandIDs?: any;
    email: string;
    assignmentCount: number;
    accountType: number;
    userImageUrl?: any;
    teamName: string;
    teamID: number;
    assignedTicketCount: number;
    authorizedBrandsList?: any;
}

export interface AssignToListWithTeam {
    teamID: number;
    teamName: string;
    user: AssignToList[];
}
