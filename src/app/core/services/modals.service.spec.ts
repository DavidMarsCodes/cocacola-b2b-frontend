import { async, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Injectable, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GoogleTagManagerModule } from 'angular-google-tag-manager';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';
import { ModalsService } from './modals.service';

describe('ModalsService', () => {
  let service: ModalsService;
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
      providers: [provideMockStore({}), { provide: ToastrService, useClass: ToastrService }, TranslateService, HttpClient, HttpHandler, UserService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
    service = TestBed.inject(ModalsService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
