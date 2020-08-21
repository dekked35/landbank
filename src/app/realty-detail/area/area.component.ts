import { Component, OnInit, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { SelectItem } from 'primeng/api';

import { DefaultsVariableService } from '../../core/services/defaults-variable.service';
import { SchemaManagerService } from '../../core/services/schema-manager.service';
import { RequestManagerService } from '../../core/services/request-manager.service';
import { CalculatorManagerService } from '../../core/services/calculator-manager.service';

import * as pageAction from '../../core/actions/page.actions';
import * as areaAction from '../../core/actions/area.actions';
import * as fromCore from '../../core/reducers';
import * as productAction from '../../core/actions/product.actions';
import { ActivatedRoute } from '@angular/router';

const ratioConvert = [
  'deposit',
  'rentPerMonth',
  'rentNoYear'
];

const villageWord = [
  'บ้าน 1 ชั้น',
  'บ้าน 2 ชั้น',
  'บ้าน 3 ชั้น',
  'ถนน',
  'พื้นที่สีเขียว'
];

const hotelWord = [
  'Pool Villa',
  'Family Room',
  'Jacuzzi Villa',
  'ส่วนของพื้นที่จอดรถ',
  'ส่วนของพื้นที่ภายนอกห้องพัก'
];


const imageType = {
  village : {
    0 : 'home1.svg',
    1 : 'home2.svg',
    2 : 'home3.svg'
  },
  resort : {
    0 : "room/Pool Villa.svg",
    1 : "room/Family Room.svg",
    2 : "room/Jacuzzi Villa.svg",
  }
};

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})

export class AreaComponent implements OnInit {

  is_loading: boolean;
  is_loading_product: boolean;
  areaData: any;
  productData: any; // hotel, condo, commall
  tempProductData: any;
  spendingsData: any;

  propertyType = '';
  rating = 3;
  // models: SelectItem[];
  totalAreaRatio = 0;
  raminingAreaRatio = 0;
  selectedModel: any;
  models: Array<any> = [];

  farValue: number;
  osrValue: number;
  lawAreaUsage: number;
  totalArea: number;
  landPrice: number;
  availableArea: number;
  standardArea: any;
  error: any;
  allArea: number;
  param: any;
  colorsTown: Array<any> = [
    { label: 'Orange', color: '#ff8407' },
    { label: 'Orange', color: '#FFFC10' },
    { label: 'Orange', color: '#A13101' },
    { label: 'Orange', color: '#FF0204' },
    { label: 'Orange', color: '#720EFD' },
    { label: 'Orange', color: '#FEA0FF' },
    { label: 'Orange', color: '#006200' },
    { label: 'Orange', color: '#FFCED1' },
    { label: 'Orange', color: '#2263FF' }
  ];

  standardRoomArea: any = {
    percent : {
      deluxe: 80,
      superDeluxe: 20
    },
    area : {
      deluxe: 0,
      superDeluxe: 0
    }
  };

  // Hot fix.
  standardSellAreaRatio: any = {
    typeOne: 0,
    typeTwo: 0,
    typeThree: 0
  };

  standardCenterArea: any = {
    swimming: 0,
    fitnessZone: 0,
    officeZone: 0,
  };

  centerAreaSave: any = {
    swimming: 0,
    fitnessZone: 0,
    officeZone: 0,
  }

  displayDialog = false;
  selectedParking = true;

  displayDialogMsg: string;

  constructor(private store: Store<any>,
    private defaultsVariableService: DefaultsVariableService,
    private requestManagerService: RequestManagerService,
    private calculatorManagerService: CalculatorManagerService,
    private shemaManagerService: SchemaManagerService,
    private route: ActivatedRoute
    ) {
      this.store.select(fromCore.getPage)
      .subscribe(data => {
        if (data.page !== this.propertyType) {
          const isReloadData = (this.propertyType === '') ? false : true;
          const isNewPage = (this.propertyType !== '' && this.propertyType !== data.page && Object.keys(this.param).length > 0 ) ? true : false;
          this.propertyType = data.page;
          this.initializeAreaSchema(isReloadData, isNewPage);
        }
      });
  }

