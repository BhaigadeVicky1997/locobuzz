import { Component, Input, OnInit, Output, EventEmitter  } from '@angular/core';
import { summary } from 'app/app-data/post-summary';
import { UserRoleEnum } from 'app/core/enums/userRoleEnum';
import { AuthUser } from 'app/core/interfaces/User';
import { AgentTicketCount, SupervisorTicketCount, TicketCountLabel } from 'app/core/models/viewmodel/SocialBoxCountDTO';
import { MixedTicketCount, MyTicketsCount } from 'app/core/models/viewmodel/TicketsCount';
import { AccountService } from 'app/core/services/account.service';
import { FilterService } from 'app/social-inbox/services/filter.service';
import { MainService } from 'app/social-inbox/services/main.service';
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { LocobuzzUtils } from '@locobuzz/utils';

@Component({
  selector: 'app-post-summary',
  templateUrl: './post-summary.component.html',
  styleUrls: ['./post-summary.component.scss']
})
export class PostSummaryComponent implements OnInit {

  @Input() postSummary: any;
  @Output() dataRecieved = new EventEmitter() ;
  Object = Object;
  allTicketsCount: MixedTicketCount;
  unseenMyTicketCount: MyTicketsCount;
  currentUser: AuthUser;
  supervisorTicketCount: SupervisorTicketCount;
  supervisorTicketCountGrouped: object;
  agentTicketCount: AgentTicketCount;
  agentTicketCountGrouped: object;
  userRole: UserRoleEnum;
  supTicketCountLabel: TicketCountLabel[] = [];
  agentTicketCountLabel: TicketCountLabel[] = [];
  currentdays = 1;
  daysLabel = 'Todays Tickets';

  constructor(private filterService: FilterService,
              private mainService: MainService,
              private accountService: AccountService) { }
  ngOnInit(): void {
    this.filterService.currentBrandListFirstCall.subscribe(
      (value) => {
        if (value) {
          this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.currentUser = user);
          this.userRole = this.currentUser.data.user.role;
          this.getUnseenTicketCount();
        }
      }
    );
  }

  public get userRoleEnum(): typeof UserRoleEnum {
    return UserRoleEnum;
  }

  changeDateFunction(days, dayslabel): void
  {
    this.currentdays = +days;
    this.daysLabel = dayslabel;
    this.getUnseenTicketCount();
  }

  getSocialInboxTicketCount(): void {
    const filterObj = this.filterService.getGenericFilter();
    filterObj.startDateEpoch = this.currentdays === 1 ? moment().startOf('day').utc().unix()
    : moment().subtract(this.currentdays, 'days').startOf('day').utc().unix();
    filterObj.endDateEpoch = moment().endOf('day').utc().unix();

    this.mainService
      .GetAllTicketsCount(filterObj)
      .subscribe((data) => {
        this.dataRecieved.emit(true);
        this.allTicketsCount = data;
        if (this.currentUser.data.user.role === UserRoleEnum.SupervisorAgent) {
          this.supervisorTicketCount = new SupervisorTicketCount(this.allTicketsCount,
            this.unseenMyTicketCount);
          this.supervisorTicketCountGrouped = LocobuzzUtils.ObjectByGroup(this.supervisorTicketCount.countProperties, 'level');
          this.supervisorTicketCount.userRole = UserRoleEnum.SupervisorAgent;
        }
        else if (this.currentUser.data.user.role === UserRoleEnum.AGENT) {
          this.agentTicketCount = new AgentTicketCount(this.allTicketsCount,
            this.unseenMyTicketCount);
          this.agentTicketCountGrouped = LocobuzzUtils.ObjectByGroup(this.agentTicketCount.countProperties, 'level');
          this.agentTicketCount.userRole = UserRoleEnum.AGENT;
        }
        console.log('allTicketsCount', this.allTicketsCount);
      });
  }

  getUnseenTicketCount(): void {
    const filterObj = this.filterService.getGenericFilter();
    filterObj.startDateEpoch = this.currentdays === 1 ? moment().startOf('day').utc().unix()
    : moment().subtract(this.currentdays, 'days').startOf('day').utc().unix();
    filterObj.endDateEpoch = moment().endOf('day').utc().unix();

    this.mainService
      .GetUnseenTicketsCount(filterObj)
      .subscribe((data) => {
        this.unseenMyTicketCount = data;
        this.getSocialInboxTicketCount();
        console.log('UnseenTicketsCount', this.allTicketsCount);
      });
  }

}
