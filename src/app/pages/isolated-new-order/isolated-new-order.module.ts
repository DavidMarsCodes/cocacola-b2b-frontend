import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsolatedNewOrderComponent } from './isolated-new-order.component';
import { IsolatedNewOrderRoutingModule } from './isolated-new-order-routing.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewOrderModule } from '../new-order/new-order.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ProductsService } from 'src/app/core/services/products.service';
import { KaCurrencyPipe } from 'src/app/shared/pipes/ka-currency.pipe';
import { NewOrderService } from '../new-order/services/new-order.service';

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
  declarations: [IsolatedNewOrderComponent],
  imports: [
    CommonModule,
    IsolatedNewOrderRoutingModule,
    NewOrderModule,
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
  providers: [MatDatepickerModule, NewOrderService, ProductsService, KaCurrencyPipe],
})
export class IsolatedNewOrderModule {}
