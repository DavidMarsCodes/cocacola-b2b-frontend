import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaDotStepperComponent } from './ka-dot-stepper.component';

describe('KaDotStepperComponent', () => {
  let component: KaDotStepperComponent;
  let fixture: ComponentFixture<KaDotStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KaDotStepperComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaDotStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
