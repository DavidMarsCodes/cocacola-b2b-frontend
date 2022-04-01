import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaAccountStatusComponent } from './ka-account-status.component';

describe('KaAccountStatusComponent', () => {
  let component: KaAccountStatusComponent;
  let fixture: ComponentFixture<KaAccountStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KaAccountStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaAccountStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
