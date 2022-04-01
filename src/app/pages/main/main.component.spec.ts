import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActionsSubject, ReducerManager, StateObservable, Store, StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { GoogleTagManagerModule, GoogleTagManagerService } from 'angular-google-tag-manager';
import { ToastrModule } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { reduce } from 'rxjs/operators';
import { Cart } from 'src/app/core/models/cart.model';
import { Client } from 'src/app/core/models/client.model';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { UserService } from 'src/app/core/services/user.service';
import { OrdersService } from '../my-orders/services/orders.service';

import { MainComponent } from './main.component';

@Injectable()
class storeMock<T> extends Store {
  constructor(stateObsevable: StateObservable, actionObserver: ActionsSubject, reducerManager: ReducerManager) {
    super(stateObsevable, actionObserver, reducerManager);
  }
  select(): Observable<{ user: UserInfo }> {
    return new Observable((obs) => {
      const userCountry = {
        countryId: 'CH',
      };
      obs.next({ user: userCountry });
    });
  }
}

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({}),
        StoreModule.forRoot({}),
        ToastrModule.forRoot(),
        RouterTestingModule,
        GoogleTagManagerModule.forRoot({ id: 'TEST_GTM_ID' }),
      ],
      declarations: [MainComponent],
      providers: [
        GoogleTagManagerService,
        { provide: ' googleTagManagerId', useValue: 'TEST_GTM_ID' },
        TranslateService,
        HttpClient,
        HttpHandler,
        UserService,
        OrdersService,
        storeMock,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', inject([storeMock], async (store: storeMock<{ user: UserInfo }>) => {
    expect(component).toBeTruthy();
  }));

  afterEach(() => {
    fixture.destroy();
  });
});
