const TagCloudColorEnum = {
    SolidColor: 0,
    SentimentColor: 1,
    MultiColor: 2
};
const INFormat = new Intl.NumberFormat('en-IN');
const TagCloudColor = TagCloudColorEnum.SolidColor;

export class Charts {
    static DrawHighchartPieChart(divId?, title?, subtitle?, xAxis?, yAxisLabel?,
                                 series?, EnableHover?, valueSuffix?, animate?, ShowLegend?, showExportingOption?,
                                 ClickFunction?, fontcolor?, legendproperties?, ShowDatalabels?, legendItemClick?): any {

         const legendDetails = {
            // layout: 'vertical',
            // align: 'right',
            // verticalAlign: 'middle',
            itemStyle: {
                color: '#bbb',
                fontWeight: 'normal',
            },
            itemHoverStyle: {
                color: '#bbb'
            },
        };
         if (fontcolor) {
            fontcolor: '#000';
        } else {
            fontcolor = fontcolor;
        }
         const options: any = {
            chart: {
                type: 'pie', renderTo: divId
            },
            exporting: {
                enabled: showExportingOption
            },
            title: {
                text: title
            },
            subtitle: {
                text: subtitle
            },
            // xAxis: {
            //     categories: xAxis
            // },
            // yAxis: {
            //     title: {
            //         text: yAxisLabel
            //     }

            // },
            tooltip: {
                pointFormat: '{point.y}',
                // valueSuffix: (" " + valueSuffix)
            },
            credits: {
                enabled: false
            },
            legend: legendDetails,
            series,
            plotOptions: {
                pie: {
                    // pointStart: 1940,
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: EnableHover
                            }
                        }
                    },
                    dataLabels: {
                        enabled: ((ShowDatalabels !== undefined) ? ShowDatalabels : true)
                    },
                    showInLegend: ((ShowLegend !== undefined) ? ShowLegend : true)
                },
                series: {
                    cursor: 'pointer',
                    animation: animate,
                    point: {
                        events: {
                            // tslint:disable-next-line: typedef
                            click(event) {
                                if (ClickFunction !== 'undefined' && ClickFunction != null) {
                                    ClickFunction(event, this);
                                }
                            },
                            // tslint:disable-next-line: typedef
                            legendItemClick() {
                                return legendItemClick;
                            }
                        }
                    }
                }
            }
        };

         return options;
    }

}
