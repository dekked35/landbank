import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromCore from '../../core/reducers';
import { DefaultsVariableService } from './defaults-variable.service';
@Injectable({
  providedIn: 'root'
})
export class CalculatorManagerService {

  propertyType: string;

  ROOM = 'room';
  CENTRAL = 'central';
  PARKING = 'parking';
  OUTDOOR = 'outdoor';
  RESORT = 'resort';

  constructor(private store: Store<any>,
    private defaultsVariableService: DefaultsVariableService) {
    this.store.select(fromCore.getPage)
    .subscribe(data => {
        this.propertyType = data.page;
    });
  }

  calculateArea(areaData: any) {
    const {farValue, osrValue} = areaData;
    // คำนวณพื้นที่ที่ใช้ได้ตามกฏหมาย

    const totalArea = +areaData.totalArea;
    if (['village', 'townhome'].includes(this.propertyType)) {
      areaData.availableArea =  totalArea;
    } else {
      areaData.availableArea = (farValue * totalArea * 4);
    }
    // คำนวณราคาที่ดิน
    const landPrice = +areaData.landPrice;
    if (['village', 'townhome', 'condo'].includes(this.propertyType)) {
      areaData.costLand = landPrice * totalArea;
    } else {
      if (areaData.costLandType === 'buy') {
        areaData.costLand = landPrice * totalArea;
      }
    }
    areaData.wording = '';

    if (farValue <= 3 && osrValue >= 10) {
      areaData.townPlanColor = '#FFFC10';
      if (farValue <= 1 && osrValue >= 40) {
        areaData.wording = 'ย.1';
      } else if (farValue <= 1.5 && osrValue >= 20) {
        areaData.wording = 'ย.2';
      } else if (farValue <= 2.5 && osrValue >= 12.5) {
        areaData.wording = 'ย.3';
      } else if (farValue <= 3 && osrValue >= 10) {
        areaData.wording = 'ย.4';
      }
    } else if (farValue <= 5 && osrValue >= 6) {
      areaData.townPlanColor = '#FF8407';
      if (farValue <= 4 && osrValue >= 7.5) {
        areaData.wording = 'ย.5';
      } else if (farValue <= 4.5 && osrValue >= 6.5) {
        areaData.wording = 'ย.6';
      } else if (farValue <= 5 && osrValue >= 6) {
        areaData.wording = 'ย.7';
      }
    } else if (farValue <= 8 && osrValue >= 4) {
      areaData.townPlanColor = '#A13101';
      if (farValue <= 6 && osrValue >= 5) {
        areaData.wording = 'ย.8';
      } else if (farValue <= 7 && osrValue >= 4.5) {
        areaData.wording = 'ย.9';
      } else if (farValue <= 8 && osrValue >= 4) {
        areaData.wording = 'ย.10';
      }
    } else if (farValue <= 10 && osrValue >= 3) {
      areaData.townPlanColor = '#FF0204';
      if ( farValue <= 5 && osrValue >= 6) {
        areaData.wording = 'พ.1';
      } else if ( farValue <= 6 && osrValue >= 5) {
        areaData.wording = 'พ.2';
      } else if ( farValue <= 7 && osrValue >= 4.5) {
        areaData.wording = 'พ.3';
      } else if ( farValue <= 8 && osrValue >= 4) {
        areaData.wording = 'พ.4';
      } else if ( farValue <= 10 && osrValue >= 3) {
        areaData.wording = 'พ.5';
      }
    } else {
      areaData.wording = 'ไม่พบในฐานข้อมูล';
    }
    if (['village', 'townhome'].includes(this.propertyType)) {
      areaData.lawAreaUsage = totalArea * 4;
    } else {
      areaData.lawAreaUsage = (farValue * totalArea * 4);
    }
    areaData.emptyArea = areaData.lawAreaUsage * osrValue / 100;
    areaData.coverArea = ['village', 'townhome'].includes(this.propertyType) ? areaData.emptyArea / 4 : areaData.emptyArea;
    return areaData;

  }

