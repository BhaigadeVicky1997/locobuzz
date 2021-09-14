import { X } from '@angular/cdk/keycodes';
import * as Highcharts from 'highcharts';
import { Options } from 'highcharts';
import * as moment from 'moment';
import { globalChartColor, TotalSentimetColor, UrlParmaters } from './GlobalChartColor';

const perShapeGradient = {
    x1: 1,
    y1: 1,
    x2: 0,
    y2: 0
};
// tslint:disable: variable-name
const color_blogs = '#f57d00';
const color_bookingcom = '#003580';
const color_customercare = '';
const color_discussionforums = '#03C0C6';
const color_ecommercewebsites = '';
const color_expediacom = '#00355F';
const color_facebook = '#3b5998';
const color_googleplus = '#ff3e30';
const color_holidayiq = '#6E587A';
const color_instagram = '#fb3958';
const color_mygov = '';
const color_news = '#E15A00';
const color_reviewwebsites = '';
const color_teambhp = '';
const color_tripadvisor = '#579441';
const color_twitter = '#1DA1F2';
const color_videos = '#DB4437';
const color_Google_play_store = '#f26522';
const color_youtube = '#ff0000';
const color_zomato = '#BC212D';
const color_LinkedIn = '#0077B5';
const color_whatsapp = '#1bd741';
const color_email = '#f57d00';
const color_teamBHP = '#38393A';
const color_AutomotiveIndia = '#8036E2';
const color_complaintwebsites = '#5668E2';
const color_Reviewwebsites = '#5668E2';
const color_EcommerceWebsites = '#E85858';
const color_CustomerComplaints = '#A59A00';
const color_GMB = '#2962FF';
const color_chatBot = '#218F00';
// let pos_neg_neu_colors = Highcharts.getOptions().colors;
// pos_neg_neu_colors = [{
//     linearGradient: perShapeGradient,
//     stops: [
//         [0, '#008800'],
//         [1, '#00EE00']
//     ]
// }, {
//     linearGradient: perShapeGradient,
//     stops: [
//         [0, '#C11b17'],
//         [1, '#EE706C']
//     ]
// }, {
//     linearGradient: perShapeGradient,
//     stops: [
//         [0, '#FFAA00'],
//         [1, '#FFCD64']
//     ]
// },
// {
//     linearGradient: perShapeGradient,
//     stops: [
//         [0, 'rgb(46, 150, 208)'],
//         [1, 'rgb(120, 202, 248)']
//     ]
// },
// {
//     linearGradient: perShapeGradient,
//     stops: [
//         [0, 'rgb(44, 44, 44)'],
//         [1, 'rgb(120, 120, 120)']
//     ]
// },
// ];

const INFormat = new Intl.NumberFormat('en-IN');

export class DashBoardChart {

    static DrawHighChart(highChartContainerObj?, title?, subtitle?, xAxis?, yAxisLabel?, series?,
                         pointWidth?, stackingType?, isTimeBasedd?,
                         ClickFunction?, ChartType?, isxAxisLabelHTML?, ischannel?, height?, isNotTickInterval?,
                         Logarithmic?, polar?, showLegend?, enableDatalabel?, lableformatterfunction?,
                         plotLines?, isshowValueandPercentage?, isNpsEmojiChart?,
                         datalabelsuffix?, isBottomlegendForPieChart?, isShowCenterCountInPie?,
                         showpositivevalues?, isHideYAxis?, xAxisLableFormatterfun?,
                         yAxisLableFormatterfun?, tooltipformatter?, datalableFormatter?, minYaxisvalue?): any

