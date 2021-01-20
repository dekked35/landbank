import { Component, OnInit, OnDestroy, SimpleChanges } from "@angular/core";
import { BasicTypeService } from "../../core/services/basic-type.service";
import { Store } from "@ngrx/store";

import { SchemaManagerService } from "../../core/services/schema-manager.service";
import { RequestManagerService } from "../../core/services/request-manager.service";
import { CalculatorManagerService } from "../../core/services/calculator-manager.service";

import * as pageAction from "../../core/actions/page.actions";
import * as areaAction from "../../core/actions/area.actions";
import * as productAction from "../../core/actions/product.actions";
import * as spendingsAction from "../../core/actions/spendings.actions";
import * as profitAction from "../../core/actions/profit.actions";
import * as implicitsCostAction from "../../core/actions/implicit-costs.actions";
import * as rateReturnAction from "../../core/actions/rate-return.actions";

import * as fromCore from "../../core/reducers";

import * as moment from "moment";

const needToConvert = [
  'priceLandBought',
  'costOther',
  'costConstructionLivingSpace',
  'costPlan',
  'noEmployee',
  'salaryEmployee',
  'costAdvt',
  'costCommission'
]

const needToConvertHotel = [
  'specialEquipments',
  'costPerMonths',
  'outdoors',
  'parking',
  'centrals',
  'rooms',
]


@Component({
  selector: "app-spendings",
  templateUrl: "./spendings.component.html",
  styleUrls: ["./spendings.component.css"],
})
export class SpendingsComponent implements OnInit, OnDestroy {
  currentProperty: string;
  areaData: any;
  productData: any;
  spendingsData: any;
  implicitCostData: any;
  rateReturnData: any;
  wording: string = '';

  is_loading = true;

  priceLandBought: number;
  costOther: number;
  costConstructionLivingSpace: number;
  costPlan: number;

  percentCostAdvt = 1;

  constructor(
    private store: Store<any>,
    private requestManagerService: RequestManagerService,
    private calculatorManagerService: CalculatorManagerService,
    private shemaManagerService: SchemaManagerService
  ) {
    this.store.select(fromCore.getPage).subscribe((page) => {
      this.currentProperty = page.page;
    });
  }

  subscriptionArea: any;
  subscriptionProduct: any;
  subscriptionSpending: any;
  subscriptionImplicitsCost: any;
  subscriptionProfit: any;
  subscriptionRateReturn: any;
  count: boolean = false;
  clickChange : boolean = false;
  fixBug = 0;
  plan = '';

  ngOnInit() {
    this.store.select(fromCore.getArea).subscribe((area) => {
      this.areaData = area.payload;
      if(this.areaData.total_land_price && this.spendingsData) {
        this.spendingsData.priceLandBought = this.areaData.total_land_price;
      }
    });

    this.subscriptionSpending = this.store
      .select(fromCore.getSpendings)
      .subscribe((spendings) => {
        this.spendingsData = this.parseObject(spendings.payload);
        this.is_loading = spendings.isLoading;
        this.caculateMonthPeriod(true)
      });

    this.subscriptionImplicitsCost = this.store
      .select(fromCore.getImplicitCosts)
      .subscribe((implicistCost) => {
        this.implicitCostData = this.parseObject(implicistCost.payload);
      });

    this.subscriptionRateReturn = this.store
      .select(fromCore.getRateReturn)
      .subscribe((rateReturn) => {
        this.rateReturnData = this.parseObject(rateReturn.payload);
      });

    this.subscriptionProduct = this.store
      .select(fromCore.getProduct)
      .subscribe((product) => {
        this.productData = product.payload;
        if (['village', 'townhome'].includes(this.currentProperty)){
          this.checkPlanModel()
        }
        if (product.payload) {
          const {wordingParking} = product.payload;
          if (wordingParking) {
            this.wording = product.payload.wordingParking;
          }
        }
      });
      this.convertNum();
  }

  checkPlanModel(){
    const { user } = this.productData;
    let countPlan = 0;
    this.plan = '';
    if(user) {
      user.products.forEach((element, index) => {
        if (element.ratio !== 0) {
          countPlan++;
        }
      });
    }
    this.plan = countPlan + ' แบบ'
  }

  caculateMonthPeriod($event) {
    if (
      this.spendingsData.periodSellStart !== undefined &&
      this.spendingsData.periodSellEnd !== undefined
    ) {
      const a = new Date(this.spendingsData.periodSellStart);
      const b = new Date(this.spendingsData.periodSellEnd);
      if (b > a) {
        const months = moment(b).diff(moment(a), 'month', true);
        this.spendingsData.sellPeriod = +months.toFixed(0);
      } else {
        this.spendingsData.sellPeriod = 0;
      }
    } else {
      this.spendingsData.sellPeriod = 0;
    }
    this.spendingsData.totalSalary =
      +this.spendingsData.sellPeriod *
      +this.spendingsData.salaryEmployee *
      +this.spendingsData.noEmployee;
      if (this.spendingsData.costPerMonth !== undefined) {
        this.spendingsData.costPerMonths = this.spendingsData.costPerMonth;
      }
  }

