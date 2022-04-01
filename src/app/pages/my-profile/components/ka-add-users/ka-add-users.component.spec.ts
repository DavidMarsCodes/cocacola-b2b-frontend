import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaAddUsersComponent } from './ka-add-users.component';

describe('KaAddUsersComponent', () => {
  let component: KaAddUsersComponent;
  let fixture: ComponentFixture<KaAddUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KaAddUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaAddUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
