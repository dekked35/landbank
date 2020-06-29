import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBasicSummaryHotelComponent } from './product-basic-summary-hotel.component';

describe('ProductBasicSummaryHotelComponent', () => {
  let component: ProductBasicSummaryHotelComponent;
  let fixture: ComponentFixture<ProductBasicSummaryHotelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductBasicSummaryHotelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBasicSummaryHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
