import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store'
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

  constructor(private store: Store<any>) { }

  iconMapping : any = {
    village : {
      0 : "home1.svg",
      1 : "home2.svg",
      2 : "home3.svg"
    },
    townhome : {
      0 : "townhome2.svg",
      1 : "townhome3.svg",
      2 : "townhome4.svg"
    }
  }

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
      this.calculateSpendings()
    });


  }

  getIcon(index) : string {
    return this.iconMapping[this.currentProperty][index];
  }

  calculateSpendings() {
    let totalSalary = +this.spendingsData.sellPeriod * +this.spendingsData.salaryEmployee * +this.spendingsData.noEmployee;
    this.netProfit = this.profitData.totalProfit - this.spendingsData.costAdvtOnePer - totalSalary;
  }

}
