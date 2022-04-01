import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaSimpleProductComponent } from './ka-simple-product.component';

describe('KaSimpleProductComponent', () => {
  let component: KaSimpleProductComponent;
  let fixture: ComponentFixture<KaSimpleProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KaSimpleProductComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaSimpleProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
