import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/core/models/cart.model';
import { ModalsService } from 'src/app/core/services/modals.service';
import { ProductsService } from 'src/app/core/services/products.service';
import { KaCurrencyPipe } from 'src/app/shared/pipes/ka-currency.pipe';
import { Product } from 'src/app/core/models/product.model';
import { getCartProducts } from '../../../../core/state/reducers/cart.reducer';

@Component({
  selector: 'app-s3-my-order-mobile',
  templateUrl: './s3-my-order-mobile.component.html',
  styleUrls: ['./s3-my-order-mobile.component.scss'],
})
export class S3MyOrderMobileComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  products;
  carouselOptions: OwlOptions;
  cart: Cart;

  constructor(
    private productsService: ProductsService,
    private store: Store<{ cart: Cart }>,
    private toastrService: ToastrService,
    private translateSrv: TranslateService,
    private kaCurrencyPipe: KaCurrencyPipe,
    private modalsService: ModalsService
  ) {
    this.productsService.getSuggestedProducts(0, true, true).subscribe((res) => (this.products = res.data));
    this.subscriptions.add(this.store.select('cart').subscribe((cart) => (this.cart = cart)));
    this.subscriptions.add(this.store.select(getCartProducts).subscribe((cart) => this.filterSuggestedProducts()));
  }

  ngOnInit(): void {
    this.carouselOptions = this.getCarouselOptions();
    if (!this.cart.minPurchaseReached) this.showMinPuchaseWarning();
    this.filterSuggestedProducts();
  }

  filterSuggestedProducts(): void {
    this.productsService.getSuggestedProducts(0, false, true).subscribe((res) => {
      this.products = res.data;
      this.cart.products.forEach((cartProd) => {
        this.products = this.products.filter((sugProd) => {
          return sugProd.productId !== cartProd.productId;
        });
      });
    });
  }

  showMinPuchaseWarning(): void {
    const titleWarning = this.translateSrv.instant('NEW_ORDER.ORDER_DETAIL.MOBILE.MIN_PURCHASE_WARN_TITLE');
    const descWarning = this.translateSrv.instant('NEW_ORDER.ORDER_DETAIL.MOBILE.MIN_PURCHASE_WARN_DESC');
    const minPurchase = this.kaCurrencyPipe.transform(this.cart.minPurchase);
    this.toastrService.warning(`${descWarning} ${minPurchase}`, titleWarning, { timeOut: 10000 });
  }

  cleanCart(): void {
    if (!this.cart.discountProducts.length) return;
    this.modalsService.openCleanCartConfirm();
  }

  getCarouselOptions(): OwlOptions {
    return {
      loop: true,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      dots: false,
      navSpeed: 700,
      navText: ['<', '>'],
      responsive: {
        0: {
          items: 1,
        },
        400: {
          items: 1,
        },
        768: {
          items: 1,
        },
        992: {
          items: 2,
        },
      },
      nav: false,
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
