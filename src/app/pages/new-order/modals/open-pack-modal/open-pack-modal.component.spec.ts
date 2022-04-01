import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenPackModalComponent } from './open-pack-modal.component';

describe('OpenPackModalComponent', () => {
  let component: OpenPackModalComponent;
  let fixture: ComponentFixture<OpenPackModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenPackModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenPackModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
