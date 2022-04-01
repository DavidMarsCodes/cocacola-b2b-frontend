import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDateModalComponent } from './edit-date-modal.component';

describe('EditDateModalComponent', () => {
  let component: EditDateModalComponent;
  let fixture: ComponentFixture<EditDateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditDateModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
