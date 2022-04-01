import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { ActionsSubject, ReducerManager, ReducerManagerDispatcher, StateObservable, Store, StoreModule } from '@ngrx/store';
import { userInfo } from 'os';
import { Observable, pipe } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { CountryCodes } from 'src/app/core/enums/country-codes.enum';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { KaCurrencyPipe } from './ka-currency.pipe';

describe('KaCurrencyPipe', () => {
  let pipe: KaCurrencyPipe;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StoreModule.forRoot({})],
      declarations: [AppComponent],
      providers: [StoreModule.forRoot({})],
    }).compileComponents();
  }));

  it('create an instance', inject([Store], async (store: Store<{ user: UserInfo }>) => {
    pipe = new KaCurrencyPipe(store);
    expect(pipe).toBeTruthy();
  }));

  it('should transform', inject([Store], async (store: Store<{ user: UserInfo }>) => {
    pipe = new KaCurrencyPipe(store);
    let value = '20.23';
    let expected = '$20.23';
    expect(pipe.transform(value)).toBe(expected);
  }));
});
