import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaPacksAndDiscountsComponent } from './ka-packs-and-discounts.component';

describe('KaPacksAndDiscountsComponent', () => {
  let component: KaPacksAndDiscountsComponent;
  let fixture: ComponentFixture<KaPacksAndDiscountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KaPacksAndDiscountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaPacksAndDiscountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
