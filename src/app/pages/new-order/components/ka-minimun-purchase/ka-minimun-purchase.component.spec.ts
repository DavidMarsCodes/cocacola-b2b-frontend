import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaMinimunPurchaseComponent } from './ka-minimun-purchase.component';

describe('KaMinimunPurchaseComponent', () => {
  let component: KaMinimunPurchaseComponent;
  let fixture: ComponentFixture<KaMinimunPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KaMinimunPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaMinimunPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
