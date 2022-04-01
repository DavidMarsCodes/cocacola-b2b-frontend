import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Injectable, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActionsSubject, ReducerManager, StateObservable, Store, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateLoader, TranslateModule, TranslateService, USE_STORE } from '@ngx-translate/core';
import { GoogleTagManagerModule } from 'angular-google-tag-manager';
import { ToastInjector, ToastrModule, ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Client } from 'src/app/core/models/client.model';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { UserService } from 'src/app/core/services/user.service';
import { HomeComponent } from './home.component';

@Injectable()
class storeMock<T> extends Store {
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

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

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
      declarations: [HomeComponent],
      providers: [
        provideMockStore({}),
        { provide: ToastrService, useClass: ToastrService },
        TranslateService,
        HttpClient,
        HttpHandler,
        UserService,
        storeMock,
        { provide: Store, useClass: storeMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', inject([storeMock], async (store: storeMock<{ client: Client }>) => {
    expect(component).toBeTruthy();
  }));

  afterEach(() => {
    fixture.destroy();
  });
});
