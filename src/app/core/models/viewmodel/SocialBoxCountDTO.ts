import { UserRoleEnum } from 'app/core/enums/userRoleEnum';
import { CommonService } from 'app/core/services/common.service';
import { DashBoardChart } from '../charts/DashBoardChart';
import { MixedTicketCount, MyTicketsCount } from './TicketsCount';

export class SupervisorTicketCount {
    userRole?: UserRoleEnum;
    totalTickets?: TicketCountLabel;
    unAssignedTicket?: TicketCountLabel;
    workInProgress?: TicketCountLabel;
    closed?: TicketCountLabel;
    flr?: TicketCountLabel;
    tat?: TicketCountLabel;
    aboutToBreach?: TicketCountLabel;
    alreadyBreached?: TicketCountLabel;
    noofActiveAgents?: TicketCountLabel;
    onBreak?: TicketCountLabel;
    avgAHT?: TicketCountLabel;
    unassignedAbtToBreach?: TicketCountLabel;
    unassignedAlreadyreached?: TicketCountLabel;
    countProperties: TicketCountLabel[] = [];

    constructor(allticketCount: MixedTicketCount,
                myTicketCount: MyTicketsCount)
    {
        let currentval = 0;
        let previousval = 0;
        let color = '';
        let arrow = '';
        let percent = 0;

        this.totalTickets = {
            name: 'Total Tickets',
            value: String(allticketCount.myTicketsCount.totalCount),
            unseenCount: String(myTicketCount.totalCount),
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 1,
            icon: 'local_activity'
        };
        this.countProperties.push(this.totalTickets);
        this.unAssignedTicket = {
            name: 'Un-Assigned',
            value: String(allticketCount.myTicketsCount.unassignedTickets),
            unseenCount: '',
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 1,
            icon: 'folder_open'
        };
        this.countProperties.push(this.unAssignedTicket);
        this.workInProgress = {
            name: 'Work In Progress',
            value: String(allticketCount.myTicketsCount.pendingTicketCount),
            unseenCount: '',
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 1,
            icon: 'message'
        };
        this.countProperties.push(this.workInProgress);
        this.closed = {
            name: 'Closed',
            value: String(allticketCount.myTicketsCount.closedTicketCount),
            unseenCount: '',
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 1,
            icon: 'folder_open'
        };
        currentval = CommonService.calculateInSeconds(+allticketCount.myTicketsCount.flrTatSeconds,
            allticketCount.myTicketsCount.flrTicketCount);
        previousval = CommonService.calculateInSeconds(+allticketCount.myTicketsCount.prevFlrTatSeconds,
                +allticketCount.myTicketsCount.prevFlrTicketCount);
        percent = CommonService.returnCountWithTrendCount(currentval, previousval) ?
        CommonService.returnCountWithTrendCount(currentval, previousval) : 0;
        color = percent <= 0 ? 'colored__green' : 'colored__red';
        arrow = percent <= 0 ? 'arrow_upward' : 'south';
        percent = percent < 0 ? (percent * -1) : percent;

        this.countProperties.push(this.closed);
        this.flr = {
            name: 'FLR',
            value: CommonService.calculateFLR(allticketCount) + ' '  + percent + '%',
            unseenCount: '',
            isGrouped: false,
            groupName: '',
            bgColor: color,
            level: 2,
            arrow
        };
        this.countProperties.push(this.flr);

        currentval = CommonService.calculateInSeconds(+allticketCount.myTicketsCount.closedTicketTAT,
            allticketCount.myTicketsCount.closedTicketCount);
        previousval = CommonService.calculateInSeconds(+allticketCount.myTicketsCount.prevClosedTicketTAT,
                +allticketCount.myTicketsCount.prevClosedTicket);
        percent = CommonService.returnCountWithTrendCount(currentval, previousval) ?
        CommonService.returnCountWithTrendCount(currentval, previousval) : 0;
        color = percent <= 0 ? 'colored__green' : 'colored__red';
        arrow = percent <= 0 ? 'arrow_upward' : 'south';
        percent = percent < 0 ? (percent * -1) : percent;
        this.tat = {
            name: 'TAT',
            value: CommonService.calculateTAT(allticketCount) + ' '  + percent + '%',
            unseenCount: '',
            isGrouped: false,
            groupName: '',
            bgColor: color,
            level: 2,
            arrow
        };
        this.countProperties.push(this.tat);
        this.aboutToBreach = {
            name: 'About To Breach',
            value: String(allticketCount.myTicketsCount.aboutToBreach),
            unseenCount: '',
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 2,
            icon: 'folder_open'
        };
        this.countProperties.push(this.aboutToBreach);
        this.alreadyBreached = {
            name: 'Already Breached',
            value: String(allticketCount.myTicketsCount.alreadyBreach),
            unseenCount: '',
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 2,
            icon: 'message'
        };
        this.countProperties.push(this.alreadyBreached);
        this.noofActiveAgents = {
            name: 'No Of Active Agents',
            value: String(allticketCount.myTicketsCount.activeAgents),
            unseenCount: '',
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 3,
            icon: 'local_activity'
        };
        this.countProperties.push(this.noofActiveAgents);
        this.onBreak = {
            name: 'On Break',
            value: String(allticketCount.myTicketsCount.onBreackAgents),
            unseenCount: '',
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 3,
            icon: 'folder_open'
        };
        this.countProperties.push(this.onBreak);

        percent = CommonService.returnCountWithTrendCount(allticketCount.myTicketsCount.avgAgentHandlingTime,
            allticketCount.myTicketsCount.prevAvgAgentHandlingTime) ?
        CommonService.returnCountWithTrendCount(allticketCount.myTicketsCount.avgAgentHandlingTime,
            allticketCount.myTicketsCount.prevAvgAgentHandlingTime) : 0;

        this.avgAHT = {
            name: 'Avg AHT',
            value: CommonService.calculateAHT(allticketCount) + ' ' + percent + '%',
            unseenCount: '',
            isGrouped: false,
            groupName: '',
            bgColor: color,
            level: 3,
            arrow
        };
        this.countProperties.push(this.avgAHT);
        this.unassignedAbtToBreach = {
            name: 'Unassigned About To Breached',
            value: String(allticketCount.allTicketsCount.aboutToBreach),
            unseenCount: '',
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 4,
            icon: 'message'
        };
        this.countProperties.push(this.unassignedAbtToBreach);
        this.unassignedAlreadyreached = {
            name: 'Unassigned Already Breached',
            value: String(allticketCount.allTicketsCount.alreadyBreach),
            unseenCount: '',
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 4,
            icon: 'local_activity'
        };
        this.countProperties.push(this.unassignedAlreadyreached);

    }
}

