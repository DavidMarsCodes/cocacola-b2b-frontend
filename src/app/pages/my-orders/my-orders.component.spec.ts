import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Injectable, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActionsSubject, ReducerManager, StateObservable, Store, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule, TranslateService, USE_STORE } from '@ngx-translate/core';
import { GoogleTagManagerModule } from 'angular-google-tag-manager';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';
import { MyOrdersComponent } from './my-orders.component';
import { Observable } from 'rxjs';
import { Client } from 'src/app/core/models/client.model';

@Injectable()
class storeMock<T> extends Store {
  overrideSelector(clients: any, arg1: { checkStatus: boolean }) {
    throw new Error('Method not implemented.');
  }
  constructor(stateObsevable: StateObservable, actionObserver: ActionsSubject, reducerManager: ReducerManager) {
    super(stateObsevable, actionObserver, reducerManager);
  }
  select(): Observable<{ client: Client }> {
    return new Observable((obs) => {
      const client = {
        street: 'ARTURO PRAT',
        hasLockOrder: true,
      };
      obs.next({ client });
    });
  }
}

describe('MyOrdersComponent', () => {
  let component: MyOrdersComponent;
  let fixture: ComponentFixture<MyOrdersComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot({}),
        ToastrModule.forRoot({}),
        HttpClientTestingModule,
        StoreModule.forRoot({}),
        GoogleTagManagerModule.forRoot({ id: 'TEST_GTM_ID' }),
      ],
      declarations: [MyOrdersComponent],
      providers: [provideMockStore({}), { provide: ToastrService, useClass: ToastrService }, TranslateService, HttpClient, HttpHandler, UserService, storeMock],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
