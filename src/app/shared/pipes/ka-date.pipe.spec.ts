import { HttpClient, HttpHandler } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { async, inject, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { KaDatePipe } from './ka-date.pipe';

describe('KaDatePipe', () => {
  function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, './assets/locale/', '.json');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient],
          },
        }),
      ],
      providers: [TranslateService, HttpClient, HttpHandler],
    }).compileComponents();
  }));

  it('create an instance', inject([TranslateService], async (translateService: TranslateService) => {
    const pipe = new KaDatePipe(translateService);
    expect(pipe).toBeTruthy();
  }));

  it('should transform', inject([TranslateService], async (translateService: TranslateService) => {
    const pipe = new KaDatePipe(translateService);
    expect(pipe.transform('2021-10-19T15:53:47+0000', 'dd/MM/yyyy')).toBe('19/10/2021');
  }));
});
