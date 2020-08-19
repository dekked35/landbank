import { Component, OnInit, OnChanges, SimpleChanges, Input} from '@angular/core';
import { Store } from '@ngrx/store'

import * as pageAction from '../../../../../core/actions/page.actions';
import * as areaAction from '../../../../../core/actions/product.actions';
import * as productAction from '../../../../../core/actions/product.actions';
import * as fromCore from '../../../../../core/reducers';

@Component({
  selector: 'app-product-basic-summary-village',
  templateUrl: './product-basic-summary-village.component.html',
  styleUrls: ['./product-basic-summary-village.component.css']
})
export class ProductBasicSummaryVillageComponent implements OnInit, OnChanges {
  @Input() owner: string;
  @Input() ownerData: any;
  areaData?: any;

  productData: any;
  // ownerData: any;
  is_loading: boolean = true;
  constructor(private store: Store<any>) {
    this.store.select(fromCore.getProduct)
    .subscribe(product => {
      this.productData = JSON.parse(JSON.stringify(product.payload));
      this.is_loading = product.isLoading;
    });
    this.store.select(fromCore.getArea)
    .subscribe(area => {
      this.areaData = area.payload;
    });
   }

  header = {
    "competitor" : "คู่แข่ง",
    "user" : "เรา"
  }


  graphs = {
    "competitor" : "product-competitor-chart",
    "user" : "product-us-chart"
  }

  settingHeader : string;
  settingGraph: string;

  ngOnInit() {
    this.settingHeader = this.header[this.owner];
    this.settingGraph = this.graphs[this.owner];
  }

   // TODO: User state store instead.
  ngOnChanges(changes: SimpleChanges) {
    try {
      let newOwnerData = changes.ownerData;
      this.ownerData = JSON.parse(JSON.stringify(newOwnerData.currentValue));
      this.checkDataCenter();
    } catch (e) {
      this.ownerData = { products: []}
    }
  }

  checkDataCenter(){
    if((this.areaData.percent && this.areaData.percent.centerArea === 0) || (this.productData.centerArea === undefined) ){
      this.productData.centerArea = [0, 0, 0];
    }
  }
}
