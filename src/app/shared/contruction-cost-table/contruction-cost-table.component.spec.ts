import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContructionCostTableComponent } from './contruction-cost-table.component';

describe('ContructionCostTableComponent', () => {
  let component: ContructionCostTableComponent;
  let fixture: ComponentFixture<ContructionCostTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContructionCostTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContructionCostTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
