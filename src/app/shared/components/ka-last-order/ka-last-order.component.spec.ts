import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { KaLastOrderComponent } from './ka-last-order.component';

describe('KaLastOrderComponent', () => {
  let component: KaLastOrderComponent;
  let fixture: ComponentFixture<KaLastOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KaLastOrderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaLastOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