  ngOnInit() {
    this.store.select(fromCore.getArea)
    .subscribe(data => {
      this.is_loading = data.isLoading;
      this.areaData = this.calculatorManagerService.calculateArea(this.parseObject(data.payload));
      this.error = data.error;
    });
    this.route.queryParams.subscribe(params => {
      this.param = params;
      if(Object.keys(this.param).length > 0){
        this.reloadDataParam(true,this.param)
      }
    })
    this.reloadData(true);

    this.store.select(fromCore.getProduct)
      .subscribe(data => {
        this.is_loading_product = data.isLoading;
        this.productData = data.payload;
        this.checkRatio(this.productData)
      });

    this.store.select(fromCore.getSpendings)
      .subscribe(data => {
        this.is_loading_product = data.isLoading;
        this.spendingsData = data.payload;
      });

  }

  initializeAreaSchema(isReloadData: boolean, isNewPage ?: boolean) {
    this.store.dispatch(new areaAction.IsLoadingAction(true));
    let areaData = this.shemaManagerService.getAreaSchema(this.propertyType);

    areaData = this.calculatorManagerService.calculateArea(areaData);
    this.store.dispatch(new areaAction.SuccessAction(areaData));


    const productData = this.shemaManagerService.getProductSchema(this.propertyType);
    if (['village', 'townhome'].includes(this.propertyType)) {
      this.standardSellAreaRatio.typeOne = productData.user.products[0].ratio;
      this.standardSellAreaRatio.typeTwo = productData.user.products[1].ratio;
      this.standardSellAreaRatio.typeThree = productData.user.products[2].ratio;
    }
    if (this.propertyType === 'village') {
      this.standardCenterArea.swimming = areaData.standardArea.centerArea.swimming;
      this.standardCenterArea.fitnessZone = areaData.standardArea.centerArea.fitnessZone;
      this.standardCenterArea.officeZone = areaData.standardArea.centerArea.officeZone;
    }

    this.lawAreaUsage = areaData.farValue * areaData.totalArea *4;
    this.farValue = areaData.farValue;
    this.osrValue = areaData.osrValue;
    this.totalArea = areaData.totalArea;
    this.landPrice = areaData.landPrice;
    this.availableArea = areaData.availableArea;
    // this.areaData.costLandType = areaData.costLandType;
    // this.store.dispatch(new areaAction.IsLoadingAction(false));

    this.models = this.defaultsVariableService.getAreaRatio(this.propertyType);
    this.selectedModel = this.defaultsVariableService.getDefaultAreaAtio(this.propertyType);
    this.standardArea = this.defaultsVariableService.getAreaUnit(this.propertyType, this.selectedModel.id);
    this.checkInnerWidth();
    if(isNewPage) {
      this.reloadDataParam(isReloadData,this.param)
    } else {
      this.reloadData(isReloadData);
    }
  }

  changeModel() {
    this.standardArea = this.defaultsVariableService.getAreaUnit(this.propertyType, this.selectedModel.id);
    const productData = this.shemaManagerService.getProductSchema(this.propertyType).user.products;
    const newProductData = this.parseObject(this.productData);
    // const newProductData = this.parseObject(this.areaData);
    if(this.selectedModel.id === 4) {
      this.standardSellAreaRatio = {
        typeOne: 0,
        typeTwo: 0,
        typeThree: 0
      };
      this.standardCenterArea = {
        swimming: 0,
        fitnessZone: 0,
        officeZone: 0,
      }
      this.areaData.standardArea.centerArea = {
        swimming: 0,
        fitnessZone: 0,
        officeZone: 0
      }
      newProductData.user.products.map(element => {
        element.ratio = 0;
        return element;
      });
      this.productData = newProductData;
      this.store.dispatch(new productAction.SuccessAction(newProductData));
    } else {
      this.standardSellAreaRatio.typeOne = productData[0].ratio;
      this.standardSellAreaRatio.typeTwo = productData[1].ratio;
      this.standardSellAreaRatio.typeThree = productData[2].ratio;
      if (this.propertyType === 'village') {
        this.standardCenterArea.swimming = this.standardArea.centerArea.swimming;
        this.standardCenterArea.fitnessZone = this.standardArea.centerArea.fitnessZone;
        this.standardCenterArea.officeZone = this.standardArea.centerArea.officeZone;
      }
      newProductData.user.products.map((element,index) => {
        element.ratio = productData[index].ratio;
        return element;
      });
      this.productData = newProductData;
      this.store.dispatch(new productAction.SuccessAction(newProductData));
    }
    this.calculateAreaRatio(null);
  }

