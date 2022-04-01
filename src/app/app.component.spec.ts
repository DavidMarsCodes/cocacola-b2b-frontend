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
import { AppComponent } from './app.component';

describe('AppComponent', () => {
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
      declarations: [AppComponent],
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
  }));

  it('should be created', inject([GoogleTagManagerService], (service: GoogleTagManagerService) => {
    expect(service).toBeTruthy();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'cocacola-andina'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('cocacola-andina');
  });

  /*  it('should render title', () => {
     const fixture = TestBed.createComponent(AppComponent);
     fixture.detectChanges();
     const app = fixture.componentInstance;
     const compiled = fixture.nativeElement;
     expect(compiled.querySelector('.content ').textContent).toContain(app.title);
   }); */
});
