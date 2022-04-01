import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Discount } from 'src/app/core/models/discount.model';
import * as _ from 'lodash';
import { Store } from '@ngrx/store';
import { Cart } from 'src/app/core/models/cart.model';
import { upsertMultipleProducts } from 'src/app/core/state/actions/cart.actions';
import { Subscription } from 'rxjs';
import { getCartProductsDisc } from 'src/app/core/state/reducers/cart.reducer';
import { Product } from 'src/app/core/models/product.model';
import { ValidationUtils } from 'src/app/core/utils/validation-utils';

@Component({
  selector: 'app-open-pack-modal',
  templateUrl: './open-pack-modal.component.html',
  styleUrls: ['./open-pack-modal.component.scss'],
})
export class OpenPackModalComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  @Input() public discount: Discount;
  productsGruped: any;
  productsSelected: Product[] = [];

  constructor(private store: Store<{ cart: Cart }>, public activeModal: NgbActiveModal) {
    this.subscriptions.add(this.store.select(getCartProductsDisc).subscribe((prods) => this.closeModal()));
  }

  ngOnInit(): void {
    this.setInitialQuantities();
  }

  addProduct(product): void {
    product.quantitySelected++;
    this.refreshProductsSelected();
  }

  removeProduct(product): void {
    if (product.quantitySelected > 0) {
      product.quantitySelected--;
    }
    this.refreshProductsSelected();
  }

  addProductsToCart(): void {
    if (!this.productsSelected.length) return;
    this.store.dispatch(upsertMultipleProducts({ products: this.productsSelected }));
  }

  refreshProductsSelected(): void {
    this.productsSelected = this.discount.requirements[0].products?.filter((product) => {
      return product.quantitySelected > 0 && this.isInteger(product.quantitySelected);
    });
  }

  closeModal(): void {
    this.setInitialQuantities();
    this.activeModal.close();
  }

  setInitialQuantities(): void {
    if (!this.discount) return;
    this.discount.requirements[0].products?.forEach((product) => (product['quantitySelected'] = 0));
    this.productsGruped = _.groupBy(this.discount.requirements[0].products, (product) => product?.productGroupName);
  }

  validQuantLength(event, product): void {
    const validKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (validKeys.some((validKey) => validKey === event.key)) return;
    if (product.quantitySelected > 99 || !/^[0-9]$/.test(event.key)) event.preventDefault();
  }

  onQuantityPaste(event): void {
    ValidationUtils.validRegexOnPaste(/^[0-9]+$/, event);
  }

  isInteger(quantity: number): boolean {
    return Number.isInteger(quantity);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
