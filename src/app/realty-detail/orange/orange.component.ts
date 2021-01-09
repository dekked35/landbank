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
import { parse } from 'querystring';

const ratioConvert = ['deposit', 'rentPerMonth', 'rentNoYear'];

const villageWord = [
  'บ้าน 1 ชั้น',
  'บ้าน 2 ชั้น',
  'บ้าน 3 ชั้น',
  'ถนน',
  'พื้นที่สีเขียว',
];

const hotelWord = [
  'Pool Villa',
  'Family Room',
  'Jacuzzi Villa',
  'ส่วนของพื้นที่จอดรถ',
  'ส่วนของพื้นที่ภายนอกห้องพัก',
];

const condoValue = {
  typeA: [
    {
      type: 'ห้องพัก',
      name: '1 Bedroom (A)',
      area: 32,
      noRoom: 0,
    },
    {
      type: 'ห้องพัก',
      name: '2 Bedroom (A)',
      area: 55,
      noRoom: 0,
    },
    {
      type: 'ห้องพัก',
      name: '3 Bedroom (A)',
      area: 75,
      noRoom: 0,
    },
  ],
  typeB: [
    {
      type: 'ห้องพัก',
      name: '1 Bedroom (B)',
      area: 35,
      noRoom: 0,
    },
    {
      type: 'ห้องพัก',
      name: '2 Bedroom (B)',
      area: 60,
      noRoom: 0,
    },
    {
      type: 'ห้องพัก',
      name: '3 Bedroom (B)',
      area: 80,
      noRoom: 0,
    },
  ],
};

const imageType = {
  village: {
    0: 'home1.svg',
    1: 'home2.svg',
    2: 'home3.svg',
  },
  resort: {
    0: 'room/Pool Villa.svg',
    1: 'room/Family Room.svg',
    2: 'room/Jacuzzi Villa.svg',
  },
};

@Component({
  selector: 'app-orange',
  templateUrl: './orange.component.html',
  styleUrls: ['./orange.component.css'],
})
export class OrangeComponent implements OnInit {

  constructor(
    private store: Store<any>,
    private defaultsVariableService: DefaultsVariableService,
    private requestManagerService: RequestManagerService,
    private calculatorManagerService: CalculatorManagerService,
    private shemaManagerService: SchemaManagerService,
    private route: ActivatedRoute
  ) {
    this.store.select(fromCore.getPage).subscribe((data) => {
      if (data.page !== this.propertyType) {
        const isReloadData = this.propertyType === '' ? false : true;
        const isNewPage =
          this.propertyType !== '' &&
          this.propertyType !== data.page &&
          Object.keys(this.param).length > 0
            ? true
            : false;
        this.propertyType = data.page;
        this.initializeAreaSchema(isReloadData, isNewPage);
      }
    });
  }
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
  param: any;
  setArea: number;
  bedRoom = 5;
  restRoom = 7;
  provience = 'กรุงเทพ';
  floor = 3;
  location = '16/90 แขวงวชิระพยาบาล เขตดุสิต กรุงเทพมหานคร'

  standardRoomArea: any = {
    percent: {
      deluxe: 80,
      superDeluxe: 20,
      poolVilla: 50,
      familyRoom: 25,
      jacuzziVilla: 25,
    },
    area: {
      deluxe: 0,
      superDeluxe: 0,
    },
  };

  standardRoomAreaCondo: any = {
    percentA: {
      bedRoom1: 50,
      bedRoom2: 25,
      bedRoom3: 25,
    },
    percentB: {
      bedRoom1: 50,
      bedRoom2: 25,
      bedRoom3: 25,
    },
  };

  standardRoomAreaCommu: any = {
    percent : {
      storeBooth: 50,
      smallBooth: 50
    }
  };

  // Hot fix.
  standardSellAreaRatio: any = {
    typeOne: 0,
    typeTwo: 0,
    typeThree: 0,
  };

  standardCenterArea: any = {
    swimming: 0,
    fitnessZone: 0,
    officeZone: 0,
  };

