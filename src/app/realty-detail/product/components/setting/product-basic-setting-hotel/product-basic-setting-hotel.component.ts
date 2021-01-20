import { Component, OnInit, OnDestroy, Input, HostListener, SimpleChanges, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { DefaultsVariableService } from '../../../../../core/services/defaults-variable.service';
import { RequestManagerService } from '../../../../../core/services/request-manager.service';
import { CalculatorManagerService } from '../../../../../core/services/calculator-manager.service';
import { SchemaManagerService } from '../../../../../core/services/schema-manager.service';

import * as schemaDefault from '../../../../../core/schema/basic-type/hotel';
import * as productAction from '../../../../../core/actions/product.actions';
import * as spendingsAction from '../../../../../core/actions/spendings.actions';
import * as implicitCostsAction from '../../../../../core/actions/implicit-costs.actions';
import * as rateReturnAction from '../../../../../core/actions/rate-return.actions';

import * as fromCore from '../../../../../core/reducers';

const productSchema = schemaDefault.hotel.product;

const needToConvert = [
  'roomProducts',
  'centralProducts',
  'parkingProducts',
  'outdoorProducts',
];

const areaNoRoom = [
  'area',
  'noRoom',
];

@Component({
  selector: 'app-product-basic-setting-hotel',
  templateUrl: './product-basic-setting-hotel.component.html',
  styleUrls: ['./product-basic-setting-hotel.component.css']
})
export class ProductBasicSettingHotelComponent implements OnInit, OnDestroy, OnChanges {
  @Input() owner: string;
  @Input() isCompetitor: boolean;
  @Input() needToRefresh: boolean;
  // @Input() currentProperty: string;

  ROOM = 'room';
  CENTRAL = 'central';
  PARKING = 'parking';
  OUTDOOR = 'outdoor';
  RESORT = 'resort';

  settingHeader: string;
  settingSubHeader = '(สัดส่วน % ในโครงการต้องรวมกันได้ 100% เท่านั้น)';

  roomType: string;
  competitorColor = {};
  competitorBackground = {};
  currentProperty = '';
  areaData: any;

  enableEdit = false;
  enableEditIndex: number = null;
  typeEdit = '';
  // tempEdit: string = 'Deluxe';
  // tempEdit: string = 'Deluxe';
  tempEdit: any;

  header = {
    'competitor': 'โครงการคู่แข่ง',
    'user': 'โครงการของเรา'
  };

  // productOptions.ts
  roomTypeOptions: Array<any> = [];
  centralTypeOptions: Array<any> = [];
  parkingTypeOptions: Array<any> = [];
  outdoorTypeOptions: Array<any> = [];
  resortTypeOptions: Array<any> = [];

  // productDefault.ts
  roomProducts: Array<any> = [];
  centralProducts: Array<any> = [];
  parkingProducts: Array<any> = [];
  outdoorProducts: Array<any> = [];
  resortProducts: Array<any> = [];

  // standardSize.ts
  standardSizeRooms: Array<any> = [];
  standardSizeCentrals: Array<any> = [];
  standardSizeParkings: Array<any> = [];
  standardSizeOutdoors: Array<any> = [];
  standardSizeResorts: Array<any> = [];

  tempProducts: Array<any> = [];
  editProduct: any;

  tempProductStore: any;

  speadingData: any;
  implicitsCostData: any;
  rateReturnData: any;

  dropDownSize = { 'width': '170px' };
  iconSelectedItem = { 'width': '16px', 'vertical-align': 'middle' };
  textSelectedItem = { 'vertical-align': 'middle', 'font-size': '13.5px', 'margin-left': '.5em' };
  iconItem = { 'width': '24px', 'position': 'absolute', 'top': '1px', 'left': '5px' };
  textItem = { 'font-size': '14px', 'float': 'right', 'margin-top': '4px' };

  displayErrDialog = false;
  displayErrDialogMsg = '';
  focus = true;
  wording: '';

  constructor(private store: Store<any>,
    private requestManagerService: RequestManagerService,
    private schemaManagerService: SchemaManagerService,
    private calculatorManagerService: CalculatorManagerService,
    private defaultsVariableService: DefaultsVariableService) {

    this.store.select(fromCore.getPage)
      .subscribe(page => {
        this.currentProperty = page.page;
        console.log('is in initial')
        this.initializeProductSchema();
      });


  }
  subscriptionArea: any;
  subscriptionProduct: any;
  subscriptionSpending: any;
  subscriptionImplicitsCost: any;
  subscriptionRateReturn: any;

  async ngOnInit() {
    this.onResize(null);
    this.settingHeader = this.header[this.owner];
    this.initializeProductSchema();

    this.subscriptionArea = this.store.select(fromCore.getArea)
      .subscribe(area => {
        this.areaData = area.payload;
        if (this.areaData.ratio_area.room > 0 && ['condo', 'hotel', 'communityMall'].includes(this.currentProperty)) {
          // tslint:disable-next-line: max-line-length
            this.roomProducts = this.calculatorManagerService.estimateRoomProduct(this.areaData, this.roomProducts, null, this.currentProperty);
            // tslint:disable-next-line: max-line-length
            if ((this.currentProperty === 'hotel' || this.currentProperty === 'condo') && (this.areaData.percent.resort && this.areaData.percent.resort > 0)) {
              // tslint:disable-next-line: max-line-length
              this.resortProducts = this.calculatorManagerService.estimateRoomProduct(this.areaData, this.resortProducts, null, this.currentProperty);
            }
            if (area.payload && this.currentProperty === 'condo') {
              // const { wordParking } = area.payload
              // console.log(area.payload.wordParking)
                this.wording = this.areaData.wordParking;
            }
            this.dispatchProduct();
          }
      });

    this.subscriptionProduct = this.store.select(fromCore.getProduct)
      .subscribe(data => {
        this.tempProductStore = data.payload;
        if (this.tempProductStore && this.tempProductStore[this.owner].rooms && this.tempProductStore[this.owner].rooms.length > 0) {
          this.roomProducts = this.tempProductStore[this.owner].rooms;
          this.resortProducts = this.tempProductStore[this.owner].resort;
          this.centralProducts = this.tempProductStore[this.owner].centrals.filter( item => item.noRoom > 0);
          this.parkingProducts = this.tempProductStore[this.owner].parking;
          // this.checkDisplayErrorDialog()
        }
        if (data.payload && this.currentProperty === 'condo') {
          if (this.wording !== data.payload.wordingParking) {
            this.wording = data.payload.wordingParking;
          }
        }
      });

    this.subscriptionSpending = this.store.select(fromCore.getSpendings)
      .subscribe(data => {
        this.speadingData = data.payload;
      });

    this.subscriptionImplicitsCost = this.store.select(fromCore.getImplicitCosts)
      .subscribe(data => {
        this.implicitsCostData = data.payload;
      });

      this.subscriptionRateReturn = this.store.select(fromCore.getRateReturn)
      .subscribe(data => {
        this.rateReturnData = data.payload;
      });

    if (this.areaData.ratio_area.room > 0) {
      this.dispatchProduct();
    }

    this.competitorColor = this.owner === 'competitor' ? { 'color' : '#ff781f' } : { };
    this.competitorBackground = this.owner === 'competitor' ? { 'background-color' : '#FF781F', 'border' : '1px solid #FF781F' } : { };
  }

  delay(ms: number) {
    console.log('sleep ' + ms + ' ms');
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  initializeProductSchema() {
    this.store.dispatch(new productAction.IsLoadingAction(true));

    let productData, speadingsData, implicitCostData, profitData, rateReturnData;
    this.roomProducts = this.defaultsVariableService.getProductDefault(this.currentProperty, this.ROOM);
    this.centralProducts = this.defaultsVariableService.getProductDefault(this.currentProperty, this.CENTRAL);
    this.parkingProducts = this.defaultsVariableService.getProductDefault(this.currentProperty, this.PARKING);
    this.outdoorProducts = this.defaultsVariableService.getProductDefault(this.currentProperty, this.OUTDOOR);
    this.resortProducts = this.defaultsVariableService.getProductDefault(this.currentProperty, this.RESORT);

    this.roomTypeOptions = this.defaultsVariableService.getProductOptions(this.currentProperty, this.ROOM);
    this.centralTypeOptions = this.defaultsVariableService.getProductOptions(this.currentProperty, this.CENTRAL);
    this.parkingTypeOptions = this.defaultsVariableService.getProductOptions(this.currentProperty, this.PARKING);
    this.outdoorTypeOptions = this.defaultsVariableService.getProductOptions(this.currentProperty, this.OUTDOOR);
    this.resortTypeOptions = this.defaultsVariableService.getProductOptions(this.currentProperty, this.RESORT);

    this.standardSizeRooms = this.defaultsVariableService.getStandardSize(this.currentProperty, this.ROOM);
    this.standardSizeCentrals = this.defaultsVariableService.getStandardSize(this.currentProperty, this.CENTRAL);
    this.standardSizeParkings = this.defaultsVariableService.getStandardSize(this.currentProperty, this.PARKING);
    this.standardSizeOutdoors = this.defaultsVariableService.getStandardSize(this.currentProperty, this.OUTDOOR);
    this.standardSizeResorts = this.defaultsVariableService.getStandardSize(this.currentProperty, this.RESORT);

    if (localStorage.getItem('product') && localStorage.getItem('page') === this.currentProperty) {
      productData = JSON.parse(localStorage.getItem('product'));
    } else {
      productData = this.schemaManagerService.getProductSchema(this.currentProperty);
    }

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

    productData = this.calculatorManagerService.calculateProduct(this.areaData, productData);
    this.store.dispatch(new productAction.SuccessAction(productData));
    this.store.dispatch(new spendingsAction.SuccessAction(speadingsData));
    this.store.dispatch(new implicitCostsAction.SuccessAction(implicitCostData));
    this.store.dispatch(new rateReturnAction.SuccessAction(rateReturnData));

  }

  enableEditMethod(e, i, type, options) {
    this.typeEdit = type;
    this.enableEdit = true;
    this.enableEditIndex = i;
    const variable = this.getTypeTable(type);
    this.tempProducts = this.selectTypeValue(type);
    this.tempEdit = this[variable].find(item => item.name === this.tempProducts[i].name) ;
    this.editProduct = this.tempProducts[i];
  }

  saveButton(type, index) {
    areaNoRoom.forEach( item => {
      this.editProduct[item] = parseFloat(this.editProduct[item].toString().replace(/,/g, ''));
    });
    const variable = this.getVariable(type);
    const test = this.parseObject(this[variable]);
    test[index] = this.editProduct;
    this[variable] = test;
    this.typeEdit = type;
    this.enableEdit = false;
    this.enableEditIndex = null;
    this.dispatchProduct();
  }

  addItem(type: string) {
    this.typeEdit = type;
    this.enableEdit = true;
    const variable = this.getVariable(type);
    const initValue = this.getDefaultByType(type);
    this.tempProducts = this.parseObject(this[variable]);
    this[variable] = [...this[variable], initValue];
    this.enableEditIndex = this[variable].length - 1;
    this.editProduct = initValue;
  }

  deleteItem(index, type) {
    this.enableEdit = false;
    this.enableEditIndex = null;
    const variable = this.getVariable(type);
    const test = this.parseObject(this[variable]);
    test.splice(index, 1);
    this[variable] = test;
    this.dispatchProduct();
  }

  onChangeDropdown(e, i, type, room, roomProduct) {
    this.typeEdit = type;
    const variable = this.getVariable(type);
    this[variable][i]['name'] = e.value.name;
    this[variable][i]['area'] = e.value.size;
    this[variable][i]['noRoom'] = 1;
  }

  // cancleEdit(type) {
  //   this.typeEdit = type;
  //   const variable = this.getVariable(type);
  //   this[variable] = JSON.parse(JSON.stringify(this.tempProducts));
  //   this.tempProducts = [];
  //   this.enableEdit = false;
  // }

  getVariable(type: string) {
    if (type === this.ROOM) {
      return 'roomProducts';
    } else if (type === this.CENTRAL) {
      return 'centralProducts';
    } else if (type === this.PARKING) {
      return 'parkingProducts';
    } else if (type === this.OUTDOOR) {
      return 'outdoorProducts';
    } else if (type === this.RESORT) {
      return 'resortProducts';
    }
  }

  getTypeTable(type: string) {
    if (type === this.ROOM) {
      return 'roomTypeOptions';
    } else if (type === this.CENTRAL) {
      return 'centralTypeOptions';
    } else if (type === this.PARKING) {
      return 'parkingTypeOptions';
    } else if (type === this.OUTDOOR) {
      return 'outdoorTypeOptions';
    } else if (type === this.RESORT) {
      return 'resortTypeOptions';
    }
  }

  selectTypeValue(type: string) {
    if (type === this.ROOM) {
      return JSON.parse(JSON.stringify(this.roomProducts));
    } else if (type === this.CENTRAL) {
      return JSON.parse(JSON.stringify(this.centralProducts));
    } else if (type === this.PARKING) {
      return JSON.parse(JSON.stringify(this.parkingProducts));
    } else if (type === this.OUTDOOR) {
      return JSON.parse(JSON.stringify(this.outdoorProducts));
    } else if (type === this.RESORT) {
      return JSON.parse(JSON.stringify(this.resortProducts));
    }
  }

  getDefaultByType(type: string) {
    if (this.currentProperty === 'hotel') {
      switch (type) {
        case this.ROOM : return {
          'type': 'ห้องพัก',
          'name': 'Deluxe',
          'area': 25,
          'noRoom': 1
        };
        case this.CENTRAL : return {
          'type': 'ส่วนกลาง',
          'name': 'Lobby',
          'area': 80,
          'noRoom': 1
        };
        case this.PARKING : return {
          'type': 'ที่จอดรถ',
          'name': 'Carpark 1',
          'area': 20,
          'noRoom': 5
        };
        case this.OUTDOOR : return {
          'type': 'พื้นที่ภายนอก',
          'name': 'Garden',
          'area': 60,
          'noRoom': 1
        };
        case this.RESORT : return {
          'type'  : 'ห้องพัก',
          'name' : 'Pool Villa',
          'area' : 65,
          'noRoom' : 1
        };
      }
    } else if (this.currentProperty === 'communityMall') {
      switch (type) {
        case this.ROOM : return {
          'type': 'ร้านค้า',
          'name': 'Store Booth',
          'area': 2,
          'noRoom': 1
        };
        case this.CENTRAL : return {
          'type': 'ส่วนกลาง',
          'name': 'Back Office',
          'area': 50,
          'noRoom': 1
        };
        case this.PARKING : return {
          'type': 'ที่จอดรถ',
          'name': 'Carpark 1',
          'area': 20,
          'noRoom': 1
        };
        case this.OUTDOOR : return {
          'type': 'พื้นที่ภายนอก',
          'name': 'Garden',
          'area': 50,
          'noRoom': 1
        };
      }
    } else {
      switch (type) {
        case this.ROOM : return {
          'type': 'ห้องพัก',
          'name': '1 Bedroom (A)',
          'area': 32,
          'noRoom': 1
        };
        case this.CENTRAL : return {
          'type': 'ส่วนกลาง',
          'name': 'Lobby',
          'area': 80,
          'noRoom': 1
        };
        case this.PARKING : return {
          'type': 'ที่จอดรถ',
          'name': 'Carpark 1',
          'area': 20,
          'noRoom': 5
        };
        case this.OUTDOOR : return {
          'type': 'พื้นที่ภายนอก',
          'name': 'Garden',
          'area': 50,
          'noRoom': 1
        };
        case this.RESORT : return {
          'type'  : 'ห้องพัก',
          'name' : '1 Bedroom (B)',
          'area' : 65,
          'noRoom' : 1
        };
      }
    }
  }

  dispatchProduct() {
    const oppositeOwner = (this.owner === 'user') ? 'competitor' : 'user';
    const productData = this.parseObject(productSchema);
    this.convertValue();
    this.checkDisplayErrorDialog();
    if (!this.displayErrDialog) {
        productData[this.owner]['rooms'] = this.parseObject(this.roomProducts);
        productData[this.owner]['parking'] = this.parseObject(this.parkingProducts);
        productData[this.owner]['outdoors'] = this.parseObject(this.outdoorProducts);
        productData[this.owner]['centrals'] = this.parseObject(this.centralProducts);
        if (this.currentProperty === 'hotel' || this.currentProperty === 'condo') {
          productData[this.owner]['resort'] = this.parseObject(this.resortProducts);
        }
        try {
          productData[oppositeOwner] = this.tempProductStore[oppositeOwner];
        } catch (e) {
          const storeProduct = this.store.select(fromCore.getProduct)
          .subscribe(data => {
            this.tempProductStore = data.payload;
          });
          try {
            productData[oppositeOwner] = this.tempProductStore[oppositeOwner];
            storeProduct.unsubscribe();
          } catch (e) {
            productData[oppositeOwner] = productData[this.owner];
            storeProduct.unsubscribe();
          }
        }
        productData.wordingParking = this.wording;
        this.store.dispatch(new productAction.IsLoadingAction(true));
        this.getProductService(productData);
    }
  }

  async getProductService(product: any) {
    const payload = {
      // propertyType: this.currentProperty,
      propertyType: this.currentProperty,
      area_input: {
        ...this.areaData,
        'percent': this.areaData.standardArea.percent,
        'area': this.areaData.standardArea.percent
      },
      product_input: product
    };
    const newProductData = await this.requestManagerService.requestProduct(payload);
    this.store.dispatch(new productAction.SuccessAction(newProductData));
    this.fillInSpeading(newProductData);
  }

  parseObject(data: any) {
    return JSON.parse(JSON.stringify(data));
  }

  async fillInSpeading(productData) {
    // console.log('product speading',productData)
    // tslint:disable-next-line: max-line-length
    const speandingsData = this.calculatorManagerService.calculateProductToSpeading(productData[this.owner], this.parseObject(this.speadingData));
    // type == central means that object it's not show icon.
    console.log('is in');
    const payload = {
      'propertyType': this.currentProperty,
      'area_input': {
        ...this.areaData,
        'percent': this.areaData.standardArea.percent,
        'area': this.areaData.standardArea.percent
      },
      'product_input': productData,
      'spendings_input': this.requestManagerService.generateSpeadingInput(speandingsData)
    };

    // TODO : Remove this after Bank edit API
    const newSpendingData = await this.requestManagerService.requestSpeading(payload);
    // tslint:disable-next-line: max-line-length
    // console.log(newSpendingData)
    // newSpendingData.specialEquipments.map((data) => { if (data.type.search(/Opening/gi) !== -1) { data.cost = newSpendingData.totalCostPerMonth; } });
    this.fillInImplicitCost(productData, newSpendingData);
  }

  async fillInImplicitCost(productData, speadingData) {
    // tslint:disable-next-line: max-line-length
    const implicitsCost = this.calculatorManagerService.calculateProductToImplicitsCost(productData[this.owner], this.parseObject(this.implicitsCostData));

    const payload = {
      'propertyType': this.currentProperty,
      'area_input': {
        ...this.areaData,
        'percent': this.areaData.standardArea.percent,
        'area': this.areaData.standardArea.percent
      },
      'product_input': productData,
      'spendings_input': this.requestManagerService.generateSpeadingInput(speadingData) ,
      'implicit_costs_input': implicitsCost,
    };
    const newImplicitsCost = await this.requestManagerService.requestImplicitsCost(payload);
    this.store.dispatch(new spendingsAction.SuccessAction(speadingData));
    this.fillInRateReturn(productData, speadingData, newImplicitsCost, this.rateReturnData);
  }

  async fillInRateReturn(productData, speadingData, implicitCostData, rateReturnData) {
    const payload = {
      'propertyType': this.currentProperty,
      'area_input': {
        ...this.areaData,
        'percent': this.areaData.standardArea.percent,
        'area': this.areaData.standardArea.percent
      },
      'product_input': this.requestManagerService.generateProductInput('user', productData),
      'spendings_input': this.requestManagerService.generateSpeadingInput(speadingData),
      'implicit_costs_input': implicitCostData,
      'ipr_input': rateReturnData
    };

    this.store.dispatch(new implicitCostsAction.SuccessAction(implicitCostData));
    const newRateReturnData = await this.requestManagerService.requestIPRRateReturn(payload);
    this.store.dispatch(new rateReturnAction.SuccessAction(newRateReturnData));

  }

  getTotalArea(type: string) {
    const variable = this.getVariable(type);
    return this[variable].reduce((sum, data) => sum + (+data.area * +data.noRoom), 0);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // this.innerWidth = window.innerWidth;
    // {'width':'50px', 'height':'35px'} small size
    if (window.innerWidth < 500) {
      this.dropDownSize = { 'width': '50px' };
      this.iconSelectedItem = { 'width': '10px', 'vertical-align': 'middle' };
      this.textSelectedItem = { 'vertical-align': 'middle', 'font-size': '10px', 'margin-left': '.5em' };
      this.iconItem = { 'width': '16px', 'position': 'absolute', 'top': '1px', 'left': '2px' };
      this.textItem = { 'font-size': '10px', 'float': 'right', 'margin-top': '2px' };
    } else {
      this.dropDownSize = { 'width': '170px' };
      this.iconSelectedItem = { 'width': '16px', 'vertical-align': 'middle' };
      this.textSelectedItem = { 'vertical-align': 'middle', 'font-size': '13.5px', 'margin-left': '.2em' };
      this.iconItem = { 'width': '24px', 'position': 'absolute', 'top': '1px', 'left': '5px' };
      this.textItem = { 'font-size': '14px', 'float': 'right', 'margin-top': '4px' };
    }
  }

  checkDisplayErrorDialog() {
    try {
    console.log(this.centralProducts)
    const room_used =  this.getTotalArea(this.ROOM) + (this.getTotalArea(this.ROOM) * 0.15);
    const central_used =  this.getTotalArea(this.CENTRAL) + (this.getTotalArea(this.CENTRAL) * 0.2);
    const parking_used =  this.getTotalArea(this.PARKING) + (this.getTotalArea(this.PARKING) * 0.4);
    const outdoor_used =  this.getTotalArea(this.OUTDOOR);
    const resort_used = this.resortProducts ? this.getTotalArea(this.RESORT) + (this.getTotalArea(this.RESORT) * 0.15) : 0;

    if (+room_used > +this.areaData.standardArea.area.room) {
      this.displayErrDialog = true;
      this.displayErrDialogMsg = 'ไม่มีพื้นที่คงเหลือสำหรับพื้นที่ห้องพัก โปรดกำหนดพื้นที่ใหม่อีกครั้ง';
      console.log('Room error ' + room_used + ':' + this.areaData.standardArea.area.room );
      return '';
    }
    if (+resort_used > +this.areaData.standardArea.area.resort && +this.areaData.standardArea.area.resort > 0) {
      this.displayErrDialog = true;
      this.displayErrDialogMsg = 'ไม่มีพื้นที่คงเหลือสำหรับพื้นที่บ้านพัก โปรดกำหนดพื้นที่ใหม่อีกครั้ง';
      console.log('Room error ' + room_used + ':' + this.areaData.standardArea.area.room );
      return '';
    }
    console.log(central_used,this.areaData.standardArea.area.central)
    if (+central_used > +this.areaData.standardArea.area.central) {
      this.displayErrDialog = true;
      this.displayErrDialogMsg = 'ไม่มีพื้นที่คงเหลือสำหรับพื้นที่ส่วนกลาง โปรดกำหนดพื้นที่ใหม่อีกครั้ง';
      return '';
    }

    if (+parking_used > +this.areaData.standardArea.area.parking && this.areaData.standardArea.area.parking > 0) {
      this.displayErrDialog = true;
      this.displayErrDialogMsg = 'ไม่มีพื้นที่คงเหลือสำหรับพื้นที่จอดรถ โปรดกำหนดพื้นที่ใหม่อีกครั้ง';
      return '';
    }

    if (+outdoor_used > +this.areaData.standardArea.area.outdoor) {
      this.displayErrDialog = true;
      this.displayErrDialogMsg = 'ไม่มีพื้นที่คงเหลือสำหรับพื้นที่ภายนอก โปรดกำหนดพื้นที่ใหม่อีกครั้ง';
      console.log('outdoor error' + outdoor_used + ':' + this.areaData.standardArea.area.outdoor );
      return '';
    }
    return '';
  } catch (e) {
    // TODO: Inital Data issue
    console.log('error', e);
  }
  }

  convertValue() {
    needToConvert.forEach( path => {
      this[path].map( item => {
        if (typeof item.area !== 'number') {
          item.area = parseFloat(item.area.toString().replace(/,/g, ''));
        }
        if (typeof item.noRoom !== 'number') {
          item.noRoom = parseFloat(item.noRoom.toString().replace(/,/g, ''));
        }
        return item;
      });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.needToRefresh) {
      setTimeout(() => {
        this.dispatchProduct();
    }, 1000);
    }
  }

  ngOnDestroy() {
    this.subscriptionArea.unsubscribe();
    this.subscriptionProduct.unsubscribe();
    this.subscriptionSpending.unsubscribe();
    this.subscriptionImplicitsCost.unsubscribe();
    this.subscriptionRateReturn.unsubscribe();
  }

}