  calculateStandard(standardArea: any) {
    if (standardArea.area.sellArea > 0) {
      const temp = standardArea;
      let all = 0;
      Object.keys(standardArea.area).forEach( item => {
        all += standardArea.area[item];
      });
      // console.log(all,temp.percent.coverArea)
      temp.percent.coverArea = temp.area.coverArea / all * 100;
      temp.percent.sellArea =  temp.percent.sellArea  - temp.percent.coverArea;
      return temp;
    } else {
      return standardArea;
    }
  }

  // Hot fixed
  estimateRoomProduct(areaData: any, roomProducts: Array<any>, defaultSetting: any, currentProperty?: any) {
    let roomArea = areaData.ratio_area.room;
    let resortArea = areaData.ratio_area.resort;
    const corriArea = roomArea * 0.15; // พื้นที่ทางเดิน
    const corriResort = resortArea * 0.15;
    roomArea = roomArea - corriArea;
    resortArea = resortArea - corriResort;
    let roomDeluxeArea = 0;
    let roomSuperDeluxeArea = 0;
    let poolVillaArea = 0;
    let familyRoomArea = 0;
    let jacuzziVilla = 0;
    let bedRoom1A = 0;
    let bedRoom2A = 0;
    let bedRoom3A = 0;
    let bedRoom1B = 0;
    let bedRoom2B = 0;
    let bedRoom3B = 0;
    let storeBooth = 0;
    let smallBooth = 0;
    if (defaultSetting === null) {
      roomDeluxeArea = roomArea * 0.8;
      roomSuperDeluxeArea = roomArea * 0.2;
      poolVillaArea = resortArea * 0.5;
      familyRoomArea = resortArea * 0.25;
      jacuzziVilla = resortArea * 0.25;
      bedRoom1A = roomArea * 0.5;
      bedRoom2A = roomArea * 0.25;
      bedRoom3A = roomArea * 0.25;
      bedRoom1B = resortArea * 0.5;
      bedRoom2B = resortArea * 0.25;
      bedRoom3B = resortArea * 0.25;
      storeBooth = roomArea * 0.5;
      smallBooth = roomArea * 0.5;
    } else {
      if (defaultSetting.percentA) {
        bedRoom1A = roomArea * (+defaultSetting.percentA.bedRoom1 / 100);
        bedRoom2A = roomArea * (+defaultSetting.percentA.bedRoom2 / 100);
        bedRoom3A = roomArea * (+defaultSetting.percentA.bedRoom3 / 100);
        bedRoom1B = resortArea * (+defaultSetting.percentB.bedRoom1 / 100);
        bedRoom2B = resortArea * (+defaultSetting.percentB.bedRoom2 / 100);
        bedRoom3B = resortArea * (+defaultSetting.percentB.bedRoom3 / 100);
      } else {
        roomDeluxeArea = roomArea * (+defaultSetting.percent.deluxe / 100);
        roomSuperDeluxeArea = roomArea * (+defaultSetting.percent.superDeluxe / 100);
        poolVillaArea = resortArea * (+defaultSetting.percent.poolVilla / 100);
        familyRoomArea = resortArea * (+defaultSetting.percent.familyRoom / 100);
        jacuzziVilla = resortArea * (+defaultSetting.percent.jacuzziVilla / 100);
        storeBooth = roomArea * (+defaultSetting.percent.storeBooth / 100);
        smallBooth = roomArea * (+defaultSetting.percent.smallBooth / 100);
      }
    }
    roomProducts = roomProducts.map((data) => {
      const x = JSON.parse(JSON.stringify(data));
      if (data.name === 'Super deluxe') {
        x.noRoom = Math.floor(roomSuperDeluxeArea / data.area);
      }
      if (data.name === 'Deluxe') {
        x.noRoom = Math.floor(roomDeluxeArea / data.area);
      }
      if (data.name === 'Pool Villa') {
        x.noRoom = Math.floor(poolVillaArea / data.area);
      }
      if (data.name === 'Family Room') {
        x.noRoom = Math.floor(familyRoomArea / data.area);
      }
      if (data.name === 'Jacuzzi Villa') {
        x.noRoom = Math.floor(jacuzziVilla / data.area);
      }
      if (data.name === '1 Bedroom (A)') {
        x.noRoom = Math.floor(bedRoom1A / data.area);
      }
      if (data.name === '2 Bedroom (A)') {
        x.noRoom = Math.floor(bedRoom2A / data.area);
      }
      if (data.name === '3 Bedroom (A)') {
        x.noRoom = Math.floor(bedRoom3A / data.area);
      }
      if (data.name === '1 Bedroom (B)') {
        x.noRoom = Math.floor(bedRoom1B / data.area);
      }
      if (data.name === '2 Bedroom (B)') {
        x.noRoom = Math.floor(bedRoom2B / data.area);
      }
      if (data.name === '3 Bedroom (B)') {
        x.noRoom = Math.floor(bedRoom3B / data.area);
      }
      if (data.name === 'Store Booth') {
        x.noRoom = Math.floor(storeBooth / data.area);
      }
      if (data.name === 'Small Store') {
        x.noRoom = Math.floor(smallBooth / data.area);
      }
      data = x;
      return data;
    });
    return roomProducts;
  }

