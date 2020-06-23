import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateReturnComponent } from './rate-return.component';

describe('RateReturnComponent', () => {
  let component: RateReturnComponent;
  let fixture: ComponentFixture<RateReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
