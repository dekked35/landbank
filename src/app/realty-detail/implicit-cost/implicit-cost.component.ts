import { Component, OnInit } from '@angular/core';
import { BasicTypeService } from '../../core/services/basic-type.service';
import { Store } from '@ngrx/store';
import * as pageAction from '../../core/actions/page.actions';
import * as areaAction from '../../core/actions/area.actions';
import * as productAction from '../../core/actions/product.actions';
import * as spendingsAction from '../../core/actions/spendings.actions';
import * as implicitsCostAction from '../../core/actions/implicit-costs.actions';
import * as profitAction from '../../core/actions/profit.actions';
import * as rateReturnAction from '../../core/actions/rate-return.actions';
import { RequestManagerService } from '../../core/services/request-manager.service';

import * as fromCore from '../../core/reducers';

@Component({
  selector: 'app-implicit-cost',
  templateUrl: './implicit-cost.component.html',
  styleUrls: ['./implicit-cost.component.css']
})
export class ImplicitCostComponent implements OnInit {

  currentProperty: string;
  areaData:any;
  productData:any;
  spendingsData:any;
  profitData: any;
  implicitsCostData:any;
  is_loading:boolean;
  is_loading_implicitCost:boolean;
  is_loading_profit: boolean;
  is_loading_rateReturn: boolean;
  occupancy : number = 80;
  loan : number = 80;
  cash : number = 20;
  rateReturnData:any;
  constructor(private store: Store<any>,
    private requestManagerService: RequestManagerService,
    private basicTypeService:BasicTypeService) {
    this.store.select(fromCore.getPage)
    .subscribe(page => {
      this.currentProperty = page.page;
    });
    this.store.select(fromCore.getArea)
    .subscribe(area => {
      this.areaData = area.payload;
    });
  }

  ngOnInit() {
    this.store.select(fromCore.getProduct)
    .subscribe(product => {
      this.productData = product.payload;
    });

    this.store.select(fromCore.getSpendings)
    .subscribe(spendings => {
      this.spendingsData =  this.parseObject(spendings.payload);
      this.is_loading = spendings.isLoading;
    });

    this.store.select(fromCore.getImplicitCosts)
    .subscribe(implicitCosts => {
      this.implicitsCostData =  this.parseObject(implicitCosts.payload);
      this.is_loading_implicitCost = implicitCosts.isLoading;
    });

    this.store.select(fromCore.getProfit)
    .subscribe(profit => {
      this.profitData =  profit.payload;
      this.is_loading_profit= profit.isLoading;
    });

    this.store.select(fromCore.getRateReturn)
    .subscribe(rateReturn => {
      this.rateReturnData = this.parseObject(rateReturn.payload);
      this.is_loading_rateReturn= rateReturn.isLoading;
    });
  }

  handleLoanChange($event) {
    this.rateReturnData.privateCash =  100 - this.rateReturnData.bankLoad;
    this.rateReturnData.ratioPrivateFund =  this.rateReturnData.privateCash;
    this.rateReturnData.ratioBorrowFund =  this.rateReturnData.bankLoad;

  }

  inputOnChange($event){
    this.convertValue()
    this.getImplicitCostService();
  }

  onSlideEnd($event, field){
    if(field === 'occupancy') {
      this.implicitsCostData.occupancy = $event.value;
    } else {
      this.rateReturnData.privateCash =  100 - this.rateReturnData.bankLoad;
      this.rateReturnData.ratioPrivateFund =  this.rateReturnData.privateCash;
      this.rateReturnData.ratioBorrowFund =  this.rateReturnData.bankLoad;
    }
    this.convertValue()
    this.getImplicitCostService();
  }

    // TODO : Move to request manager component
  getImplicitCostService(){
    let payload = {
      "propertyType": this.currentProperty,
      "area_input": this.areaData,
      "product_input": this.requestManagerService.generateProductInput('user',this.productData),
      "spendings_input": this.requestManagerService.generateSpeadingInput(this.spendingsData),
      "implicit_costs_input": this.implicitsCostData,
    }
    console.log("get ImplicitCost Service")

    this.basicTypeService.getProperyImplicitCosts(payload)
      .subscribe((response) => {
        this.store.dispatch(new implicitsCostAction.SuccessAction(response.implicitCosts));
        this.getRateReturnService();
      },
        err => {
          this.store.dispatch(new implicitsCostAction.FailureAction(err));
        });
  }

  // TODO : Move to request manager component
  getRateReturnService(){
    let payload = {
      "propertyType": this.currentProperty,
      "area_input": this.areaData,
      "product_input": this.requestManagerService.generateProductInput('user',this.productData),
      "spendings_input":  this.requestManagerService.generateSpeadingInput(this.spendingsData),
      "implicit_costs_input": this.implicitsCostData,
      "ipr_input" : this.rateReturnData
    }
    console.log("get rate return service");
    this.basicTypeService.getProperyRateReturn(payload)
      .subscribe((response) => {
        console.log('success')
        this.store.dispatch(new rateReturnAction.SuccessAction(response.ipr.ipr));
      },
        err => {
          this.store.dispatch(new rateReturnAction.FailureAction(err));
        });
  }

  convertValue() {
    this.implicitsCostData.incomes.map( item => {
      item.pricePerRoom = parseFloat(item.pricePerRoom.toString().replace(/,/g, ''));
      return item;
    })
  }

  parseObject(data:any) {
    return JSON.parse(JSON.stringify(data));
  }


}
