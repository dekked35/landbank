import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBasicSettingTownhouseComponent } from './product-basic-setting-townhouse.component';

describe('ProductBasicSettingTownhouseComponent', () => {
  let component: ProductBasicSettingTownhouseComponent;
  let fixture: ComponentFixture<ProductBasicSettingTownhouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductBasicSettingTownhouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBasicSettingTownhouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
