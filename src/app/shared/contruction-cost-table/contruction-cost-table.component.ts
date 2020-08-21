import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store'
import * as fromCore from '../../core/reducers';

@Component({
  selector: 'app-contruction-cost-table',
  templateUrl: './contruction-cost-table.component.html',
  styleUrls: ['./contruction-cost-table.component.css']
})
export class ContructionCostTableComponent implements OnInit {

  constructor(private store: Store<any>) { }
  is_loading: boolean;

  spendingData :any;
  costConstructionPerItem: Array<any> = [];
  private currentProperty: string;

  iconMapping : any = {
    village : {
      0 : "home1.svg",
      1 : "home2.svg",
      2 : "home3.svg"
    },
    townhome : {
      0 : "townhome2.svg",
      1 : "townhome3.svg",
      2 : "townhome4.svg"
    },
    resort : {
      0 : "room/Pool Villa.svg",
      1 : "room/Family Room.svg",
      2 : "room/Jacuzzi Villa.svg",
    }
  }

  wording : any = {
    village : 'หลัง',
    townhome : 'อาคาร'
  }


  ngOnInit() {

    this.store.select(fromCore.getPage)
    .subscribe(page => {
      this.currentProperty = page.page;
    });

    this.store.select(fromCore.getSpendings)
    .subscribe(speading => {
      this.is_loading = speading.isLoading;
      this.spendingData = speading.payload;
      if(this.spendingData) {
        this.costConstructionPerItem = this.spendingData.costConstructionPerItem;
      }
    });
  }

  getIcon(index) : string {
    return this.iconMapping[this.currentProperty][index];
  }

  getWord() : string {
    return this.wording[this.currentProperty];
  }

}
