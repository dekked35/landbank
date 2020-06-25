import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Store } from '@ngrx/store'
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

@Component({
  selector: 'app-product-basic-setting-hotel',
  templateUrl: './product-basic-setting-hotel.component.html',
  styleUrls: ['./product-basic-setting-hotel.component.css']
})
export class ProductBasicSettingHotelComponent implements OnInit, OnDestroy {
  @Input() owner: string;
  @Input() isCompetitor: boolean;

  ROOM: string = 'room';
  CENTRAL: string = 'central';
  PARKING: string = 'parking';
  OUTDOOR: string = 'outdoor';

  settingHeader: string;
  settingSubHeader: string = '(สัดส่วน % ในโครงการต้องรวมกันได้ 100% เท่านั้น)';

  roomType: string;

  currentProperty: string = '';
  areaData: any;

  enableEdit: boolean = false;
  enableEditIndex: number = null;
  typeEdit: string = '';
  // tempEdit: string = 'Deluxe';
  // tempEdit: string = 'Deluxe';
  tempEdit : any;

  header = {
    "competitor": "โครงการคู่แข่ง",
    "user": "โครงการของเรา"
  }

  //productOptions.ts
  roomTypeOptions: Array<any> = [];
  centralTypeOptions: Array<any> = []
  parkingTypeOptions: Array<any> = []
  outdoorTypeOptions: Array<any> = []

  //productDefault.ts
  roomProducts: Array<any> = []
  centralProducts: Array<any> = [];
  parkingProducts: Array<any> = [];
  outdoorProducts: Array<any> = [];

  //standardSize.ts
  standardSizeRooms: Array<any> = []
  standardSizeCentrals: Array<any> = []
  standardSizeParkings: Array<any> = []
  standardSizeOutdoors: Array<any> = []

  tempProducts: Array<any> = [];

  tempProductStore: any;

  speadingData: any;
  implicitsCostData: any;
  rateReturnData: any;

  constructor(private store: Store<any>,
    private requestManagerService: RequestManagerService,
    private schemaManagerService: SchemaManagerService,
    private calculatorManagerService: CalculatorManagerService,
    private defaultsVariableService: DefaultsVariableService) {

    this.store.select(fromCore.getPage)
      .subscribe(page => {
        this.currentProperty = page.page;
      });


  }
  subscriptionArea:any;
  subscriptionProduct:any;
  subscriptionSpending: any;
  subscriptionImplicitsCost: any;
  subscriptionRateReturn :any;

