import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBasicSettingHotelComponent } from './product-basic-setting-hotel.component';

describe('ProductBasicSettingHotelComponent', () => {
  let component: ProductBasicSettingHotelComponent;
  let fixture: ComponentFixture<ProductBasicSettingHotelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductBasicSettingHotelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBasicSettingHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
