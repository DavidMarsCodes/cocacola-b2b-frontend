import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaMyOrderDetailTableComponent } from './ka-my-order-detail-table.component';

describe('KaMyOrderDetailTableComponent', () => {
  let component: KaMyOrderDetailTableComponent;
  let fixture: ComponentFixture<KaMyOrderDetailTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KaMyOrderDetailTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaMyOrderDetailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
