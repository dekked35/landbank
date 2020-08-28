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
    if (['village','townhome'].includes(this.propertyType)) {
      areaData.availableArea =  totalArea;
    } else {
      areaData.availableArea = (far * totalArea * 4)
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
    areaData.wording = '';
    if ([1.5, 2 , 3].includes(areaData.farValue)) {
      areaData.townPlanColor = '#FFFC10';
    } else if ([3.5, 4.5].includes(areaData.farValue)) {
      areaData.townPlanColor = '#FF8407';
    } else if ([6, 7.5].includes(areaData.farValue)) {
      areaData.townPlanColor = '#A13101';
    } else if ([4, 5, 7, 8].includes(areaData.farValue)) {
      areaData.townPlanColor = '#FF0204';
    }
    switch (areaData.farValue) {
      case 1.5: {
        areaData.wording = 'ย.1';
        break;
      }
      case 2: {
        areaData.wording = 'ย.2';
        break;
      }
      case 3: {
        areaData.wording = 'ย.3';
        break;
      }
      case 3.5: {
        areaData.wording = 'ย.4';
        break;
      }
      case 4.5: {
        areaData.wording = 'ย.5';
        break;
      }
      case 6: {
        areaData.wording = 'ย.7';
        break;
      }
      case 7.5: {
        areaData.wording = 'ย.8';
        break;
      }
      case 4: {
        areaData.wording = 'พ.8';
        break;
      }
      case 5: {
        areaData.wording = 'พ.2';
        break;
      }
      case 7: {
        areaData.wording = 'พ.3';
        break;
      }
      case 8: {
        areaData.wording = 'พ.4';
        break;
      }
      default : {
        areaData.wording = 'ไม่พบในฐานข้อมูล';
        areaData.townPlanColor = '#FFFFFF';
        break;
      }
    }

    return areaData;

  }
  // Hot fixed
  estimateRoomProduct(areaData:any, roomProducts:Array<any>, defaultSetting: any, currentProperty?: any) {
    let roomArea = areaData.ratio_area.room;
    // let roomResortArea = areaData.standardArea.
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
    if(currentProperty !== 'resort'){
      roomProducts = roomProducts.map((data)=> {
        if(data.name === "Super deluxe") {
          const x = JSON.parse(JSON.stringify(data));
          x.noRoom = Math.floor(roomSuperDeluxeArea / data.area);
          data = x
        }
        if(data.name === "Deluxe") {
          const x = JSON.parse(JSON.stringify(data));
          x.noRoom = Math.floor(roomDeluxeArea / data.area);
          data = x
        }
        return data;
      });
    } else if (currentProperty === 'resort') {
      roomProducts = roomProducts.map((data)=> {
        if(data.name === "Pool Villa") {
          const x = JSON.parse(JSON.stringify(data));
          x.noRoom = Math.floor(roomArea * 0.5 / data.area);
          data = x
        }
        if(data.name === "Family Room") {
          const x = JSON.parse(JSON.stringify(data));
          x.noRoom = Math.floor(roomArea * 0.25 / data.area);
          data = x
        }
        if(data.name === "Jacuzzi Villa") {
          const x = JSON.parse(JSON.stringify(data));
          x.noRoom = Math.floor(roomArea * 0.25 / data.area);
          data = x
        }
        return data;
      });
    }
    return roomProducts;
  }

  calculateProduct(areaData: any, productData: any) {

    if(this.propertyType === "village") {
      // calculate size of home
      // productData.user.products.map((product) => {
      //   product.area = product.size * 4;
      // });
      // productData.competitor.products.map((product) => {
      //   product.area = product.size * 4;
      // });

    }
    // let field = (this.propertyType === "village") ? "size" : "area";
    let field = "size";
    // calculate remainingArea
    if(this.propertyType === "village" || this.propertyType === "townhome") {
      let products = productData.user.products;
      let sumArea = 0;
      for (let i = 0; i < products.length; i++) {
        if(this.propertyType === "village") {
          sumArea += products[i].quantity *  products[i][field];
        } else {
          sumArea += products[i].quantity *  products[i][field] / 4
        }
      }
      let sellArea = areaData.standardArea.area.sellArea;
      productData.user.usedArea = sellArea;
      productData.user.remainingArea = sellArea - sumArea;
      products = productData.competitor.products;
      sumArea = 0;
      for (let i = 0; i < products.length; i++) {
        if(this.propertyType === "village") {
          sumArea += products[i].quantity *  products[i][field];
        } else {
          sumArea += products[i].quantity *  products[i][field] / 4
        }
      }
      if(productData.competitor.usedArea){
        productData.competitor.remainingArea =  productData.competitor.usedArea - sumArea;
      } else {
        productData.competitor.usedArea = sellArea;
        productData.competitor.remainingArea =  sellArea - sumArea;
      }
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
