import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaSuggestedProductComponent } from './ka-suggested-product.component';

describe('KaSuggestedProductComponent', () => {
  let component: KaSuggestedProductComponent;
  let fixture: ComponentFixture<KaSuggestedProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KaSuggestedProductComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaSuggestedProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
