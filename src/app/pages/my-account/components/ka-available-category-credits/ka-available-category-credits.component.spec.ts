import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaAvailableCategoryCreditsComponent } from './ka-available-category-credits.component';

describe('KaAvailableCategoryCreditsComponent', () => {
  let component: KaAvailableCategoryCreditsComponent;
  let fixture: ComponentFixture<KaAvailableCategoryCreditsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KaAvailableCategoryCreditsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaAvailableCategoryCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
