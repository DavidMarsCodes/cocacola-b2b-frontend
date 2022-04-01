import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaRightSidebarComponent } from './ka-right-sidebar.component';

describe('KaRightSidebarComponent', () => {
  let component: KaRightSidebarComponent;
  let fixture: ComponentFixture<KaRightSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KaRightSidebarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaRightSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
