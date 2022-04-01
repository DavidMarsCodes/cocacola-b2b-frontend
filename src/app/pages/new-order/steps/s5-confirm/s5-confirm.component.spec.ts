import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { S5ConfirmComponent } from './s5-confirm.component';

describe('S5ConfirmComponent', () => {
  let component: S5ConfirmComponent;
  let fixture: ComponentFixture<S5ConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [S5ConfirmComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(S5ConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
