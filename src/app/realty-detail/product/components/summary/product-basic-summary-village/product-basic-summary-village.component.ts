import { Component, OnInit, OnChanges, SimpleChanges, Input} from '@angular/core';
import { Store } from '@ngrx/store'

import * as pageAction from '../../../../../core/actions/page.actions';
import * as areaAction from '../../../../../core/actions/product.actions';
import * as productAction from '../../../../../core/actions/product.actions';
import * as fromCore from '../../../../../core/reducers';

const imageType = {
  village : {
    0 : 'home1.svg',
    1 : 'home2.svg',
    2 : 'home3.svg'
  },
  villageCom : {
    0 : 'home1-1.png',
    1 : 'home2-2.png',
    2 : 'home3-3.png'
  },
  resort : {
    0 : "room/Pool Villa.svg",
    1 : "room/Family Room.svg",
    2 : "room/Jacuzzi Villa.svg",
  }
};

@Component({
  selector: 'app-product-basic-summary-village',
  templateUrl: './product-basic-summary-village.component.html',
  styleUrls: ['./product-basic-summary-village.component.css']
})
export class ProductBasicSummaryVillageComponent implements OnInit, OnChanges {
  @Input() owner: string;
  @Input() ownerData: any;
  areaData?: any;

  currentProperty: string;
  competitorColor : {};
  productData: any;
  // ownerData: any;
  is_loading: boolean = true;
  constructor(private store: Store<any>) {
    this.store.select(fromCore.getPage)
      .subscribe(page => {
        this.currentProperty = page.page;
      });
    this.store.select(fromCore.getProduct)
    .subscribe(product => {
      if(product.payload){
        this.productData = JSON.parse(JSON.stringify(product.payload));
        this.is_loading = product.isLoading;
      }
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

  getImage(index: number){
    let wording = this.currentProperty;
    if (this.owner === 'competitor') {
      wording += 'Com';
    }
    return imageType[wording][index];
  }

  checkDataCenter(){
    if((this.areaData.percent && this.areaData.percent.centerArea === 0) || (this.productData.centerArea === undefined) ){
      this.productData.centerArea = [0, 0, 0];
    }
  }
}
