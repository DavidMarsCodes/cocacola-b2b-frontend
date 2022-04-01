import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TycModalComponent } from './tyc-modal.component';

describe('TycModalComponent', () => {
  let component: TycModalComponent;
  let fixture: ComponentFixture<TycModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TycModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TycModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