  async InputOnchanges($event) {
    this.convertNum()
    if (['village', 'townhome'].includes(this.currentProperty)) {
      if (this.spendingsData !== undefined) {
        this.spendingsData.totalSalary =
          +this.spendingsData.sellPeriod *
          +this.spendingsData.salaryEmployee *
          +this.spendingsData.noEmployee;
        if (
          this.spendingsData.priceLandBought > 0 &&
          this.spendingsData.costOther > 0 &&
          this.spendingsData.costConstructionLivingSpace > 0 &&
          this.spendingsData.costPlan > 0
        ) {
          const tempSpending = this.parseObject(this.spendingsData);
          this.store.dispatch(new spendingsAction.IsLoadingAction(true));
          const payload = this.generatePayload(tempSpending);
          let newSpendingData = await this.requestManagerService.requestSpeading(
            payload,'spendings'
          );
          newSpendingData = this.mappingResponse(
            tempSpending,
            this.parseObject(newSpendingData)
          );
          this.store.dispatch(
            new spendingsAction.SuccessAction(newSpendingData)
          );
          this.store.dispatch(new spendingsAction.IsLoadingAction(false));
          this.caculateMonthPeriod(true)
          this.getImplicitsCosts(tempSpending);
          this.getProfit(tempSpending);
          this.getRateReturn(newSpendingData);
        }
      }
    } else {
      const tempSpending = this.parseObject(this.spendingsData);
      this.store.dispatch(new spendingsAction.IsLoadingAction(true));
      const payload = {
        // "propertyType": this.currentProperty,
        propertyType: 'hotel',
        area_input: this.areaData,
        product_input: this.requestManagerService.generateProductInput(
          'user',
          this.productData
        ),
        spendings_input: this.requestManagerService.generateSpeadingInput(
          tempSpending
        ),
      };
      if (
        this.productData.user.rooms !== undefined ||
        this.productData.user.rooms.length > 0
      ) {
        const newSpendingData = await this.requestManagerService.requestSpeading(
          payload,'spending'
        );
        if (newSpendingData.costPerMonth !== undefined) {
          newSpendingData.costPerMonths = newSpendingData.costPerMonth;
        }
        newSpendingData.specialEquipments.map((data) => {
          if (data.type.search(/Opening/gi) !== -1) {
            data.cost = newSpendingData.totalCostPerMonth;
          }
        });
        this.store.dispatch(new spendingsAction.SuccessAction(newSpendingData));
        this.store.dispatch(new spendingsAction.IsLoadingAction(false));

        this.getImplicitsCosts(tempSpending);
        this.getRateReturn(tempSpending);
      }
    }
  }

  convertNum(){
    if (['village', 'townhome'].includes(this.currentProperty)) {
      for (const item in this.spendingsData) {
        if (needToConvert.includes(item)) {
          this.spendingsData[item] = parseFloat(this.spendingsData[item].toString().replace(/,/g, ''))
        }
      }
    } else {
      for (const item in this.spendingsData) {
          if (needToConvertHotel.includes(item) && this.spendingsData[item].length > 0) {
            this.spendingsData[item].map( (items) => {
              if(items.cost && typeof items.cost === 'string') {
                items.cost = parseFloat(items.cost.toString().replace(/,/g, ''));
              }
              if (items === 'specialEquipments' || items === 'costPerMonths' && items.no && typeof items.no === 'string') {
                items.no = parseFloat(items.no.toString().replace(/,/g, ''));
              }
                return items;
              });
          }
        }
      }
    this.spendingsData.priceLandBought = this.areaData.total_land_price;
    }

  setChange(){
    this.clickChange = true;
  }

  async getImplicitsCosts(tempSpending) {
    let payload = {};
    if (['village', 'townhome'].includes(this.currentProperty)) {
      payload = this.parseObject(tempSpending);
    } else {
      payload = this.generateImplicitCostPayload(tempSpending);
    }
    const newImplicitsCost = await this.requestManagerService.requestImplicitsCost(
      payload
    );
    this.store.dispatch(
      new implicitsCostAction.SuccessAction(newImplicitsCost)
    );
    this.store.dispatch(new implicitsCostAction.IsLoadingAction(false));
  }

  async getProfit(tempSpending) {
    // this.store.dispatch(new profitAction.IsLoadingAction(true));
    const newProfit = await this.requestManagerService.requestProfit(
      this.generatePayload(tempSpending)
    );
    this.store.dispatch(new profitAction.SuccessAction(newProfit));
    // this.store.dispatch(new profitAction.IsLoadingAction(false));
  }

