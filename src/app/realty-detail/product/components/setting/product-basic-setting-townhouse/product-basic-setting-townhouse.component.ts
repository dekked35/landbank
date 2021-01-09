import { Component, ElementRef, HostListener, OnInit, OnChanges, SimpleChanges, ViewChild, Input } from '@angular/core';
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

const imageType = {
  townhome : {
    0 : 'townhome2.svg' ,
    1 : 'townhome3.svg' ,
    2 : 'townhome4.svg'
  },
  townhomeCom : {
    0 : 'townhome2-2.png' ,
    1 : 'townhome3-2.png' ,
    2 : 'townhome4-2.png'
  },
};

@Component({
  selector: 'app-product-basic-setting-townhouse',
  templateUrl: './product-basic-setting-townhouse.component.html',
  styleUrls: ['./product-basic-setting-townhouse.component.css']
})

export class ProductBasicSettingTownhouseComponent implements OnInit {
  @Input() owner: string;
  @Input() isCompetitor: boolean;

  currentProperty: string;
  areaData: any;
  is_loading = true;
  products: Array<any> = [];
  ownerProductData: any;
  productData: any;
  allArea : number;
  allArea4 : number
  competitorColor : {};

  header = {
    'competitor': 'โครงการคู่แข่ง',
    'user': 'โครงการของเรา'
  };

  convertField = [
    'width',
    'depth',
    'frontDepth',
    'behindDepth'
  ];



  // convert = [
  //   'area',
  //   'size',
  //   'stairArea'
  // ];

  settingHeader: string;
  settingSubHeader = '(สัดส่วน % ในโครงการต้องรวมกันได้ 100% เท่านั้น)';

