import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KaMyHistoryComponent } from './ka-my-history.component';

describe('KaMyHistoryComponent', () => {
  let component: KaMyHistoryComponent;
  let fixture: ComponentFixture<KaMyHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KaMyHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KaMyHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
