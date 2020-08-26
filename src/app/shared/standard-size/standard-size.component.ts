import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromCore from '../../core/reducers';
import { DefaultsVariableService } from '../../core/services/defaults-variable.service';

@Component({
  selector: 'app-standard-size',
  templateUrl: './standard-size.component.html',
  styleUrls: ['./standard-size.component.css']
})
export class StandardSizeComponent implements OnInit {

  @Input() standardType: string; // size , price
  @Input() type : string; // rooms/ centrals/ parkings/ outdoors / Special Equipment / costPerMonth /
  @Input() owner : string;

  buttonLabel: string = "ดูขนาดมาตรฐาน" ; //ดูขนาดมาตรฐาน || ดูราคามาตรฐาน
  standardLabel: string = "Standard Size"; //  Standard Size || Standard Price
  nameLabel: string = "พื้นที่ก่อสร้าง"; // พื้นที่ก่อสร้าง || รายการ
  showIcon: boolean = false;
  standardSize: Array<any>; // It's can be standard size and standard price
  currentProperty: string;
  competitorColor : {}
  pic: ''
  tableSize: any ;

  constructor(private defaultsVariableService: DefaultsVariableService,
    private store: Store<any>) {
      this.store.select(fromCore.getPage)
      .subscribe(page => {
        this.currentProperty = page.page;
      });
    }

  ngOnInit() {
    this.checkInnerWidth();

    if(this.standardType === 'price') {
      this.buttonLabel = "ดูราคามาตรฐาน";
      this.standardLabel = "Standard Price";
      this.nameLabel = "รายการ";
    } else if(this.standardType === 'size'){
      this.buttonLabel = "ดูขนาดมาตรฐาน";
      this.standardLabel = "Standard Size";
      this.nameLabel = "พื้นที่ก่อสร้าง";
    } else {
      this.buttonLabel = "ดูการคำนวณพื้นที่จอดรถ"
    }

    if(['room', 'central', 'parking', 'outdoor'].includes(this.type)){
      this.showIcon = true;
    }
    this.competitorColor = this.owner === 'competitor' ? { 'background-color' : '#ff781f', 'border': '1px solid #ff781f' } : { }

    this.standardSize = this.defaultsVariableService.getStandardData(this.currentProperty, this.standardType, this.type);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkInnerWidth();
  }

  checkInnerWidth () {
    if (window.innerWidth < 500) {
      this.tableSize = {'width': '320px'};
    } else {
      this.tableSize = {'width': '480px'};
    }
    if (this.currentProperty === 'townhome') {
      this.tableSize = {'width': '520px'};
    }
  }
}
