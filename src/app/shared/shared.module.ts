import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KaSelectCountryComponent } from './components/ka-select-country/ka-select-country.component';
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import * as fromMaterial from '../../assets/scss/material-components';
import { KaImageMenuComponent } from './components/ka-image-menu/ka-image-menu.component';
import { KaVerticalImageMenuComponent } from './components/ka-vertical-image-menu/ka-vertical-image-menu.component';
import { KaNavbarComponent } from './components/ka-navbar/ka-navbar.component';
import { KaNavbarMenuMobileComponent } from './components/ka-navbar-menu-mobile/ka-navbar-menu-mobile.component';
import { KaSelectCommerceComponent } from './components/ka-select-commerce/ka-select-commerce.component';
import { KaSuggestedProductComponent } from './components/ka-suggested-product/ka-suggested-product.component';
import { DiscountProductCardComponent } from './components/discount-product-card/discount-product-card.component';
import { KaRateExpComponent } from './components/ka-rate-exp/ka-rate-exp.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { KaSelectDeliveryDateComponent } from './components/ka-select-delivery-date/ka-select-delivery-date.component';
import { KaSplittedInputComponent } from './components/ka-splitted-input/ka-splitted-input.component';
import { KaPacksAndDiscountsComponent } from './components/ka-packs-and-discounts/ka-packs-and-discounts.component';
import { KaButtonMenuComponent } from './components/ka-button-menu/ka-button-menu.component';
import { KaWeekBestsellersComponent } from './components/ka-week-bestsellers/ka-week-bestsellers.component';
import { KaSimpleProductComponent } from './components/ka-simple-product/ka-simple-product.component';
import { KaLastOrderComponent } from './components/ka-last-order/ka-last-order.component';
import { KaRightSidebarComponent } from './components/ka-right-sidebar/ka-right-sidebar.component';
import { KaSuggestedOnCartComponent } from './components/ka-suggested-on-cart/ka-suggested-on-cart.component';
import { KaAvailableCreditsComponent } from './components/ka-available-credits/ka-available-credits.component';
import { ExpTimerWarnComponent } from './components/exp-timer-warn/exp-timer-warn.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RouterModule } from '@angular/router';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { SessionExpiredModalComponent } from './modals/session-expired-modal/session-expired-modal.component';
import { KaCurrencyPipe } from './pipes/ka-currency.pipe';
import { KaDatePipe } from './pipes/ka-date.pipe';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
import { LoadingModalComponent } from './modals/loading-modal/loading-modal.component';
import { EditDateModalComponent } from './modals/edit-date-modal/edit-date-modal.component';
import { KaMenuItemsComponent } from './components/ka-menu-items/ka-menu-items.component';
import { KaCreditsPipe } from './pipes/ka-credits.pipe';
import { KaCarouselComponent } from './components/ka-carousel/ka-carousel.component';
import { KaDeliveryDetailsComponent } from './components/ka-delivery-details/ka-delivery-details.component';
import { KaSidebarComponent } from './components/ka-sidebar/ka-sidebar.component';
import { KaPaymentMethodPipe } from './pipes/ka-payment-method.pipe';
import { KaOrderFooterComponent } from './components/ka-order-footer/ka-order-footer.component';

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

const sharedModules: any[] = [
  CommonModule,
  NgbModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  CarouselModule,
  FontAwesomeModule,
  ...fromMaterial.materialComponents,
  InfiniteScrollModule,
  UiSwitchModule,
];

const sharedComponents: any[] = [
  KaSelectCountryComponent,
  KaImageMenuComponent,
  KaVerticalImageMenuComponent,
  KaNavbarComponent,
  KaNavbarMenuMobileComponent,
  KaSelectCommerceComponent,
  KaSuggestedProductComponent,
  KaSelectDeliveryDateComponent,
  KaSplittedInputComponent,
  KaRateExpComponent,
  KaPacksAndDiscountsComponent,
  KaButtonMenuComponent,
  KaWeekBestsellersComponent,
  KaSimpleProductComponent,
  SessionExpiredModalComponent,
  ConfirmModalComponent,
  EditDateModalComponent,
  KaCarouselComponent,
  KaLastOrderComponent,
  KaRightSidebarComponent,
  DiscountProductCardComponent,
  KaOrderFooterComponent,
  KaDeliveryDetailsComponent,
  KaSuggestedOnCartComponent,
  KaAvailableCreditsComponent,
  ExpTimerWarnComponent,
  KaSidebarComponent,
];

const sharedPipes: any[] = [KaCurrencyPipe, KaDatePipe, KaCreditsPipe, KaPaymentMethodPipe];

@NgModule({
  declarations: [sharedComponents, sharedPipes, LoadingModalComponent, KaMenuItemsComponent],
  imports: [
    sharedModules,
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
  exports: [sharedModules, sharedComponents, sharedPipes, TranslateModule],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
  }
}
