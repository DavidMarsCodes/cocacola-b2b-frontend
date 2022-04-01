import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { S1DeliveryDateComponent } from './s1-delivery-date.component';

describe('S1DeliveryDateComponent', () => {
  let component: S1DeliveryDateComponent;
  let fixture: ComponentFixture<S1DeliveryDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [S1DeliveryDateComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(S1DeliveryDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
