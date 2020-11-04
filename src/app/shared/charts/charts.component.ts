import { Component, ViewChild, OnInit, OnChanges, OnDestroy, SimpleChanges, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { ChartComponent, ApexNonAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, ApexLegend, ApexResponsive } from 'ng-apexcharts';

import * as allChart from './data/chart-setting';
import * as villageChart from './data/village-chart';
import * as townhomeChart from './data/townhome-chart';
import * as condoChart from './data/condo-chart';
import * as hotelChart from './data/hotel-chart';
import * as communityMallChart from './data/communityMall-chart';
import * as resortChart from './data/resort-chart';
import * as fromCore from '../../core/reducers';

const allCharts = allChart.chartsType;

const appCharts = {
  village: villageChart.chartsType,
  townhome: townhomeChart.chartsType,
  condo: condoChart.chartsType,
  hotel: hotelChart.chartsType,
  resort: resortChart.chartsType,
  communityMall: communityMallChart.chartsType
};


export interface ChartOptions {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  colors: string[];
  labels: string[];
  responsive: ApexResponsive[];
}

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})

export class ChartsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() chartType: string;
  @Input() chartData: any;
  @Input() owner: string;

  series: ApexNonAxisChartSeries;
  @ViewChild('chart', { static: false }) chart: ChartComponent;

  public chartOptions: Partial<ChartOptions>;
  private currentProperty: string;

  constructor(private store: Store<any>) {
    this.store.select(fromCore.getPage)
      .subscribe(page => {
        this.currentProperty = page.page;
      });
  }

  initializeChart(chartType: string) {
    const chartsModel = appCharts[this.currentProperty][chartType];
  }

  ngOnInit() {
    // this.chartMapping('init');
    // console.log('product chart init',this.chartData, this.chartType)
    this.chartMapper(this.chartType, this.owner);
  }

  ngOnChanges(changes: SimpleChanges) {
    // this.chartMapping('onChange');
    // console.log('product chart onChange',this.chartData, this.chartType)
    this.chartMapper(this.chartType, this.owner);

  }


  getCharts(): any {
    const myChart = allCharts.filter((data) => data.name === this.chartType)[0];
    return myChart.chart;
  }

  chartMapper(chartType: string, owner?: string) {
    let word = chartType;
    if (owner === 'competitor') {
      word += 'Com';
    }
    const chartDefault = JSON.parse(JSON.stringify(appCharts[this.currentProperty][word]));
    switch (chartType) {
      case 'area':
        if (this.chart !== undefined) {
          chartDefault.series =  this.areaChartMapping(this.currentProperty);
          this.chart.updateOptions(chartDefault);
        } else {
          chartDefault.series =  this.areaChartMapping(this.currentProperty);
          this.chartOptions = chartDefault;
          // console.log("using default chart.")
        }
        break;
      case 'product':
        if (this.chart !== undefined) {
          chartDefault.series = this.productChartMapping(this.currentProperty);
          // this.series = product_series;
          this.chart.updateOptions(chartDefault);
        } else {
          chartDefault.series = this.productChartMapping(this.currentProperty);
          this.chartOptions = chartDefault;
        }

        break;
      case 'spendings':
        // let isDefault_2 = spendings_series.some((data) => { return +data === 0 });
        // if (!isDefault_2) {
          if (this.chart !== undefined) {
            chartDefault.series = this.spendingChartMapping(this.currentProperty);
            // this.series = spendings_series;
            this.chart.updateOptions(chartDefault);
          } else {
            chartDefault.series = this.spendingChartMapping(this.currentProperty);
            this.chartOptions = chartDefault;
          }
        break;
      default:
        console.log('Chart not found : ' + this.chartType);
        break;
    }

  }

  areaChartMapping(currentProperty: string): Array<number> {
    let series = [];
    Object.keys(this.chartData.percent).forEach(element => {
      if (typeof this.chartData.percent[element] !== 'number') {
        this.chartData.percent[element] = parseFloat(this.chartData.percent[element].toString().replace(/,/g, ''));
      }
    });
    if (['village', 'townhome'].includes(currentProperty)) {
      try {
        // tslint:disable-next-line: max-line-length
        series = [+this.chartData.percent.coverArea.toFixed(2), +this.chartData.percent.sellArea.toFixed(2), +this.chartData.percent.roadSize.toFixed(2), +this.chartData.percent.greenArea.toFixed(2), +this.chartData.percent.centerArea.toFixed(2)];
      } catch (e) {
        series = [0, 0, 0, 0, 0];
      }
    } else if (currentProperty === 'hotel') {
      // tslint:disable-next-line: max-line-length
      series = [+this.chartData.percent.coverArea,+this.chartData.percent.room, +this.chartData.percent.resort, +this.chartData.percent.central, +this.chartData.percent.corridor, +this.chartData.percent.parking, +this.chartData.percent.outdoor];
    } else if (currentProperty === 'communityMall') {
      // condo commall
      series = [+this.chartData.percent.coverArea,+this.chartData.percent.room, +this.chartData.percent.central, +this.chartData.percent.parking, +this.chartData.percent.outdoor];
    } else if (currentProperty === 'condo') {
      series = [+this.chartData.percent.coverArea,+this.chartData.percent.room, +this.chartData.percent.resort, +this.chartData.percent.central, +this.chartData.percent.parking, +this.chartData.percent.outdoor];
    } else {
      series = [+this.chartData.percent.coverArea,+this.chartData.percent.room, +this.chartData.percent.central,
        +this.chartData.percent.corridor, +this.chartData.percent.parking,
        +this.chartData.percent.outdoor];
    }
    return series;
  }

  productChartMapping(currentProperty: string): Array<number> {
    let series = [];
    if (['village', 'townhome'].includes(currentProperty)) {
      series = [this.chartData[0].quantity, this.chartData[1].quantity, this.chartData[2].quantity];
      const empty = series.every((data) => +data === 0);
      if (empty) {
        series = [0, 0, 0];
      }
    } else if (this.currentProperty === 'communityMall') {
      series = [this.chartData.availableArea, this.chartData.usedArea,  this.chartData.totalRoomArea, 0, this.chartData.roomCorridor, this.chartData.totalParkingArea, this.chartData.totalOutdoorArea];
      const empty = series.every((data) => +data === 0);
      if (empty) {
        series = [0, 0, 0];
      }
    } else {
      try {
        series = [this.chartData.totalRoomArea, this.chartData.totalResortArea ? this.chartData.totalResortArea : 0 , this.chartData.totalCentralArea,
                this.chartData.totalCorridor,  this.chartData.totalCentralArea, this.chartData.totalOutdoorArea];
        const empty = series.every((data) => +data === 0);
        if (empty) {
          series = [1, 0, 0, 0, 0, 0];
        }
      } catch (e) {
        series = [1, 0, 0, 0, 0, 0];
      }
    }
    return series;
  }

  spendingChartMapping(currentProperty: string): Array<number> {
    let series = [];
    if (['village', 'townhome'].includes(currentProperty)) {
      if (Object.entries(this.chartData).length === 0 && this.chartData.constructor === Object) {
        series = [0, 0 , 0];
      } else {
        const publicUtility = this.chartData.costTapWater + this.chartData.costWaterTreatment + this.chartData.costElectricity
        + this.chartData.costFenceAndGuardHouse;
        const greenArea = this.chartData.costDevelopGreenArea;
        const roadDevelopment = this.chartData.costDevelopRoad + this.chartData.costRoadCover;
        series = [publicUtility, roadDevelopment, greenArea];
      }
    } else {
      series = [ this.chartData.costSpecielEquipmentAndPreOpening, this.chartData.totalCostPerMonth, this.chartData.costConstruction ];
    }
    return series;
  }

  ngOnDestroy() {
    // this.chart.destroy();
  }

}
