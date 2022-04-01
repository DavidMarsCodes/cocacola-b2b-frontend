import { ComponentFixture, TestBed } from '@angular/core/testing';

import { S6MiniCreditComponent } from './s6-mini-credit.component';

describe('S6MiniCreditComponent', () => {
  let component: S6MiniCreditComponent;
  let fixture: ComponentFixture<S6MiniCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [S6MiniCreditComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(S6MiniCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