    {
        // Working Example
        let showyaxis = true;
        if (typeof (isHideYAxis) !== 'undefined' && isHideYAxis === true) {
            showyaxis = false;
        }
        if (typeof (showpositivevalues) === 'undefined') {
            showpositivevalues = false;
        }
        if (typeof (Logarithmic) !== 'undefined' && Logarithmic === '') {
            if (typeof (minYaxisvalue) === 'undefined') {
                minYaxisvalue = 0.1;
            }
        }


        let TotalCount = 0;
        let isTimeBased = false;
        if (isTimeBasedd != null && typeof isTimeBasedd !== 'undefined' && isTimeBasedd !== '') {
            isTimeBased = isTimeBasedd;
        }
        if (polar === undefined) {
            polar = false;
        }

        if (isshowValueandPercentage) {

            // TotalCount = Enumerable.From(series[0].data).Sum(x => x.y);
            TotalCount = series[0].data.reduce((a, x) => a + x.y);
        }

        if (typeof (isBottomlegendForPieChart) === 'undefined') {
            isBottomlegendForPieChart = false;
        }


        if (typeof (isShowCenterCountInPie) === 'undefined') {
            isShowCenterCountInPie = false;
        }
        if (typeof (isNpsEmojiChart) === 'undefined') {
            isNpsEmojiChart = false;
        }


        if (typeof (datalabelsuffix) === 'undefined') {
            datalabelsuffix = '';
        }
        let newheight = 0;
        if (height !== undefined) {
            newheight = height;
        } else {
            newheight = 400;
        }
        let TickInterval = 1;
        if ((!ischannel || ischannel === undefined) && !isNotTickInterval) {
            TickInterval = DashBoardChart.GetTickInterval(xAxis.length);
        }

        if (ischannel) {
            // tslint:disable: prefer-for-of
            for (let i = 0; i < series.length; i++) {
                for (let j = 0; j < series[i].data.length; j++) {
                    // series[i].data = Enumerable.From(series[i].data).Where(x => x.name != 'GooglePlus'
                     // && x.name != 'Google Plus').ToArray();
                     series[i].data = series[i].data.filter(x => {
                         return x.name !== 'GooglePlus' && x.name !== 'Google Plus';
                     });
                }
            }

            // xAxis = Enumerable.From(xAxis).Where(x => x != 'GooglePlus' && x != 'Google Plus').ToArray();
            xAxis = xAxis.filter(x => {
                return x.name !== 'GooglePlus' && x.name !== 'Google Plus';
            });
        }
        let hilegends: any = {};
        let layout = 'vertical';
        let align = 'right';
        let verticalAlign = 'middle';
        let TitleYPoint = 0;
        let fontsize = '1rem';
        if (isBottomlegendForPieChart) {
            layout = 'horizontal';
            align = 'center';
            verticalAlign = 'bottom';



        }

        if (typeof (UrlParmaters) !== 'undefined' && isShowCenterCountInPie) {
            TitleYPoint = 130;
            if (UrlParmaters.Mode === 'pdf') {
                TitleYPoint = 180;
            }
        } else if (isShowCenterCountInPie) {
            TitleYPoint = 130;
            fontsize = '15px';
        }

        let lableYpoint = -20;
        if (ChartType === 'pie') {
            // hilegends = {
            //    align: 'right',
            //    verticalAlign: 'top',
            //    layout: 'vertical',
            //    x: 0,
            //    y: 100,
            //    itemStyle: {
            //        color: "#333333"
            //    },
            // };
            lableYpoint = 0;
            if (typeof (UrlParmaters) !== 'undefined') {
                enableDatalabel = true;
            }

            hilegends = {
                layout,
                align,
                verticalAlign,


                adjustChartSize: true,



                useHTML: true,
                // tslint:disable-next-line: typedef
                labelFormatter() {

                    if (isxAxisLabelHTML) {
                        return '<img src="../../images/Reactions/Facebook/' + this.name.toLowerCase() + '.svg" style="width: 25px;padding-bottom:3px; vertical-align: middle" />';
                    } else if (typeof (lableformatterfunction) !== 'undefined') {
                        return lableformatterfunction(this);
                    }
                    else {
                        return this.name;
                    }

                },
                itemStyle: {
                    // tslint:disable: typedef
                    color() {
                        if (window.location.href.includes('CommandCenter')) {
                            return '#c3c3c3';
                            // labelitemcolor = '#e5bd46';
                        } else {
                            return '#333333';
                        }
                    }
                }
            };
        } else {
            hilegends = {
                useHTML: true,
                labelFormatter() {
                    if (typeof (lableformatterfunction) !== 'undefined') {
                        return lableformatterfunction(this);
                    } else {
                        return this.name;
                    }

                },
                itemStyle: {
                    color() {
                        if (window.location.href.includes('CommandCenter')) {
                            return '#c3c3c3';
                            // labelitemcolor = '#e5bd46';
                        } else {
                            return '#333333';
                        }
                    }
                }

            };
        }
        // itemStyle: {
        //    color: "#333333"
        // },
        let labelitemcolor = null;
        if (window.location.href.includes('CommandCenter')) {
            hilegends.itemStyle.color = '#c3c3c3';
            labelitemcolor = '#e5bd46';
        }

        const options: any = {
            chart: {
                type: '' + ChartType, height: newheight,
                polar,
                style: {
                    fontFamily: 'Roboto'
                }
            },
            credits: {
                enabled: false
            },
            legend: hilegends,
            title: {
                text: title,
                y: TitleYPoint,
                x: 0,
                style: {
                    fontSize: fontsize
                }
            },
            subtitle: {
                text: subtitle
            },
            exporting: { enabled: false },
            xAxis: {
                categories: xAxis,
                crosshair: true,
                tickInterval: TickInterval,
                labels: {
                    useHTML: true,
                    formatter() {
                        if (showpositivevalues) {
                            if (this.value < 0) {
                                this.value = -1 * this.value;
                            }
                        }
                        if (isxAxisLabelHTML) {

                            if (isNpsEmojiChart) {
                                if (this.value > 8) {

                                    return '<img src="../../images/feedback/promoters.svg" style="width: 25px;padding-bottom:3px; vertical-align: middle" />';
                                }
                                else if (this.value <= 6) {
                                    return '<img src="../../images/feedback/detractors.svg"  style="width: 25px;padding-bottom:3px; vertical-align: middle" />';
                                }
                                else if (this.value === 7 || this.value === 8) {
                                    return '<img src="../../images/feedback/passives.svg"  style="width: 25px;padding-bottom:3px; vertical-align: middle" />';
                                }
                            } else {
                                return '<img src="../../images/Reactions/Facebook/' + String(this.value).toLowerCase() + '.svg" style="width: 25px; vertical-align: middle" />';
                            }




                        } else if (ischannel) {
                            if (String(this.value) !== 'GooglePlus' && String(this.value) !== 'Google Plus') {
                                return this.FormatLables(this.value);
                            }


                        } else if (typeof (xAxisLableFormatterfun) !== 'undefined') {
                            return xAxisLableFormatterfun(this);
                        }
                        else {

                            return (this.value);
                        }
                    }
                },
            },
            yAxis: {
                visible: showyaxis,
                plotLines,
                allowDecimals: false,
                min: (Logarithmic === undefined || Logarithmic === '') ? null : minYaxisvalue,
                title: {
                    text: yAxisLabel
                },
                type: undefined,
                labels: {
                    useHTML: true,
                    style: {
                        color: labelitemcolor,
                    },
                    formatter() {
                        // if (this.value < 1) {
                        //    return 0;
                        // } else {
                        //    return this.axis.defaultLabelFormatter.call(this);
                        // }
                        if (typeof (yAxisLableFormatterfun) !== 'undefined') {
                            return yAxisLableFormatterfun(this);
                        }
                        return this.axis.defaultLabelFormatter.call(this);
                    }
                }
            },
            tooltip: {
                // valueSuffix: '%'

                formatter() {

                    if (showpositivevalues) {
                        if (this.y < 0) {
                            this.y = -1 * this.y;
                        }
                        if (typeof (this.point.stackTotal) !== 'undefined' && this.point.stackTotal < 0) {
                            this.point.stackTotal = -1 * this.point.stackTotal;
                        }
                    }
                    if (typeof (tooltipformatter) !== 'undefined') {
                        return tooltipformatter(this);
                    }

                    if (this.point.stackTotal === undefined) {

                        if (this.x !== undefined) {

                            if (+this.x >= 0) {
                                let tootltiptext = '';
                                if (this.key !== undefined) {
                                    tootltiptext += '<b>' + this.key + '</b> ';
                                }

                                return tootltiptext + this.series.name + ': ' + (isTimeBased ?
                                    DashBoardChart.SecondstoHumanReadable(this.y) : INFormat.format(this.y)) + '<br/>';
                            }
                            if (typeof (this.point.OtherValue) !== 'undefined'
                            && this.point.OtherValue !== null
                            && typeof (this.point.OtherValue.isTime) !== 'undefined' && this.point.OtherValue.isTime) {
                                return '<b>' + this.x + '</b><br/>' +
                                    this.series.name + ': ' + DashBoardChart.SecondstoHumanReadable(this.y) + '<br/>';

                            } else {
                                return '<b>' + this.x + '</b><br/>' +
                                    this.series.name + ': ' + (isTimeBased ?
                                        DashBoardChart.SecondstoHumanReadable(this.y) : INFormat.format(this.y)) + '<br/>';

                            }
                        } else {
                            let tootltiptext = '';
                            if (this.key !== undefined) {
                                tootltiptext += '<b>' + this.key + '</b> ';
                            }

                            return tootltiptext + this.series.name + ': ' + (isTimeBased ?
                                DashBoardChart.SecondstoHumanReadable(this.y) : INFormat.format(this.y)) + '<br/>';
                        }

                    }
                    else {

                        if (typeof (this.point.OtherValue) !== 'undefined' && this.point.OtherValue !== null
                        && typeof (this.point.OtherValue.isTime) !== 'undefined' && this.point.OtherValue.isTime) {
                            return '<b>' + this.x + '</b><br/>' +
                                this.series.name + ': ' + DashBoardChart.SecondstoHumanReadable(this.y) + '<br/>';

                        } else {
                            return '<b>' + this.x + '</b><br/>' +
                                this.series.name + ': ' + (isTimeBased ? DashBoardChart.SecondstoHumanReadable(this.y) :
                                 INFormat.format(this.y)) + '<br/>' + 'Total: ' + this.point.stackTotal;
                        }

                    }
                    return '';
                },
                borderRadius: 0,
                itemMarginBottom: 3,
                borderWidth: 0,
                backgroundColor: '#000000',
                style: { color: '#FFFFFF', fontSize: '1rem', fontWeight: 'bold' },
                shadow: false,
                shared: typeof (tooltipformatter) !== 'undefined',
                useHTML: typeof (tooltipformatter) !== 'undefined'
            },
            // plotOptions: {
            //    series: {
            //        animation: false,
            //    },
            //    column: {
            //        stacking: stackingType,
            //        point: {
            //            events: {
            //                click: function (data) {
            //                    if (ClickFunction != "undefined") {
            //                        ClickFunction(data, this);
            //                    }
            //                }
            //            }
            //        },
            //    }
            // },
            plotOptions: {
                series: {
                    minPointLength: 1,
                    dataLabels: {
                        enabled: enableDatalabel,
                        verticalAlign: undefined,
                        useHTML: typeof (datalableFormatter) !== 'undefined',
                        y: lableYpoint,
                        style: {
                            color: '#869DAD',
                            fontSize: '9px',
                            fontFamily: 'Roboto',
                            fill: '#869DAD'
                        },
                        formatter() {
                            if (typeof (datalableFormatter) !== 'undefined') {
                                return datalableFormatter(this);
                            } else {
                                if (isshowValueandPercentage) {
                                    return (TotalCount && this.y > 0) ? INFormat.format(this.y)
                                    + '(' + ((this.y / TotalCount) * 100).toFixed(2) + '%)' : 0;

                                }
                                else {
                                    return this.y + ' ' + datalabelsuffix;
                                }
                            }


                        }
                    },
                    animation: false,
                    cursor: 'pointer',
                    point: {
                        events: {
                            click(event) {
                                if (typeof ClickFunction !== 'undefined') {
                                    ClickFunction(event, this);
                                }
                            }
                        }
                    }
                },
                // bubble: {
                //    minSize: 30,
                //    maxSize: 100
                // },
                column: {
                    stacking: stackingType,

                },
                pie: {
                    cursor: 'pointer',
                    dataLabels: {

                        formatter() {

                            return '<div class="datalabel"><b>' + this.point.name + '</b>: ' + this.y + ' </div>';
                        }
                    },
                    showInLegend: showLegend
                }

            },
            series
        };
        return options;
    }

