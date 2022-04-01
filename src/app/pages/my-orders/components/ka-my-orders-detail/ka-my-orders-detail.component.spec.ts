import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaMyOrdersDetailComponent } from './ka-my-orders-detail.component';

describe('KaMyOrdersDetailComponent', () => {
  let component: KaMyOrdersDetailComponent;
  let fixture: ComponentFixture<KaMyOrdersDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KaMyOrdersDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaMyOrdersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