  InputChange($event) {
    this.reloadData(true);
  }

  InputChangeTotalArea($event){
    if (this.propertyType === 'village'){
      const newStandartArea = this.parseObject(this.standardArea)
      const allSellArea = newStandartArea.percent.centerArea + newStandartArea.percent.sellArea;
      const centerArea: any = Object.values(newStandartArea.centerArea).reduce((t: number, value: number) => t + value, 0);
      const newRatioCenter = (centerArea *1.25 / 4)  / parseFloat(this.totalArea.toString().replace(/,/g, '')) * 100;
      newStandartArea.percent.centerArea = newRatioCenter;
      newStandartArea.percent.sellArea = allSellArea - newRatioCenter;
      this.standardArea = newStandartArea;
    }
    this.reloadData(true);
  }

  convertNum() {
    for (const item in this.areaData) {
      if (ratioConvert.includes(item)) {
        this.areaData[item] = parseFloat(this.areaData[item].toString().replace(/,/g, ''));
      }
    }
    this.totalArea = parseFloat(this.totalArea.toString().replace(/,/g, ''));
    this.landPrice = parseFloat(this.landPrice.toString().replace(/,/g, ''));

  }

  clickRatio () {
    this.convertNum();
    if (this.areaData.costLandType === 'buy') {
      this.areaData = this.calculatorManagerService.calculateArea(this.areaData);
    }
    this.reloadData(true);
  }

  checkRatio(product: any) {
    if (['village', 'townhome'].includes(this.propertyType) && product.user.length > 0) {
      this.standardSellAreaRatio.typeOne = product.user.products[0].ratio;
      this.standardSellAreaRatio.typeTwo = product.user.products[1].ratio;
      this.standardSellAreaRatio.typeThree = product.user.products[2].ratio;
    }
  }

  calculateAreaRatio($event) {
    const percent = this.standardArea.percent;
    let totalAreaRatio = 0;
    for (let [key, value] of Object.entries(percent)) {
      totalAreaRatio += +value;
    }
    Object.keys(this.standardArea.percent).forEach(element => {
      if(this.standardArea.percent[element] === '') {
        this.standardArea.percent[element] = 0;
      } else {
        this.standardArea.percent[element] = parseFloat(this.standardArea.percent[element].toString().replace(/,/g, ''))
      }
    });
    this.totalAreaRatio = totalAreaRatio;
    this.raminingAreaRatio = 100 - this.totalAreaRatio;
    this.checkDisplayDialog(percent);
    if (this.totalAreaRatio <= 100) {
      this.reloadData(true);
    }

  }

  // Hot Fixed solution, Customer need quickly.
  updateProductRatio(index: number, percent: number) {
    const newProductData = this.parseObject(this.productData);
    newProductData.user.products[index].ratio = +percent;
    newProductData.competitor.products[index].ratio = +percent;
    const maxProduct = newProductData.user.products.reduce((sum, data) => {
      let changeToNum = data.ratio;
      changeToNum = typeof changeToNum === 'string' ? parseFloat(changeToNum.toString().replace(/,/g, '')) : changeToNum;
      return changeToNum + sum;
    } , 0);
    if(maxProduct > 100) {
      this.displayDialogMsg = 'โปรดระบุสัดส่วนของพื้นที่ขายให้ถูกต้อง โดยสัดส่วนพื้นที่ต้องรวมกันไม่เกิน 100% เท่านั้น';
      this.displayDialog = true;
    } else {
      this.displayDialog = false;
      this.store.dispatch(new productAction.SuccessAction(newProductData));
      this.reloadData(true);
    }
  }
// uncomplete
  updateCenterAreaRatio() {
    const newAreaData = this.parseObject(this.areaData);
    const newStandard = this.parseObject(this.standardArea)
    this.centerAreaSave = {
      swimming : parseFloat(this.standardCenterArea.swimming.toString().replace(/,/g, '')) / 4,
      fitnessZone : parseFloat(this.standardCenterArea.fitnessZone.toString().replace(/,/g, '')) / 4,
      officeZone : parseFloat(this.standardCenterArea.officeZone.toString().replace(/,/g, '')) / 4
    };
    const centerZone = Object.keys(this.centerAreaSave).reduce((sum, data) => this.centerAreaSave[data] + sum, 0) * 1.25;
    newStandard.area.centerArea = centerZone;
    newStandard.percent.centerArea = centerZone/ newAreaData.availableArea * 100;
    newStandard.centerArea = this.centerAreaSave;
    let totalAreaRatio = 0;
    for (let [key, value] of Object.entries(newStandard.percent)) {
      totalAreaRatio += +value;
    }
    Object.keys(this.standardArea.percent).forEach(element => {
      this.standardArea.percent[element] = parseFloat(this.standardArea.percent[element].toString().replace(/,/g, ''))
    });
    this.totalAreaRatio = totalAreaRatio;
    this.raminingAreaRatio = 100 - this.totalAreaRatio;
    this.standardArea = newStandard;
    this.checkDisplayDialog(newStandard.percent);
    if (this.totalAreaRatio <= 100) {
      this.reloadData(true);
    }
    // this.reloadData(true);
  }