  standardCentralProduct: any = {
    hotel: [
      { name: 'Lobby', type: 'ส่วนกลาง', area: 80, noRoom: 0 },
      { name: 'Pool', type: 'ส่วนกลาง', area: 50, noRoom: 0 },
      { name: 'BOH & Store', type: 'ส่วนกลาง', area: 150, noRoom: 0 },
      { name: 'Restaurant', type: 'ส่วนกลาง', area: 120, noRoom: 0 },
      { name: 'Spa', type: 'ส่วนกลาง', area: 60, noRoom: 0 },
      { name: 'Gym', type: 'ส่วนกลาง', area: 50, noRoom: 0 },
      { name: 'Kitchen', type: 'ส่วนกลาง', area: 50, noRoom: 0 },
      { name: 'Kid Club', type: 'ส่วนกลาง', area: 60, noRoom: 0 },
      { name: 'Restroom', type: 'ส่วนกลาง', area: 80, noRoom: 0 },
    ],
    condo: [
      { name: 'Lobby', type: 'ส่วนกลาง', area: 87, noRoom: 0 },
      { name: 'Pool', type: 'ส่วนกลาง', area: 100, noRoom: 0 },
      { name: 'BOH & Store', type: 'ส่วนกลาง', area: 87, noRoom: 0 },
      { name: 'Spa', type: 'ส่วนกลาง', area: 107, noRoom: 0 },
      { name: 'Gym', type: 'ส่วนกลาง', area: 107, noRoom: 0 },
      { name: 'Lobby lounge', type: 'ส่วนกลาง', area: 87, noRoom: 0 },
      { name: 'Restroom lobby', type: 'ส่วนกลาง', area: 22, noRoom: 0 },
      { name: 'Restroom', type: 'ส่วนกลาง', area: 107, noRoom: 0 },
    ],
    communityMall: [
      { name: 'Restaurant', type: 'ส่วนกลาง', area: 60, noRoom: 0 },
      { name: 'IT Store', type: 'ส่วนกลาง', area: 30, noRoom: 0 },
      { name: 'Gym', type: 'ส่วนกลาง', area: 90, noRoom: 0 },
      { name: 'Spa', type: 'ส่วนกลาง', area: 60, noRoom: 0 },
      { name: 'Cinema', type: 'ส่วนกลาง', area: 120, noRoom: 0 },
      { name: 'Food Court', type: 'ส่วนกลาง', area: 100, noRoom: 0 },
      { name: 'General Store', type: 'ส่วนกลาง', area: 50, noRoom: 0 },
      { name: 'Learning Store', type: 'ส่วนกลาง', area: 60, noRoom: 0 },
  ],
  };

  standardCenterAreaResort: any = {
    lobby: 0,
    pool: 0,
    boh: 0,
    restroom: 0,
  };

  centerAreaSave: any = {
    swimming: 0,
    fitnessZone: 0,
    officeZone: 0,
  };

  centerAreaSaveResort: any = {
    lobby: 0,
    pool: 0,
    boh: 0,
    restroom: 0,
  };

  displayDialog = false;
  selectedParking = true;
  selectedCommunity = true;
  selectedTypeParking = true;
  selectedTypeCondo = true;
  selectedHotel = ['hotel'];
  selectedCondo = ['type1'];

  displayDialogMsg: string;

  tableSize: any;

  ngOnInit() {
    this.store.select(fromCore.getArea).subscribe((data) => {
      this.is_loading = data.isLoading;
      this.areaData = this.calculatorManagerService.calculateArea(
        this.parseObject(data.payload)
      );
      this.setValue(data.payload)
      this.error = data.error;
    });
    this.route.queryParams.subscribe((params) => {
      this.param = params;
      if (Object.keys(this.param).length > 0) {
        this.reloadDataParam(true, this.param);
      }
    });
    this.reloadData(true);

  }

  setValue(value) {
    this.farValue = value.farValue;
    this.osrValue = value.osrValue;
    this.totalArea = value.totalArea;
    this.landPrice = value.landPrice;
    this.availableArea = value.availableArea;
  }

