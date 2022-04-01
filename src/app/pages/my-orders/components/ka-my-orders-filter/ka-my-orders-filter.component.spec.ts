import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaMyOrdersFilterComponent } from './ka-my-orders-filter.component';

describe('KaMyOrdersFilterComponent', () => {
  let component: KaMyOrdersFilterComponent;
  let fixture: ComponentFixture<KaMyOrdersFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KaMyOrdersFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaMyOrdersFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
