import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Injectable, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule, TranslateService, USE_STORE } from '@ngx-translate/core';
import { GoogleTagManagerModule } from 'angular-google-tag-manager';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';
import { PrivacyTermsComponent } from './privacy-terms.component';

describe('PrivacyTermsComponent', () => {
  let component: PrivacyTermsComponent;
  let fixture: ComponentFixture<PrivacyTermsComponent>;

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
      declarations: [PrivacyTermsComponent],
      providers: [provideMockStore({}), { provide: ToastrService, useClass: ToastrService }, TranslateService, HttpClient, HttpHandler, UserService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
