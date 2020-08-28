import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { BasicTypeService } from './basic-type.service';
import { Observable } from 'rxjs';

import * as pageAction from '../../core/actions/page.actions';
import * as areaAction from '../../core/actions/area.actions';
import * as fromCore from '../../core/reducers';


const API_PROPERTY_MAPPER = {
  "village": "village",
  "townhome": "townhouse",
  "condo": "condo",
  "hotel": "hotel",
  "communityMall": "community mall",
  "resort": "hotel"
}

@Injectable({
  providedIn: 'root'
})
export class RequestManagerService {

  propertyType: string;

  constructor(private store: Store<any>,
    private basicTypeService: BasicTypeService) {
    this.store.select(fromCore.getPage)
      .subscribe(data => {
        try {
          this.propertyType = data.page;
        } catch (e) {
          this.propertyType = "hotel";
        }
      });
  }

  // Area Manager
  // The reason of this solution becuase of API is schema is not match with UI schema.
  requestArea(areaData: any): Promise<any> {
    let payload = this.generateAreaPayload(areaData);
    return new Promise((resolve, reject) => {
      this.basicTypeService.getProperyArea(payload).subscribe((response) => {
        console.log("Get area successfully.")
        resolve(this.generateAreaResponse(areaData, response.area));
      }, err => {
        console.log(err);
        reject();
        // TODO : show error dialog
      });
    })
  }

  generateAreaPayload(areaData: any) {
    let percent = areaData.standardArea.percent;
    let area = areaData.standardArea.area;
    return {
      "propertyType": API_PROPERTY_MAPPER[this.propertyType],
      "area_input": {
        ...areaData,
        "percent": percent,
        "area": area
      }
    }
  }

  generateAreaResponse(areaData: any, response: any) {
    let standardArea = this.parseObject(areaData.standardArea);
    standardArea.percent = response.percent;
    standardArea.area = response.ratio_area;
    // Check schema mismatch
    let availableArea = (['village', 'townhome'].includes(this.propertyType)) ? areaData.usableArea : areaData.availableArea;
    return {
      ...response,
      "townPlanColor": areaData.townPlanColor,
      "landPrice": areaData.landPrice,
      "usableArea": areaData.usableArea,
      "availableArea": availableArea,
      "standardArea": standardArea
    }
  }

  requestProduct(payload:any): Promise<any> {
    console.log("request product . . .");
    // console.log(JSON.stringify(payload));
    return new Promise((resolve, reject) => {
      this.basicTypeService.getProperyProduct(payload).subscribe((response) => {
        console.log("Get product successfully.")
        resolve(response['product']);
      }, err => {
        console.log(err);
        reject();
        // TODO : show error dialog
      });
    })
  }

  generateProductInput(owner:string, productData:any) {
    productData = this.parseObject(productData);
    if(this.propertyType === "village") {
      let oppositeOwner = (owner === 'user') ? 'competitor' : 'user';
      let myProduct = JSON.parse(JSON.stringify(productData[owner]['products']));
      productData[owner].products = myProduct;
      productData[owner].products[0].cost = this.parseToMillionFormat(myProduct[0].cost)
      productData[owner].products[1].cost = this.parseToMillionFormat(myProduct[1].cost)
      productData[owner].products[2].cost = this.parseToMillionFormat(myProduct[2].cost)
      productData[oppositeOwner].products[0].cost = this.parseToMillionFormat(productData[oppositeOwner].products[0].cost)
      productData[oppositeOwner].products[1].cost = this.parseToMillionFormat(productData[oppositeOwner].products[1].cost)
      productData[oppositeOwner].products[2].cost = this.parseToMillionFormat(productData[oppositeOwner].products[2].cost)
      let product_input = { ...productData };
      return product_input;
    }

    if(this.propertyType === "townhome") {
      let oppositeOwner = (owner === 'user') ? 'competitor' : 'user';
      productData[owner] = JSON.parse(JSON.stringify(productData[owner])); // user or owner
      let myProductList = this.parseObject(productData[owner]['products']);
      let depth = +productData[owner].depth;
      let width = +productData[owner].width;
      productData[owner].products[0].area = myProductList[0].area;
      productData[owner].products[1].area = myProductList[1].area;
      productData[owner].products[2].area = myProductList[2].area;
      productData[owner].products[0].stairArea = myProductList[0].stairArea;
      productData[owner].products[1].stairArea = myProductList[1].stairArea;
      productData[owner].products[2].stairArea = myProductList[2].stairArea;
      productData[owner].products[0].cost = this.parseToMillionFormat(myProductList[0].cost);
      productData[owner].products[1].cost = this.parseToMillionFormat(myProductList[1].cost);
      productData[owner].products[2].cost = this.parseToMillionFormat(myProductList[2].cost);
      productData[owner].products[0].ratio = myProductList[0].ratio;
      productData[owner].products[1].ratio = myProductList[1].ratio;
      productData[owner].products[2].ratio = myProductList[2].ratio;
      productData[oppositeOwner] = productData[oppositeOwner]; // user or owner
      productData[oppositeOwner].products[0].cost = this.parseToMillionFormat(productData[oppositeOwner].products[0].cost)
      productData[oppositeOwner].products[1].cost = this.parseToMillionFormat(productData[oppositeOwner].products[1].cost)
      productData[oppositeOwner].products[2].cost = this.parseToMillionFormat(productData[oppositeOwner].products[2].cost)
      const product_input = { ...productData };
      return product_input;
    }

    return productData;
  }