    static GetTickInterval(recordCount): number {

        let TickInterval = 1;
        if (recordCount > 10 && recordCount < 20) {
            TickInterval = 2;
        }
        if (recordCount > 20 && recordCount < 40) {
            TickInterval = 4;
        }
        if (recordCount > 40 && recordCount < 80) {
            TickInterval = 8;
        }

        if (recordCount > 80) {
            TickInterval = Math.ceil(recordCount / 14);
        }
        return TickInterval;
    }
    static SecondstoHumanReadable(seconds): string {
        if (seconds === null || seconds === undefined || seconds === '' || seconds === '0') {
            seconds = 0;
        }
        // if (seconds != null && typeof seconds === 'string' && seconds.indexOf(",") > 0) {
        //    seconds= replaceAll(seconds, ",", "");        //}

        const mobject = moment.duration(seconds, 'seconds');
        const asDays = +mobject.asDays();

        if (asDays > 0) {
            return asDays + ((asDays > 1) ? ' Days, ' : ' Day, ') + mobject.hours()
            + ((mobject.hours() > 1) ? ' hrs, ' : ' hr, ') + mobject.minutes()
            + ((mobject.minutes() > 1) ? ' mins, ' : ' min, ') + mobject.seconds()
            + ((mobject.seconds() > 1) ? ' secs' : ' sec');
        } else if (mobject.hours() > 0) {
            return mobject.hours() + ((mobject.hours() > 1) ? ' hrs, ' : ' hr, ')
            + mobject.minutes() + ((mobject.minutes() > 1) ? ' mins, ' : ' min, ')
            + mobject.seconds() + ((mobject.seconds() > 1) ? ' secs' : ' sec');
            // mobject.hours + " hrs, " + mobject.minutes + " mins, " + mobject.seconds + " sec";
        } else if (mobject.minutes() > 0) {
            return mobject.minutes() + ((mobject.minutes() > 1) ? ' mins, ' : ' min, ')
            + mobject.seconds() + ((mobject.seconds() > 1) ? ' secs' : ' sec');
            // mobject.minutes + " mins, " + mobject.seconds + " sec";
        } else if (mobject.seconds() > 0) {
            if (mobject.seconds() > 1) {
                return mobject.seconds() + ' secs';
            }
            else {
                return mobject.seconds() + ' sec';
            }

        } else {
            return '0 sec';
        }
    }

