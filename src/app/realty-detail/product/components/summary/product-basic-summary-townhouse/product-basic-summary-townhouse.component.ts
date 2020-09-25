import { Component, OnInit, OnChanges, SimpleChanges, Input} from '@angular/core';
import { Store } from '@ngrx/store'

import * as pageAction from '../../../../../core/actions/page.actions';
import * as areaAction from '../../../../../core/actions/product.actions';
import * as productAction from '../../../../../core/actions/product.actions';
import * as fromCore from '../../../../../core/reducers';

const imageType = {
  townhome : {
    0 : 'townhome2.svg' ,
    1 : 'townhome3.svg' ,
    2 : 'townhome4.svg'
  },
  townhomeCom : {
    0 : 'townhome2-2.png' ,
    1 : 'townhome3-2.png' ,
    2 : 'townhome4-2.png'
  },
};

@Component({
  selector: 'app-product-basic-summary-townhouse',
  templateUrl: './product-basic-summary-townhouse.component.html',
  styleUrls: ['./product-basic-summary-townhouse.component.css']
})

export class ProductBasicSummaryTownhouseComponent implements OnInit, OnChanges {
  @Input() owner: string;
  @Input() ownerData: any;
  areaData?: any;
  competitorColor : {};
  productData: any;
  currentProperty: string;
  isEmpty: boolean = false;
  is_loading: boolean = true;


  constructor(private store: Store<any>) {
      this.store.select(fromCore.getPage)
      .subscribe(page => {
        this.currentProperty = page.page;
      });
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
    "competitor" : "product",
    "user" : "product"
  }
  settingHeader : string;
  settingGraph: string;

  ngOnInit() {
    this.settingHeader = this.header[this.owner];
    this.settingGraph = this.graphs[this.owner];
    this.competitorColor = this.owner === 'competitor' ? { 'color' : '#ff781f' } : { }
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
    if(this.areaData.percent){
      // this.productData.centerArea = [0, 0, 0];
      this.isEmpty = this.productData.centerArea.every( (item) => item === 0)
    }
  }

  getImage(index: number){
    let wording = this.currentProperty;
    if (this.owner === 'competitor') {
      wording += 'Com';
    }
    return imageType[wording][index];
  }

}
