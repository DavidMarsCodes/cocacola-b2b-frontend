import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { S2ProductsComponent } from './s2-products.component';

describe('S2ProductsComponent', () => {
  let component: S2ProductsComponent;
  let fixture: ComponentFixture<S2ProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [S2ProductsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(S2ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
