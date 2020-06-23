import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBasicTypeComponent } from './product-basic-type.component';

describe('ProductBasicTypeComponent', () => {
  let component: ProductBasicTypeComponent;
  let fixture: ComponentFixture<ProductBasicTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductBasicTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBasicTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