  product_limit = {
    size: {
      min: 20,
      max: 50
    },
    width: {
      min: 4,
      max: 10
    },
    depth: {
      min: 4,
      max: 20
    },
    behindDepth: {
      min: 1.5,
      max: 5
    },
    frontDepth: {
      min: 0,
      max: 8
    },
    area: {
      min: 0,
      max: 1000
    },
    stairArea: {
      min: 0,
      max: 100
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


  constructor(private store: Store<any>,
    private formBuilder: FormBuilder,
    private requestManagerService: RequestManagerService,
    private schemaManagerService: SchemaManagerService,
    private calculatorManagerService: CalculatorManagerService,
    private _elemRef: ElementRef) {
    this.store.select(fromCore.getPage)
      .subscribe(page => {
        this.currentProperty = page.page;
      });
  }

  spendingData: any;
  implicitsCostData: any;
  profitData: any;
  rateReturnData: any;

  displayErrDialog = false;
  displayErrDialogMsg = '';

  totalRatio: number;
  balanceRatio: number;

  subscriptionArea: any;
  subscriptionProduct: any;
  subscriptionSpending: any;
  subscriptionImplicitsCost: any;
  subscriptionProfit: any;
  subscriptionRateReturn: any;

  ngOnInit() {

    this.subscriptionArea = this.store.select(fromCore.getArea)
      .subscribe(product => {
        if (this.areaData !== product.payload) {
          this.areaData = product.payload;
          if(this.ownerProductData) {
            this.convertNumAndCheckSize();
            this.getBasicService(this.ownerProductData);
          }
        }
        // check for Area have been call API successfully.
      });

    this.initializeProductSchema();

     this.subscriptionProduct = this.store.select(fromCore.getProduct)
      .subscribe(data => {
          this.productData = this.parseObject(data.payload);
          this.ownerProductData = this.parseObject(this.productData[this.owner]);
          this.products = this.parseObjectDecimal(data.payload[this.owner]['products']);
      });
    this.subscriptionSpending = this.store.select(fromCore.getSpendings)
      .subscribe(data => {
        this.spendingData = data.payload;
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
    this.settingHeader = this.header[this.owner];
    // this.calculateSize();
    this.convertNumAndCheckSize();
    this.getBasicService(this.ownerProductData);
    this.competitorColor = this.owner === 'competitor' ? { 'color' : '#ff781f' } : { }
  }

  initializeProductSchema() {
    this.store.dispatch(new productAction.IsLoadingAction(true));
    let productData, speadingsData, implicitCostData, profitData, rateReturnData;
    if (localStorage.getItem('product') && localStorage.getItem('page') === this.currentProperty) {
      productData = JSON.parse(localStorage.getItem('product'));
    } else {
      productData = this.schemaManagerService.getProductSchema(this.currentProperty);
    }
    productData = this.calculatorManagerService.calculateProduct(this.areaData, productData);

    if (localStorage.getItem('spending') && localStorage.getItem('page') === this.currentProperty) {
      speadingsData = JSON.parse(localStorage.getItem('spending'));
    } else {
      speadingsData = this.schemaManagerService.getSpeadingSchema(this.currentProperty);
    }

    if (localStorage.getItem('implicit') && localStorage.getItem('page') === this.currentProperty) {
      implicitCostData = JSON.parse(localStorage.getItem('implicit'));
    } else {
      implicitCostData = this.schemaManagerService.getImplicitSchema(this.currentProperty);
    }

    if (localStorage.getItem('profit') && localStorage.getItem('page') === this.currentProperty) {
      profitData = JSON.parse(localStorage.getItem('profit'));
    } else {
      profitData = this.schemaManagerService.getProfitSchama(this.currentProperty);
    }

    if (localStorage.getItem('rateReturn') && localStorage.getItem('page') === this.currentProperty) {
      rateReturnData = JSON.parse(localStorage.getItem('rateReturn'));
    } else {
      rateReturnData = this.schemaManagerService.getRateReturn(this.currentProperty);
    }

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

  calculateSize() {
    const depth = +this.ownerProductData.depth;
    const width = +this.ownerProductData.width;
    // this.products[0].area = depth * width * 2;
    // this.products[1].area = depth * width * 3;
    // this.products[2].area = depth * width * 4;
  }

  handleRatioEnd(index: number, $event: any) {
    // this.calculateSize();
    // console.log(this.products);
    this.convertNumAndCheckSize();
    // this.calculateSize();
    this.getBasicService(this.ownerProductData);
  }

  async getBasicService(ownerProductData) {
    const payload = {
      'propertyType': 'townhouse',
      'area_input': {
        ...this.areaData,
      'percent': this.areaData.standardArea.percent,
      'area': this.areaData.standardArea.percent
      },
      'product_input': this.generateProductPayload(this.parseObject(ownerProductData))
    };
    this.store.dispatch(new productAction.IsLoadingAction(true));
    // console.log('payload',payload)
    let newProductData = await this.requestManagerService.requestProduct(payload);
    newProductData = this.parsePayloadResponse(newProductData);
    // console.log(newProductData[this.owner].products[0].stairArea);
    newProductData = this.calculatorManagerService.calculateProduct(this.areaData, newProductData);
    this.store.dispatch(new productAction.SuccessAction(newProductData));
    this.store.dispatch(new productAction.IsLoadingAction(false));
    this.fillInSpeading();
  }

  generateProductPayload(ownerProductData) {
    const productData = this.parseObject(this.productData);
    const oppositeOwner = (this.owner === 'user') ? 'competitor' : 'user';
    const myProductList = this.parseObject(this.products);

    productData[this.owner] = ownerProductData; // user or owner
    const depth = +ownerProductData.depth;
    const width = +ownerProductData.width;
    productData[this.owner].products[0].area = parseFloat(this.products[0].area);
    productData[this.owner].products[1].area = parseFloat(this.products[1].area);
    productData[this.owner].products[2].area = parseFloat(this.products[2].area);
    productData[this.owner].products[0].stairArea = parseFloat(this.products[0].stairArea);
    productData[this.owner].products[1].stairArea = parseFloat(this.products[1].stairArea);
    productData[this.owner].products[2].stairArea = parseFloat(this.products[2].stairArea);
    productData[this.owner].products[0].cost = this.parseToMillionFormat(this.products[0].cost);
    productData[this.owner].products[1].cost = this.parseToMillionFormat(this.products[1].cost);
    productData[this.owner].products[2].cost = this.parseToMillionFormat(this.products[2].cost);
    productData[this.owner].products[0].ratio = this.products[0].ratio;
    productData[this.owner].products[1].ratio = this.products[1].ratio;
    productData[this.owner].products[2].ratio = this.products[2].ratio;
    productData[this.owner].products[0].size = parseFloat(this.products[0].size);
    productData[this.owner].products[1].size = parseFloat(this.products[1].size);
    productData[this.owner].products[2].size = parseFloat(this.products[2].size);
    productData[oppositeOwner] = productData[oppositeOwner]; // user or owner
    productData[oppositeOwner].products[0].cost = this.parseToMillionFormat(this.productData[oppositeOwner].products[0].cost);
    productData[oppositeOwner].products[1].cost = this.parseToMillionFormat(this.productData[oppositeOwner].products[1].cost);
    productData[oppositeOwner].products[2].cost = this.parseToMillionFormat(this.productData[oppositeOwner].products[2].cost);
    // let product_input = { ... };
    productData.isCompetitor = this.isCompetitor;
    return this.parseObject(productData);
  }

  parsePayloadResponse( response) {
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
    this.store.dispatch(new spendingsAction.IsLoadingAction(true));
    const payload = this.generateSpeadingPayload(this.spendingData);
    let newSpendingData = await this.requestManagerService.requestSpeading(payload,"product"); /// spending API
    newSpendingData = this.mappingSpeadingResponse(this.spendingData, this.parseObject(newSpendingData));
    this.store.dispatch(new spendingsAction.SuccessAction(newSpendingData));
    this.store.dispatch(new spendingsAction.IsLoadingAction(false));
    this.fillInImplicitsCost(newSpendingData);
    this.fillInProfitCost(newSpendingData);
    this.fillInRateReturn(newSpendingData);
  }

  generateSpeadingPayload(spendingData: any) {
    this.convertNumAndCheckSize()
    const tempInput = this.parseObject(spendingData);
    if(this.areaData.total_land_price) {
      tempInput.priceLandBought = this.areaData.total_land_price;
    }
    let productData = JSON.parse(JSON.stringify(this.productData));
    productData = this.convertNum(productData)
    const requestProperty = this.currentProperty === 'townhome' ? 'townhouse' : this.currentProperty;
    const payload = {
      'propertyType': requestProperty,
      'area_input': this.areaData,
      'product_input': this.requestManagerService.generateProductInput('user', productData),
      'spendings_input': this.requestManagerService.generateSpeadingInput(tempInput),
    };
    return this.parseObject(payload);
  }

  mappingSpeadingResponse(tempSpending, newSpendings) {
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
    const payload = this.generateSpeadingPayload(spendingData);
    const newImplicitsCost = await this.requestManagerService.requestImplicitsCost(payload);
    this.store.dispatch(new implicitCostsAction.SuccessAction(newImplicitsCost));
    this.store.dispatch(new implicitCostsAction.IsLoadingAction(false));
  }

  async fillInProfitCost(spendingData: any) {
    const payload = this.generateSpeadingPayload(spendingData);
    const newProfit = await this.requestManagerService.requestProfit(payload);
    this.store.dispatch(new profitAction.SuccessAction(newProfit));
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
    const stringValue = value * 1000000;
    return stringValue;
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
    return m + '/' + d + '/' + y;
  }

  parseObject(data: any) {
    try {
      return JSON.parse(JSON.stringify(data));
    } catch (e) {
      return data;
    }
  }

  parseObjectDecimal(data: any) {
    try {
      const test = JSON.parse(JSON.stringify(data));
      test.map(element => {
        for (const item in element) {
          if(typeof element[item] === 'number') {
            element[item] = element[item].toFixed(2)
          }
        }
        return element;
      });
      return test;
    } catch (e) {
      return data;
    }
  }

  parseMillionToUnitFormat(value: number) {
    const stringValue = value + '';
    return parseFloat(stringValue) / 1000000;
  }

  convertNumAndCheckSize() {
    this.convertField.forEach(element => {
      // tslint:disable-next-line: max-line-length
      this.ownerProductData[element] = typeof this.ownerProductData[element] === 'string' ? parseFloat(this.ownerProductData[element].toString().replace(/,/g, '')) : this.ownerProductData[element];
    });
    // tslint:disable-next-line: max-line-length
    this.allArea = (this.ownerProductData.behindDepth * this.ownerProductData.width) + (this.ownerProductData.frontDepth * this.ownerProductData.width) + (this.ownerProductData.depth * this.ownerProductData.width)
    this.allArea4 = this.allArea / 4;
  }

  convertNum(productData) {
    productData.user.products.map(element => {
        element.area = parseFloat(element.area);
        return element;
      });
    return productData;
  }

  checkDisplayErrorDialog() {
    try {
      const remainningArea = this.productData[this.owner].remainingArea;
      if (+remainningArea < 0) {
        this.displayErrDialog = true;
        this.displayErrDialogMsg = 'ไม่มีพื้นที่คงเหลือเพียงพอสำหรับการก่อสร้าง โปรดกำหนดขนาดพื้นที่ใหม่อีกครั้ง';
        return '';
      }
      return '';
    } catch (e) {
      console.log('error');
    }
  }

  getImage(index: number){
    let wording = this.currentProperty;
    if (this.owner === 'competitor') {
      wording += 'Com';
    }
    return imageType[wording][index];
  }

  ngOnDestroy(){
    this.subscriptionArea.unsubscribe();
    this.subscriptionProduct.unsubscribe();
    this.subscriptionSpending.unsubscribe();
    this.subscriptionImplicitsCost.unsubscribe();
    this.subscriptionProfit.unsubscribe();
    this.subscriptionRateReturn.unsubscribe();
  }

}
