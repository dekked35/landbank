import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardSizeComponent } from './standard-size.component';

describe('StandardSizeComponent', () => {
  let component: StandardSizeComponent;
  let fixture: ComponentFixture<StandardSizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardSizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
