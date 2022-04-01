import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaMenuItemsComponent } from './ka-menu-items.component';

describe('KaMenuItemsComponent', () => {
  let component: KaMenuItemsComponent;
  let fixture: ComponentFixture<KaMenuItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KaMenuItemsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaMenuItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