    static GetChannelColors(num) {
        if (num === 0) {
            return '#56E2CF';
        }
        else if (num === 1) {
            return '#E256AD';
        }
        else if (num === 2) {
            return '#CF56E3';
        }
        else if (num === 3) {
            return '#8A55E1';
        }
        else if (num === 4) {
            return '#5568E1';
        }
        else if (num === 5) {
            return '#57AEE3';
        }
        else if (num === 6) {
            return '#87757D';
        }
        else if (num === 7) {
            return '#FC6600';
        }
        else if (num === 8) {
            return '#D30000';
        }
        else if (num === 9) {
            return '#FC0FC0';
        }
        else if (num === 10) {
            return '#B200ED';
        }
        else if (num === 11) {
            return '#0018F9';
        }
        else if (num === 12) {
            return '#3BB143';
        }
        else if (num === 13) {
            return '#7C4700';
        }
        else if (num === 14) {
            return '#828282';
        }
        else if (num === 15) {
            return '#F8DE7E';
        }
        else if (num === 16) {
            return '#F9A602';
        }
        else if (num === 17) {
            return '#FA8072';
        }
        else if (num === 18) {
            return '#5568E1';
        }
        else if (num === 19) {
            return '#E011F5';
        }
        else if (num === 20) {
            return '#B43757';
        }
        else if (num === 21) {
            return '#0E4C92';
        }
        else if (num === 22) {
            return '#0B6623';
        }
        else if (num === 23) {
            return '#4B3A26';
        }
        else if (num === 24) {
            return '#5568E1';
        }
        else if (num === 25) {
            return '#787276';
        }
        else if (num === 26) {
            return '#FFD300';
        }
        else if (num === 27) {
            return '#DBA520';
        }
        else if (num === 28) {
            return '#FF2400';
        }
        else if (num === 29) {
            return '#FF6FFF';
        }
        else if (num === 30) {
            return '#784B84';
        }
        else if (num === 31) {
            return '#7285A5';
        }
        else if (num === 32) {
            return '#9DC183';
        }
        else if (num === 33) {
            return '#622A0F';
        }
        else if (num === 34) {
            return '#88807B';
        }
        else if (num === 35) {
            return '#FADAFE';
        }
        else if (num === 36) {
            return '#FF7417';
        }
        else if (num === 37) {
            return '#7C0A02';
        }
        else if (num === 38) {
            return '#FDE6FA1';
        }
        else if (num === 39) {
            return '#C64B8C';
        }
        else if (num === 40) {
            return '#95C8D8';
        }
        else if (num === 41) {
            return '#708238';
        }
        else if (num === 42) {
            return '#3A1F04';
        }
        else if (num === 43) {
            return '#D9DDDC';
        }
        else if (num === 44) {
            return '#FCF4A3';
        }
        else if (num === 45) {
            return '#FDA50F';
        }
        else if (num === 46) {
            return '#ED2939';
        }
        else if (num === 47) {
            return '#FF0990';
        }
        else if (num === 48) {
            return '#E4A0F7';
        }
        else if (num === 49) {
            return '#4D516D';
        }
        else if (num === 50) {
            return '#C7EA46';
        }
        else if (num === 51) {
            return '#3B270C';
        }
        else if (num === 52) {
            return '#D6CFC7';
        }
        else if (num === 53) {
            return '#FCD12A';
        }
        else if (num === 54) {
            return '#CC7722';
        }
        else if (num === 55) {
            return '#CDFCFC';
        }
        else if (num === 56) {
            return '#FF66CC';
        }
        else if (num === 57) {
            return '#AF69EE';
        }
        else if (num === 58) {
            return '#598BAF';
        }
        else if (num === 59) {
            return '#3F704D';
        }
        else if (num === 60) {
            return '#362312';
        }
        else if (num === 61) {
            return '#C7C6C1';
        }
        else if (num === 62) {
            return '#EFFD5F';
        }
        else if (num === 63) {
            return '#964000';
        }
        else if (num === 64) {
            return '#C21807';
        }
        else if (num === 65) {
            return '#FBAED2';
        }
        else if (num === 66) {
            return '#B660CD';
        }
        else if (num === 67) {
            return '#89CFEF';
        }
        else if (num === 68) {
            return '#00A86B';
        }
        else if (num === 69) {
            return '#997950';
        }
        else if (num === 70) {
            return '#BDBEB8';
        }
        else if (num === 71) {
            return '#FCE205';
        }
        else if (num === 72) {
            return '#C49102';
        }
        else if (num === 73) {
            return '#B22222';
        }
        else if (num === 74) {
            return '#FF6984';
        }
        else if (num === 75) {
            return '#8F00FF';
        }
        else if (num === 76) {
            return '#000080';
        }
        else if (num === 77) {
            return '#8F9779';
        }
        else if (num === 78) {
            return '#2B1700';
        }
        else if (num === 79) {
            return '#BDB7AB';
        }
        else if (num === 80) {
            return '#FFFDD0';
        }
        else if (num === 81) {
            return '#E4CD05';
        }
        else if (num === 82) {
            return '#D2B55B';
        }
        else if (num === 83) {
            return '#CF9812A';
        }
        else if (num === 84) {
            return '#FFBF00';
        }
        else if (num === 85) {
            return '#813FOB';
        }
        else if (num === 86) {
            return '#800000';
        }
        else if (num === 87) {
            return '#FF2800';
        }
        else if (num === 88) {
            return '#8D021F';
        }
        else if (num === 89) {
            return '#FF00FF';
        }
        else if (num === 90) {
            return '#FB607F';
        }
        else if (num === 91) {
            return '#F81894';
        }
        else if (num === 92) {
            return '#B284BE';
        }
        else if (num === 93) {
            return '#B5338A';
        }
        else if (num === 94) {
            return '#7852A9';
        }
        else if (num === 95) {
            return '#4682B4';
        }
        else if (num === 96) {
            return '#6693F5';
        }
        else if (num === 97) {
            return '#1134A6';
        }
        else if (num === 98) {
            return '#4F7942';
        }
        else if (num === 99) {
            return '#98FB98';
        }
        else if (num === 100) {
            return '#50C878';
        }
        else if (num === 101) {
            return '#492000';
        }
        else if (num === 102) {
            return '#48260D';
        }
        else if (num === 103) {
            return '#795C32';
        }
        else if (num === 104) {
            return '#999DAO';
        }
        else if (num === 105) {
            return '#B9BBB6';
        }
        else if (num === 106) {
            return '#363636';
        }
        else if (num === 107) {
            return '#FFE584';
        }
        else if (num === 108) {
            return '#FEE12B';
        }
        else if (num === 109) {
            return '#EEDC82';
        }
        else if (num === 110) {
            return '#FD6A02';
        }
        else if (num === 111) {
            return '#EF820D';
        }
        else if (num === 112) {
            return '#8B4000';
        }
        else if (num === 113) {
            return '#A45A52';
        }
        else if (num === 114) {
            return '#CA3433';
        }
        else if (num === 115) {
            return '#B80F0A';
        }
        else if (num === 116) {
            return '#F64A8A';
        }
        else if (num === 117) {
            return '#F19CBB';
        }
        else if (num === 118) {
            return '#EC5578';
        }
        else if (num === 119) {
            return '#6F2DA8';
        }
        else if (num === 120) {
            return '#D373FF';
        }
        else if (num === 121) {
            return '#81007F';
        }
        else if (num === 122) {
            return '#57A0D2';
        }
        else if (num === 123) {
            return '#008ECC';
        }
        else if (num === 124) {
            return '#131E3A';
        }
        else if (num === 125) {
            return '#29AB87';
        }
        else if (num === 126) {
            return '#01796F';
        }
        else if (num === 127) {
            return '#4CBB17';
        }
        else if (num === 128) {
            return '#FC2C06';
        }
        else if (num === 129) {
            return '#402F1D';
        }
        else if (num === 130) {
            return '#7E481C';
        }
        else if (num === 131) {
            return '#777B7E';
        }
        else if (num === 132) {
            return '#97978F';
        }
        else if (num === 133) {
            return '#F44C4A';
        }
        else if (num === 134) {
            return '#F8E473';
        }
        else if (num === 135) {
            return '#D5B85A';
        }
        else if (num === 136) {
            return '#CEB180';
        }
        else if (num === 137) {
            return '#FEDC56';
        }
        else if (num === 138) {
            return '#F9E29C';
        }
        else if (num === 139) {
            return '#E3B778';
        }
        else if (num === 140) {
            return '#EB9605';
        }
        else if (num === 141) {
            return '#EF7215';
        }
        else if (num === 142) {
            return '#B1560F';
        }
        else if (num === 143) {
            return '#B3672B';
        }
        else if (num === 144) {
            return '#883000';
        }
        else if (num === 145) {
            return '#793802';
        }
        else if (num === 146) {
            return '#D21F3C';
        }
        else if (num === 147) {
            return '#FF0800';
        }
        else if (num === 148) {
            return '#BF0A30';
        }
        else if (num === 149) {
            return '#960019';
        }
        else if (num === 150) {
            return '#5E1914';
        }
        else if (num === 151) {
            return '#420D09';
        }
        else if (num === 152) {
            return '#DE3163';
        }
        else if (num === 153) {
            return '#FFA6C9';
        }
        else if (num === 154) {
            return '#F987C5';
        }
        else if (num === 155) {
            return '#222021';
        }
        else if (num === 156) {
            return '#FDB9C8';
        }
        else if (num === 157) {
            return '#FCA3B7';
        }
        else if (num === 158) {
            return '#9966CB';
        }
        else if (num === 159) {
            return '#702963';
        }
        else if (num === 160) {
            return '#B473DE';
        }
        else if (num === 161) {
            return '#D7BFDC';
        }
        else if (num === 162) {
            return '#8D4585';
        }
        else if (num === 163) {
            return '#311432';
        }
        else if (num === 164) {
            return '#5097A4';
        }
        else if (num === 165) {
            return '#73C2FB';
        }
        else if (num === 166) {
            return '#0F52BA';
        }
        else if (num === 167) {
            return '#0080FE';
        }
        else if (num === 168) {
            return '#003151';
        }
        else if (num === 169) {
            return '#1C2951';
        }
        else if (num === 170) {
            return '#A9BA9D';
        }
        else if (num === 171) {
            return '#8A9A5B';
        }
        else if (num === 172) {
            return '#D0F0C0';
        }
        else if (num === 173) {
            return '#4B5320';
        }
        else if (num === 174) {
            return '#043927';
        }
        else if (num === 175) {
            return '#2E8B57';
        }
        else if (num === 176) {
            return '#613613';
        }
        else if (num === 177) {
            return '#43270F';
        }
        else if (num === 178) {
            return '#351E10';
        }
        else if (num === 179) {
            return '#4B382A';
        }
        else if (num === 180) {
            return '#4B3619';
        }
        else if (num === 181) {
            return '#7F461B';
        }
        else if (num === 182) {
            return '#87757D';
        }
        else if (num === 183) {
            return '#48494B';
        }
        else if (num === 184) {
            return '#818380';
        }
        else if (num === 185) {
            return '#808588';
        }
        else if (num === 186) {
            return '#3E424B';
        }
        else if (num === 187) {
            return '#FFF200';
        }
        else {
            // return new Highcharts.Color(colors[i]).brighten(0.066).get();
        }

    }

