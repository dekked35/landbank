import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromCore from '../../core/reducers';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {

  public currentProperty = '';

  constructor(
    private store: Store<any>,
  ) {
    this.store.select(fromCore.getPage).subscribe((page) => {
      this.currentProperty = page.page;
    });
  }

  ngOnInit() {
  }

  saveLocalPage() {
    localStorage.setItem('page', this.currentProperty);
  }

  clickButtonTop(){
    document.getElementById('button-print').click()
  }

}
