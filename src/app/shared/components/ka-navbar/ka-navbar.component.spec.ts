import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaNavbarComponent } from './ka-navbar.component';

describe('KaNavbarComponent', () => {
  let component: KaNavbarComponent;
  let fixture: ComponentFixture<KaNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KaNavbarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