export class AgentTicketCount {
    userRole?: UserRoleEnum;
    myTickets?: TicketCountLabel;
    open?: TicketCountLabel;
    pending?: TicketCountLabel;
    awaiting?: TicketCountLabel;
    unAssignedTickets?: TicketCountLabel;
    myFlr?: TicketCountLabel;
    myTat?: TicketCountLabel;
    aboutToBreach?: TicketCountLabel;
    alreadyBreached?: TicketCountLabel;
    myAHT?: TicketCountLabel;
    allTickets?: TicketCountLabel;
    closedTickets?: TicketCountLabel;
    unAssignedAboutToBreach?: TicketCountLabel;
    unAssignedAlreadyToBreach?: TicketCountLabel;
    countProperties: TicketCountLabel[] = [];

    constructor(allticketCount: MixedTicketCount,
                myTicketCount: MyTicketsCount)
    {
        let currentval = 0;
        let previousval = 0;
        let color = '';
        let arrow = '';
        let percent = 0;
        this.myTickets = {
            name: 'My Tickets',
            value: String(allticketCount.myTicketsCount.totalCount),
            unseenCount: String(myTicketCount.totalCount),
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 1
        };
        this.countProperties.push(this.myTickets);
        this.open = {
            name: 'Open',
            value: String(allticketCount.myTicketsCount.openTicketCount),
            unseenCount: '',
            isGrouped: true,
            groupName: 'grp1',
            bgColor: '',
            level: 1
        };
        this.countProperties.push(this.open);
        this.pending = {
            name: 'Pending',
            value: String(allticketCount.myTicketsCount.pendingTicketCount),
            unseenCount: '',
            isGrouped: true,
            groupName: 'grp1',
            bgColor: '',
            level: 1
        };
        this.countProperties.push(this.pending);
        this.awaiting = {
            name: 'Awaiting',
            value: String(allticketCount.myTicketsCount.awaitingFromCustomer),
            unseenCount: '',
            isGrouped: true,
            groupName: '',
            bgColor: '',
            level: 1
        };
        this.countProperties.push(this.awaiting);
        this.unAssignedTickets = {
            name: 'Unassigned Tickets',
            value: String(allticketCount.myTicketsCount.unassignedTickets),
            unseenCount: '',
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 1
        };
        this.countProperties.push(this.unAssignedTickets);

        currentval = CommonService.calculateInSeconds(+allticketCount.myTicketsCount.flrTatSeconds,
            allticketCount.myTicketsCount.flrTicketCount);
        previousval = CommonService.calculateInSeconds(+allticketCount.myTicketsCount.prevFlrTatSeconds,
                +allticketCount.myTicketsCount.prevFlrTicketCount);
        percent = CommonService.returnCountWithTrendCount(currentval, previousval) ?
        CommonService.returnCountWithTrendCount(currentval, previousval) : 0;
        color = percent <= 0 ? 'colored__green' : 'colored__red';
        arrow = percent <= 0 ? 'arrow_upward' : 'south';
        percent = percent < 0 ? (percent * -1) : percent;

        this.myFlr = {
            name: 'My FLR',
            value: CommonService.calculateFLR(allticketCount) + ' '  + percent + '%',
            unseenCount: '',
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 2
        };
        this.countProperties.push(this.myFlr);

        currentval = CommonService.calculateInSeconds(+allticketCount.myTicketsCount.flrTatSeconds,
            allticketCount.myTicketsCount.flrTicketCount);
        previousval = CommonService.calculateInSeconds(+allticketCount.myTicketsCount.prevFlrTatSeconds,
                +allticketCount.myTicketsCount.prevFlrTicketCount);
        percent = CommonService.returnCountWithTrendCount(currentval, previousval) ?
        CommonService.returnCountWithTrendCount(currentval, previousval) : 0;
        color = percent <= 0 ? 'colored__green' : 'colored__red';
        arrow = percent <= 0 ? 'arrow_upward' : 'south';
        percent = percent < 0 ? (percent * -1) : percent;
        this.myTat = {
            name: 'My TAT',
            value: CommonService.calculateTAT(allticketCount) + ' '  + percent + '%',
            unseenCount: '',
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 2
        };
        this.countProperties.push(this.myTat);
        this.aboutToBreach = {
            name: 'About To Breach',
            value: String(allticketCount.myTicketsCount.aboutToBreach),
            unseenCount: '',
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 2
        };
        this.countProperties.push(this.aboutToBreach);
        this.alreadyBreached = {
            name: 'Already Breached',
            value: String(allticketCount.myTicketsCount.alreadyBreach),
            unseenCount: '',
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 2
        };
        this.countProperties.push(this.alreadyBreached);

        percent = CommonService.returnCountWithTrendCount(allticketCount.myTicketsCount.avgAgentHandlingTime,
            allticketCount.myTicketsCount.prevAvgAgentHandlingTime) ?
        CommonService.returnCountWithTrendCount(allticketCount.myTicketsCount.avgAgentHandlingTime,
            allticketCount.myTicketsCount.prevAvgAgentHandlingTime) : 0;

        this.myAHT = {
            name: 'My AHT',
            value: CommonService.calculateAHT(allticketCount)+ ' ' + percent + '%',
            unseenCount: '',
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 3
        };
        this.countProperties.push(this.myAHT);
        this.allTickets = {
            name: 'All Tickets',
            value: String(allticketCount.allTicketsCount.totalCount),
            unseenCount: '',
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 4
        };
        this.countProperties.push(this.allTickets);
        this.closedTickets = {
            name: 'Closed Tickets',
            value: String(allticketCount.allTicketsCount.closedCount),
            unseenCount: '',
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 4
        };
        this.countProperties.push(this.closedTickets);
        this.unAssignedAboutToBreach = {
            name: 'Unassigned About To Breached',
            value: String(allticketCount.allTicketsCount.aboutToBreach),
            unseenCount: '',
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 4
        };
        this.countProperties.push(this.unAssignedAboutToBreach);
        this.unAssignedAlreadyToBreach = {
            name: 'Unassigned Already Breached',
            value: String(allticketCount.allTicketsCount.alreadyBreach),
            unseenCount: '',
            isGrouped: false,
            groupName: '',
            bgColor: '',
            level: 4
        };
        this.countProperties.push(this.unAssignedAlreadyToBreach);
    }
}

export interface TicketCountLabel
{
    name?: string;
    value?: string;
    unseenCount?: string;
    isGrouped?: boolean;
    groupName?: string;
    bgColor?: string;
    level?: number;
    dbValue?: number;
    arrow?: string;
    icon?: string;
}
