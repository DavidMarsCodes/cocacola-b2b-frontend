import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaNavbarMenuMobileComponent } from './ka-navbar-menu-mobile.component';

describe('KaNavbarMenuMobileComponent', () => {
  let component: KaNavbarMenuMobileComponent;
  let fixture: ComponentFixture<KaNavbarMenuMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KaNavbarMenuMobileComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaNavbarMenuMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
