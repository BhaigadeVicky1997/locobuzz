import { UserRoleEnum } from 'app/core/enums/userRoleEnum';

export interface LocoBuzzAgent {
    agentID: number;
    agentName: string;
    userRole: UserRoleEnum;
    logIn_Status: number;
    isUserAssignmentDisabled: number;
    selectedBrandID: string;
    isDisabled: boolean;
    authorizedBrandIDs: string;
    email: string;
    assignmentCount: number;
    accountType: number;
    userImageUrl: string;
    teamName: string;
    teamID: number;
    assignedTicketCount: number;
    authorizedBrandsList: number[];
}
export interface LocobuzzAgentResponse {
    success: boolean;
    message: string | null;
    data: LocoBuzzAgent[];
}
export interface LocobuzzTeam {
    teamID: number;
    categoryID: number;
    teamName: string;
}
