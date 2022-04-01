import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaOrderFooterComponent } from './ka-order-footer.component';

describe('KaOrderFooterComponent', () => {
  let component: KaOrderFooterComponent;
  let fixture: ComponentFixture<KaOrderFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KaOrderFooterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaOrderFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
