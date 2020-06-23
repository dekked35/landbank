import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBasicSummaryTownhouseComponent } from './product-basic-summary-townhouse.component';

describe('ProductBasicSummaryTownhouseComponent', () => {
  let component: ProductBasicSummaryTownhouseComponent;
  let fixture: ComponentFixture<ProductBasicSummaryTownhouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductBasicSummaryTownhouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBasicSummaryTownhouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
