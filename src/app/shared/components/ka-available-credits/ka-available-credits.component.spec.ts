import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaAvailableCreditsComponent } from './ka-available-credits.component';

describe('KaAvailableCreditsComponent', () => {
  let component: KaAvailableCreditsComponent;
  let fixture: ComponentFixture<KaAvailableCreditsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KaAvailableCreditsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaAvailableCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
