import { Component, OnInit } from '@angular/core';
import { BasicTypeService } from '../../core/services/basic-type.service';
import { Store } from '@ngrx/store';

import { DefaultsVariableService } from '../../core/services/defaults-variable.service';
import { SchemaManagerService } from '../../core/services/schema-manager.service';
import { RequestManagerService } from '../../core/services/request-manager.service';
import { CalculatorManagerService } from '../../core/services/calculator-manager.service';


import * as pageAction from '../../core/actions/page.actions';
import * as areaAction from '../../core/actions/area.actions';
import * as productAction from '../../core/actions/product.actions';
import * as spendingsAction from '../../core/actions/spendings.actions';
import * as implicitsCostAction from '../../core/actions/implicit-costs.actions';
import * as profitAction from '../../core/actions/profit.actions';
import * as rateReturnAction from '../../core/actions/rate-return.actions';

import * as fromCore from '../../core/reducers';

@Component({
  selector: 'app-rate-return',
  templateUrl: './rate-return.component.html',
  styleUrls: ['./rate-return.component.css']
})
export class RateReturnComponent implements OnInit {

  currentProperty: string;
  areaData:any;
  productData:any;
  spendingsData:any;
  profitData: any;
  implicitsCostData:any;
  is_loading_implicitCost:boolean;
  is_loading_profit: boolean;
  is_loading_rateReturn: boolean;
  occupancy : number = 80;
  loan : number = 80;
  cash : number = 20;
  rateReturnData:any;
  constructor(private store: Store<any>,
    private defaultsVariableService: DefaultsVariableService,
    private requestManagerService: RequestManagerService,
    private calculatorManagerService: CalculatorManagerService,
    private shemaManagerService: SchemaManagerService,
    private basicTypeService:BasicTypeService) {
    this.store.select(fromCore.getPage)
    .subscribe(page => {
      this.currentProperty = page.page;
    });

  }

  ngOnInit() {

    this.store.select(fromCore.getArea)
    .subscribe(area => {
      this.areaData = area.payload;
    });

    this.store.select(fromCore.getProduct)
    .subscribe(product => {
      this.productData = product.payload;
    });

    this.store.select(fromCore.getSpendings)
    .subscribe(spendings => {
      this.spendingsData =  this.parseObject(spendings.payload);
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
    this.rateReturnData.privateInvestmentFundRatio = 100 - this.rateReturnData.bankInvestmentFundRatio
  }

  inputOnChange($event){
    console.log("Input changes")
    this.getImplicitCostService();
  }

  onSlideEnd($event, field){
    console.log($event);
    if(field === 'occupancy') {
      this.implicitsCostData.occupancy = $event.value;
    } else {
      this.rateReturnData.privateInvestmentFundRatio = 100 - this.rateReturnData.bankInvestmentFundRatio
    }

    this.getImplicitCostService();
  }

  async getImplicitCostService(){
    let payload = {
      "propertyType": this.currentProperty,
      "area_input": this.areaData,
      "product_input": this.requestManagerService.generateProductInput('user',this.productData),
      "spendings_input": this.requestManagerService.generateSpeadingInput(this.spendingsData) ,
      "implicit_costs_input": this.implicitsCostData,
    }

    let newImplicitsCost = await this.requestManagerService.requestImplicitsCost(payload);
    this.store.dispatch(new implicitsCostAction.SuccessAction(newImplicitsCost));
    this.store.dispatch(new implicitsCostAction.IsLoadingAction(false));
    this.getRateReturnService();
  }

  async getRateReturnService(){

    let payload = {
      "propertyType": this.currentProperty,
      "area_input": this.areaData,
      "product_input": this.requestManagerService.generateProductInput('user',this.productData),
      "spendings_input": this.requestManagerService.generateSpeadingInput(this.spendingsData) ,
      "implicit_costs_input": this.implicitsCostData,
      "ipr_input" : this.generateRateReturnInput()
    }
    let newRateReturnData = await this.requestManagerService.requestIPRRateReturn(payload);
    this.store.dispatch(new rateReturnAction.SuccessAction(newRateReturnData));

  }
  generateRateReturnInput(){
    let payload = {
      "privateInvestmentFundRatio": +this.rateReturnData.privateInvestmentFundRatio,
      "bankInvestmentFundRatio": +this.rateReturnData.bankInvestmentFundRatio,
      "bankInterest": +this.rateReturnData.bankInterest,
      "returnRate": +this.rateReturnData.returnRate,
      "cashFlowYear": +this.rateReturnData.cashFlowYear,
      "ratioInvestmentValue": +this.rateReturnData.ratioInvestmentValue,
      "borrowPeriod": +this.rateReturnData.borrowPeriod
    }
    if (['hotel', 'comunityMall'].includes(this.currentProperty)){
      payload = this.rateReturnData;
    }
    return payload;
  }

  parseObject(data:any) {
    return JSON.parse(JSON.stringify(data));
  }

}
