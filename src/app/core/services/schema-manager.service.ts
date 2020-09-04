import { Injectable } from '@angular/core';

import * as villageSchema from '../../core/schema/basic-type/village';
import * as townhomeSchema from '../../core/schema/basic-type/townhome';
import * as condoSchema from '../../core/schema/basic-type/condo';
import * as hotelSchema from '../../core/schema/basic-type/hotel';
import * as communityMallSchema from '../../core/schema/basic-type/communityMall';

const DEFAULT_SCHEMA = {
  "village": villageSchema.village,
  "townhome": townhomeSchema.townhome,
  "condo": condoSchema.condo,
  "hotel": hotelSchema.hotel,
  "communityMall": communityMallSchema.communityMall,
}

@Injectable({
  providedIn: 'root'
})



export class SchemaManagerService {

  constructor() {}

  getAreaSchema(propertyType: string) {
    return this.parseObject(DEFAULT_SCHEMA[propertyType]['area']);
  }

  getProductSchema(propertyType: string) {
    return this.parseObject(DEFAULT_SCHEMA[propertyType]['product']);
  }

  getSpeadingSchema(propertyType: string) {
    return this.parseObject(DEFAULT_SCHEMA[propertyType]['spendings']);
  }

  getProfitSchama(propertyType: string) {
    return this.parseObject(DEFAULT_SCHEMA[propertyType]['profit']);
  }

  getImplicitSchema(propertyType: string) {
    return this.parseObject(DEFAULT_SCHEMA[propertyType]['implicitCosts']);
  }

  getRateReturn(propertyType: string) {
    return this.parseObject(DEFAULT_SCHEMA[propertyType]['rateReturn']);
  }

  parseObject(data: any){
    return JSON.parse(JSON.stringify(data));
  }

}
