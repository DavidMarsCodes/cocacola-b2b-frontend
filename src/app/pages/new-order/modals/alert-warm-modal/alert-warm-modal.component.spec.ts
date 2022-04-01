import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertWarmModalComponent } from './alert-warm-modal.component';

describe('AlertWarmModalComponent', () => {
  let component: AlertWarmModalComponent;
  let fixture: ComponentFixture<AlertWarmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertWarmModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertWarmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
