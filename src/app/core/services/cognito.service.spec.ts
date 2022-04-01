import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import {
  DEFAULT_LANGUAGE,
  MissingTranslationHandler,
  TranslateCompiler,
  TranslateLoader,
  TranslateModule,
  TranslateParser,
  TranslateService,
  TranslateStore,
  USE_DEFAULT_LANG,
  USE_EXTEND,
  USE_STORE,
} from '@ngx-translate/core';
import { GoogleTagManagerModule, GoogleTagManagerService } from 'angular-google-tag-manager';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CognitoService } from './cognito.service';

describe('CognitoService', () => {
  let service: CognitoService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ToastrModule.forRoot(),
        HttpClientTestingModule,
        GoogleTagManagerModule.forRoot({ id: 'TEST_GTM_ID' }),
        RouterTestingModule,
        StoreModule.forRoot({}),
      ],
      declarations: [],
      providers: [
        TranslateService,
        TranslateStore,
        TranslateLoader,
        TranslateCompiler,
        TranslateParser,
        MissingTranslationHandler,
        { provide: USE_DEFAULT_LANG, useValue: undefined },
        { provide: USE_STORE, useValue: undefined },
        { provide: USE_DEFAULT_LANG, useValue: undefined },
        { provide: USE_EXTEND, useValue: undefined },
        { provide: ToastrService, useClass: ToastrService },
        HttpClient,
        GoogleTagManagerService,
        { provide: ' googleTagManagerId', useValue: 'TEST_GTM_ID' },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
    service = TestBed.inject(CognitoService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
