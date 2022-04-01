import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { S4DetailComponent } from './s4-detail.component';

describe('S4DetailComponent', () => {
  let component: S4DetailComponent;
  let fixture: ComponentFixture<S4DetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [S4DetailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(S4DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
