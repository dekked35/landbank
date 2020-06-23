import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromCore from '../../core/reducers';
import { DefaultsVariableService } from './defaults-variable.service';
@Injectable({
  providedIn: 'root'
})
export class CalculatorManagerService {

  propertyType: string;

  ROOM: string = 'room';
  CENTRAL: string = 'central';
  PARKING: string = 'parking';
  OUTDOOR: string = 'outdoor';

  constructor(private store: Store<any>,
    private defaultsVariableService: DefaultsVariableService) {
    this.store.select(fromCore.getPage)
    .subscribe(data => {
        this.propertyType = data.page;
    });
  }

  calculateArea(areaData: any) {
    // คำนวณพื้นที่ที่ใช้ได้ตามกฏหมาย
    let far = +areaData.farValue;
    let totalArea = +areaData.totalArea;
    if (this.propertyType === 'village') {
      areaData.availableArea =  totalArea;
    } else if (this.propertyType === 'townhome') {
      areaData.availableArea =  (far * totalArea);
    } else {
      areaData.availableArea = (far * 4 * totalArea)
    }
    // คำนวณราคาที่ดิน
    let landPrice = +areaData.landPrice;
    if(['village', 'townhome', 'condo'].includes(this.propertyType)) {
      areaData.costLand = landPrice * totalArea;
    } else {
      if(areaData.costLandType === "buy") {
        areaData.costLand = landPrice * totalArea;
      }
    }


    return areaData;

  }
  // Hot fixed
  estimateRoomProduct(areaData:any, roomProducts:Array<any>, defaultSetting: any) {
    let roomArea = areaData.ratio_area.room;
    let corriArea = roomArea * 0.15; // พื้นที่ทางเดิน
    roomArea = roomArea - corriArea;
    let roomDeluxeArea = 0;
    let roomSuperDeluxeArea = 0;
    if(defaultSetting === null) {
      roomDeluxeArea = roomArea * 0.8;
      roomSuperDeluxeArea = roomArea * 0.2;
    } else {
      roomDeluxeArea = roomArea * (defaultSetting.percent.deluxe/100);
      roomSuperDeluxeArea = roomArea * (defaultSetting.percent.superDeluxe/100);
    }
    roomProducts.map((data)=> {
      if(data.name === "Super deluxe") {
        data.noRoom = Math.floor(roomSuperDeluxeArea/data.area);
      }
      if(data.name === "Deluxe") {
        data.noRoom = Math.floor(roomDeluxeArea/data.area);
      }
    });

    return roomProducts;
  }

  calculateProduct(areaData: any, productData: any) {

    if(this.propertyType === "village") {
      // calculate size of home
      productData.user.products.map((product) => {
        product.area = product.size * 4;
      });
      productData.competitor.products.map((product) => {
        product.area = product.size * 4;
      });

    }
    let field = (this.propertyType === "village") ? "size" : "area";
    // calculate remainingArea
    if(this.propertyType === "village" || this.propertyType === "townhome") {
      let products = productData.user.products;
      let sumArea = 0;
      for (let i = 0; i < products.length; i++) {
        sumArea += products[i].quantity *  products[i][field];
      }
      let sellArea = areaData.standardArea.area.sellArea;
      productData.user.usedArea = sellArea;
      productData.user.remainingArea = sellArea - sumArea;

      products = productData.competitor.products;
      sumArea = 0;
      for (let i = 0; i < products.length; i++) {
        sumArea += products[i].quantity *  products[i][field];
      }
      productData.competitor.usedArea = sellArea;
      productData.competitor.remainingArea =  sellArea - sumArea;

    }

    return productData;
  }

  calculateProductToSpeading(productData: any, speadingsData:any) {

    // คำนวณค่าก่อสร้างของสิ่งก่อสร้างแต่ละชนิด
    speadingsData.rooms = productData.rooms.map((room) => {
      let cost = this.defaultsVariableService.getContructionCost(this.propertyType, this.ROOM, room.name);
      return { ...room, cost: cost, totalCost: (+room.noRoom) * cost * (+room.area) }
    });

    speadingsData.centrals = productData.centrals.map((room) => {
      let cost = this.defaultsVariableService.getContructionCost(this.propertyType, this.CENTRAL, room.name);
      return { ...room, cost: cost, totalCost: +room.noRoom * cost * (+room.area) }
    });
    speadingsData.outdoors = productData.outdoors.map((room) => {
      let cost = this.defaultsVariableService.getContructionCost(this.propertyType, this.OUTDOOR, room.name);
      return { ...room, cost: cost, totalCost: +room.noRoom * cost * (+room.area) }
    });
    speadingsData.parking = productData.parking.map((room) => {
      let cost = this.defaultsVariableService.getContructionCost(this.propertyType, this.PARKING, room.name);
      return { ...room, cost: cost, totalCost: +room.noRoom * cost * (+room.area) }
    });

    // คำนวณค่าก่อสร้างของพื้นที่อื่น ๆ เช่น ถนน, ทางเดิน
    let costRoomCorridor = this.defaultsVariableService.getContructionCost(this.propertyType, this.ROOM, 'corridor');
    let costCentralCorridor = this.defaultsVariableService.getContructionCost(this.propertyType, this.CENTRAL, 'corridor');
    let costRoad = this.defaultsVariableService.getContructionCost(this.propertyType, this.PARKING, 'road');
    let roomCoridorArea = this.getTotalArea(productData.rooms) * 0.15;
    speadingsData.rooms.push({
      "type": "central",
      "name": "พื้นที่ทางเดินส่วนกลาง 15%",
      "area": roomCoridorArea,
      "noRoom": 1,
      "cost": costRoomCorridor,
      "totalCost": roomCoridorArea * costRoomCorridor
    });
    let centralsCoridorArea = this.getTotalArea(productData.centrals) * 0.2;
    speadingsData.centrals.push({
      "type": "central",
      "name": "พื้นที่ทางเดินส่วนกลาง 20%",
      "area": centralsCoridorArea,
      "noRoom": 1,
      "cost": costCentralCorridor,
      "totalCost": costCentralCorridor * centralsCoridorArea
    });
    let parkingCorridorArea = this.getTotalArea(productData.parking) * 0.4;
    speadingsData.parking.push({
      "type": "central",
      "name": "พื้นที่เสียจากถนนขับผ่าน 40%",
      "area": parkingCorridorArea,
      "noRoom": 1,
      "cost": costRoad,
      "totalCost": costRoad * parkingCorridorArea
    });

    return speadingsData;

  }

  getTotalArea(variable: Array<any>) {
    return variable.reduce((sum, data) => { return sum + (+data.area * +data.noRoom) }, 0);
  }

  calculateProductToImplicitsCost(productData: any, implicitsCost:any){
    implicitsCost.incomes = productData.rooms.map((room) => {
      let incomePrice = this.defaultsVariableService.getIncome(this.propertyType, this.ROOM, room.name);
      return {
        roomType: room.type,
        roomName: room.name,
        area: room.area,
        noRoom: room.noRoom,
        pricePerRoom: incomePrice,
        incomePerDay: +room.noRoom * incomePrice
      }
    });
    return implicitsCost;
  }





}
