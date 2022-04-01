import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MyBenefitsRoutingModule } from './my-benefits-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ModalsService } from 'src/app/core/services/modals.service';
import { DocsViewModalComponent } from 'src/app/shared/modals/docs-view-modal/docs-view-modal.component';
import { MyBenefitsComponent } from './my-benefits.component';
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/locale/', '.json');
}

export class MyMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams): any {
    if (params.interpolateParams) {
      return params.interpolateParams['Default'] || params.key;
    }
    return params.key;
  }
}
@NgModule({
  declarations: [DocsViewModalComponent, MyBenefitsComponent],
  imports: [
    CommonModule,
    MyBenefitsRoutingModule,
    SharedModule,
    TranslateModule.forChild({
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler },
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      extend: true,
    }),
  ],
  providers: [ModalsService],
})
export class MyBenefitsModule {}