  calculateProduct(areaData: any, productData: any) {

    if (this.propertyType === 'village') {
      // calculate size of home
      // productData.user.products.map((product) => {
      //   product.area = product.size * 4;
      // });
      // productData.competitor.products.map((product) => {
      //   product.area = product.size * 4;
      // });

    }
    // let field = (this.propertyType === "village") ? "size" : "area";
    const field = 'size';
    // calculate remainingArea
    if (this.propertyType === 'village' || this.propertyType === 'townhome') {
      let products = productData.user.products;
      let sumArea = 0;
      for (let i = 0; i < products.length; i++) {
        if (this.propertyType === 'village') {
          sumArea += products[i].quantity *  products[i][field];
        } else {
          sumArea += products[i].quantity *  products[i][field] / 4;
        }
      }
      const sellArea = areaData.standardArea.area.sellArea;
      productData.user.usedArea = sellArea;
      productData.user.remainingArea = sellArea - sumArea;
      products = productData.competitor.products;
      sumArea = 0;
      for (let i = 0; i < products.length; i++) {
        if (this.propertyType === 'village') {
          sumArea += products[i].quantity *  products[i][field];
        } else {
          sumArea += products[i].quantity *  products[i][field] / 4;
        }
      }
      if (productData.competitor.usedArea) {
        productData.competitor.remainingArea =  productData.competitor.usedArea - sumArea;
      } else {
        productData.competitor.usedArea = sellArea;
        productData.competitor.remainingArea =  sellArea - sumArea;
      }
    }

    return productData;
  }

