import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaMyOrderDetailResumeComponent } from './ka-my-order-detail-resume.component';

describe('KaMyOrderDetailResumeComponent', () => {
  let component: KaMyOrderDetailResumeComponent;
  let fixture: ComponentFixture<KaMyOrderDetailResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KaMyOrderDetailResumeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaMyOrderDetailResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
