import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { S3MyOrderMobileComponent } from './s3-my-order-mobile.component';

describe('S3MyOrderMobileComponent', () => {
  let component: S3MyOrderMobileComponent;
  let fixture: ComponentFixture<S3MyOrderMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [S3MyOrderMobileComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(S3MyOrderMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
