import { UserRoleEnum } from 'app/core/enums/userRoleEnum';
import { TicketCountLabel } from './SocialBoxCountDTO';
import { MixedTicketCount, MyTicketsCount } from './TicketsCount';

export class SupervisorNavTicketCount {
    userRole?: UserRoleEnum;
    open?: TicketCountLabel;
    onHold?: TicketCountLabel;
    pending?: TicketCountLabel;
    awaiting?: TicketCountLabel;
    awatingTlApproval?: TicketCountLabel;
    allTickets?: TicketCountLabel;
    awaitingFromCustomer?: TicketCountLabel;
    closedTickets?: TicketCountLabel;
    unAssignedTickets?: TicketCountLabel;
    SSRE?: TicketCountLabel;
    countProperties: TicketCountLabel[] = [];


    constructor(allticketCount: MyTicketsCount,
                myTicketCount: MyTicketsCount)
    {
        this.open = {
            name: 'Open',
            value: String(allticketCount.openTicketCount),
            unseenCount: String(myTicketCount.openTicketCount),
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 1,
            dbValue: 4
        };
        this.countProperties.push(this.open);
        this.onHold = {
            name: 'On Hold',
            value: String(allticketCount.onholdTicketCount),
            unseenCount: String(myTicketCount.onholdTicketCount),
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 1,
            dbValue: 7
        };
        this.countProperties.push(this.onHold);
        this.pending = {
            name: 'Pending',
            value: String(allticketCount.pendingTicketCount),
            unseenCount: String(myTicketCount.pendingTicketCount),
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 1,
            dbValue: 5
        };
        this.countProperties.push(this.pending);
        this.awaiting = {
            name: 'Awaiting',
            value: String(allticketCount.awaitingTicketCount),
            unseenCount: String(myTicketCount.awaitingTicketCount),
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 1,
            dbValue: 1 // not sure
        };
        this.countProperties.push(this.awaiting);
        this.awatingTlApproval = {
            name: 'Awaiting TL Approval',
            value: String(allticketCount.awaitingForApproval),
            unseenCount: String(myTicketCount.awaitingForApproval),
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 1,
            dbValue: 10
        };
        this.countProperties.push(this.awatingTlApproval);
        this.allTickets = {
            name: 'All Tickets',
            value: String(allticketCount.totalCount),
            unseenCount: String(myTicketCount.totalCount),
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 2,
            dbValue: 0
        };
        this.countProperties.push(this.allTickets);
        this.awaitingFromCustomer = {
            name: 'Awaiting From Customer',
            value: String(allticketCount.awaitingFromCustomer),
            unseenCount: String(myTicketCount.awaitingFromCustomer),
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 2,
            dbValue: 8
        };
        this.countProperties.push(this.awaitingFromCustomer);
        this.closedTickets = {
            name: 'Closed Tickets',
            value: String(allticketCount.closedTicketCount),
            unseenCount: String(myTicketCount.closedTicketCount),
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 2,
            dbValue: 2
        };
        this.countProperties.push(this.closedTickets);
        this.unAssignedTickets = {
            name: 'Unassigned Tickets',
            value: String(allticketCount.unassignedTickets),
            unseenCount: String(myTicketCount.unassignedTickets),
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 2,
            dbValue: 6
        };
        this.countProperties.push(this.unAssignedTickets);
        this.SSRE = {
            name: 'SSRE',
            value: String(allticketCount.ssreTicketCount),
            unseenCount: String(myTicketCount.ssreTicketCount),
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 2,
            dbValue: 12
        };
        this.countProperties.push(this.SSRE);

    }

    static calculateFLR(): string
    {
        return 'hello';
    }

    static calculateTAT(): string
    {
        return 'hello';
    }

    static calculateAHT(): string
    {
        return 'hello';
    }
}

export class AgentNavTicketCount {

    userRole?: UserRoleEnum;
    open?: TicketCountLabel;
    onHold?: TicketCountLabel;
    pending?: TicketCountLabel;
    awaiting?: TicketCountLabel;
    awatingTlApproval?: TicketCountLabel;
    allTickets?: TicketCountLabel;
    awaitingFromCustomer?: TicketCountLabel;
    closedTickets?: TicketCountLabel;
    unAssignedTickets?: TicketCountLabel;
    SSRE?: TicketCountLabel;
    countProperties: TicketCountLabel[] = [];


    constructor(allticketCount: MyTicketsCount,
                myTicketCount: MyTicketsCount)
    {
        this.open = {
            name: 'Open',
            value: String(allticketCount.openTicketCount),
            unseenCount: String(myTicketCount.openTicketCount),
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 1,
            dbValue: 4
        };
        this.countProperties.push(this.open);
        this.onHold = {
            name: 'On Hold',
            value: String(allticketCount.onholdTicketCount),
            unseenCount: String(myTicketCount.onholdTicketCount),
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 1,
            dbValue: 7
        };
        this.countProperties.push(this.onHold);
        this.pending = {
            name: 'Pending',
            value: String(allticketCount.pendingTicketCount),
            unseenCount: String(myTicketCount.pendingTicketCount),
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 1,
            dbValue: 5
        };
        this.countProperties.push(this.pending);
        this.awaiting = {
            name: 'Awaiting',
            value: String(allticketCount.awaitingTicketCount),
            unseenCount: String(myTicketCount.awaitingTicketCount),
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 1,
            dbValue: 1 // not sure
        };
        this.countProperties.push(this.awaiting);
        this.awatingTlApproval = {
            name: 'Awaiting TL Approval',
            value: String(allticketCount.awaitingForApproval),
            unseenCount: String(myTicketCount.awaitingForApproval),
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 1,
            dbValue: 10
        };
        this.countProperties.push(this.awatingTlApproval);
        this.allTickets = {
            name: 'All Tickets',
            value: String(allticketCount.totalCount),
            unseenCount: String(myTicketCount.totalCount),
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 2,
            dbValue: 0
        };
        this.countProperties.push(this.allTickets);
        this.awaitingFromCustomer = {
            name: 'Awaiting From Customer',
            value: String(allticketCount.awaitingFromCustomer),
            unseenCount: String(myTicketCount.awaitingFromCustomer),
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 2,
            dbValue: 8
        };
        this.countProperties.push(this.awaitingFromCustomer);
        this.closedTickets = {
            name: 'Closed Tickets',
            value: String(allticketCount.closedTicketCount),
            unseenCount: String(myTicketCount.closedTicketCount),
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 2,
            dbValue: 2
        };
        this.countProperties.push(this.closedTickets);
        this.unAssignedTickets = {
            name: 'Unassigned Tickets',
            value: String(allticketCount.unassignedTickets),
            unseenCount: String(myTicketCount.unassignedTickets),
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 2,
            dbValue: 6
        };
        this.countProperties.push(this.unAssignedTickets);
        this.SSRE = {
            name: 'SSRE',
            value: String(allticketCount.ssreTicketCount),
            unseenCount: String(myTicketCount.ssreTicketCount),
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 2,
            dbValue: 12
        };
        this.countProperties.push(this.SSRE);

    }
}