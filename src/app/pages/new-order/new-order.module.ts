import { NgModule } from '@angular/core';
import { NewOrderRoutingModule } from './new-order-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NewOrderComponent } from './new-order.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { KaCartSidebarComponent } from './components/ka-cart-sidebar/ka-cart-sidebar.component';
import { KaOrderDetailComponent } from './steps/s4-detail/ka-order-detail/ka-order-detail.component';
import { KaMyOrderTableComponent } from './steps/s4-detail/ka-my-order-table/ka-my-order-table.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { S1DeliveryDateComponent } from './steps/s1-delivery-date/s1-delivery-date.component';
import { S2ProductsComponent } from './steps/s2-products/s2-products.component';
import { NewOrderService } from './services/new-order.service';
import { S4DetailComponent } from './steps/s4-detail/s4-detail.component';
import { S5ConfirmComponent } from './steps/s5-confirm/s5-confirm.component';
import { PaymentMethodComponent } from './steps/s4-detail/payment-method/payment-method.component';
import { S3MyOrderMobileComponent } from './steps/s3-my-order-mobile/s3-my-order-mobile.component';
import { S4DetailSidebarComponent } from './steps/s4-detail/s4-detail-sidebar/s4-detail-sidebar.component';
import { KaMinimunPurchaseComponent } from './components/ka-minimun-purchase/ka-minimun-purchase.component';
import { KaMyOrderWidgetComponent } from './steps/s4-detail/ka-my-order-widget/ka-my-order-widget.component';
import { ProductsService } from '../../core/services/products.service';
import { DeadlineExceededModalComponent } from './steps/s4-detail/deadline-exceeded-modal/deadline-exceeded-modal.component';
import { KaCurrencyPipe } from 'src/app/shared/pipes/ka-currency.pipe';
import { ScalePackModalComponent } from './modals/scale-pack-modal/scale-pack-modal.component';
import { OpenPackModalComponent } from './modals/open-pack-modal/open-pack-modal.component';
import { DeadlineWarnModalComponent } from './modals/deadline-warn-modal/deadline-warn-modal.component';
import { S6MiniCreditComponent } from './steps/s6-mini-credit/s6-mini-credit.component';
import { KaS6SidebarComponent } from './steps/s6-mini-credit/components/ka-s6-sidebar/ka-s6-sidebar.component';
import { KaHowToPayComponent } from './steps/s6-mini-credit/components/ka-how-to-pay/ka-how-to-pay.component';
import { KaHowToPayWidgetComponent } from './steps/s4-detail/ka-how-to-pay-widget/ka-how-to-pay-widget.component';
import { AlertWarmModalComponent } from './modals/alert-warm-modal/alert-warm-modal.component';

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
  declarations: [
    NewOrderComponent,
    KaOrderDetailComponent,
    KaMyOrderTableComponent,
    KaCartSidebarComponent,
    S1DeliveryDateComponent,
    S2ProductsComponent,
    S4DetailComponent,
    S5ConfirmComponent,
    S4DetailSidebarComponent,
    PaymentMethodComponent,
    S3MyOrderMobileComponent,
    KaMinimunPurchaseComponent,
    KaMyOrderWidgetComponent,
    DeadlineExceededModalComponent,
    ScalePackModalComponent,
    OpenPackModalComponent,
    DeadlineWarnModalComponent,
    S6MiniCreditComponent,
    KaS6SidebarComponent,
    KaHowToPayComponent,
    KaHowToPayWidgetComponent,
    AlertWarmModalComponent,
  ],
  imports: [
    CommonModule,
    NewOrderRoutingModule,
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
  entryComponents: [],
  providers: [MatDatepickerModule, NewOrderService, ProductsService, KaCurrencyPipe],
  exports: [
    KaMinimunPurchaseComponent,
    KaOrderDetailComponent,
    AlertWarmModalComponent,
    NewOrderComponent,
    KaOrderDetailComponent,
    KaMyOrderTableComponent,
    KaCartSidebarComponent,
    S1DeliveryDateComponent,
    S2ProductsComponent,
    S4DetailComponent,
    S5ConfirmComponent,
    S4DetailSidebarComponent,
    PaymentMethodComponent,
    S3MyOrderMobileComponent,
    KaMinimunPurchaseComponent,
    KaMyOrderWidgetComponent,
    DeadlineExceededModalComponent,
    ScalePackModalComponent,
    OpenPackModalComponent,
    DeadlineWarnModalComponent,
    S6MiniCreditComponent,
    KaS6SidebarComponent,
    KaHowToPayComponent,
    KaHowToPayWidgetComponent,
    AlertWarmModalComponent,
  ],
})
export class NewOrderModule {}