  calculateProductToSpeading(productData: any, speadingsData: any) {

    // คำนวณค่าก่อสร้างของสิ่งก่อสร้างแต่ละชนิด
    speadingsData.rooms = productData.rooms.map((room) => {
      const cost = this.defaultsVariableService.getContructionCost(this.propertyType, this.ROOM, room.name);
      return { ...room, cost: cost, totalCost: (+room.noRoom) * cost * (+room.area) };
    });
    if (productData.centrals) {
      speadingsData.centrals = productData.centrals.map((room) => {
        const cost = this.defaultsVariableService.getContructionCost(this.propertyType, this.CENTRAL, room.name);
        return { ...room, cost: cost, totalCost: +room.noRoom * cost * (+room.area) };
      });
    }
    if (productData.resort && productData.resort.reduce((accumulator, currentValue) => accumulator + currentValue.noRoom, 0) > 0) {
      speadingsData.resort = productData.resort.map((room) => {
        const cost = this.defaultsVariableService.getContructionCost(this.propertyType, this.RESORT, room.name);
        return { ...room, cost: cost, totalCost: +room.noRoom * cost * (+room.area) };
      });
    } else {
      speadingsData.resort = [];
    }
    speadingsData.outdoors = productData.outdoors.map((room) => {
      const cost = this.defaultsVariableService.getContructionCost(this.propertyType, this.OUTDOOR, room.name);
      return { ...room, cost: cost, totalCost: +room.noRoom * cost * (+room.area) };
    });
    speadingsData.parking = productData.parking.map((room) => {
      const cost = this.defaultsVariableService.getContructionCost(this.propertyType, this.PARKING, room.name);
      return { ...room, cost: cost, totalCost: +room.noRoom * cost * (+room.area) };
    });

    // คำนวณค่าก่อสร้างของพื้นที่อื่น ๆ เช่น ถนน, ทางเดิน
    const costRoomCorridor = this.defaultsVariableService.getContructionCost(this.propertyType, this.ROOM, 'corridor');
    const costCentralCorridor = this.defaultsVariableService.getContructionCost(this.propertyType, this.CENTRAL, 'corridor');
    const costResortCorridor = this.defaultsVariableService.getContructionCost(this.propertyType, this.RESORT, 'corridor');
    const costRoad = this.defaultsVariableService.getContructionCost(this.propertyType, this.PARKING, 'road');
    const roomCoridorArea = this.getTotalArea(productData.rooms) * 0.15;
    speadingsData.rooms.push({
      'type': 'central',
      'name': 'พื้นที่ทางเดินส่วนกลาง 15%',
      'area': roomCoridorArea,
      'noRoom': 1,
      'cost': costRoomCorridor,
      'totalCost': roomCoridorArea * costRoomCorridor
    });
    if (productData.centrals) {
      const centralsCoridorArea = this.getTotalArea(productData.centrals) * 0.2;
      speadingsData.centrals.push({
        'type': 'central',
        'name': 'พื้นที่ทางเดินส่วนกลาง 20%',
        'area': centralsCoridorArea,
        'noRoom': 1,
        'cost': costCentralCorridor,
        'totalCost': costCentralCorridor * centralsCoridorArea
      });
    }
    if (productData.resort && productData.resort.reduce((accumulator, currentValue) => accumulator + currentValue.noRoom, 0) > 0) {
      const resortCoridorArea = this.getTotalArea(productData.resort) * 0.15;
      speadingsData.resort.push({
        'type': 'central',
        'name': 'พื้นที่ทางเดินส่วนกลาง 15%',
        'area': resortCoridorArea,
        'noRoom': 1,
        'cost': costResortCorridor,
        'totalCost': resortCoridorArea * costResortCorridor
      });
    }
    const parkingCorridorArea = this.getTotalArea(productData.parking) * 0.4;
    speadingsData.parking.push({
      'type': 'central',
      'name': 'พื้นที่เสียจากถนนขับผ่าน 40%',
      'area': parkingCorridorArea,
      'noRoom': 1,
      'cost': costRoad,
      'totalCost': costRoad * parkingCorridorArea
    });

    return speadingsData;

  }

  getTotalArea(variable: Array<any>) {
    return variable.reduce((sum, data) => sum + (+data.area * +data.noRoom), 0);
  }

  calculateProductToImplicitsCost(productData: any, implicitsCost: any) {
    implicitsCost.incomes = productData.rooms.map((room) => {
      const incomePrice = this.defaultsVariableService.getIncome(this.propertyType, this.ROOM, room.name);
      return {
        roomType: room.type,
        roomName: room.name,
        area: room.area,
        noRoom: room.noRoom,
        pricePerRoom: incomePrice,
        incomePerDay: +room.noRoom * incomePrice
      };
    });
    if (productData.resort && productData.resort.reduce((accumulator, currentValue) => accumulator + currentValue.noRoom, 0) > 0) {
      implicitsCost.incomes = implicitsCost.incomes.concat(productData.resort.map((room) => {
        const incomePrice = this.defaultsVariableService.getIncome(this.propertyType, this.ROOM, room.name);
        return {
          roomType: room.type,
          roomName: room.name,
          area: room.area,
          noRoom: room.noRoom,
          pricePerRoom: incomePrice,
          incomePerDay: +room.noRoom * incomePrice
        };
      }));
    }
    return implicitsCost;
  }





}
