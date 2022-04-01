import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaEditPasswordComponent } from './ka-edit-password.component';

describe('KaEditPasswordComponent', () => {
  let component: KaEditPasswordComponent;
  let fixture: ComponentFixture<KaEditPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KaEditPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaEditPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
