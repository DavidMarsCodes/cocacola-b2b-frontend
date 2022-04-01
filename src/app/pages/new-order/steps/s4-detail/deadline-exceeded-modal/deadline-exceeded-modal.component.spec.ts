import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeadlineExceededModalComponent } from './deadline-exceeded-modal.component';

describe('DeadlineExceededModalComponent', () => {
  let component: DeadlineExceededModalComponent;
  let fixture: ComponentFixture<DeadlineExceededModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeadlineExceededModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeadlineExceededModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
