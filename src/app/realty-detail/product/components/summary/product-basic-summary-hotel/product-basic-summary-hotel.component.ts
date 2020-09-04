import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store'

import * as schemaDefault from '../../../../../core/schema/basic-type/hotel';
import * as productAction from '../../../../../core/actions/product.actions';
import * as fromCore from '../../../../../core/reducers';

@Component({
  selector: 'app-product-basic-summary-hotel',
  templateUrl: './product-basic-summary-hotel.component.html',
  styleUrls: ['./product-basic-summary-hotel.component.css']
})
export class ProductBasicSummaryHotelComponent implements OnInit, OnChanges {
  @Input() owner: string;
  @Input() ownerData: any;

  currentProperty: string = "";
  products: any ;
  areaData: any;
  conclustionText : string = "สรุปจำนวน";
  isin: number = 1
  constructor(private store: Store<any>) {}

  ngOnInit() {
    // this.settingHeader = this.header[this.owner];
    this.store.select(fromCore.getPage)
    .subscribe(page => {
      this.currentProperty = page.page;
    });

    this.store.select(fromCore.getArea)
    .subscribe(data => {
      this.areaData = data.payload;
    });

    this.store.select(fromCore.getProduct)
    .subscribe(data => {
      const opposite = this.owner === 'user' ? 'competitor' : 'user';
      this.products = data.payload[this.owner];
      // if (data.payload[this.owner].rooms.length === 0) {
      //   this.products = data.payload[opposite];
      // }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    try {
      this.products = changes.ownerData.currentValue;
      // let newOwnerData = changes.ownerData;
      // this.ownerData = JSON.parse(JSON.stringify(newOwnerData.currentValue));
    } catch (e) {
      this.ownerData = { products: []}
    }
  }

}
