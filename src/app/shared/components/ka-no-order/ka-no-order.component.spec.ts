import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaNoOrderComponent } from './ka-no-order.component';

describe('KaNoOrderComponent', () => {
  let component: KaNoOrderComponent;
  let fixture: ComponentFixture<KaNoOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KaNoOrderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaNoOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