  convertToNum(item: any){
    Object.keys(item).forEach(block => item[block] = parseFloat(item[block].toString().replace(/,/g, '')))
    return item;
  }

  // hot Fixed solution
  updateProductRoomRatio($event) {
    const percent = this.standardRoomArea.percent;
    const newProductData = this.parseObject(this.productData);
    let totalAreaRatio = 0;
    for (let [key, value] of Object.entries(percent)) {
      totalAreaRatio += +value;
    }

    if(totalAreaRatio > 100) {
      this.displayDialogMsg = 'โปรดระบุสัดส่วนของพื้นที่รวมห้องพักให้ถูกต้อง โดยสัดส่วนพื้นที่ต้องรวมกันไม่เกิน 100% เท่านั้น';
      this.displayDialog = true;
    } else {
      this.displayDialog = false;
      const userRooms = this.calculatorManagerService.estimateRoomProduct(this.areaData, newProductData.user.rooms, this.standardRoomArea);
      newProductData.user.rooms = userRooms;
      newProductData.competitor.rooms = userRooms;
      this.store.dispatch(new productAction.TriggerRoomAction(true));
      this.store.dispatch(new productAction.SuccessAction(newProductData));
      this.store.dispatch(new productAction.TriggerRoomAction(false));
    }
  }

  clickParkingRatio() {
    if (this.selectedParking) {
      this.standardArea.percent.parking = 10;
    } else {
      this.standardArea.percent.parking = 0;
    }
    this.calculateAreaRatio(null);
  }

  reloadDataParam(isReload: boolean,param: any) {
    const params = this.convertParamToObject(param)
    const costLandType = ((this.areaData.costLandType === undefined || this.areaData.costLandType === '') && isReload) ? 'buy' : this.areaData.costLandType;
    this.convertNum();
    this.lawAreaUsage = params.far * params.totalArea *4;
    this.farValue = params.far;
    this.osrValue = params.osr;
    this.totalArea = params.totalArea;
    this.landPrice = params.landPrice;
    this.availableArea = ['village','townhome'].includes(this.propertyType) ? +params.totalArea : params.far * params.landPrice;
    if (this.propertyType === 'village'){
      const newStandartArea = this.parseObject(this.standardArea)
      const allSellArea = newStandartArea.percent.centerArea + newStandartArea.percent.sellArea;
      const centerArea: any = Object.values(newStandartArea.centerArea).reduce((t: number, value: number) => t + value, 0);
      const newRatioCenter = (centerArea *1.25 / 4)  / this.totalArea * 100;
      newStandartArea.percent.centerArea = newRatioCenter;
      newStandartArea.percent.sellArea = allSellArea - newRatioCenter;
      this.standardArea = newStandartArea;
    }
    this.reloadData(true);
    this.getAreaBasicService(+this.osrValue, +this.farValue, +this.totalArea, +this.landPrice, +this.areaData.availableArea, costLandType);
  }

  reloadData(isReload: boolean) {
    if(isReload) {
      const costLandType = ((this.areaData.costLandType === undefined || this.areaData.costLandType === '') && isReload) ? 'buy' : this.areaData.costLandType;
      this.convertNum();
      this.getAreaBasicService(+this.osrValue, +this.farValue, +this.totalArea, +this.landPrice, +this.areaData.availableArea, costLandType);
    } else {
      // const fromParam = this.convertParamToObject(this.param)
      // this.getAreaBasicService(fromParam.osr, fromParam.far, fromParam.totalArea, fromParam.landPrice, fromParam.totalArea, costLandType);
    }
  }

