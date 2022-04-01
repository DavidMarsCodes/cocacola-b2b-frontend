import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaRateExpComponent } from './ka-rate-exp.component';

describe('KaRateExpComponent', () => {
  let component: KaRateExpComponent;
  let fixture: ComponentFixture<KaRateExpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KaRateExpComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaRateExpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
