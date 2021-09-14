import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  highcharts: typeof Highcharts = Highcharts;
  @Input() highchartOptions: {} = {};
  @Input() highchartStyles?: string;
  @Input() updateFlag?: boolean = true;
  @Input() centerAlign?: boolean;
  constructor() { }

  ngOnInit(): void {
    console.log('highChartOPtions', JSON.stringify(this.highchartOptions));
    this.centerAlign = this.centerAlign === undefined ? false : this.centerAlign;
    this.highchartStyles = this.highchartStyles !== undefined ? 'width:40%;min-height:400px' + this.highchartStyles : 'width:40%';
  }

  logChartInstance(chart: Highcharts.Chart): void {
    console.log('Chart instance: ', chart);
  }
}
