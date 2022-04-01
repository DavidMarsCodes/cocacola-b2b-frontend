import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaSelectCommerceComponent } from './ka-select-commerce.component';

describe('KaSelectCommerceComponent', () => {
  let component: KaSelectCommerceComponent;
  let fixture: ComponentFixture<KaSelectCommerceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KaSelectCommerceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaSelectCommerceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
