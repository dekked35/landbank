import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { Store } from '@ngrx/store'
import * as pageAction from '../../../../core/actions/page.actions';
import * as areaAction from '../../../../core/actions/product.actions';
import * as productAction from '../../../../core/actions/product.actions';
import * as fromCore from '../../../../core/reducers';

@Component({
  selector: 'app-product-basic-type',
  templateUrl: './product-basic-type.component.html',
  styleUrls: ['./product-basic-type.component.css']
})
export class ProductBasicTypeComponent implements OnInit, OnChanges {
  @Input() showCompetitor:  boolean;

  currentProperty: string;
  areaData:any;
  productData:any;
  isShowCompetitor: boolean;
  needtoRefresh: boolean;

  constructor(private store: Store<any>) {
    this.store.select(fromCore.getPage)
    .subscribe(page => {
      this.currentProperty = page.page;
    });
    this.store.select(fromCore.getArea)
    .subscribe(area => {
      this.areaData = area.payload;
    });

    this.store.select(fromCore.getProduct)
    .subscribe(product => {
      this.productData = product.payload;
      if(product.payload === undefined) {
        this.productData  = { competitor: { products: []}, user : { products: []}};
      }
    });

   }


  ngOnInit() { this.isShowCompetitor = this.showCompetitor;}

  ngOnChanges(changes: SimpleChanges) {
    this.isShowCompetitor = changes.showCompetitor.currentValue;
    if (this.isShowCompetitor) {
      this.needtoRefresh = true;
    } else {
      this.needtoRefresh = false;
    }
  }
}
