import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/core/models/cart.model';
import { Product } from 'src/app/core/models/product.model';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { ModalsService } from 'src/app/core/services/modals.service';
import { ProductsService } from 'src/app/core/services/products.service';
import { getCartProducts } from '../../../../core/state/reducers/cart.reducer';

@Component({
  selector: 'app-s4-detail',
  templateUrl: './s4-detail.component.html',
  styleUrls: ['./s4-detail.component.scss'],
})
export class S4DetailComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  suggestedProducts: Product[];
  cart: Cart;
  user: UserInfo;
  panelOpenState = false;
  readonly ROOT = 'MY_ORDERS.ORDER_DETAIL.';
  products: Product[] = [];
  productsFrozen: Product[] = [];
  readonly ROOT_NEW = 'NEW_ORDER.RIGHT_SIDEBAR.';
  visitDate: string | Date;
  frozenVisitDate: string | Date;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<{ cart: Cart; user: UserInfo }>,
    private modalsService: ModalsService,
    private productsService: ProductsService
  ) {
    this.subscriptions.add(this.store.select('cart').subscribe((cart) => (this.cart = cart)));
    this.subscriptions.add(this.store.select(getCartProducts).subscribe((cart) => this.filterSuggestedProducts()));
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));
  }

  ngOnInit(): void {
    this.filterSuggestedProducts();
    this.visitDate = this.cart.visitDate;
    this.frozenVisitDate = this.cart.frozenVisitDate;
    this.products = this.cart.products.filter((product) => product.deliveryType !== 'deliveryfrozen');
    this.productsFrozen = this.cart.products.filter((product) => product.deliveryType === 'deliveryfrozen');
  }

  filterSuggestedProducts(): void {
    this.productsService.getSuggestedProducts(0, false, true).subscribe((res) => {
      this.suggestedProducts = res.data;
      this.cart.products.forEach((cartProd) => {
        this.suggestedProducts = this.suggestedProducts.filter((sugProd) => {
          return sugProd.productId !== cartProd.productId;
        });
      });
    });
  }

  changeStep(step): void {
    this.router.navigate(['../', step], { relativeTo: this.activatedRoute.parent });
  }

  cleanCart(): void {
    if (!this.cart.discountProducts.length) return;
    this.modalsService.openCleanCartConfirm();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
