export interface Widget {
  widgetID: number;
  widgetName: string;
  widgetDescription: string;
  uiJson: string;
  isDefault: boolean;
  isDeleted: boolean;
  configJson: string;
}

export interface UiJson {
  CurrentSize: Array<number>;
  FilterdSeries: Array<string>;
  Note: string;
  ShowChartType: Array<number>;
  ShowLables: boolean;
  WidgetDesignType: number;
}

export interface ConfigJson {
  API: string;
  AllowedCharts: Array<number[]>;
  AllowedSeries: Array<string>;
  AllowedSize: Array<number>;
  DateDuration: WidgetDateDuration;
  DefaultFilterValue: { Priority: number };
  HelpText: string;
  NotAllowed: Array<string>;
  ShowReachImpressionRefresh: boolean;
  WidgetSpecificFilter: Array<string>;
}

export interface WidgetDateDuration {
  LessThan24Hour: Array<string>;
  LessThan2Days: Array<string>;
  LessThan7Days: Array<string>;
  LessThan14Days: Array<string>;
}
