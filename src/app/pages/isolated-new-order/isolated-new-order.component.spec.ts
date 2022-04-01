import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsolatedNewOrderComponent } from './isolated-new-order.component';

describe('IsolatedNewOrderComponent', () => {
  let component: IsolatedNewOrderComponent;
  let fixture: ComponentFixture<IsolatedNewOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IsolatedNewOrderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsolatedNewOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