  initializeAreaSchema(isReloadData: boolean, isNewPage?: boolean) {
    let areaData
    this.store.dispatch(new areaAction.IsLoadingAction(true));
    if(localStorage.getItem('area') && localStorage.getItem('page') === this.propertyType) {
      areaData = JSON.parse(localStorage.getItem('area'))
      this.selectedModel = {id : areaData.standardArea.id ,name : areaData.standardArea.name}
      this.standardArea = this.defaultsVariableService.getAreaUnit(
        this.propertyType,
        areaData.standardArea.id
      );
    } else {
      areaData = this.shemaManagerService.getAreaSchema(this.propertyType);
      this.selectedModel = this.defaultsVariableService.getDefaultAreaAtio(
        this.propertyType
      );
      this.standardArea = this.defaultsVariableService.getAreaUnit(
        this.propertyType,
        this.selectedModel.id
      );
    }
    areaData = this.calculatorManagerService.calculateArea(areaData);
    this.store.dispatch(new areaAction.SuccessAction(areaData));

    const productData = this.shemaManagerService.getProductSchema(
      this.propertyType
    );
    if (['village', 'townhome'].includes(this.propertyType)) {
      this.standardSellAreaRatio.typeOne = productData.user.products[0].ratio;
      this.standardSellAreaRatio.typeTwo = productData.user.products[1].ratio;
      this.standardSellAreaRatio.typeThree = productData.user.products[2].ratio;
    }
    if (this.propertyType === 'village') {
      this.standardCenterArea.swimming =
        areaData.standardArea.centerArea.swimming;
      this.standardCenterArea.fitnessZone =
        areaData.standardArea.centerArea.fitnessZone;
      this.standardCenterArea.officeZone =
        areaData.standardArea.centerArea.officeZone;
    }
    if (this.propertyType === 'resort') {
      this.standardCenterAreaResort.lobby =
        areaData.standardArea.centerArea.lobby;
      this.standardCenterAreaResort.pool =
        areaData.standardArea.centerArea.pool;
      this.standardCenterAreaResort.boh = areaData.standardArea.centerArea.boh;
      this.standardCenterAreaResort.restroom =
        areaData.standardArea.centerArea.restroom;
    }

    this.farValue = areaData.farValue;
    this.osrValue = areaData.osrValue;
    this.totalArea = areaData.totalArea;
    this.landPrice = areaData.landPrice;
    this.availableArea = areaData.availableArea;

    this.models = this.defaultsVariableService.getAreaRatio(this.propertyType);
    this.selectedParking = true;
    this.checkInnerWidth();
    this.setArea = this.availableArea * 4;
    if (isNewPage) {
      this.reloadDataParam(isReloadData, this.param);
    } else {
      this.reloadData(isReloadData);
    }
  }

  clickAddItem(string) {
    const newStandardArea = this.parseObject(this.standardArea);
    if (!this.selectedHotel.includes(string)) {
      newStandardArea.percent[string === 'hotel' || string === 'typeA' ? 'room' : 'resort'] = 0;
      this.standardArea = newStandardArea;
    }
    this.calculateAreaRatio(null);
    // this.reloadData(true)
  }

