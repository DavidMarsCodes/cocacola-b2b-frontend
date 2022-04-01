import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaSelectDeliveryDateComponent } from './ka-select-delivery-date.component';

describe('KaSelectDeliveryDateComponent', () => {
  let component: KaSelectDeliveryDateComponent;
  let fixture: ComponentFixture<KaSelectDeliveryDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KaSelectDeliveryDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaSelectDeliveryDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
