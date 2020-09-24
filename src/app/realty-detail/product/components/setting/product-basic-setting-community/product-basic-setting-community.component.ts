import { Component, OnInit, OnDestroy, Input, HostListener, SimpleChanges, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { DefaultsVariableService } from '../../../../../core/services/defaults-variable.service';
import { RequestManagerService } from '../../../../../core/services/request-manager.service';
import { CalculatorManagerService } from '../../../../../core/services/calculator-manager.service';
import { SchemaManagerService } from '../../../../../core/services/schema-manager.service';

import * as schemaDefault from '../../../../../core/schema/basic-type/communityMall';
import * as productAction from '../../../../../core/actions/product.actions';
import * as spendingsAction from '../../../../../core/actions/spendings.actions';
import * as implicitCostsAction from '../../../../../core/actions/implicit-costs.actions';
import * as rateReturnAction from '../../../../../core/actions/rate-return.actions';

import * as fromCore from '../../../../../core/reducers';

const productSchema = schemaDefault.communityMall.product;

const needToConvert = [
  'roomProducts',
  'parkingProducts',
  'outdoorProducts',
];

const areaNoRoom = [
  'area',
  'noRoom',
];


@Component({
  selector: 'app-product-basic-setting-community',
  templateUrl: './product-basic-setting-community.component.html',
  styleUrls: ['./product-basic-setting-community.component.css']
})
export class ProductBasicSettingCommunityComponent implements OnInit, OnDestroy, OnChanges {
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
  competitorColor = {}
  competitorBackground = {}
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
  parkingTypeOptions: Array<any> = [];
  outdoorTypeOptions: Array<any> = [];

  // productDefault.ts
  roomProducts: Array<any> = [];
  parkingProducts: Array<any> = [];
  outdoorProducts: Array<any> = [];

  // standardSize.ts
  standardSizeRooms: Array<any> = [];
  standardSizeParkings: Array<any> = [];
  standardSizeOutdoors: Array<any> = [];

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

  constructor(private store: Store<any>,
    private requestManagerService: RequestManagerService,
    private schemaManagerService: SchemaManagerService,
    private calculatorManagerService: CalculatorManagerService,
    private defaultsVariableService: DefaultsVariableService) {

    this.store.select(fromCore.getPage)
      .subscribe(page => {
        this.currentProperty = page.page;
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
        if (this.areaData.ratio_area.room > 0) {
          // tslint:disable-next-line: max-line-length
            this.roomProducts = this.calculatorManagerService.estimateRoomProduct(this.areaData, this.roomProducts, null, this.currentProperty);
            this.dispatchProduct();
          }
      });

    this.subscriptionProduct = this.store.select(fromCore.getProduct)
      .subscribe(data => {
        this.tempProductStore = data.payload;
        if(this.tempProductStore && this.tempProductStore[this.owner].rooms && this.tempProductStore[this.owner].rooms.length > 0){
          this.roomProducts = this.tempProductStore[this.owner].rooms;
          // this.dispatchProduct();
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

    this.competitorColor = this.owner === 'competitor' ? { 'color' : '#ff781f' } : { }
    this.competitorBackground = this.owner === 'competitor' ? { 'background-color' : '#FF781F','border' : '1px solid #FF781F' } : { }
  }

  delay(ms: number) {
    console.log('sleep ' + ms + ' ms');
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  initializeProductSchema() {
    this.store.dispatch(new productAction.IsLoadingAction(true));
    let productData = this.schemaManagerService.getProductSchema(this.currentProperty);
    const speadingsData = this.schemaManagerService.getSpeadingSchema(this.currentProperty);
    const implicitCostData = this.schemaManagerService.getImplicitSchema(this.currentProperty);
    const rateReturnData = this.schemaManagerService.getRateReturn(this.currentProperty);

    this.roomProducts = this.defaultsVariableService.getProductDefault(this.currentProperty, this.ROOM);
    this.parkingProducts = this.defaultsVariableService.getProductDefault(this.currentProperty, this.PARKING);
    this.outdoorProducts = this.defaultsVariableService.getProductDefault(this.currentProperty, this.OUTDOOR);

    this.roomTypeOptions = this.defaultsVariableService.getProductOptions(this.currentProperty, this.ROOM);
    this.parkingTypeOptions = this.defaultsVariableService.getProductOptions(this.currentProperty, this.PARKING);
    this.outdoorTypeOptions = this.defaultsVariableService.getProductOptions(this.currentProperty, this.OUTDOOR);

    this.standardSizeRooms = this.defaultsVariableService.getStandardSize(this.currentProperty, this.ROOM);
    this.standardSizeParkings = this.defaultsVariableService.getStandardSize(this.currentProperty, this.PARKING);
    this.standardSizeOutdoors = this.defaultsVariableService.getStandardSize(this.currentProperty, this.OUTDOOR);

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

  saveButton(type,index) {
    areaNoRoom.forEach( item => {
      this.editProduct[item] = parseFloat(this.editProduct[item].toString().replace(/,/g, ''));
    })
    const variable = this.getVariable(type);
    let test = this.parseObject(this[variable])
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
      return 'resortProducts'
    }
  }

  getTypeTable(type: string) {
    if (type === this.ROOM) {
      return 'roomTypeOptions';
    } else if (type === this.PARKING) {
      return 'parkingTypeOptions';
    } else if (type === this.OUTDOOR) {
      return 'outdoorTypeOptions';
    }
  }

  selectTypeValue(type: string) {
    if (type === this.ROOM) {
      return JSON.parse(JSON.stringify(this.roomProducts));
    } else if (type === this.PARKING) {
      return JSON.parse(JSON.stringify(this.parkingProducts));
    } else if (type === this.OUTDOOR) {
      return JSON.parse(JSON.stringify(this.outdoorProducts));
    }
  }

  getDefaultByType(type: string) {
    if (type === this.ROOM) {
      return {
        'type': 'ร้านค้า',
        'name': 'Store Booth',
        'area': 2,
        'noRoom': 1
      };
    } else if (type === this.PARKING) {
      return {
        'type': 'ที่จอดรถ',
        'name': 'Carpark 1',
        'area': 20,
        'noRoom': 5
      };
    } else if (type === this.OUTDOOR) {
      return {
        'type': 'พื้นที่ภายนอก',
        'name': 'Garden',
        'area': 50,
        'noRoom': 1
      };
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
            productData[oppositeOwner] = {};
            storeProduct.unsubscribe();
          }
        }
        this.store.dispatch(new productAction.IsLoadingAction(true));
        this.getProductService(productData);
    }
  }

  async getProductService(product: any) {
    const payload = {
      // propertyType: this.currentProperty,
      propertyType: 'communityMall',
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

    const payload = {
      'propertyType': 'communityMall',
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
      'propertyType': 'communityMall',
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
      'propertyType': 'communityMall',
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
    const room_used =  this.getTotalArea(this.ROOM) + (this.getTotalArea(this.ROOM) * 0.15);
    const resort_used = this.getTotalArea(this.RESORT) + (this.getTotalArea(this.RESORT) * 0.15)
    const parking_used =  this.getTotalArea(this.PARKING) + (this.getTotalArea(this.PARKING) * 0.4);
    const outdoor_used =  this.getTotalArea(this.OUTDOOR);

    if (+room_used > +this.areaData.standardArea.area.room) {
      this.displayErrDialog = true;
      this.displayErrDialogMsg = 'ไม่มีพื้นที่คงเหลือสำหรับพื้นที่ห้องพัก โปรดกำหนดพื้นที่ใหม่อีกครั้ง';
      console.log('Room error ' + room_used + ':' + this.areaData.standardArea.area.room );
      return '';
    }

    if (+resort_used > +this.areaData.standardArea.area.resort && +this.areaData.standardArea.area.resort !== 0) {
      this.displayErrDialog = true;
      this.displayErrDialogMsg = 'ไม่มีพื้นที่คงเหลือสำหรับพื้นที่บ้านพัก โปรดกำหนดพื้นที่ใหม่อีกครั้ง';
      console.log('Room error ' + room_used + ':' + this.areaData.standardArea.area.room );
      return '';
    }

    if (+parking_used > +this.areaData.standardArea.area.parking) {
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
    console.log('error');
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
