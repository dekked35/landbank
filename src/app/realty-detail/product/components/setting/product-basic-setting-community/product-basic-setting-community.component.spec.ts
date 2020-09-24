import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBasicSettingCommunityComponent } from './product-basic-setting-community.component';

describe('ProductBasicSettingHotelComponent', () => {
  let component: ProductBasicSettingCommunityComponent;
  let fixture: ComponentFixture<ProductBasicSettingCommunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductBasicSettingCommunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBasicSettingCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
