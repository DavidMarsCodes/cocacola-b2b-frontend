import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaDeliveryDetailsComponent } from './ka-delivery-details.component';

describe('KaDeliveryDetailsComponent', () => {
  let component: KaDeliveryDetailsComponent;
  let fixture: ComponentFixture<KaDeliveryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KaDeliveryDetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaDeliveryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