  // Product Manager
  parseObject(data: any) {
    return JSON.parse(JSON.stringify(data));
  }

  requestSpeading(payload: any, string ?: string): Promise<any>{
    console.log("request speading . . .");
    // console.log(JSON.stringify(payload));
    return new Promise((resolve, reject) => {
      this.basicTypeService.getProperySpendings(payload).subscribe((response) => {
        console.log("Get spendings successfully.");
        // console.log(JSON.stringify(response));
        resolve(response['spendings']);
      }, err => {
        console.log(err);
        resolve(payload.speadings_input);
        // TODO : show error dialog
      });
    })
  }

  generateSpeadingInput(tempInput:any) { //speadingData
    tempInput = this.parseObject(tempInput);
    if (['village', 'townhome'].includes(this.propertyType)) {
      tempInput.priceLandBought = +tempInput.priceLandBought;
      tempInput.costConstructionLivingSpace = +tempInput.costConstructionLivingSpace;
      tempInput.costOther = +tempInput.costOther;
      tempInput.costPlan = +tempInput.costPlan;
      tempInput.sellPeriod = +tempInput.sellPeriod;
      tempInput.salaryEmployee = +tempInput.salaryEmployee;
      tempInput.costAdvt = +tempInput.costAdvt;
      tempInput.periodSellStart = this.parseDate(tempInput.periodSellStart);
      tempInput.periodSellEnd = this.parseDate(tempInput.periodSellEnd);
      return tempInput;
    }
    return tempInput;
  }

  requestProfit(payload :any) : Promise<any>{
    console.log("request profit . . .");
    // console.log(JSON.stringify(payload));
    return new Promise((resolve, reject) => {
      this.basicTypeService.getProperyProfit(payload).subscribe((response) => {
        console.log("Get profit successfully.")
        resolve(response['profit']);
      }, err => {
        console.log(err);
        reject();
        // TODO : show error dialog
      });
    })
  }

  requestImplicitsCost(payload: any) : Promise<any> {
    console.log("request implicitCosts . . .");
    // console.log(JSON.stringify(payload));
    return new Promise((resolve, reject) => {
      this.basicTypeService.getProperyImplicitCosts(payload).subscribe((response) => {
        console.log("Get implicitCosts successfully.")
        resolve(response['implicitCosts']);
      }, err => {
        console.log(err);
        reject();
        // TODO : show error dialog
      });
    })
  }

  requestIPRRateReturn(payload: any) : Promise<any>{
    console.log("request IPR rate return . . .");
    // console.log(JSON.stringify(payload));
    return new Promise((resolve, reject) => {
      this.basicTypeService.getProperyRateReturn(payload).subscribe((response) => {
        console.log("Get IPRRateReturn successfully.");
        // console.log(JSON.stringify(response.ipr.ipr));
        resolve(response['ipr']['ipr']);
      }, err => {
        console.log("Error.");
        console.log(err);
        // TODO : Townhome is api bug. It's cannot callulate correctly.
        resolve(payload.ipr_input);
        // TODO : show error dialog
      })
    })
  }

  parseToMillionFormat(value: number) {
    return +(value * 1000000);
  }

  parseMillionToUnitFormat(value: number) {
    let stringValue = value + '';
    return +(stringValue.replace('000000', ''));
  }

  parseDate(date: string): string {
    try {
      if (date.indexOf('/') > 0) {
        return date;
      }
    } catch (e) {
      return "";
    }

    let d = date.substring(8, 10);
    let m = date.substring(5, 7);
    let y = date.substring(0, 4);
    return m + "/" + d + "/" + y
  }
}
