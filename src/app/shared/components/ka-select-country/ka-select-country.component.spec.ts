import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaSelectCountryComponent } from './ka-select-country.component';

describe('KaSelectCountryComponent', () => {
  let component: KaSelectCountryComponent;
  let fixture: ComponentFixture<KaSelectCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KaSelectCountryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaSelectCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