    FormatLables(Name) {
        switch (Name) {
            case 'Facebook':
                return '<br/><a class="fa fa-lg fa-facebook-square txt-color-blueLight"  title="' + Name + '"></a>';
                break;
            case 'Four Square Checkins':
                return '<br/><a class="fa fa-lg fa-foursquare txt-color-blueLight"  title="' + Name + '"></a>';
                break;
            case 'Booking':
                return '<br/><a class="fa fa-lg fa-bold txt-color-blueLight"  title="' + Name + '"></a>';
                break;
            case 'Booking.com':
                return '<br/><a class="fa fa-lg fa-bold txt-color-blueLight"  title="' + Name + '"></a>';
                break;
            case 'TripAdvisor':
                return '<br/><a class="fa fa-lg fa-github-alt txt-color-blueLight"  title="' + Name + '"></a>';
                break;
            case 'News':
                return '<br/><a class="fa fa-lg fa-credit-card txt-color-blueLight"  title="' + Name + '"></a>';
                break;
            case 'Expedia':
                return '<br/><a class="fa fa-lg fa-plane txt-color-blueLight"  title="' + Name + '"></a>';
                break;
            case 'Expedia.com':
                return '<br/><a class="fa fa-lg fa-plane txt-color-blueLight"  title="' + Name + '"></a>';
                break;
            case 'Blogs':
                return '<br/><a class="fa fa-lg fa-rss txt-color-blueLight"  title="' + Name + '"></a>';
                break;
            case 'Twitter':
                return '<br/><a class="fa fa-lg fa-twitter txt-color-blueLight" title="' + Name + '"></a>';
                break;
            case 'WhatsApp':
                return '<br/><a class="fa fa-lg fa-whatsapp txt-color-blueLight" title="' + Name + '"></a>';
                break;
            case 'TeamBHP':
                return '<br/><a class="fa fa-lg fa-car txt-color-blueLight" title="' + Name + '"></a>';
                break;
            case 'AutomotiveIndia':
                return '<br/><a class="fa fa-lg fa-taxi txt-color-blueLight" title="' + Name + '"></a>';
                break;
            case 'Complaint Websites':
                return '<br/><a class="fa fa-lg fa-ticket txt-color-blueLight" title="' + Name + '"></a>';
                break;
            case 'Youtube': case 'YouTube':
                return '<br/><a class="fa fa-lg fa-youtube-play txt-color-blueLight" title="' + Name + '"></a>';
                break;
            case 'Discussion Forums':
                return '<br/><a class="fa fa-lg fa-comments txt-color-blueLight" title="' + Name + '"></a>';
                break;
            case 'DiscussionForums':
                return '<br/><a class="fa fa-lg fa-comments txt-color-blueLight" title="' + Name + '"></a>';
                break;
            case 'Review Websites':
                return '<br/><a class="fa fa-lg fa-comment txt-color-blueLight" title="' + Name + '"></a>';
                break;
            case 'Instagram':
                return '<br/><a class="fa fa-lg fa-instagram txt-color-blueLight" title="' + Name + '"></a>';
                break;
            case 'E-Commerce Websites':
                return '<br/><a class="fa fa-lg fa-shopping-cart txt-color-blueLight" title="' + Name + '"></a>';
                break;
            case 'Customer Complaints':
                return '<br/><a class="fa fa-lg fa-group txt-color-blueLight" title="' + Name + '"></a>';
                break;
            // case 'GooglePlus': case 'Google Plus':
            //    return '<br/><a class="fa fa-lg fa-google-plus txt-color-blueLight" title="' + Name + '"></a>';
            //    break;
            case 'HolidayIQ':
                return '<br/><a class="fa fa-lg fa-h-square txt-color-blueLight" title="' + Name + '"></a>';
                break;
            case 'Zomato':
                return '<br/><a class="fa fa-lg fa-cutlery txt-color-blueLight" title="' + Name + '"></a>';
                break;
            case 'Videos':
                return '<br/><a class="fa fa-lg fa fa-video-camera txt-color-blueLight" title="' + Name + '"></a>';
                break;
            case 'GooglePlayStore':
                return '<br/><img src="assets/images/channelicons/PlayStoreNormal.png" width="15" height="15" title="' + Name + '" />';
                break;
            case 'Google Play Store':
                return '<br/><img src="assets/images/channelicons/PlayStoreNormal.png" width="15" height="15" title="' + Name + '" />';
                break;
            case 'LinkedIn':
                return '<br/><a class="fa fa-lg fa fa-linkedin txt-color-blueLight" title="' + Name + '"></a>';
                break;
            case 'Email':
                return '<br/><a class="fa fa-lg fa fa-envelope txt-color-blueLight" title="' + Name + '"></a>';
                break;
            case 'Google My Business Reviews': case 'GMB Reviews':
                // tslint:disable-next-line: max-line-length
                return '<br/><img src="assets/images/channelicons/GogleMyBusinessNormal.png" width="15" height="15" title="' + Name + '" />';
                break;
            case 'ElectronicMedia':
                return '<br/><img src="assets/images/channelicons/Electronic_Media.png" width="15" height="15" title="' + Name + '" />';
                break;
            case 'GoogleMyReview':
                // tslint:disable-next-line: max-line-length
                return '<br/><img src="assets/images/channelicons/GoogleMyBusinessReviewsBlackWhite.svg" width="15" height="15" title="' + Name + '" />';
                break;
            case 'ChatBot':
                return '<br/><img src="assets/images/channelicons/WebsiteChatBot.svg" width="15" height="15" title="' + Name + '" />';
                break;
            case 'WebsiteChatBot':
                return '<br/><img src="assets/images/channelicons/WebsiteChatBot.svg" width="15" height="15" title="' + Name + '" />';
                break;
            default:
                return Name;
                break;
        }
    }
}
