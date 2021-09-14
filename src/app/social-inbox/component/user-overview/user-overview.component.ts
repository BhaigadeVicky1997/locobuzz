import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Charts } from 'app/core/models/charts/Chart';
import { ChartUtility } from 'app/core/models/charts/ChartUtility';
import { DashBoardChart } from 'app/core/models/charts/DashBoardChart';
import { Series } from 'app/core/models/charts/Series';
import { ChannelWiseActivityCount } from 'app/core/models/dbmodel/ChannelWiseActivityCount';
import { MentionInformation } from 'app/core/models/dbmodel/MentionInformation';
import { UserLoyaltyDetails } from 'app/core/models/dbmodel/UserLoyaltyDetails';
import { BaseMention } from 'app/core/models/mentions/locobuzz/BaseMention';
import { UserInteractionEnggagement } from 'app/core/models/viewmodel/UserInteractionEnggagement';
import { FilterService } from 'app/social-inbox/services/filter.service';
import { PostDetailService } from 'app/social-inbox/services/post-detail.service';
import { UserDetailService } from 'app/social-inbox/services/user-details.service';
import * as Highcharts from 'highcharts';
import { LoaderService } from './../../../shared/services/loader.service';

@Component({
  selector: 'app-user-overview',
  templateUrl: './user-overview.component.html',
  styleUrls: ['./user-overview.component.scss']
})
export class UserOverviewComponent implements OnInit {
  postObj: BaseMention;
  userLoyaltyDetails: UserLoyaltyDetails;
  userInteractionEnggagement: UserInteractionEnggagement[];
  sentimentTrendDetails: Series[];
  sentimentDetailOptions: any;
  highcharts = Highcharts;
  userInteractionOptions: any;

  constructor(// private accountService: AccountService,
    private filterService: FilterService,
    private _postDetailService: PostDetailService,
    private _loaderService: LoaderService,
    // private _ticketService: TicketsService,
    // public dialog: MatDialog,
    // private MapLocobuzz: MaplocobuzzentitiesService,
    private _snackBar: MatSnackBar,
    private _userDetailService: UserDetailService) { }

  ngOnInit(): void {
    this.postObj = this._postDetailService.postObj;
    this.GetLoyaltyDetails();
    this.GetSentimentTrendDetails();
    this.GetUserInteraction();
  }

  private GetLoyaltyDetails(): void {
    const filterObj = this.filterService.getGenericRequestFilter(this.postObj);
    this._userDetailService
      .GetLoyaltyDetails(filterObj)
      .subscribe((data) => {
        this.userLoyaltyDetails = data;
      });
  }

  private GetSentimentTrendDetails(): void {
    const filterObj = this.filterService.getGenericRequestFilter(this.postObj);
    this._userDetailService
      .GetSentimentTrendDetailsEnrichMentView(filterObj)
      .subscribe((data) => {
        this.sentimentTrendDetails = data;
        this.buildSentimentChart(data);
      });
  }

  private buildSentimentChart(seriesData: Series[]): void
  {
    const chartUtility = new ChartUtility(seriesData);
    const data = chartUtility.getJSChartDataStack();
    // const dashboardchart = new DashBoardChart();

    this.sentimentDetailOptions = DashBoardChart.DrawHighChart(null, '', '', data.xAxis, '', data.series, null,
     undefined, false, undefined, 'spline', false, false, undefined, '', true, false, false);
  }

  private GetUserInteraction(): void {
    const filterObj = this.filterService.getGenericRequestFilter(this.postObj);
    this._userDetailService
      .GetUserInteraction(filterObj)
      .subscribe((data) => {
        this.userInteractionEnggagement = data;
        this.EngagementData(this.userInteractionEnggagement);
      });
  }

  private EngagementData(data: UserInteractionEnggagement[]): void {
    const brands = data.map(obj => {
      return obj.brandFriendlyName;
    });
    // Enumerable.From(data).Select(function (s) { return [s.BrandFriendlyName] }).ToArray();
    const TotalPosts = data.map(obj => {
      return obj.mentionCount;
    });
    // Enumerable.From(data).Select(function (s) { return [s.MentionCount] }).ToArray();
    const PositiveCounts = data.map(obj => {
      return obj.positive;
    });
    // Enumerable.From(data).Select(function (s) { return [s.Positive] }).ToArray();
    const NeutralCounts = data.map(obj => {
      return obj.neutral;
    });
    // Enumerable.From(data).Select(function (s) { return [s.Neutral] }).ToArray();
    const NegativeCounts = data.map(obj => {
      return obj.negative;
    });
    // Enumerable.From(data).Select(function (s) { return [s.Negative] }).ToArray();
    const cat = ['Positive', 'Negative', 'Neutral'];
    const INFormat = new Intl.NumberFormat('en-IN');

    // for (let i = 0; i < brands.length; i++) {

    //     brands[i] = brands[i][0];
    //     TotalPosts[i] = TotalPosts[i][0];

    //     PositiveCounts[i] = PositiveCounts[i][0];


    //     NeutralCounts[i] = NeutralCounts[i][0];


    //     NegativeCounts[i] = NegativeCounts[i][0];

    // }
    if (!(+(PositiveCounts.reduce((a, b) => a + b, 0)
    + NeutralCounts.reduce((a, b) => a + b, 0)
    + NegativeCounts.reduce((a, b) => a + b, 0)) > 0)) {
        // $('#ChannelChart').html('<div class="NoDataFound" style="text-align:center;margin-top:25px;min-height: 300px;"></div>');

    }
    else {

        const colors = [];
        const ChannelData = [];
        const EngagementData = [];
        for (let i = 0; i < brands.length; i++) {
            colors[i] = DashBoardChart.GetChannelColors(i);
            ChannelData.push({
                name: brands[i],
                y: +(TotalPosts[i]),
                color: colors[i]
            });

            EngagementData.push({
                name: cat[0],
                channel: brands[i],
                y: +(PositiveCounts[i]),
                color: '#76DE32'// Highcharts.Color(colors[i]).brighten(0.2).get()
            });

            EngagementData.push({
                name: cat[1],
                channel: brands[i],
                y: +(NegativeCounts[i]),
                color: '#F46666'// Highcharts.Color(colors[i]).brighten(0.133).get()
            });

            EngagementData.push({
                name: cat[2],
                channel: brands[i],
                y: +(NeutralCounts[i]),
                color: '#F4D039'
            });

        }
        const series = [{
            type: undefined,
            name: 'Total Count',
            data: ChannelData,
            // size: '50%',
            size: '40%',
            dataLabels: {
                // tslint:disable: typedef
                formatter() {
                    return this.percentage > 15 ? '<b>' + this.point.name + '</b> ' : null;

                },
                color: 'white',
                distance: -30
            },


        }, {
            type: undefined,
            name: 'Count',
            data: EngagementData,
            // size: '67%',
            // innerSize: '55%',
            size: '55%',
            innerSize: '45%',
            dataLabels: {
                distance: 25,
                formatter() {
                    return this.y > 0 ? '<b>' + this.point.name + ' :</b> ' + INFormat.format(this.y) : null;
                },
            },
            tooltip: {
                useHTML: false,

                headerFormat: '',
                pointFormat: '{point.channel}  {point.name}:{point.y}'

            },
            showInLegend: false

        }];
        this.userInteractionOptions =  Charts.DrawHighchartPieChart('', '', '', '', '',
         series, true, '', true, true, false, undefined, '', '', false, false);
        console.log('UserInteraction', JSON.stringify(this.userInteractionOptions));
    }
}

}
