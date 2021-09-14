import { LoaderService } from './../../../shared/services/loader.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChannelGroup } from 'app/core/enums/ChannelGroup';
import { Sentiment } from 'app/core/enums/Sentiment';
import { ChannelWiseActivityCount, CustomChannelWiseActivityCount } from 'app/core/models/dbmodel/ChannelWiseActivityCount';
import { MentionInformation } from 'app/core/models/dbmodel/MentionInformation';
import { UserOneViewDTO, UserOneViewModel } from 'app/core/models/dbmodel/UserOneViewDTO';
import { BaseMention } from 'app/core/models/mentions/locobuzz/BaseMention';
import { LocobuzzmentionService } from 'app/core/services/locobuzzmention.service';
import { FilterService } from 'app/social-inbox/services/filter.service';
import { PostDetailService } from 'app/social-inbox/services/post-detail.service';
import { UserDetailService } from 'app/social-inbox/services/user-details.service';
import { UseroneviewService } from 'app/social-inbox/services/useroneview.service';

@Component({
  selector: 'app-user-activities',
  templateUrl: './user-activities.component.html',
  styleUrls: ['./user-activities.component.scss']
})
export class UserActivitiesComponent implements OnInit {

  userOneViewTimeline: MentionInformation;
  channelWiseUserActivityCount: ChannelWiseActivityCount[] = [];
  customActivityCount: CustomChannelWiseActivityCount[] = [];
  userOneViewDTO: UserOneViewDTO[];
  postObj: BaseMention;
  userOneViewModel: UserOneViewModel;
  constructor(
    private filterService: FilterService,
    private _postDetailService: PostDetailService,
    // private _ticketService: TicketsService,
    // public dialog: MatDialog,
    // private MapLocobuzz: MaplocobuzzentitiesService,
    private _snackBar: MatSnackBar,
    private _userDetailService: UserDetailService,
    private _locobuzzMentionService: LocobuzzmentionService,
    private _userOneViewService: UseroneviewService,
    private _loaderService: LoaderService
  ) { }

  public get channelGroupEnum(): typeof ChannelGroup {
    return ChannelGroup;
  }

  ngOnInit(): void {
    this._loaderService.togglComponentLoader({
      status: true,
      section: 'activities'
    });
    this.userOneViewModel = {};
    this.postObj = this._postDetailService.postObj;
    this.GetUserOneViewTimeline();
    this.GetChannelWiseUserActivityCount();
  }

  private GetUserOneViewTimeline(channelid?: number): void {
    this._loaderService.togglComponentLoader({
      status: true,
      section: 'activities'
    });
    const filterObj = this.filterService.getGenericRequestFilter(this.postObj);
    if (channelid)
    {
      filterObj.channel = channelid;
    }
    else{
      filterObj.channel = 0;
    }
    filterObj.author = null;
    this._userDetailService
      .GetUserOneViewTimeline(filterObj)
      .subscribe((data) => {
        this.userOneViewTimeline = data;
        this.mapUserOneView();
        
      });
  }

  getUserTimelineByChannel(channelid): void
  {
    this.GetUserOneViewTimeline(+channelid);
  }

  mapUserOneView(): void
  {
    this.userOneViewModel.firstActivity = this.userOneViewTimeline.firstActivity ?
     this._userOneViewService.calculateActivityTiming(this.userOneViewTimeline.firstActivity).timetoshow : 'NA';

    this.userOneViewModel.lastActivity = this.userOneViewTimeline.lastActivity ?
      this._userOneViewService.calculateActivityTiming(this.userOneViewTimeline.lastActivity).timetoshow : 'NA';

    this.checkSentimentType();

    if (this.userOneViewTimeline.mentionList.length > 0)
    {
      this.userOneViewModel.channelIcon = this._locobuzzMentionService.getChannelIcon(this.userOneViewTimeline.mentionList[0]);
      this.userOneViewDTO = this._userOneViewService.buildUserOneviewObject(this.userOneViewTimeline.mentionList);


    }
    this._loaderService.togglComponentLoader({
      status: false,
      section: 'activities'
    });

  }

  private GetChannelWiseUserActivityCount(): void {
    this._loaderService.togglComponentLoader({
      status: true,
      section: 'activities'
    });
    const filterObj = this.filterService.getGenericRequestFilter(this.postObj);
    this._userDetailService
      .GetChannelWiseUserActivityCount(filterObj)
      .subscribe((data) => {
        this.channelWiseUserActivityCount = data;
        this.setCustomActivityCount(this.channelWiseUserActivityCount);
      });
  }

  setCustomActivityCount(channelObj: ChannelWiseActivityCount[] ): void {
    if (channelObj && channelObj.length > 0)
    {
      channelObj.forEach( obj => {
        this.customActivityCount.push({channelGroup: obj.channelGroup,
          count: obj.count, channelName: ChannelGroup[obj.channelGroup]});
      });
    }

    this._loaderService.togglComponentLoader({
      status: false,
      section: 'activities'
    });
  }

  checkSentimentType(): void {
  try
  {
    this.userOneViewModel.firstSentiment = Sentiment[this.userOneViewTimeline.firstSentimentType];
    this.userOneViewModel.lastSentiMent = Sentiment[this.userOneViewTimeline.lastSentimentType];
  }
  catch (exception)
  {
    this.userOneViewModel.firstSentiment = 'Negative';
    this.userOneViewModel.lastSentiMent = 'Negative';
  }
  }

}
