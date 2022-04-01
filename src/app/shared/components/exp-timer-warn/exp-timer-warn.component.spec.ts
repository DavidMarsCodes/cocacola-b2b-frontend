import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpTimerWarnComponent } from './exp-timer-warn.component';

describe('ExpTimerWarnComponent', () => {
  let component: ExpTimerWarnComponent;
  let fixture: ComponentFixture<ExpTimerWarnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpTimerWarnComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpTimerWarnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
