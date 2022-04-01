import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaSuggestedOnCartComponent } from './ka-suggested-on-cart.component';

describe('KaSuggestedOnCartComponent', () => {
  let component: KaSuggestedOnCartComponent;
  let fixture: ComponentFixture<KaSuggestedOnCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KaSuggestedOnCartComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaSuggestedOnCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
