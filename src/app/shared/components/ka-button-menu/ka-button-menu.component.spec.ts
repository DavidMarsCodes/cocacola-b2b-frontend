import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KaButtonMenuComponent } from './ka-button-menu.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { reducers } from '../../../core/state/app.state';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { getClientFeatureState } from '../../../core/state/reducers/client.reducer';
import { RouterTestingModule } from '@angular/router/testing';

describe('KaButtonMenuComponent', () => {
  let component: KaButtonMenuComponent;
  let fixture: ComponentFixture<KaButtonMenuComponent>;
  let store: MockStore<typeof reducers>;
  let mockClientSelector;

  beforeEach(async () => {});

  it('should create', async () => {
    await TestBed.configureTestingModule({
      providers: [provideMockStore()],
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [KaButtonMenuComponent],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    mockClientSelector = store.overrideSelector(getClientFeatureState, {
      hasLockOrder: true,
    });
    fixture = TestBed.createComponent(KaButtonMenuComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    spyOn(store, 'dispatch').and.callFake(() => {});
    expect(component).toBeTruthy();
  });
});
