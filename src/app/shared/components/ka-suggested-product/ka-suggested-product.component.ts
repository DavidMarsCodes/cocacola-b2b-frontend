import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/core/models/cart.model';
import { Product } from 'src/app/core/models/product.model';
import * as CartActions from 'src/app/core/state/actions/cart.actions';
import { getHomeStyle } from 'src/app/core/state/reducers/user.reducer';
import { environment } from 'src/environments/environment';
import { ValidationUtils } from 'src/app/core/utils/validation-utils';
import { DefaultImages } from 'src/app/core/enums/default-images';
import { ModalsService } from 'src/app/core/services/modals.service';
import { VisitPlanService } from 'src/app/core/services/visit-plan.service';
import { loadFrozenVisitDates } from 'src/app/core/state/actions/client.actions';
import { updateFrozenVisitDate } from 'src/app/core/state/actions/cart.actions';

@Component({
  selector: 'app-ka-suggested-product',
  templateUrl: './ka-suggested-product.component.html',
  styleUrls: ['./ka-suggested-product.component.scss'],
})
export class KaSuggestedProductComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  @Input() product?: Product;
  @Input() page: string;
  homeStyle: any;
  notFoundImg = environment.IMG_S3_HOST + DefaultImages.PRODUCT;
  unavailable = false;
  cart: Cart;

  constructor(private store: Store<{ cart: Cart }>, private modalService: ModalsService, private visitPlanService: VisitPlanService) {
    this.subscriptions.add(this.store.select('cart').subscribe((cart) => (this.cart = cart)));
    this.subscriptions.add(this.store.select(getHomeStyle).subscribe((homeStyle) => (this.homeStyle = homeStyle)));
  }

  ngOnInit(): void {
    this.unavailable = !this.product.availability || this.product.locked;
  }

  addProduct(): void {
    this.product.quantitySelected++;
  }

  removeProduct(): void {
    if (this.product.quantitySelected > 1) {
      this.product.quantitySelected--;
    }
  }

  addProductToCart(product: Product): void {
    if (!this.product.quantitySelected || this.product.quantitySelected < 1 || !this.isInteger(product.quantitySelected)) return;
    const cartProduct = { ...product };
    if (product.deliveryType === 'deliveryfrozen' && !this.cart.hasDeliveryFrozenProducts) {
      this.deliveryFrozenActions(cartProduct);
    } else {
      this.store.dispatch(CartActions.upsertProduct({ product: cartProduct }));
    }
  }

  deliveryFrozenActions(cartProduct: any): void {
    this.visitPlanService.getClientVisitPlan(true).subscribe(
      async (res) => {
        this.store.dispatch(updateFrozenVisitDate({ date: res.data[0].visitDate }));
        this.store.dispatch(loadFrozenVisitDates({ frozenVisitDates: res.data }));
        await this.setOperationDate();
        this.modalService.openEditFrozenDeliveryDate('deliveryfrozen', true, this.cart.frozenVisitDate);
        this.store.dispatch(CartActions.upsertProduct({ product: cartProduct }));
        this.store.dispatch(CartActions.updateHasDeliveryFrozenProducts());
      },
      (error) => {
        this.modalService.openEditFrozenDeliveryDate('deliveryfrozen', true, this.cart.frozenVisitDate, true, 'FROZEN_PRODUCTS_LABEL_ERROR');
        this.store.dispatch(loadFrozenVisitDates({ frozenVisitDates: [] }));
      }
    );
  }

  setOperationDate(): Promise<any> {
    return this.visitPlanService.setOperationDate('deliveryfrozen').toPromise();
  }

  validQuantLength(event): void {
    const validKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (validKeys.some((validKey) => validKey === event.key)) return;
    if (this.product.quantitySelected > 99 || !/^[0-9]$/.test(event.key)) event.preventDefault();
  }

  onQuantityPaste(event): void {
    ValidationUtils.validRegexOnPaste(/^[0-9]+$/, event);
  }

  onImgError(): void {
    this.product.image = this.notFoundImg;
  }

  isInteger(quantity: number): boolean {
    return Number.isInteger(quantity);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