  checkDisplayDialog(percent) {
    let maxLimit = false;
    // let minLimit = false;
    if (this.selectedModel.id === 4 && this.totalAreaRatio > 100) {
      maxLimit = true;
      this.displayDialogMsg = 'โปรดระบุสัดส่วนพื้นที่ให้ถูกต้อง โดยสัดส่วนพื้นที่ต้องรวมกันไม่เกิน 100% เท่านั้น'
    }

    // if(this.selectedModel.id === 4 && this.totalAreaRatio < 100)  {
    //   minLimit = true;
    //   this.displayDialogMsg = 'กรุณาระบุข้อมูลสัดส่วนพื้นที่ให้ครบถ้วน โดยสัดส่วนพื้นที่ต้องรวมกันไม่เกิน 100% เท่านั้น';
    // } || minLimit

    if (maxLimit) {
      this.displayDialog = true;
    } else {
      this.displayDialog = false;
    }
  }

  convertParamToObject(params: any){
    const paramNew = this.parseObject(params)
    Object.keys(paramNew).forEach( item => {
      if (['osr', 'far','totalArea','landPrice'].includes(item)){
          paramNew[item] = parseFloat(paramNew[item].toString().replace(/,/g, ''));
      } else if (['colorTown'].includes(item)) {
        paramNew[item] = ['#', paramNew[item]].join('');
      }
    })
    return paramNew;
  }

  async getAreaBasicService(osrValue: number, farValue: number, totalArea: number, landPrice: number, availableArea: number, costLandType: string) {
    let areaData = {
      'townPlanColor': this.areaData.townPlanColor,
      'farValue': farValue,
      'osrValue': osrValue,
      'totalArea': totalArea,
      'landPrice': landPrice,
      'land_price' : landPrice,
      'usableArea': totalArea, // Not use this one but API still require
      'availableArea' : availableArea,
      'standardArea': this.parseObject(this.standardArea),
      'costLand' : this.areaData.costLand,
      'costLandType' : costLandType,
      'deposit': this.areaData.deposit,
      'rentPerMonth' : this.areaData.rentPerMonth,
      'rentNoYear' : this.areaData.rentNoYear,
    };
    areaData = this.calculatorManagerService.calculateArea(areaData);
    this.store.dispatch(new areaAction.IsLoadingAction(true));
    let newAreaData = await this.requestManagerService.requestArea(areaData);
    this.standardArea.area = newAreaData.standardArea.area;
    this.lawAreaUsage = newAreaData.farValue * newAreaData.totalArea *4;
    newAreaData.deposit = newAreaData.deposit ? newAreaData.deposit : this.areaData.deposit;
    newAreaData.rentPerMonth = newAreaData.rentPerMonth ? newAreaData.rentPerMonth : this.areaData.rentPerMonth;
    newAreaData.rentNoYear = newAreaData.rentNoYear ? newAreaData.rentNoYear : this.areaData.rentNoYear;
    newAreaData = this.calculatorManagerService.calculateArea(newAreaData);
    this.store.dispatch(new areaAction.SuccessAction(newAreaData));
    this.store.dispatch(new areaAction.IsLoadingAction(false));
  }

  parseObject(data: any) {
    return JSON.parse(JSON.stringify(data));
  }

  getStyleTown() {
    return { 'background-color:': this.areaData.townPlanColor }
  }

  getScoreColor(type: string) {
    if (type === 'มาก') {
      return { 'color': 'green' };
    }
    if (type === 'ปานกลาง') {
      return { 'color': 'orange' };
    }
    if (type === 'น้อย') {
      return { 'color': 'red' };
    }
  }

  getWordingType(index: number){
    if(this.propertyType === 'village'){
      return villageWord[index];
    } else {
      return hotelWord[index];
    }
  }

  getImage(index: number){
    return imageType[this.propertyType][index]
  }

  tableSize: any;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkInnerWidth();
  }

  checkInnerWidth() {
    if (window.innerWidth < 500) {
      this.tableSize = { 'width': '320px' };

    } else {
      this.tableSize = { 'width': '480px' };
    }
  }
}
