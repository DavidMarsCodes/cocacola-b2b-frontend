import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeadlineWarnModalComponent } from './deadline-warn-modal.component';

describe('DeadlineWarnModalComponent', () => {
  let component: DeadlineWarnModalComponent;
  let fixture: ComponentFixture<DeadlineWarnModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeadlineWarnModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeadlineWarnModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
