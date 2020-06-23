import { Component, OnInit } from '@angular/core';
import { BasicTypeService } from '../../core/services/basic-type.service';
import { Store } from '@ngrx/store';

import * as fromCore from '../../core/reducers';

@Component({
  selector: 'app-conclusion',
  templateUrl: './conclusion.component.html',
  styleUrls: ['./conclusion.component.css']
})
export class ConclusionComponent implements OnInit {
  
  currentProperty: string;
  areaData:any;

  constructor(private store: Store<any>,
    private basicTypeService:BasicTypeService) {}

  ngOnInit() {
    this.store.select(fromCore.getPage)
    .subscribe(page => {
      this.currentProperty = page.page;
    });
    this.store.select(fromCore.getArea)
    .subscribe(area => {
      this.areaData = area.payload;
    });
  }

  
}
