import { Component, ElementRef, HostListener, OnInit, OnDestroy, SimpleChanges, ViewChild, Input } from '@angular/core';
import { Validators, AbstractControl, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';

import { RequestManagerService } from '../../../../../core/services/request-manager.service';
import { CalculatorManagerService } from '../../../../../core/services/calculator-manager.service';
import { SchemaManagerService } from '../../../../../core/services/schema-manager.service';

import * as productAction from '../../../../../core/actions/product.actions';
import * as spendingsAction from '../../../../../core/actions/spendings.actions';
import * as profitAction from '../../../../../core/actions/profit.actions';
import * as implicitCostsAction from '../../../../../core/actions/implicit-costs.actions';
import * as rateReturnAction from '../../../../../core/actions/rate-return.actions';

import * as fromCore from '../../../../../core/reducers';

@Component({
  selector: 'app-product-basic-setting-village',
  templateUrl: './product-basic-setting-village.component.html',
  styleUrls: ['./product-basic-setting-village.component.css']
})

export class ProductBasicSettingVillageComponent implements OnInit, OnDestroy {
  @Input() owner: string;

  productData: any;

  currentProperty: string;
  areaData: any;
  products: Array<any> = [];

  is_loading: boolean;

  constructor(private store: Store<any>,
    private _elemRef: ElementRef,
    private requestManagerService: RequestManagerService,
    private schemaManagerService: SchemaManagerService,
    private calculatorManagerService: CalculatorManagerService) {
    this.store.select(fromCore.getPage)
      .subscribe(page => {
        this.currentProperty = page.page;
      });
  }

  header = {
    'competitor': 'โครงการคู่แข่ง',
    'user': 'โครงการของเรา'
  };

  convertRatio = [2.2, 3, 2.857];

  setDefaultValue = [50, 60, 70];

  settingHeader: string;
  settingSubHeader = '(สัดส่วน % ในโครงการต้องรวมกันได้ 100% เท่านั้น)';

  product_limit = {
    size: {
      min: 10,
      max: 1000
    },
    area: {
      min: 40,
      max: 4000
    },
    cost: {
      min: 1,
      max: 100
    },
    ratio: {
      min: 0,
      max: 100
    }
  };

  speadingData: any;
  implicitsCostData: any;
  profitData: any;
  rateReturnData: any;

  subscriptionArea: any;
  subscriptionProduct: any;
  subscriptionSpending: any;
  subscriptionImplicitsCost: any;
  subscriptionProfit: any;
  subscriptionRateReturn: any;
  rateControl: any;

  totalRatio: number;
  balanceRatio: number;
  displayErrDialog = false;
  displayErrDialogMsg = '';


  setForm: FormGroup;

  ngOnInit() {
    this.settingHeader = this.header[this.owner];
    this.subscriptionArea = this.store.select(fromCore.getArea)
      .subscribe(product => {
        this.areaData = product.payload;
        // check for Area have been cal API successfully.
        if (this.areaData.ratio_area.sellArea > 0 && this.currentProperty === 'village') {
          this.getBasicService();
        }
      });

    this.initializeProductSchema();

    this.subscriptionProduct = this.store.select(fromCore.getProduct)
      .subscribe(product => {
        this.is_loading = product.isLoading;
        this.productData = product.payload;
        this.products = this.parseObject(this.productData[this.owner]['products']);
      });

    this.subscriptionSpending = this.store.select(fromCore.getSpendings)
      .subscribe(data => {
        this.speadingData = data.payload;
      });

    this.subscriptionImplicitsCost = this.store.select(fromCore.getImplicitCosts)
      .subscribe(data => {
        this.implicitsCostData = data.payload;
      });

    this.subscriptionProfit = this.store.select(fromCore.getProfit)
      .subscribe(data => {
        this.profitData = data.payload;
      });

    this.subscriptionRateReturn = this.store.select(fromCore.getRateReturn)
      .subscribe(data => {
        this.rateReturnData = data.payload;
      });

    // check for Area have been call API successfully.
    if (this.areaData.ratio_area.sellArea > 0) {
      this.getBasicService();
    }
    this.setForm = new FormGroup({
      product1: new FormGroup({
        size : new FormControl(this.products[0].size, [Validators.max(1000), Validators.min(10)]),
        area : new FormControl(this.products[0].area, [Validators.max(4000), Validators.min(40)]),
        cost : new FormControl(this.products[0].cost, [Validators.max(100), Validators.min(1)])
      })
    });
    this.rateControl = new FormControl('', [Validators.max(100), Validators.min(0)]);

  }

  initializeProductSchema() {
    this.store.dispatch(new productAction.IsLoadingAction(true));
    let productData = this.schemaManagerService.getProductSchema(this.currentProperty);
    productData = this.calculatorManagerService.calculateProduct(this.areaData, productData);

    const speadingsData = this.schemaManagerService.getSpeadingSchema(this.currentProperty);
    const implicitCostData = this.schemaManagerService.getImplicitSchema(this.currentProperty);
    const profitData = this.schemaManagerService.getProfitSchama(this.currentProperty);
    const rateReturnData = this.schemaManagerService.getRateReturn(this.currentProperty);

    this.store.dispatch(new productAction.SuccessAction(productData));
    this.store.dispatch(new spendingsAction.SuccessAction(speadingsData));
    this.store.dispatch(new implicitCostsAction.SuccessAction(implicitCostData));
    this.store.dispatch(new profitAction.SuccessAction(profitData));
    this.store.dispatch(new rateReturnAction.SuccessAction(rateReturnData));

  }

  handleRatioChange(index: number, $event: any) {
    this.totalRatio = this.products.reduce((sum, product) => sum + product.ratio, 0);
    if (this.totalRatio > this.product_limit.ratio.max) {
      this.products[index].ratio = 0;
    }
  }

  handleRatioEnd(index: number, $event: any, text?: string) {
    this.convertNum()
    if (text) {
      switch (text) {
        case 'size':
        if (this.products[index].size <= this.product_limit.size.min) {
          this.products[index].size = this.product_limit.size.min;
        } else if (this.products[index].size > this.product_limit.size.max) {
          this.products[index].size = this.product_limit.size.max;
        }
        break;
        case 'area':
          if (this.products[index].area <= this.product_limit.area.min) {
            this.products[index].area = this.product_limit.area.min;
          } else if (this.products[index].area > this.product_limit.area.max) {
            this.products[index].area = this.product_limit.area.max;
          }
        break;
        case 'cost':
          if (this.products[index].cost <= this.product_limit.cost.min) {
            this.products[index].cost = this.product_limit.cost.min;
          } else if (this.products[index].cost > this.product_limit.cost.max) {
            this.products[index].cost = this.product_limit.cost.max;
          }
      }
    }
    this.getBasicService();
  }

  convertNum() {
    this.products.forEach( (element, index) => {
      this.products[index].size = parseFloat(this.products[index].size.toString().replace(/,/g, ''));
      this.products[index].area = parseFloat(this.products[index].area.toString().replace(/,/g, ''));
      this.products[index].cost = parseFloat(this.products[index].cost.toString().replace(/,/g, ''));
    });
  }

  async getBasicService() {
  this.convertNum()
  if(this.productData) {
    const payload = {
      'propertyType': this.currentProperty,
      'area_input': {
        ...this.areaData,
        'percent': this.areaData.standardArea.percent,
        'area': this.areaData.standardArea.percent
      },
      'product_input': this.generateProductPayload()
    };
    this.store.dispatch(new productAction.IsLoadingAction(true));
    let newProductData = await this.requestManagerService.requestProduct(payload);
    newProductData = this.parsePayloadResponse(newProductData);
    newProductData = this.calculatorManagerService.calculateProduct(this.areaData, newProductData);
    console.log('newProduct',newProductData)
    this.store.dispatch(new productAction.SuccessAction(newProductData));

    this.store.dispatch(new productAction.IsLoadingAction(false));
    this.fillInSpeading();
  }
  }

  generateProductPayload() {
    const productData = JSON.parse(JSON.stringify(this.productData));
    const oppositeOwner = (this.owner === 'user') ? 'competitor' : 'user';
    const myProduct = JSON.parse(JSON.stringify(this.products));
    productData[this.owner].products = myProduct;
    productData[this.owner].products[0].cost = this.parseToMillionFormat(myProduct[0].cost);
    productData[this.owner].products[1].cost = this.parseToMillionFormat(myProduct[1].cost);
    productData[this.owner].products[2].cost = this.parseToMillionFormat(myProduct[2].cost);
    productData[this.owner].products[0].size = myProduct[0].size;
    productData[this.owner].products[1].size = myProduct[1].size;
    productData[this.owner].products[2].size = myProduct[2].size;
    productData[this.owner].products[0].area = myProduct[0].area;
    productData[this.owner].products[1].area = myProduct[1].area;
    productData[this.owner].products[2].area = myProduct[2].area;
    productData[oppositeOwner].products[0].cost = this.parseToMillionFormat(this.productData[oppositeOwner].products[0].cost);
    productData[oppositeOwner].products[1].cost = this.parseToMillionFormat(this.productData[oppositeOwner].products[1].cost);
    productData[oppositeOwner].products[2].cost = this.parseToMillionFormat(this.productData[oppositeOwner].products[2].cost);
    const product_input = { ...productData };
    return product_input;
  }

  parsePayloadResponse(response: any) {
    const productData = JSON.parse(JSON.stringify(response));
    productData['user'].products[0].cost = this.parseMillionToUnitFormat(response['user'].products[0].cost);
    productData['user'].products[1].cost = this.parseMillionToUnitFormat(response['user'].products[1].cost);
    productData['user'].products[2].cost = this.parseMillionToUnitFormat(response['user'].products[2].cost);
    productData['competitor'].products[0].cost = this.parseMillionToUnitFormat(response['competitor'].products[0].cost);
    productData['competitor'].products[1].cost = this.parseMillionToUnitFormat(response['competitor'].products[1].cost);
    productData['competitor'].products[2].cost = this.parseMillionToUnitFormat(response['competitor'].products[2].cost);
    return productData;
  }

  async fillInSpeading() {
    console.log('fill in speading.');
    this.store.dispatch(new spendingsAction.IsLoadingAction(true));
    const payload = this.generateSpeadingPayload(this.speadingData);
    let newSpendingData = await this.requestManagerService.requestSpeading(payload,'productBasic');
    newSpendingData = this.mappingSpeadingResponse(this.speadingData, this.parseObject(newSpendingData));
    this.store.dispatch(new spendingsAction.SuccessAction(newSpendingData));
    this.store.dispatch(new spendingsAction.IsLoadingAction(false));
    this.fillInImplicitsCost(newSpendingData);
    this.fillInProfitCost(newSpendingData);
    this.fillInRateReturn(newSpendingData);
  }

  generateSpeadingPayload(speadingData: any) {
    const tempInput = this.parseObject(speadingData);
    if(this.areaData.total_land_price) {
      tempInput.priceLandBought = this.areaData.total_land_price;
    }
    const productData = JSON.parse(JSON.stringify(this.productData));
    const requestProperty = this.currentProperty === 'townhome' ? 'townhouse' : this.currentProperty;
    const payload = {
      'propertyType': requestProperty,
      'area_input': this.areaData,
      'product_input': this.requestManagerService.generateProductInput('user', productData),
      'spendings_input': this.requestManagerService.generateSpeadingInput(tempInput),
    };
    return this.parseObject(payload);
  }

  mappingSpeadingResponse(tempSpending: any, newSpendings: any) {
    newSpendings.sellPeriod = tempSpending.sellPeriod;
    newSpendings.totalSalary = +tempSpending.sellPeriod * +tempSpending.salaryEmployee * +tempSpending.noEmployee;
    // newSpendings.costAdvt = +tempSpending.sellPeriod * +tempSpending.salaryEmployee * +tempSpending.noEmployee;
    newSpendings.salaryEmployee = +tempSpending.salaryEmployee;
    if (newSpendings.periodSellStart === '//') {
      newSpendings.periodSellStart = '';
    }
    if (newSpendings.periodSellEnd === '//') {
      newSpendings.periodSellEnd = '';
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

  async fillInImplicitsCost(spendingData: any) {
    this.store.dispatch(new implicitCostsAction.IsLoadingAction(true));
    const payload = this.generateSpeadingPayload(spendingData);
    const newImplicitsCost = await this.requestManagerService.requestImplicitsCost(payload);
    this.store.dispatch(new implicitCostsAction.SuccessAction(newImplicitsCost));
    this.store.dispatch(new implicitCostsAction.IsLoadingAction(false));
  }

  async fillInProfitCost(spendingData: any) {
    const payload = this.generateSpeadingPayload(spendingData);
    const newProfit = await this.requestManagerService.requestProfit(payload);
    this.store.dispatch(new profitAction.SuccessAction(newProfit));
    this.store.dispatch(new profitAction.IsLoadingAction(false));

  }

  async fillInRateReturn(spendingData: any) {
    // TODO: need to remove try catch when Bank finished API.
    this.checkDisplayErrorDialog();
    try {
      const payload = this.generateSpeadingPayload(spendingData);
      payload.implicit_costs_input = this.implicitsCostData;
      payload.ipr_input = this.rateReturnData;
      const newRateRetrun = await this.requestManagerService.requestIPRRateReturn(payload);
      this.store.dispatch(new rateReturnAction.SuccessAction(newRateRetrun));
    } catch (e) {
      console.log('ERR: Rate return error. replace value with original value.');
      this.store.dispatch(new rateReturnAction.SuccessAction(this.rateReturnData));
    }
  }

  parseToMillionFormat(value: number) {
    return +(value + '000000');
  }

  parseMillionToUnitFormat(value: number) {
    const stringValue = value + '';
    return +(stringValue.replace('000000', ''));
  }

  parseDate(date: string): string {
    try {
      if (date.indexOf('/') > 0) {
        return date;
      }
    } catch (e) {
      return '';
    }

    const d = date.substring(8, 10);
    const m = date.substring(5, 7);
    const y = date.substring(0, 4);
    return `${m}/${d}/${y}`;
  }

  parseObject(data: any) {
    try {
      return JSON.parse(JSON.stringify(data));
    } catch (e) {
      return data;
    }
  }

  parseObjectForProduct(data: any, check ?: boolean) {
    try {
      let test = JSON.parse(JSON.stringify(data))
      test.map( (num, index) => {
        if(!check) {
          num.size = this.setDefaultValue[index];
        }
        const numArea = num.size * this.convertRatio[index];
        num.area = Math.round(numArea);
        return num;
      })
      return test;
    } catch (e) {
      return data;
    }
  }

  checkDisplayErrorDialog() {
    try {
      const remainningArea = this.productData[this.owner].remainingArea;
      if (+remainningArea < 0) {
        this.displayErrDialog = true;
        this.displayErrDialogMsg = 'ไม่มีพื้นที่คงเหลือเพียงพอสำหรับการก่อสร้าง โปรดกำหนดขนาดพื้นที่ใหม่อีกครั้ง';
        return '';
      } else {
        this.displayErrDialog = false;
      }
      return '';
    } catch (e) {
      console.log('error');
    }
  }

  convertAreaToSize(){
    this.products.map( (arr , index) => {
      const demoArea = arr.area / this.convertRatio[index];
      arr.size = Math.round(demoArea);
      return arr;
    })
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
