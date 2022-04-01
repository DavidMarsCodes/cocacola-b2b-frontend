import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaMyOrdersBannerComponent } from './ka-my-orders-banner.component';

describe('KaMyOrdersBannerComponent', () => {
  let component: KaMyOrdersBannerComponent;
  let fixture: ComponentFixture<KaMyOrdersBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KaMyOrdersBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaMyOrdersBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
