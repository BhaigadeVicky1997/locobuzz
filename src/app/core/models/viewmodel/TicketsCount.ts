export interface AllTicketsCount {
    totalCount?: number;
    closedCount?: number;
    aboutToBreach?: number;
    alreadyBreach?: number;
}

export interface MyTicketsCount {
    totalCount?: number;
    unassignedTickets?: number;
    openTicketCount?: number;
    closedTicketCount?: number;
    awaitingTicketCount?: number;
    pendingTicketCount?: number;
    onholdTicketCount?: number;
    aboutToBreach?: number;
    alreadyBreach?: number;
    flrTatSeconds?: number;
    flrTicketCount?: number;
    avgAgentHandlingTime?: number;
    tatTicketCount?: number;
    activeAgents?: number;
    onBreackAgents?: number;
    notClosedCount?: number;
    awaitingFromCustomer?: number;
    awaitingForApproval?: number;
    awaitingForOtherTLApproval?: number;
    sentForApproval?: number;
    closedTicketTAT?: number;
    csdPending?: number;
    brandPending?: number;
    unActioned?: number;
    ssreTicketCount?: number;
    prevFlrTatSeconds?: number;
    prevFlrTicketCount?: number;
    prevAvgAgentHandlingTime?: number;
    prevClosedTicketTAT?: number;
    prevClosedTicket?: number;
}

export interface MixedTicketCount {
    allTicketsCount?: AllTicketsCount;
    myTicketsCount?: MyTicketsCount;
}

export interface TicketsCountResponse {
    success?: boolean;
    message?: string | null;
    data?: MixedTicketCount | null;
}

export interface MyTicketsCountResponse {
    success?: boolean;
    message?: string | null;
    data?: MyTicketsCount | null;
}

