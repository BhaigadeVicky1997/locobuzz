import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { locobuzzAnimations } from '@locobuzz/animations';
import { DashboardService } from 'app/analytics/services/dashboard.service';
import { DIYMasterWidgets, DIYMasterWidgetsParams } from 'app/core/models/analytics/DIYMasterWidgets';
import { DIYWidgetCategory, DIYWidgetCustom } from 'app/core/models/analytics/DIYWidgetCategory';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-widget-container',
  templateUrl: './widget-container.component.html',
  styleUrls: ['./widget-container.component.scss'],
  animations: locobuzzAnimations
})
export class WidgetContainerComponent implements OnInit {

  constructor(private _bottomSheet: MatBottomSheet,
              private _dashboardService: DashboardService) { }
  toggleSearch: boolean = false;
  selectedWidgets: Array<any> = [];
  widgetData =  [
    {
      widgetID: 2,
      widgetName: 'Summary Overview',
      widgetDescription: 'Visualize trend of mentions over the selected duration.',
      uiJson: '{\r\n\t"CurrentSize":[10,15],\r\n\t"ShowChartType":[2,4],\r\n\t"FilterdSeries":["Positive","Neutral","User Activity","Brand Activity","Unique User","Engagement","Impression","Reach","Engaged User"],\r\n\t"Note":"123",\r\n\t"ShowLables":false,\r\n\t"WidgetDesignType":1\r\n\t}',
      isDefault: false,
      isDeleted: false,
      configJson: '{\r\n"AllowedCharts":[[2],[1,4,7,6]],\r\n"AllowedSeries":["Positive","Negative","Neutral","User Activity","Brand Activity","Unique User","Engagement","Impression","Reach","Engaged User"],\r\n"NotAllowed":["Sentiment"],\r\n"AllowedSize":[10,15],\r\n"WidgetSpecificFilter":["BrandActivity"],\r\n"HelpText":"Visualize trend of mentions over the selected duration.",\r\n"ShowReachImpressionRefresh":true,\r\n"API":"DIY/GetSummary",\r\n"DefaultFilterValue":{"Priority":1},\r\n"DateDuration":{\r\n"LessThan24Hour":["1 Hr","4 Hr","8 Hr","12 Hr"],\r\n"LessThan2Days":["1 Hr","4 Hr","8 Hr","12 Hr","Daily"],\r\n"LessThan7Days":["4 Hr","8 Hr","12 Hr","Daily"],\r\n"LessThan14Days":["4 Hr","8 Hr","12 Hr","Daily"]\r\n}\r\n\r\n}'
    }
  ];

  dIYWidgetCategory: DIYWidgetCategory[] = [];
  dIYMasterWidgets: DIYMasterWidgets[] = [];
  dIYMasterWidgetsParams: DIYMasterWidgetsParams;
  dIYWidgetCustom: DIYWidgetCustom[] = [];

  dIYWidgetCustomAsync = new Subject<DIYWidgetCustom[]>();
  dIYWidgetCustomAsync$ = this.dIYWidgetCustomAsync.asObservable();

  ngOnInit(): void {
    this.initializeComponent();
  }
  initializeComponent(): void {
    this.getDIYWidgetCategotries();
  }

  getDIYWidgetCategotries(): void
  {
    this._dashboardService.getDIYWidgetCategotries().subscribe(resp => {
      if (resp && resp.length > 0)
      {
        this.dIYWidgetCategory = resp;
        this.dIYWidgetCustom = resp;
        this.dIYWidgetCustomAsync.next(this.dIYWidgetCustom);
        this.dIYMasterWidgetsParams = {
          WidgetCategory: resp[0].widgetGroupID,
          SearchQuery: ''
        };
        this.dIYWidgetCustom = this.dIYWidgetCustom.filter(obj => { obj.expanded = false; return obj; } );
        this.dIYWidgetCustom[0].expanded = true;
        this.getGetDIYWidgets(this.dIYMasterWidgetsParams);
      }
    });
  }

  getGetDIYWidgets(params: DIYMasterWidgetsParams): void
  {
    this._dashboardService.getGetDIYWidgets(params).subscribe(resp => {
      if (resp && resp.length > 0)
      {
        this.dIYMasterWidgets = resp;
        const widgetindex = this.dIYWidgetCustom.findIndex(obj => obj.widgetGroupID === params.WidgetCategory);
        if (widgetindex > -1)
        {
          this.dIYWidgetCustom[widgetindex].DIYMasterWidget = resp;
          this.dIYWidgetCustom[widgetindex].expanded = true;
          this.dIYWidgetCustomAsync.next(this.dIYWidgetCustom);
        }
      }
    });
  }

  getWidgetListByID(widget: DIYWidgetCustom): void
  {
    if (widget.expanded)
    {
        const widgetindex = this.dIYWidgetCustom.findIndex(obj => obj.widgetGroupID === widget.widgetGroupID);
        if (widgetindex > -1)
        {
          this.dIYWidgetCustom[widgetindex].expanded = false;
          this.dIYWidgetCustomAsync.next(this.dIYWidgetCustom);
        }
    }
    else{
      this.dIYMasterWidgetsParams = {
        WidgetCategory: widget.widgetGroupID,
        SearchQuery: ''
      };
      this.getGetDIYWidgets(this.dIYMasterWidgetsParams);
    }

  }

  selectWidget(id): void{
    if (this.selectedWidgets.includes(id)){
      this.selectedWidgets.push(id);
    }else{
      const index = this.selectedWidgets.findIndex(id);
      this.selectedWidgets.slice(index, id);
    }
    document
    .querySelector(`#widget_${id}`)
    .scrollIntoView({ behavior: 'smooth' });

  }

  closeWidgetContainer(): void {
    this._bottomSheet.dismiss();
  }
}
