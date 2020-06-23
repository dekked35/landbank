import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplicitCostComponent } from './implicit-cost.component';

describe('ImplicitCostComponent', () => {
  let component: ImplicitCostComponent;
  let fixture: ComponentFixture<ImplicitCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImplicitCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImplicitCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
