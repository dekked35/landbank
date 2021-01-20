import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromCore from '../../core/reducers';

@Component({
  selector: 'app-profit-table',
  templateUrl: './profit-table.component.html',
  styleUrls: ['./profit-table.component.css']
})
export class ProfitTableComponent implements OnInit {

  is_loading: boolean;
  profitData: any;
  spendingsData: any;
  private currentProperty: string;
  totalSarary: number;
  netProfit: number;
  averageProfit: number;
  changeColor: any;
  sumHouse = 0;

  constructor(private store: Store<any>) { }

  iconMapping: any = {
    village : {
      0 : 'home1.svg',
      1 : 'home2.svg',
      2 : 'home3.svg'
    },
    townhome : {
      0 : 'townhome2.svg',
      1 : 'townhome3.svg',
      2 : 'townhome4.svg'
    },
    resort : {
      0 : 'room/Pool Villa.svg',
      1 : 'room/Family Room.svg',
      2 : 'room/Jacuzzi Villa.svg',
    }
  };

  ngOnInit() {
    this.store.select(fromCore.getPage)
    .subscribe(page => {
      this.currentProperty = page.page;
    });

    this.store.select(fromCore.getSpendings)
    .subscribe((spendings) => {
      this.spendingsData = spendings.payload;
      this.is_loading = spendings.isLoading;
    });

    this.store.select(fromCore.getProfit)
    .subscribe(profit => {
      this.is_loading = profit.isLoading;
      this.profitData =  profit.payload;
      this.calculateSpendings();
    });


  }

  getIcon(index): string {
    return this.iconMapping[this.currentProperty][index];
  }

  calculateSpendings() {
    this.sumHouse = this.profitData.profitPerItems.reduce( (acc, value) => {
      return acc + value.noItem;
    }, 0);
    const totalSalary = +this.spendingsData.sellPeriod * +this.spendingsData.salaryEmployee * +this.spendingsData.noEmployee;
    this.netProfit = this.profitData.totalProfit - this.spendingsData.costAdvtOnePer - totalSalary;
    this.averageProfit = this.profitData.averageProfitPerHouse ? this.profitData.averageProfitPerHouse : this.profitData.averageProfit;
    this.changeColor = this.profitData.totalProfit > this.profitData.totalProfitCompetitor ? true : false;
  }

}
