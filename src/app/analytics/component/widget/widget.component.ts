import { ConfigJson, UiJson, Widget } from './../../../core/interfaces/Widget';
import { ChannelImage } from 'app/core/enums/ChannelImgEnum';
import { Component, Input, OnInit } from '@angular/core';
import { DashBoardChart } from 'app/core/models/charts/DashBoardChart';
import { Series } from 'app/core/models/charts/Series';
import { ChartUtility } from 'app/core/models/charts/ChartUtility';
import { sentimentAnalysis, tatResolutionDemo } from 'app/app-data/widget-data';
import { WidgetChartType, WidgetDesignType } from 'app/core/enums/widgetEnum';
@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
})
export class WidgetComponent implements OnInit {
  constructor() {}
  @Input() widgetObj: Widget;
  @Input() demoData: boolean = false;
  widgetData: Series[];
  uiJson: UiJson;
  configJson: ConfigJson;
  channelImage = ChannelImage;
  updateChart: boolean = false;
  chartOptions: any = {};
  tableData = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  ];

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = this.tableData;

  public get widgetChartTypeEnum(): typeof WidgetChartType {
    return WidgetChartType;
  }

  public get widgetTypeEnum(): typeof WidgetDesignType {
    return WidgetDesignType;
  }

  ngOnInit(): void {
    this.uiJson = JSON.parse(this.widgetObj.uiJson);
    this.configJson = JSON.parse(this.widgetObj.configJson);
    if (this.demoData) {
      if (this.configJson.API === 'DIY/GetSentimentAnalysis') {
        this.widgetData = sentimentAnalysis;
        this.uiJson.ShowChartType.forEach((item, index) => {
          this.changeChartType(item, index);
       });
      }
    } else {
      // api call
    }
  }

  changeChartType(chartType, groupIdex: number): void {
    if (
      this.uiJson.ShowChartType[groupIdex] !== chartType &&
      this.configJson.AllowedCharts[groupIdex].length > 1
    ) {
      this.uiJson.ShowChartType[groupIdex] = chartType;
    }else{
      if (
        this.uiJson.ShowChartType[groupIdex] === this.widgetChartTypeEnum.NoChart
        || !this.uiJson.ShowChartType.includes(this.widgetChartTypeEnum.NoChart)){
        this.uiJson.ShowChartType[groupIdex] = this.uiJson.ShowChartType[groupIdex]  ? this.widgetChartTypeEnum.NoChart : chartType;
      }
    }
    switch (chartType) {
      case this.widgetChartTypeEnum.Pie:
        this.chartOptions =  this.buildChart(this.widgetData, 'pie');
        break;
      case this.widgetChartTypeEnum.Bar:
        this.chartOptions =  this.buildChart(this.widgetData, 'bar');
        break;
      case this.widgetChartTypeEnum.Donut:
        this.chartOptions =  this.buildChart(this.widgetData, 'pie');
        break;
      case this.widgetChartTypeEnum.Line:
        this.chartOptions =  this.buildChart(this.widgetData, 'line');
        break;
      case this.widgetChartTypeEnum.DualAxis:
        this.chartOptions =  this.buildChart(this.widgetData, 'line');
        break;
      case this.widgetChartTypeEnum.Column:
        this.chartOptions =  this.buildChart(this.widgetData, 'column');
        break;
      case this.widgetChartTypeEnum.Area:
        this.chartOptions =  this.buildChart(this.widgetData, 'area');
        break;
      case this.widgetChartTypeEnum.SpiderWeb:
        this.chartOptions =  this.buildChart(this.widgetData, 'line');
        break;
      case this.widgetChartTypeEnum.Polar:
        this.chartOptions =  this.buildChart(this.widgetData, 'line');
        break;

      default:
        // code block
    }
    this.updateChart = true;
  }

  isArray(obj: any ): boolean {
    return Array.isArray(obj);
 }

  private buildChart(seriesData: Series[], chartType): void {
    const chartUtility = new ChartUtility(seriesData);
    const data = chartUtility.getJSChartDataStack();
    // const dashboardchart = new DashBoardChart();

    return DashBoardChart.DrawHighChart(
      null,
      '',
      '',
      data.xAxis,
      '',
      data.series,
      null,
      undefined,
      false,
      undefined,
      chartType,
      false,
      false,
      undefined,
      '',
      true,
      false,
      false
    );
  }
}
