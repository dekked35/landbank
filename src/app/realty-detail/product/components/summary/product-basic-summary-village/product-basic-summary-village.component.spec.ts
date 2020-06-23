import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBasicSummaryVillageComponent } from './product-basic-summary-village.component';

describe('ProductBasicSummaryVillageComponent', () => {
  let component: ProductBasicSummaryVillageComponent;
  let fixture: ComponentFixture<ProductBasicSummaryVillageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductBasicSummaryVillageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBasicSummaryVillageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
