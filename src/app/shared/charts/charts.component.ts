import { Component, ViewChild, OnInit, OnChanges, OnDestroy, SimpleChanges, Input } from '@angular/core';
import { Store } from '@ngrx/store'

import { ChartComponent, ApexNonAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, ApexLegend, ApexResponsive } from "ng-apexcharts";

import * as allChart from './data/chart-setting';
import * as villageChart from './data/village-chart';
import * as townhomeChart from './data/townhome-chart';
import * as condoChart from './data/condo-chart';
import * as hotelChart from './data/hotel-chart';
import * as communityMallChart from './data/communityMall-chart';
import * as fromCore from '../../core/reducers';

const allCharts = allChart.chartsType;

const appCharts = {
  village: villageChart.chartsType,
  townhome: townhomeChart.chartsType,
  condo: hotelChart.chartsType,
  hotel: hotelChart.chartsType,
  communityMall: communityMallChart.chartsType
  // condo: condoChart.chartsType,
  // hotel: hotelChart.chartsType,
}


export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  colors: string[];
  labels: string[];
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})

export class ChartsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() chartType: string;
  @Input() chartData: any;

  series: ApexNonAxisChartSeries;
  @ViewChild("chart", { static: false }) chart: ChartComponent;

  public chartOptions: Partial<ChartOptions>;
  private currentProperty: string;

  constructor(private store: Store<any>) {
    this.store.select(fromCore.getPage)
      .subscribe(page => {
        this.currentProperty = page.page;
      });
  }

  initializeChart(chartType: string) {
    let chartsModel = appCharts[this.currentProperty][chartType];
  }

  ngOnInit() {
    // this.chartMapping('init');
    // console.log('product chart init',this.chartData, this.chartType)
    this.chartMapper(this.chartType);
  }

  ngOnChanges(changes: SimpleChanges) {
    // this.chartMapping('onChange');
    // console.log('product chart onChange',this.chartData, this.chartType)
    this.chartMapper(this.chartType);

  }


  getCharts(): any {
    let myChart = allCharts.filter((data) => { return data.name === this.chartType })[0];
    return myChart.chart;
  }

  chartMapper(chartType: string) {
    let chartDefault = JSON.parse(JSON.stringify(appCharts[this.currentProperty][chartType]));
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
        let product_series = this.productChartMapping(this.currentProperty);
        if (this.chart !== undefined) {
          this.series = product_series;
          this.chart.updateSeries(this.series);
        }
        else {
          chartDefault.series = product_series;
          this.chartOptions = chartDefault;
        }

        break;
      case 'spendings':
        let spendings_series = this.spendingChartMapping(this.currentProperty);
        let isDefault_2 = spendings_series.some((data) => { return +data === 0 });
        if (!isDefault_2) {
          if (this.chart !== undefined) {
            this.series = spendings_series;
            this.chart.updateSeries(this.series);
          } else {
            chartDefault.series = spendings_series;
            this.chartOptions = chartDefault;
          }
        } else {
          this.chartOptions = chartDefault;
        }
        break;
      default:
        console.log("Chart not found : " + this.chartType);
        break;
    }

  }

  areaChartMapping(currentProperty:string) :Array<number>{
    let series = [];
    if(['village'].includes(currentProperty)) {
      series = [+this.chartData.percent.sellArea, +this.chartData.percent.roadSize, +this.chartData.percent.greenArea, +this.chartData.percent.centerArea];
    } else if (['townhome'].includes(currentProperty)) {
      series = [+this.chartData.percent.sellArea, +this.chartData.percent.roadSize, +this.chartData.percent.greenArea];
    } else {
      // condo hotel commall
            series = [+this.chartData.percent.room, +this.chartData.percent.central,
         +this.chartData.percent.corridor, +this.chartData.percent.parking,
         +this.chartData.percent.outdoor];
    }
    return series;
  }

  productChartMapping(currentProperty:string) : Array<number> {
    let series = [];
    if(['village', 'townhome'].includes(currentProperty)) {
      series = [this.chartData[0].quantity, this.chartData[1].quantity, this.chartData[2].quantity];
      let empty = series.every((data) => { return +data === 0 });
      if(empty) {
        series = [1,0,0]
      }
    } else {
      // condo

      series = [this.chartData.totalRoomArea, this.chartData.totalCentralArea,
      this.chartData.totalCorridor,  this.chartData.totalCentralArea, this.chartData.totalOutdoorArea];
      let empty = series.every((data) => { return +data === 0 });
      if(empty) {
        series = [1,0,0,0,0]
      }
    }
    return series;
  }

  spendingChartMapping(currentProperty:string) : Array<number> {
    let series = [];
    if(['village', 'townhome'].includes(currentProperty)) {
      if(Object.entries(this.chartData).length === 0 && this.chartData.constructor === Object) {
        series = [0, 0 , 0];
      } else{
        let publicUtility = this.chartData.costTapWater + this.chartData.costWaterTreatment + this.chartData.costElectricity
        + this.chartData.costFenceAndGuardHouse;
        let greenArea = this.chartData.costDevelopGreenArea;
        let roadDevelopment = this.chartData.costDevelopRoad + this.chartData.costRoadCover;
        series = [publicUtility, roadDevelopment, greenArea]
      }
    } else {
      series = [ this.chartData.totalCostPerMonthAndPreOpening, this.chartData.totalCostPerMonth, this.chartData.costConstruction ];
    }
    return series;
  }

  chartMapping(event: string) {
    let chartDefault = this.getCharts();
    switch (this.chartType) {
      case 'area':
        chartDefault.series = [this.chartData.sellArea, this.chartData.roadSize, this.chartData.greenArea];
        this.chartOptions = chartDefault;

        break;
      case 'product':
        let product_series = [this.chartData[0].quantity, this.chartData[1].quantity, this.chartData[2].quantity];
        let isDefault = product_series.some((data) => { return +data === 0 });
        if (!isDefault) {
          if (this.chart !== undefined) {
            this.series = [this.chartData[0].quantity, this.chartData[1].quantity, this.chartData[2].quantity];
            this.chart.updateSeries(this.series);
          } else {
            chartDefault.series = [this.chartData[0].quantity, this.chartData[1].quantity, this.chartData[2].quantity];
            this.chartOptions = chartDefault;
          }
        } else {
          this.chartOptions = chartDefault;
        }
        break;
      case 'spendings':
        let publicUtility = this.chartData.costTapWater + this.chartData.costWaterTreatment + this.chartData.costElectricity
          + this.chartData.costFenceAndGuardHouse;
        let greenArea = this.chartData.costDevelopGreenArea;
        let roadDevelopment = this.chartData.costDevelopRoad + this.chartData.costRoadCover;
        let spendings_series = [publicUtility, roadDevelopment, greenArea]
        let isDefault_2 = spendings_series.some((data) => { return +data === 0 });
        if (!isDefault_2) {
          if (this.chart !== undefined) {
            this.series = [publicUtility, roadDevelopment, greenArea];
            this.chart.updateSeries(this.series);
          } else {
            chartDefault.series = [publicUtility, roadDevelopment, greenArea];
            this.chartOptions = chartDefault;
          }
        } else {
          this.chartOptions = chartDefault;
        }
        break;
      default:
        console.log("Chart not found : " + this.chartType);
        break;
    }

  }

  ngOnDestroy() {
    // this.chart.destroy();
  }

}
