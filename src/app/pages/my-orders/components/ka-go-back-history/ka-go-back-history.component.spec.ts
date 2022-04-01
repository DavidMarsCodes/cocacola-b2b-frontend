import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaGoBackHistoryComponent } from './ka-go-back-history.component';

describe('KaGoBackHistoryComponent', () => {
  let component: KaGoBackHistoryComponent;
  let fixture: ComponentFixture<KaGoBackHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KaGoBackHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaGoBackHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
