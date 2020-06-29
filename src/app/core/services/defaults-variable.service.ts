import { Injectable } from '@angular/core';
import * as constructionCostsData from './variables/contructionCosts';
import * as productDefaultData from './variables/productDefault';
import * as productOptionsData from './variables/productOptions';
import * as standardSizeData from './variables/standardSize';
import * as standardPriceData from './variables/standardPrice';
import * as incomePriceData from './variables/incomePrice';
import * as areaRatioData from './variables/areaRatio';
import * as areaRatioDefault from './variables/areaRatioDefault';


@Injectable({
  providedIn: 'root'
})

export class DefaultsVariableService {

  constructor() {}

  getAreaRatio(property: string){
    let areaRatio = areaRatioData.areaRatioList.filter((data)=> { return data.propertyType.includes(property)})[0];
    return areaRatio.areaRatio;
  }

  getAreaUnit(property: string, id :number){
    let areaRatio = [];
    let areaByProperty = areaRatioData.areaUnitList.filter((data)=> { return data.propertyType.includes(property)})[0];
    areaRatio = areaByProperty.areaRatio;
    return areaRatio.filter((data)=> {return data.id === id})[0];
  }

  getDefaultAreaAtio(property: string) {
    let areaRatio = areaRatioDefault.defaultAreaRatio.filter((data)=> { return data.propertyType.includes(property)})[0];
    return areaRatio.default;
  }

  getProductOptions(property: string, areaType:string) : any[] {
    return productOptionsData.productOptions[property][areaType];
  }

  getProductDefault(property: string, areaType:string) : any[] {
    return productDefaultData.productDefault[property][areaType];
  }

  getStandardSize(property: string, areaType:string) : any[] {
    return standardSizeData.standardSizes[property][areaType];
  }

  getStandardData(property: string, standardType: string, areaType:string) : any[] {
    if(standardType === 'size') {
      return standardSizeData.standardSizes[property][areaType];
    } else {
      return standardPriceData.standardPrices[property][areaType];
    }
  }

  getContructionCost(property: string, areaType:string, name: string) : number {
    return constructionCostsData.contructionCosts[property][areaType].filter(element => {
      return element['name'] === name;
    })[0]['cost'];
  }

  getIncome(property: string, areaType:string, name: string) : number {
    return incomePriceData.incomePrices[property][areaType].filter(element => {
      return element['name'] === name;
    })[0]['price'];
  }



}
