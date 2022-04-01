import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaWeekBestsellersComponent } from './ka-week-bestsellers.component';

describe('KaWeekBestsellersComponent', () => {
  let component: KaWeekBestsellersComponent;
  let fixture: ComponentFixture<KaWeekBestsellersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KaWeekBestsellersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaWeekBestsellersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