  async ngOnInit() {
    this.onResize(null);
    this.settingHeader = this.header[this.owner];
    this.initializeProductSchema();

    this.subscriptionArea = this.store.select(fromCore.getArea)
      .subscribe(area => {
        this.areaData = area.payload;
        if (this.areaData.ratio_area.room > 0 && ['condo', 'hotel', 'communityMall'].includes(this.currentProperty)) {
          this.roomProducts = this.calculatorManagerService.estimateRoomProduct(this.areaData, this.roomProducts, null);
          this.dispatchProduct();
        }
      });

    this.subscriptionProduct = this.store.select(fromCore.getProduct)
      .subscribe(data => {
        this.tempProductStore = data.payload;
        if(this.isCompetitor) {
          this.roomProducts = data.payload[this.owner].rooms;
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

    // if (this.areaData.ratio_area.room > 0) {
    //   this.dispatchProduct();
    // }
  }

  delay(ms: number) {
    console.log("sleep " + ms + " ms");
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  initializeProductSchema() {
    this.store.dispatch(new productAction.IsLoadingAction(true));
    let productData = this.schemaManagerService.getProductSchema(this.currentProperty);
    const speadingsData = this.schemaManagerService.getSpeadingSchema(this.currentProperty);
    const implicitCostData = this.schemaManagerService.getImplicitSchema(this.currentProperty);
    const rateReturnData = this.schemaManagerService.getRateReturn(this.currentProperty);

    this.roomProducts = this.defaultsVariableService.getProductDefault(this.currentProperty, this.ROOM);
    this.centralProducts = this.defaultsVariableService.getProductDefault(this.currentProperty, this.CENTRAL);
    this.parkingProducts = this.defaultsVariableService.getProductDefault(this.currentProperty, this.PARKING);
    this.outdoorProducts = this.defaultsVariableService.getProductDefault(this.currentProperty, this.OUTDOOR);

    this.roomTypeOptions = this.defaultsVariableService.getProductOptions(this.currentProperty, this.ROOM);
    this.centralTypeOptions = this.defaultsVariableService.getProductOptions(this.currentProperty, this.CENTRAL);
    this.parkingTypeOptions = this.defaultsVariableService.getProductOptions(this.currentProperty, this.PARKING);
    this.outdoorTypeOptions = this.defaultsVariableService.getProductOptions(this.currentProperty, this.OUTDOOR);

    this.standardSizeRooms = this.defaultsVariableService.getStandardSize(this.currentProperty, this.ROOM);
    this.standardSizeCentrals = this.defaultsVariableService.getStandardSize(this.currentProperty, this.CENTRAL);
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
  }

  saveButton(type) {
    this.typeEdit = type;
    this.enableEdit = false;
    this.enableEditIndex = null;
    let variable = this.getVariable(type);
    this.dispatchProduct();
  }

  addItem(type: string) {
    this.typeEdit = type;
    this.enableEdit = true;
    let variable = this.getVariable(type);
    let initValue = this.getDefaultByType(type);
    this.tempProducts = this.parseObject(this[variable]);
    this[variable] = [...this[variable], initValue]
    this.enableEditIndex = this[variable].length - 1;
  }

  deleteItem(index, type) {
    this.typeEdit = type;
    let variable = this.getVariable(type);
    this[variable].splice(index, 1);
    this.dispatchProduct();
  }

  onChangeDropdown(e, i, type,room, roomProduct) {
    this.typeEdit = type;
    let variable = this.getVariable(type);
    this[variable][i]['name'] = e.value.name;
    this[variable][i]['area'] = e.value.size
    this[variable][i]['noRoom'] = 1;
  }

  cancleEdit(type) {
    this.typeEdit = type;
    let variable = this.getVariable(type);
    this[variable] = JSON.parse(JSON.stringify(this.tempProducts));
    this.tempProducts = [];
    this.enableEdit = false;
  }

  getVariable(type: string) {
    if (type === this.ROOM) {
      return 'roomProducts';
    } else if (type === this.CENTRAL) {
      return 'centralProducts';
    } else if (type === this.PARKING) {
      return 'parkingProducts';
    } else if (type === this.OUTDOOR) {
      return 'outdoorProducts';
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
    }
  }

  getDefaultByType(type: string) {
    if (type === this.ROOM) {
      return {
        "type": "ห้องพัก",
        "name": "Pool Villa",
        "area": 65,
        "noRoom": 1
      };
    } else if (type === this.CENTRAL) {
      return {
        "type": "ส่วนกลาง",
        "name": "Lobby",
        "area": 150,
        "noRoom": 1
      };
    } else if (type === this.PARKING) {
      return {
        "type": "ที่จอดรถ",
        "name": "Carpark 1",
        "area": 20,
        "noRoom": 5
      };
    } else if (type === this.OUTDOOR) {
      return {
        "type": "พื้นที่ภายนอก",
        "name": "Garden",
        "area": 60,
        "noRoom": 1
      };
    }
  }

  dispatchProduct() {
    let oppositeOwner = (this.owner === 'user') ? 'competitor' : 'user';
    let productData = this.parseObject(productSchema);
    this.checkDisplayErrorDialog();
    if(!this.displayErrDialog) {
        productData[this.owner]["rooms"] = this.parseObject(this.roomProducts);
        productData[this.owner]["centrals"] = this.parseObject(this.centralProducts);
        productData[this.owner]["parking"] = this.parseObject(this.parkingProducts);
        productData[this.owner]["outdoors"] = this.parseObject(this.outdoorProducts);
        try {
          productData[oppositeOwner] = this.tempProductStore[oppositeOwner];
        } catch(e){
          let storeProduct = this.store.select(fromCore.getProduct)
          .subscribe(data => {
            this.tempProductStore = data.payload;
          });
          productData[oppositeOwner] = this.tempProductStore[oppositeOwner];
          storeProduct.unsubscribe();
        }
        console.log(productData)
        this.store.dispatch(new productAction.IsLoadingAction(true));
        this.getProductService(productData);
    }
  }

  async getProductService(product: any) {
    let payload = {
      // propertyType: this.currentProperty,
      propertyType: "hotel",
      area_input: {
        ...this.areaData,
        "percent": this.areaData.standardArea.percent,
        "area": this.areaData.standardArea.percent
      },
      product_input: product
    }
    let newProductData = await this.requestManagerService.requestProduct(payload);
    this.store.dispatch(new productAction.SuccessAction(newProductData));
    this.fillInSpeading(newProductData);
  }

  parseObject(data: any) {
    return JSON.parse(JSON.stringify(data));
  }

  async fillInSpeading(productData) {
    let speandingsData = this.calculatorManagerService.calculateProductToSpeading(productData[this.owner], this.parseObject(this.speadingData))
    // type == central means that object it's not show icon.

    let payload = {
      "propertyType": "hotel",
      "area_input": {
        ...this.areaData,
        "percent": this.areaData.standardArea.percent,
        "area": this.areaData.standardArea.percent
      },
      "product_input": productData,
      "spendings_input": this.requestManagerService.generateSpeadingInput(speandingsData)
    }

    // TODO : Remove this after Bank edit API
    let newSpendingData = await this.requestManagerService.requestSpeading(payload);
    if (newSpendingData.costPerMonth !== undefined) {
      newSpendingData.costPerMonths = newSpendingData.costPerMonth
    }
    newSpendingData.specialEquipments.map((data) => { if (data.type.search(/Opening/gi) !== -1) { data.cost = newSpendingData.totalCostPerMonth } });
    this.fillInImplicitCost(productData, newSpendingData);
  }

  async fillInImplicitCost(productData, speadingData) {
    let implicitsCost = this.calculatorManagerService.calculateProductToImplicitsCost(productData[this.owner], this.parseObject(this.implicitsCostData));

    let payload = {
      "propertyType": "hotel",
      "area_input": {
        ...this.areaData,
        "percent": this.areaData.standardArea.percent,
        "area": this.areaData.standardArea.percent
      },
      "product_input": productData,
      "spendings_input": this.requestManagerService.generateSpeadingInput(speadingData) ,
      "implicit_costs_input": implicitsCost,
    }
    let newImplicitsCost = await this.requestManagerService.requestImplicitsCost(payload);
    this.store.dispatch(new spendingsAction.SuccessAction(speadingData));
    this.fillInRateReturn(productData, speadingData, newImplicitsCost, this.rateReturnData);
  }

  async fillInRateReturn(productData, speadingData, implicitCostData, rateReturnData) {
    let payload = {
      "propertyType": "hotel",
      "area_input": {
        ...this.areaData,
        "percent": this.areaData.standardArea.percent,
        "area": this.areaData.standardArea.percent
      },
      "product_input": this.requestManagerService.generateProductInput('user', productData),
      "spendings_input": this.requestManagerService.generateSpeadingInput(speadingData),
      "implicit_costs_input": implicitCostData,
      "ipr_input": rateReturnData
    }

    this.store.dispatch(new implicitCostsAction.SuccessAction(implicitCostData));
    let newRateReturnData = await this.requestManagerService.requestIPRRateReturn(payload);
    this.store.dispatch(new rateReturnAction.SuccessAction(newRateReturnData));

  }

  getTotalArea(type: string) {
    let variable = this.getVariable(type);
    return this[variable].reduce((sum, data) => { return sum + (+data.area * +data.noRoom) }, 0);
  }

  dropDownSize = { 'width': '170px' };
  iconSelectedItem = { 'width': '16px', 'vertical-align': 'middle' };
  textSelectedItem = { 'vertical-align': 'middle', 'font-size': '13.5px', 'margin-left': '.5em' }
  iconItem = { 'width': '24px', 'position': 'absolute', 'top': '1px', 'left': '5px' }
  textItem = { 'font-size': '14px', 'float': 'right', 'margin-top': '4px' }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // this.innerWidth = window.innerWidth;
    //{'width':'50px', 'height':'35px'} small size
    if (window.innerWidth < 500) {
      this.dropDownSize = { 'width': '50px' };
      this.iconSelectedItem = { 'width': '10px', 'vertical-align': 'middle' };
      this.textSelectedItem = { 'vertical-align': 'middle', 'font-size': '10px', 'margin-left': '.5em' }
      this.iconItem = { 'width': '16px', 'position': 'absolute', 'top': '1px', 'left': '2px' };
      this.textItem = { 'font-size': '10px', 'float': 'right', 'margin-top': '2px' };
    } else {
      this.dropDownSize = { 'width': '170px' };
      this.iconSelectedItem = { 'width': '16px', 'vertical-align': 'middle' };
      this.textSelectedItem = { 'vertical-align': 'middle', 'font-size': '13.5px', 'margin-left': '.2em' }
      this.iconItem = { 'width': '24px', 'position': 'absolute', 'top': '1px', 'left': '5px' };
      this.textItem = { 'font-size': '14px', 'float': 'right', 'margin-top': '4px' };
    }
  }

  displayErrDialog:boolean = false;
  displayErrDialogMsg: string = "";

  checkDisplayErrorDialog(){
    try {
    let room_used =  this.getTotalArea(this.ROOM) + (this.getTotalArea(this.ROOM) * 0.15);
    let central_used =  this.getTotalArea(this.CENTRAL) + (this.getTotalArea(this.CENTRAL) * 0.2);
    let parking_used =  this.getTotalArea(this.PARKING) + (this.getTotalArea(this.PARKING) * 0.4);
    let outdoor_used =  this.getTotalArea(this.OUTDOOR);

    if(+room_used > +this.areaData.standardArea.area.room) {
      this.displayErrDialog = true;
      this.displayErrDialogMsg = "ไม่มีพื้นที่คงเหลือสำหรับพื้นที่ห้องพัก โปรดกำหนดพื้นที่ใหม่อีกครั้ง";
      console.log("Room error " + room_used + ":" + this.areaData.standardArea.area.room )
      return "";
    }

    if(+central_used > +this.areaData.standardArea.area.central) {
      this.displayErrDialog = true;
      this.displayErrDialogMsg = "ไม่มีพื้นที่คงเหลือสำหรับพื้นที่ส่วนกลาง โปรดกำหนดพื้นที่ใหม่อีกครั้ง";
      console.log("central error " + central_used + ":" + this.areaData.standardArea.area.central )

      return "";
    }

    if(+parking_used > +this.areaData.standardArea.area.parking) {
      this.displayErrDialog = true;
      this.displayErrDialogMsg = "ไม่มีพื้นที่คงเหลือสำหรับพื้นที่จอดรถ โปรดกำหนดพื้นที่ใหม่อีกครั้ง";
      return "";
    }

    if(+outdoor_used > +this.areaData.standardArea.area.outdoor) {
      this.displayErrDialog = true;
      this.displayErrDialogMsg = "ไม่มีพื้นที่คงเหลือสำหรับพื้นที่ภายนอก โปรดกำหนดพื้นที่ใหม่อีกครั้ง";
      console.log("outdoor error" + outdoor_used + ":" + this.areaData.standardArea.area.outdoor )
      return "";
    }
    return "";
  } catch(e) {
    // TODO: Inital Data issue
    console.log("error");
  }
  }

  ngOnDestroy(){
    this.subscriptionArea.unsubscribe();
    this.subscriptionProduct.unsubscribe();
    this.subscriptionSpending.unsubscribe();
    this.subscriptionImplicitsCost.unsubscribe();
    this.subscriptionRateReturn.unsubscribe();
  }

}
