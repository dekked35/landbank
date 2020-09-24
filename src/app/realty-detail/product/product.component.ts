import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store'

import * as pageAction from '../../core/actions/page.actions';
import * as areaAction from '../../core/actions/area.actions';
import * as fromCore from '../../core/reducers';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  currentProperty: string;
  showCompetitor: boolean = false;
  constructor(private store: Store<any>) {
    this.store.select(fromCore.getPage)
    .subscribe(page => {
      this.currentProperty = page.page;
      this.showCompetitor = false;
    });
   }

  ngOnInit() {
  }

}