  changeModel() {
    this.standardArea = this.defaultsVariableService.getAreaUnit(
      this.propertyType,
      this.selectedModel.id
    );
    if (['village', 'townhome'].includes(this.propertyType)) {
      const newStandartArea = this.parseObject(this.standardArea);
      const allSellArea =
      newStandartArea.percent.centerArea + newStandartArea.percent.sellArea;
      const centerArea: any = Object.values(newStandartArea.centerArea).reduce(
        (t: number, value: number) => t + value,
        0
        );
      const newRatioCenter = ((centerArea * 1.25) / 4 / parseFloat(this.totalArea.toString().replace(/,/g, ''))) * 100;
      newStandartArea.percent.centerArea = newRatioCenter;
      newStandartArea.percent.sellArea = allSellArea - newRatioCenter;
      this.standardArea = newStandartArea;
    }
    const productData = this.shemaManagerService.getProductSchema(
      this.propertyType
    );
    const newProductData = this.parseObject(this.productData);
    if (this.selectedModel.id === 4) {
      this.standardSellAreaRatio = {
        typeOne: 0,
        typeTwo: 0,
        typeThree: 0,
      };
      this.standardCenterArea = {
        swimming: 0,
        fitnessZone: 0,
        officeZone: 0,
      };
      this.areaData.standardArea.centerArea = {
        swimming: 0,
        fitnessZone: 0,
        officeZone: 0,
      };
      if (['village', 'townhome'].includes(this.propertyType)) {
        newProductData.user.products.map((element) => {
          element.ratio = 0;
          return element;
        });
      }
      this.productData = newProductData;
      this.store.dispatch(new productAction.SuccessAction(newProductData));
    } else {
      if (['village', 'townhome'].includes(this.propertyType)) {
        this.standardSellAreaRatio.typeOne = productData.user.products[0].ratio;
        this.standardSellAreaRatio.typeTwo = productData.user.products[1].ratio;
        this.standardSellAreaRatio.typeThree = productData.user.products[2].ratio;
        this.standardCenterArea.swimming = this.standardArea.centerArea.swimming;
        this.standardCenterArea.fitnessZone = this.standardArea.centerArea.fitnessZone;
        this.standardCenterArea.officeZone = this.standardArea.centerArea.officeZone;
        newProductData.user.products.map((element, index) => {
          element.ratio = productData.user.products[index].ratio;
          return element;
        });
        this.productData = newProductData;
      } else if (this.propertyType === 'hotel') {
        this.updateProductRoomRatio(true);
      } else if (this.propertyType === 'condo') {
        this.updateProductRoomRatioCondo(true);
      }
      this.store.dispatch(new productAction.SuccessAction(newProductData));
    }
    this.calculateAreaRatio(null);
  }

  InputChange($event) {
    this.reloadData(true);
  }

  InputChangeTotalArea($event) {
    if (['village', 'townhome'].includes(this.propertyType)) {
      const newStandartArea = this.parseObject(this.standardArea);
      const allSellArea =
        newStandartArea.percent.centerArea + newStandartArea.percent.sellArea;
      const centerArea: any = Object.values(newStandartArea.centerArea).reduce(
        (t: number, value: number) => t + value,
        0
      );
      const newRatioCenter =
        ((centerArea * 1.25) /
          4 /
          parseFloat(this.totalArea.toString().replace(/,/g, ''))) *
        100;
      newStandartArea.percent.centerArea = newRatioCenter;
      newStandartArea.percent.sellArea = allSellArea - newRatioCenter;
      this.standardArea = newStandartArea;
    }
    this.reloadData(true);
  }

  convertNum() {
    for (const item in this.areaData) {
      if (ratioConvert.includes(item)) {
        this.areaData[item] = parseFloat(
          this.areaData[item].toString().replace(/,/g, '')
        );
      }
    }
    this.totalArea = parseFloat(this.totalArea.toString().replace(/,/g, ''));
    this.landPrice = parseFloat(this.landPrice.toString().replace(/,/g, ''));
  }

  clickRatio() {
    this.convertNum();
    if (this.areaData.costLandType === 'buy') {
      this.areaData = this.calculatorManagerService.calculateArea(
        this.areaData
      );
    }
    this.reloadData(true);
  }

  checkRatio(product: any) {
    if (
      ['village', 'townhome'].includes(this.propertyType) &&
      product.user.length > 0
    ) {
      this.standardSellAreaRatio.typeOne = product.user.products[0].ratio;
      this.standardSellAreaRatio.typeTwo = product.user.products[1].ratio;
      this.standardSellAreaRatio.typeThree = product.user.products[2].ratio;
    } else if (['hotel', 'condo', 'communityMall'].includes(this.propertyType)) {
      if (product && product.user && product.user.centrals) {
        let newStandardCentral = this.parseObject(
          this.standardCentralProduct[this.propertyType]
          );
        newStandardCentral = newStandardCentral.map( (item) => {
          item.noRoom = 0;
          return item;
        });
        product.user.centrals.forEach((element) => {
          const index = newStandardCentral.findIndex((item) => item.name === element.name);
          if (index !== -1) {
            newStandardCentral[index].noRoom = element.noRoom;
          }
        });
        this.standardCentralProduct[this.propertyType] = newStandardCentral;
      }
    }
  }

