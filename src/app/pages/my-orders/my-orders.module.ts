import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyOrdersRoutingModule } from './my-orders-routing.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from '../../shared/shared.module';
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MyOrdersComponent } from './my-orders.component';
import { KaMyOrdersBannerComponent } from './components/ka-my-orders-banner/ka-my-orders-banner.component';
import { KaMyHistoryComponent } from './components/ka-my-history/ka-my-history.component';
import { CoreModule } from '../../core/core.module';
import { NewOrderModule } from '../new-order/new-order.module';
import { KaMyOrdersDetailComponent } from './components/ka-my-orders-detail/ka-my-orders-detail.component';
import { KaMyOrderDetailTableComponent } from './components/ka-my-order-detail-table/ka-my-order-detail-table.component';
import { KaMyOrdersFilterComponent } from './components/ka-my-orders-filter/ka-my-orders-filter.component';
import { KaMyOrderDetailResumeComponent } from './components/ka-my-order-detail-resume/ka-my-order-detail-resume.component';
import { OrdersService } from './services/orders.service';
import { KaGoBackHistoryComponent } from './components/ka-go-back-history/ka-go-back-history.component';

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
    MyOrdersComponent,
    KaMyOrdersBannerComponent,
    KaMyHistoryComponent,
    KaMyOrdersDetailComponent,
    KaMyOrderDetailTableComponent,
    KaMyOrdersFilterComponent,
    KaMyOrderDetailResumeComponent,
    KaGoBackHistoryComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    MyOrdersRoutingModule,
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
  providers: [OrdersService],
})
export class MyOrdersModule {}
