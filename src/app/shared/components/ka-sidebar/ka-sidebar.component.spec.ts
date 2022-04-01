import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaSidebarComponent } from './ka-sidebar.component';

describe('KaSidebarComponent', () => {
  let component: KaSidebarComponent;
  let fixture: ComponentFixture<KaSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KaSidebarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
