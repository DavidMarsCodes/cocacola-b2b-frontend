import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, inject, Injectable, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActionsSubject, ReducerManager, StateObservable, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GoogleTagManagerModule } from 'angular-google-tag-manager';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';
import { ScalePackModalComponent } from './scale-pack-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { KaCurrencyPipe } from 'src/app/shared/pipes/ka-currency.pipe';
import { Observable } from 'rxjs';
import { Cart } from 'src/app/core/models/cart.model';
7;

describe('ScalePackModalComponent', () => {
  let component: ScalePackModalComponent;
  let fixture: ComponentFixture<ScalePackModalComponent>;

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
      declarations: [ScalePackModalComponent, KaCurrencyPipe],
      providers: [
        KaCurrencyPipe,
        provideMockStore({}),
        { provide: ToastrService, useClass: ToastrService },
        TranslateService,
        HttpClient,
        HttpHandler,
        UserService,
        NgbActiveModal,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScalePackModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
