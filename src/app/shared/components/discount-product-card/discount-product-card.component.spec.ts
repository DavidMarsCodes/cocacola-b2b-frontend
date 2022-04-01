import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountProductCardComponent } from './discount-product-card.component';

describe('DiscountProductCardComponent', () => {
  let component: DiscountProductCardComponent;
  let fixture: ComponentFixture<DiscountProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiscountProductCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountProductCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