  async getRateReturn(spendingData: any) {
    console.log('getRate Return')
    // TODO: need to remove try catch when Bank finished API.
    if (['village', 'townhome'].includes(this.currentProperty)) {
      try {
        const payload = this.generatePayload(spendingData);
        payload.implicit_costs_input = this.implicitCostData;
        payload.ipr_input = this.rateReturnData;
        const newRateRetrun = await this.requestManagerService.requestIPRRateReturn(
          payload
        );
        this.store.dispatch(new rateReturnAction.SuccessAction(newRateRetrun));
      } catch (e) {
        console.log(
          'ERR: Rate return error. replace value with original value.'
        );
        this.store.dispatch(
          new rateReturnAction.SuccessAction(this.rateReturnData)
        );
      }
    } else {
      const payload = {
        propertyType: 'hotel',
        area_input: {
          ...this.areaData,
          percent: this.areaData.standardArea.percent,
          area: this.areaData.standardArea.percent,
        },
        product_input: this.requestManagerService.generateProductInput(
          'user',
          this.productData
        ),
        spendings_input: this.requestManagerService.generateSpeadingInput(
          spendingData
        ),
        implicit_costs_input: this.implicitCostData,
        ipr_input: this.rateReturnData,
      };

      const newRateReturnData = await this.requestManagerService.requestIPRRateReturn(
        payload
      );
      this.store.dispatch(
        new rateReturnAction.SuccessAction(newRateReturnData)
      );
    }
  }

  generatePayload(tempInput) {
    console.log('generate Payload')
    let requestProperty =  '';
    if (this.currentProperty === 'townhome') {
      requestProperty = 'townhouse';
    } else if (this.currentProperty === 'resort') {
      requestProperty = 'village';
    } else {
      requestProperty = this.currentProperty;
    }
    const payload = {
      propertyType: requestProperty,
      area_input: this.areaData,
      product_input: this.requestManagerService.generateProductInput(
        'user',
        this.productData
      ),
      spendings_input: this.requestManagerService.generateSpeadingInput(
        tempInput
      ),
    };
    return this.parseObject(payload);
  }

  addItem(type: string) {
    this.spendingsData[type].push({
      type: 'รายการใหม่',
      cost: 0,
      no: 1,
      total: 0,
    });
  }

  deleteItem(index: number, type: string) {
    this.spendingsData[type].splice(index, 1);
    this.InputOnchanges(null);
  }

  // Model condo, hotel, commall
  generateImplicitCostPayload(tempInput) {
    console.log('on implicit')
    let payload = {
      // "propertyType": this.currentProperty,
      propertyType: "hotel",
      area_input: this.areaData,
      product_input: this.requestManagerService.generateProductInput(
        "user",
        this.productData
      ),
      spendings_input: this.requestManagerService.generateSpeadingInput(
        tempInput
      ),
      implicit_costs_input: JSON.parse(JSON.stringify(this.implicitCostData)),
    };
    return JSON.parse(JSON.stringify(payload));
  }

  mappingResponse(tempSpending, newSpendings) {
    try {
      newSpendings.sellPeriod = tempSpending.sellPeriod;
    } catch (e) {
      // TODO : Bugs - selPeriod is undefiend.
      newSpendings.sellPeriod = 0;
    }
    newSpendings.totalSalary =
      +tempSpending.sellPeriod *
      +tempSpending.salaryEmployee *
      +tempSpending.noEmployee;
    // newSpendings.costAdvt =
    //   +tempSpending.sellPeriod *
    //   +tempSpending.salaryEmployee *
    //   +tempSpending.noEmployee;
    newSpendings.salaryEmployee = +tempSpending.salaryEmployee;
    if (newSpendings.periodSellStart === "//") {
      newSpendings.periodSellStart = "";
    }
    if (newSpendings.periodSellEnd === "//") {
      newSpendings.periodSellEnd = "";
    }
    if (newSpendings.sellPeriod === null) {
      newSpendings.sellPeriod = 0;
    }
    if (newSpendings.salaryEmployee === null) {
      newSpendings.salaryEmployee = 0;
    }
    if (newSpendings.costAdvt === null) {
      newSpendings.costAdvt = 0;
    }
    return newSpendings;
  }

  parseDate(date: string): string {
    try {
      if (date.indexOf("/") > 0) {
        return date;
      }
    } catch (e) {
      return "";
    }

    let d = date.substring(8, 10);
    let m = date.substring(5, 7);
    let y = date.substring(0, 4);
    return m + "/" + d + "/" + y;
  }

  parseToMillionFormat(value: number) {
    return +(value + "000000");
  }

  parseObject(data: any) {
    return JSON.parse(JSON.stringify(data));
  }

  parseObjectCheckSpendings(data: any, area?: any, isClick?: boolean, same?: boolean) {
    let test = JSON.parse(JSON.stringify(data))
    return test;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  getWording() {
    return this.currentProperty === 'village' ? 'หลัง' : 'อาคาร';
  }

  convertToNum(num: string) {
    return parseFloat(num.toString().replace(/,/g, ''));
  }

  ngOnDestroy() {
    this.subscriptionArea.unsubscribe();
    this.subscriptionProduct.unsubscribe();
    this.subscriptionSpending.unsubscribe();
    this.subscriptionImplicitsCost.unsubscribe();
    this.subscriptionProfit.unsubscribe();
    this.subscriptionRateReturn.unsubscribe();
  }
}
