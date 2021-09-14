import { CompetitionColor, globalChartColor, TotalSentimetColor } from './GlobalChartColor';

let ChartUtilityColor;
export class ChartUtility {
    serverChartData: any;
    constructor(serverChartData) {
        this.serverChartData = serverChartData;
        if (typeof CompetitionColor !== 'undefined') {
            ChartUtilityColor = CompetitionColor;
        }
        else if (typeof globalChartColor !== 'undefined') {
            ChartUtilityColor = globalChartColor;
        }
    }
    static CheckSeriesData(lstSeries): boolean {
        let Value = 0;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < lstSeries.length; i++) {
            if (lstSeries[i].ChartPoints.length > 0) {
                // tslint:disable-next-line: prefer-for-of
                for (let j = 0; j < lstSeries[i].ChartPoints.length; j++) {
                    Value += lstSeries[i].ChartPoints[j].YPoint;
                }
            }
        }
        if (Value === 0) {
            return false;
        }
        else {
            return true;
        }
    }
    static SetPredifinedColorasPerSeries(serieschartdatalist, index): any {
        let color = ChartUtilityColor[index];
        if (serieschartdatalist.seriesName != null) {
            if (serieschartdatalist.seriesName.toLowerCase().indexOf('positive') > -1) {
                color = TotalSentimetColor.positive;

            } else if (serieschartdatalist.seriesName.toLowerCase().indexOf('negative') > -1) {
                color = TotalSentimetColor.negative;
            } else if (serieschartdatalist.seriesName.toLowerCase().indexOf('neutral') > -1) {
                color = TotalSentimetColor.neutral;
            } else if (serieschartdatalist.seriesName.toLowerCase().indexOf('total') > -1) {
                color = TotalSentimetColor.total;
            }
        }
        return color;
    }
    getJSChartData(): any {
        let xLabels = [];
        const mainSeries = [];
        for (const serverSeries of this.serverChartData) {
            const series: any = {};
            series.data = [];
            series.type = serverSeries.chartType;
            series.name = serverSeries.seriesName;
            series.OtherValue = serverSeries.otherValue;
            series.stacking = serverSeries.stacking;
            series.innerSize = serverSeries.innerSize;
            for (let pt = 0; pt < serverSeries.chartPoints.length; pt++) {
                xLabels.push(serverSeries.chartPoints[pt].xPoint);
                if (typeof ChartUtilityColor !== 'undefined') {
                    let color = serverSeries.color;
                    color = color != null && color !== '' ? color : ChartUtilityColor[pt];
                    series.data.push({ name: serverSeries.chartPoints[pt].XPoint,
                         y: serverSeries.chartPoints[pt].yPoint, color, OtherValue: serverSeries.chartPoints[pt].otherValue });
                }
                else {
                    series.data.push({ name: serverSeries.chartPoints[pt].xPoint,
                         y: serverSeries.chartPoints[pt].yPoint, OtherValue: serverSeries.chartPoints[pt].otherValue });
                }
            }
            mainSeries.push(series);
        }
        xLabels = [...new Set(xLabels)]; // get distinct values
        // xLabels = Enumerable.From(xLabels).Distinct().ToArray();
        return { xAxis: xLabels, series: mainSeries };
    }

    getJSChartDataStack(distinct?, isNoAutoColor?): any {
        let xLabels = [];
        const mainSeries = [];
        const DataColorChange = this.serverChartData.length === 1;
        for (let i = 0; i < this.serverChartData.length; i++) {
            const series: any = {};
            series.data = [];
            series.type = this.serverChartData[i].chartType;
            series.name = this.serverChartData[i].seriesName;
            series.OtherValue = this.serverChartData[i].otherValue;

            series.stacking = this.serverChartData[i].stacking;
            series.innerSize = this.serverChartData[i].innerSize;
            series.yAxis = 0;
            // tslint:disable-next-line: prefer-for-of
            for (let pt = 0; pt < this.serverChartData[i].chartPoints.length; pt++) {
                xLabels.push(this.serverChartData[i].chartPoints[pt].xPoint);
                const data = { name: this.serverChartData[i].chartPoints[pt].xPoint,
                     y: this.serverChartData[i].chartPoints[pt].yPoint,
                      OtherValue: (typeof (this.serverChartData[i].chartPoints[pt].otherValueObj) !== 'undefined'
                      && this.serverChartData[i].chartPoints[pt].otherValueObj != null
                      && this.serverChartData[i].chartPoints[pt].otherValueObj) ?
                      this.serverChartData[i].chartPoints[pt].otherValueObj
                      : this.serverChartData[i].chartPoints[pt].otherValue,
                       OtherValueObj: this.serverChartData[i].chartPoints[pt].otherValueObj,
                        CustomXPoint: this.serverChartData[i].chartPoints[pt].customXPoint };
                if (data.OtherValue == null && this.serverChartData[i].chartPoints[pt].otherValue != null) {
                    data.OtherValue = this.serverChartData[i].chartPoints[pt].otherValue;
                }
                series.data.push(data);

            }
            if ((typeof (isNoAutoColor) === 'undefined' || isNoAutoColor === false)
            && typeof (TotalSentimetColor) !== 'undefined') {
                this.serverChartData[i].color = (this.serverChartData[i].color !== null
                    && this.serverChartData[i].color !== '') ? this.serverChartData[i].color
                    : ChartUtility.SetPredifinedColorasPerSeries(this.serverChartData[i], i);
            }

            let color = this.serverChartData[i].color;
            color = color != null && color !== '' ? color : typeof (ChartUtilityColor) !== 'undefined' ? ChartUtilityColor[i] : undefined;
            series.color = color;
            mainSeries.push(series);
        }
        if (distinct === undefined || distinct === false) {
            xLabels = [...new Set(xLabels)];
            // xLabels = Enumerable.From(xLabels).Distinct().ToArray();
        }

        return { xAxis: xLabels, series: mainSeries };
    }
}
