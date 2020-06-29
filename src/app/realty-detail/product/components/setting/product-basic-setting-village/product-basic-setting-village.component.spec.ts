import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBasicSettingVillageComponent } from './product-basic-setting-village.component';

describe('ProductBasicSettingVillageComponent', () => {
  let component: ProductBasicSettingVillageComponent;
  let fixture: ComponentFixture<ProductBasicSettingVillageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductBasicSettingVillageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBasicSettingVillageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