  calculateAreaRatio($event) {
    const percent = this.standardArea.percent;
    let totalAreaRatio = 0;
    for (const [key, value] of Object.entries(percent)) {
      totalAreaRatio += +value;
    }
    Object.keys(this.standardArea.percent).forEach((element) => {
      if (this.standardArea.percent[element] === '') {
        this.standardArea.percent[element] = 0;
      } else {
        this.standardArea.percent[element] = parseFloat(
          this.standardArea.percent[element].toString().replace(/,/g, '')
        );
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
      changeToNum =
        typeof changeToNum === 'string'
          ? parseFloat(changeToNum.toString().replace(/,/g, ''))
          : changeToNum;
      return changeToNum + sum;
    }, 0);
    if (maxProduct > 100) {
      this.displayDialogMsg =
        'โปรดระบุสัดส่วนของพื้นที่ขายให้ถูกต้อง โดยสัดส่วนพื้นที่ต้องรวมกันไม่เกิน 100% เท่านั้น';
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
    const newStandard = this.parseObject(this.standardArea);
    this.centerAreaSave = {
      swimming:
        parseFloat(
          this.standardCenterArea.swimming.toString().replace(/,/g, '')
        ),
      fitnessZone:
        parseFloat(
          this.standardCenterArea.fitnessZone.toString().replace(/,/g, '')
        ),
      officeZone:
        parseFloat(
          this.standardCenterArea.officeZone.toString().replace(/,/g, '')
        ),
    };
    const centerZone =
      Object.keys(this.centerAreaSave).reduce(
        (sum, data) => this.centerAreaSave[data] + sum,
        0
      ) * 1.25;
    newStandard.area.centerArea = centerZone;
    newStandard.percent.centerArea =
      (centerZone / newAreaData.availableArea) * 100;
    newStandard.centerArea = this.centerAreaSave;
    let totalAreaRatio = 0;
    for (const [key, value] of Object.entries(newStandard.percent)) {
      totalAreaRatio += +value;
    }
    Object.keys(this.standardArea.percent).forEach((element) => {
      this.standardArea.percent[element] = parseFloat(
        this.standardArea.percent[element].toString().replace(/,/g, '')
      );
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

  convertToNum(item: any) {
    Object.keys(item).forEach(
      (block) =>
        (item[block] = parseFloat(item[block].toString().replace(/,/g, '')))
    );
    return item;
  }

  // hot Fixed solution
  updateProductRoomRatio($event) {
    const percent = this.standardRoomArea.percent;
    const newProductData = this.parseObject(this.productData);
    let totalAreaRatio = 0;
    let totalResortRatio = 0;
    for (const [key, value] of Object.entries(percent)) {
      if (
        ['deluxe', 'superDeluxe'].includes(key) &&
        this.propertyType === 'hotel'
      ) {
        totalAreaRatio += +parseFloat(value.toString().replace(/,/g, ''));
      }
      if (
        ['familyRoom', 'jacuzziVilla', 'poolVilla'].includes(key) &&
        this.propertyType === 'hotel'
      ) {
        totalResortRatio += +parseFloat(value.toString().replace(/,/g, ''));
      }
    }
    if (totalAreaRatio > 100) {
      this.displayDialogMsg =
        'โปรดระบุสัดส่วนของพื้นที่รวมห้องพักให้ถูกต้อง โดยสัดส่วนพื้นที่ต้องรวมกันไม่เกิน 100% เท่านั้น';
      this.displayDialog = true;
    } else if (totalResortRatio > 100) {
      this.displayDialogMsg =
        'โปรดระบุสัดส่วนของพื้นที่รวมบ้านพักให้ถูกต้อง โดยสัดส่วนพื้นที่ต้องรวมกันไม่เกิน 100% เท่านั้น';
      this.displayDialog = true;
    }
    {
      this.displayDialog = false;
      const userRooms = this.calculatorManagerService.estimateRoomProduct(
        this.areaData,
        newProductData.user.rooms,
        this.standardRoomArea
      );
      const userResort = this.calculatorManagerService.estimateRoomProduct(
        this.areaData,
        newProductData.user.resort,
        this.standardRoomArea
      );
      newProductData.user.rooms = userRooms;
      newProductData.competitor.rooms = userRooms;
      newProductData.user.resort = userResort;
      newProductData.competitor.resort = userResort;
      this.store.dispatch(new productAction.SuccessAction(newProductData));
      // this.reloadData(true);
    }
  }

  updateProductRoomRatioCommu($event) {
    const percent = this.standardRoomAreaCommu.percent;
    const newProductData = this.parseObject(this.productData);
    let totalAreaRatio = 0;
    for (const [key, value] of Object.entries(percent)) {
        totalAreaRatio += +value;
    }
    if (totalAreaRatio > 100) {
      this.displayDialogMsg =
        'โปรดระบุสัดส่วนของพื้นที่ให้เช่าให้ถูกต้อง โดยสัดส่วนพื้นที่ต้องรวมกันไม่เกิน 100% เท่านั้น';
      this.displayDialog = true;
    } else {
      this.displayDialog = false;
      const userRooms = this.calculatorManagerService.estimateRoomProduct(
        this.areaData,
        newProductData.user.rooms,
        this.standardRoomAreaCommu
      );
      newProductData.user.rooms = userRooms;
      newProductData.competitor.rooms = userRooms;
      this.store.dispatch(new productAction.SuccessAction(newProductData));
      // this.reloadData(true);
    }
  }

  changeTypeCondo() {
    this.standardCentralProduct.condo = this.standardCentralProduct.condo.map(
      (item) => {
        item.noRoom = 0;
        return item;
      }
    );
    const newProductData = this.parseObject(this.productData);
    const newValueCondo = this.selectedTypeCondo
      ? condoValue.typeA
      : condoValue.typeB;
    const userRooms = this.calculatorManagerService.estimateRoomProduct(
      this.areaData,
      newValueCondo,
      this.standardRoomAreaCondo
    );
    newProductData.user.rooms = userRooms;
    newProductData.user.centrals = this.standardCentralProduct.condo;
    newProductData.competitor.rooms = userRooms;
    this.productData = newProductData;
    this.store.dispatch(new productAction.SuccessAction(newProductData));
  }

  updateProductRoomRatioCondo($event) {
    const percentA = this.standardRoomAreaCondo.percentA;
    const percentB = this.standardRoomAreaCondo.percentB;
    const newProductData = this.parseObject(this.productData);
    let totalAreaRatioTypeA = 0;
    let totalAreaRatioTypeB = 0;
    for (const [key, value] of Object.entries(percentA)) {
      totalAreaRatioTypeA += +parseFloat(value.toString().replace(/,/g, ''));
    }
    for (const [key, value] of Object.entries(percentB)) {
      totalAreaRatioTypeB += +parseFloat(value.toString().replace(/,/g, ''));
    }
    if (totalAreaRatioTypeA > 100 || totalAreaRatioTypeB > 100) {
      this.displayDialogMsg =
        'โปรดระบุสัดส่วนของพื้นที่รวมห้องพักให้ถูกต้อง โดยสัดส่วนพื้นที่ต้องรวมกันไม่เกิน 100% เท่านั้น';
      this.displayDialog = true;
    } else {
      this.displayDialog = false;
      const userRooms = this.calculatorManagerService.estimateRoomProduct(
        this.areaData,
        newProductData.user.rooms,
        this.standardRoomAreaCondo
      );
      const userResort = this.calculatorManagerService.estimateRoomProduct(
        this.areaData,
        newProductData.user.resort,
        this.standardRoomAreaCondo
      );
      newProductData.user.rooms = userRooms;
      newProductData.competitor.rooms = userRooms;
      newProductData.user.resort = userResort;
      newProductData.competitor.resort = userResort;
      console.log('is in')
      this.store.dispatch(new productAction.SuccessAction(newProductData));
      // this.reloadData(true);
    }
  }

  updateProductResortRatio($event) {
    const newProductData = this.parseObject(this.productData);
    let setProduct = this.standardCentralProduct[this.propertyType];
    setProduct = setProduct.map((element) => {
      element.noRoom = parseFloat(element.noRoom.toString().replace(/,/g, ''));
      return element;
    });
    newProductData.user.centrals = setProduct;
    // this.productData = newProductData;
    this.store.dispatch(new productAction.SuccessAction(newProductData));
  }

  clickParkingRatio() {
    if (this.selectedParking) {
      this.standardArea.percent.parking = 10;
    } else {
      this.standardArea.percent.parking = 0;
    }
    this.calculateAreaRatio(null);
  }

  changeParkingWord() {
    const newProductData = this.parseObject(this.productData);
    newProductData.wordingParking = this.selectedTypeParking
      ? 'ภายในกรุงเทพ'
      : 'ภายนอกกรุงเทพ';
    this.productData = newProductData;
    this.store.dispatch(new productAction.SuccessAction(newProductData));
    this.reloadData(true);
  }

  reloadDataParam(isReload: boolean, param: any) {
    const params = this.convertParamToObject(param);
    const costLandType =
      (this.areaData.costLandType === undefined ||
        this.areaData.costLandType === '') &&
      isReload
        ? 'buy'
        : this.areaData.costLandType;
    this.convertNum();
    this.areaData.lawAreaUsage = params.far * params.totalArea * 4;
    this.areaData.emptyArea =
      (this.areaData.lawAreaUsage * params.osrValue) / 100;
    this.farValue = params.far;
    this.osrValue = params.osr;
    this.totalArea = params.totalArea;
    this.landPrice = params.landPrice;
    this.availableArea = ['village', 'townhome'].includes(this.propertyType)
      ? +params.totalArea
      : params.far * params.landPrice;
    if (this.propertyType === 'village') {
      const newStandartArea = this.parseObject(this.standardArea);
      const allSellArea =
        newStandartArea.percent.centerArea + newStandartArea.percent.sellArea;
      const centerArea: any = Object.values(newStandartArea.centerArea).reduce(
        (t: number, value: number) => t + value,
        0
      );
      const newRatioCenter = ((centerArea * 1.25) / 4 / this.totalArea) * 100;
      newStandartArea.percent.centerArea = newRatioCenter;
      newStandartArea.percent.sellArea = allSellArea - newRatioCenter;
      this.standardArea = newStandartArea;
    }
    this.reloadData(true);
  }

  reloadData(isReload: boolean) {
    if (isReload) {
      const costLandType = (this.areaData.costLandType === undefined || this.areaData.costLandType === '') && isReload ? 'buy' : this.areaData.costLandType;
      this.convertNum();
      this.getAreaBasicService(
        +this.osrValue,
        +this.farValue,
        +this.totalArea,
        +this.landPrice,
        +this.areaData.availableArea,
        costLandType
      );
    }
  }

  checkDisplayDialog(percent) {
    let maxLimit = false;
    // let minLimit = false;
    if (this.selectedModel.id === 4 && this.totalAreaRatio > 100) {
      maxLimit = true;
      this.displayDialogMsg =
        'โปรดระบุสัดส่วนพื้นที่ให้ถูกต้อง โดยสัดส่วนพื้นที่ต้องรวมกันไม่เกิน 100% เท่านั้น';
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

  convertParamToObject(params: any) {
    const paramNew = this.parseObject(params);
    Object.keys(paramNew).forEach((item) => {
      if (['osr', 'far', 'totalArea', 'landPrice'].includes(item)) {
        paramNew[item] = parseFloat(
          paramNew[item].toString().replace(/,/g, '')
        );
      } else if (['colorTown'].includes(item)) {
        paramNew[item] = ['#', paramNew[item]].join('');
      }
    });
    return paramNew;
  }

  async getAreaBasicService(
    osrValue: number,
    farValue: number,
    totalArea: number,
    landPrice: number,
    availableArea: number,
    costLandType: string
  ) {
    let areaData = {
      townPlanColor: this.areaData.townPlanColor,
      farValue: farValue,
      osrValue: osrValue,
      totalArea: totalArea,
      landPrice: landPrice,
      land_price: landPrice,
      usableArea: totalArea, // Not use this one but API still require
      availableArea: availableArea,
      standardArea: this.parseObject(this.standardArea),
      costLand: this.areaData.costLand,
      costLandType: costLandType,
      deposit: this.areaData.deposit,
      rentPerMonth: this.areaData.rentPerMonth,
      rentNoYear: this.areaData.rentNoYear,
      coverArea : this.areaData.coverArea,

    };
    areaData = this.calculatorManagerService.calculateArea(areaData);
    this.store.dispatch(new areaAction.IsLoadingAction(true));
    let newAreaData = await this.requestManagerService.requestArea(areaData);
    // if(this.selectedModel.id !== 4 ) {
      this.standardArea = this.calculateNewStandardArea(newAreaData);
    // }
    this.standardArea.area = newAreaData.standardArea.area;
    // this.standardArea.percent = newAreaData.percent;
    newAreaData.deposit = newAreaData.deposit
    ? newAreaData.deposit
    : this.areaData.deposit;
    newAreaData.rentPerMonth = newAreaData.rentPerMonth
    ? newAreaData.rentPerMonth
    : this.areaData.rentPerMonth;
    newAreaData.rentNoYear = newAreaData.rentNoYear
    ? newAreaData.rentNoYear
    : this.areaData.rentNoYear;
    newAreaData = this.calculatorManagerService.calculateArea(newAreaData);
    newAreaData.wordParking = this.selectedTypeParking ? 'ภายในกรุงเทพ' : 'ภายนอกกรุงเทพ';
    this.store.dispatch(new areaAction.SuccessAction(newAreaData));
    this.store.dispatch(new areaAction.IsLoadingAction(false));
  }

  parseObject(data: any) {
    return JSON.parse(JSON.stringify(data));
  }

  getStyleTown() {
    return { 'background-color:': this.areaData.townPlanColor };
  }

  getScoreColor(type: string) {
    if (type === 'มาก') {
      return { color: 'green' };
    }
    if (type === 'ปานกลาง') {
      return { color: 'orange' };
    }
    if (type === 'น้อย') {
      return { color: 'red' };
    }
  }

  getWording(type: boolean) {
    if (type) {
      return 'ภายในกรุงเทพ';
    } else {
      return 'ภายนอกกรุงเทพ';
    }
  }

  getWordingType(index: number) {
    if (this.propertyType === 'village') {
      return villageWord[index];
    } else {
      return hotelWord[index];
    }
  }

  getImage(index: number) {
    return imageType[this.propertyType][index];
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkInnerWidth();
  }

  checkInnerWidth() {
    if (window.innerWidth < 500) {
      this.tableSize = { width: '320px' };
    } else {
      this.tableSize = { width: '480px' };
    }
  }

  calculateNewStandardArea(areaData) {
    let all = 0;
    const itemObj = {};
    const temp = this.parseObject(areaData.standardArea);
    const {area} = temp;
    if (this.selectedModel.id === 4) {
      all = areaData.availableArea;
    } else {
      Object.values(area).forEach( item => {
        all = all + +item;
      });
    }
    Object.keys(area).forEach( item => {
      if (area[item] < 0) {
        itemObj[item] = 0;
      } else {
        itemObj[item] = parseFloat((area[item] / all * 100).toFixed(2));
      }
    });
    temp.percent = itemObj;
    return temp;
  }
}
