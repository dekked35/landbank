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

const needToConvert = [
  'farValue',
  'osrValue',
  'landPrice',
  'standardArea.percent.sellArea',
  'standardArea.percent.roadSize',
  'standardArea.percent.greenArea',
  'standardArea.percent.room',
  'standardSellAreaRatio.typeOne',
  'standardSellAreaRatio.typeTwo',
  'standardSellAreaRatio.typeThree',
  'standardRoomArea.percent.deluxe',
  'standardRoomArea.percent.superDeluxe',
  'standardArea.percent.central',
  'standardArea.percent.parking',
  'standardArea.percent.outdoor'
];

const ratioConvert = [
  'deposit',
  'rentPerMonth',
  'rentNoYear'
];

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
  totalArea: number;
  landPrice: number;
  availableArea: number;
  standardArea: any;
  error: any;
  allArea: number;
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
    typeOne: 50,
    typeTwo: 25,
    typeThree: 25
  };

  displayDialog = false;
  selectedParking = true;

  displayDialogMsg: string;

  constructor(private store: Store<any>,
    private defaultsVariableService: DefaultsVariableService,
    private requestManagerService: RequestManagerService,
    private calculatorManagerService: CalculatorManagerService,
    private shemaManagerService: SchemaManagerService) {

      this.store.select(fromCore.getPage)
      .subscribe(data => {

        if (data.page !== this.propertyType) {
          const isReloadData = (this.propertyType === '') ? false : true;
          this.propertyType = data.page;
          this.initializeAreaSchema(isReloadData);
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

    this.reloadData(true);

    this.store.select(fromCore.getProduct)
      .subscribe(data => {
        this.is_loading_product = data.isLoading;
        this.productData = data.payload;
      });

    this.store.select(fromCore.getSpendings)
      .subscribe(data => {
        this.is_loading_product = data.isLoading;
        this.spendingsData = data.payload;
      });

  }

  initializeAreaSchema(isReloadData: boolean) {
    this.store.dispatch(new areaAction.IsLoadingAction(true));
    let areaData = this.shemaManagerService.getAreaSchema(this.propertyType);
    areaData = this.calculatorManagerService.calculateArea(areaData);
    this.store.dispatch(new areaAction.SuccessAction(areaData));


    const productData = this.shemaManagerService.getProductSchema(this.propertyType);
    if (['village', 'townhome'].includes(this.propertyType)) {
      this.standardSellAreaRatio.typeOne = productData.user.products[0].ratio;
      this.standardSellAreaRatio.typeTwo = productData.user.products[1].ratio;
      this.standardSellAreaRatio.TypeThree = productData.user.products[2].ratio;
    }


    this.farValue = areaData.farValue;
    this.osrValue = areaData.osrValue;
    this.totalArea = 10000;
    this.landPrice = areaData.landPrice;
    this.availableArea = areaData.availableArea;
    // this.areaData.costLandType = areaData.costLandType;
    // this.store.dispatch(new areaAction.IsLoadingAction(false));

    this.models = this.defaultsVariableService.getAreaRatio(this.propertyType);
    this.selectedModel = this.defaultsVariableService.getDefaultAreaAtio(this.propertyType);
    this.standardArea = this.defaultsVariableService.getAreaUnit(this.propertyType, this.selectedModel.id);
    this.checkInnerWidth();
    this.reloadData(isReloadData);
  }

  changeModel() {
    this.standardArea = this.defaultsVariableService.getAreaUnit(this.propertyType, this.selectedModel.id);
    this.calculateAreaRatio(null);
  }

  InputChange($event) {
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
    if (this.areaData.costLandType === 'rent') {
      this.areaData.costLand = 0;
      this.convertNum();
      this.reloadData(true);
    } else {
      this.areaData = this.calculatorManagerService.calculateArea(this.areaData);
    }
  }

  calculateAreaRatio($event) {
    const percent = this.standardArea.percent;
    let totalAreaRatio = 0;
    for (let [key, value] of Object.entries(percent)) {
      totalAreaRatio += +value;
    }
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
    const maxProduct = newProductData.user.products.reduce((sum, data) => data.ratio + sum, 0);
    if(maxProduct > 100) {
      this.displayDialogMsg = 'โปรดระบุสัดส่วนของพื้นที่ขายให้ถูกต้อง โดยสัดส่วนพื้นที่ต้องรวมกันไม่เกิน 100% เท่านั้น';
      this.displayDialog = true;
    } else {
      this.displayDialog = false;
      this.store.dispatch(new productAction.SuccessAction(newProductData));
    }
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

  reloadData(isReload: boolean) {
    if(isReload) {
      let costLandType = (this.areaData.costLandType === undefined || this.areaData.costLandType === '') ? 'buy' : this.areaData.costLandType;
      this.convertNum();
      this.getAreaBasicService(+this.osrValue, +this.farValue, +this.totalArea, +this.landPrice, +this.areaData.availableArea, costLandType);
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
    // this.allArea = Object.values(this.standardArea.area).map( (x) => console.log(x))
    let test = Object.values(this.standardArea.area).reduce( (acc: number, cur: number) => acc + cur)
    if (typeof test === 'number' && test <= 10000) {
      this.allArea = test;
      this.standardArea.percent.greenArea = 100 - this.standardArea.percent.roadSize - this.standardArea.percent.sellArea;
      this.standardArea.area.greenArea = 10000 - this.standardArea.area.roadSize - this.standardArea.area.sellArea;
    }
    // Remove this after bank remove API.
    // console.log('Assign : ' +  costLandType);
    // this.areaData.availableArea = areaData.availableArea;
    newAreaData.costLandType = costLandType;
    newAreaData.deposit = this.areaData.deposit;
    newAreaData.rentPerMonth = this.areaData.rentPerMonth;
    newAreaData.rentNoYear = this.areaData.rentNoYear;
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
