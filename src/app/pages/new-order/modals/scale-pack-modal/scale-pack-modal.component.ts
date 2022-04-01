import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Discount } from 'src/app/core/models/discount.model';
import * as _ from 'lodash';
import { Store } from '@ngrx/store';
import { Cart } from 'src/app/core/models/cart.model';
import { upsertMultipleProducts } from 'src/app/core/state/actions/cart.actions';
import { Subscription } from 'rxjs';
import { getCartProductsDisc } from 'src/app/core/state/reducers/cart.reducer';
import { DiscountCalculationType } from 'src/app/core/enums/discount-calculation-type';

@Component({
  selector: 'app-scale-pack-modal',
  templateUrl: './scale-pack-modal.component.html',
  styleUrls: ['./scale-pack-modal.component.scss'],
})
export class ScalePackModalComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  @Input() public discount: Discount;
  currentScale;
  nextScale;
  prevScale;
  isCurrentScaleLast;
  currentScaleLabel: string;
  totalFinalPrice = 0;
  totalListPrice = 0;
  prevScaleMaxNumber = 0;

  constructor(private store: Store<{ cart: Cart }>, public activeModal: NgbActiveModal) {
    this.subscriptions.add(this.store.select(getCartProductsDisc).subscribe((prods) => this.closeModal()));
  }

  ngOnInit(): void {
    this.setInitialQuantities();
    this.updateScale();
  }

  updateScale(): any {
    const currentScale = this.discount.requirements?.scales?.find((scale) => {
      return this.discount.quantitySelected >= scale.min && this.discount.quantitySelected <= scale.max;
    });
    this.currentScale = currentScale ? currentScale : this.discount.requirements?.scales[0];
    this.getScaleLabel();
    this.getScaleDiscountPrice();
  }

  getScaleLabel(): void {
    const scaleIndex = this.discount.requirements.scales.findIndex((scale) => scale == this.currentScale);
    this.nextScale = this.discount.requirements.scales[scaleIndex + 1];
    this.prevScale = this.discount.requirements.scales[scaleIndex - 1];
    this.isCurrentScaleLast = this.currentScale?.max === 9999999;
    const currentScaleHasDiscount = !!this.currentScale?.reward?.value;
    const nextScaleHasDiscount = !!this.nextScale?.reward?.value;

    if (this.isCurrentScaleLast) {
      if (currentScaleHasDiscount) this.currentScaleLabel = 'DISCOUNT_LABEL_UNLIMITED';
      return;
    }

    if (!currentScaleHasDiscount) {
      this.currentScaleLabel = this.discount.calculationType === DiscountCalculationType.AMOUNT ? 'NO_DISCOUNT_LABEL_2' : 'NO_DISCOUNT_LABEL_1';
      return;
    }

    if (this.discount.quantitySelected < this.currentScale?.max - 1 || !nextScaleHasDiscount) {
      this.currentScaleLabel = 'DISCOUNT_LABEL_PACK';
    } else if (this.currentScale?.max === this.discount.quantitySelected || !nextScaleHasDiscount) {
      this.currentScaleLabel = 'PRE_DISCOUNT_MAX';
    } else {
      this.currentScaleLabel = 'PRE_DISCOUNT';
    }
  }

  getScaleDiscountPrice(): void {
    let discountAcc;
    let previousListPrice;
    if (!this.currentScale.reward?.value) {
      previousListPrice = this.totalListPrice;
      discountAcc = this.totalListPrice - this.totalFinalPrice;
    }
    this.totalFinalPrice = 0;
    this.totalListPrice = 0;
    this.currentScale.products.forEach((product) => {
      this.totalFinalPrice += product.quantity * product.price.finalPrice;
      this.totalListPrice += product.quantity * product.price.listPrice;
    });
    // if scale has no reward and is upper scale
    if (!this.currentScale.reward?.value && previousListPrice < this.totalListPrice) this.totalFinalPrice = this.totalFinalPrice - discountAcc;
  }

  addProduct(product): void {
    this.discount.quantitySelected++;
    this.discount.requirements.scales.forEach((scale) => {
      const productUpdated = scale.products.find((prod) => prod.productId === product.productId);
      productUpdated.quantity++;
    });
    // product.quantity++;
    this.updateScale();
  }

  removeProduct(product): void {
    if (product.quantity > 0) {
      this.discount.quantitySelected--;
      this.discount.requirements.scales.forEach((scale) => {
        const productUpdated = scale.products.find((prod) => prod.productId === product.productId);
        productUpdated.quantity--;
      });
      // product.quantity--;
      this.updateScale();
    }
  }

  addProductsToCart(): void {
    if (!this.discount.quantitySelected) return;
    const productsPack = [];
    this.currentScale.products?.forEach((product) => {
      if (product.quantity > 0) productsPack.push({ ...product, quantitySelected: product.quantity });
    });
    this.store.dispatch(upsertMultipleProducts({ products: productsPack }));
  }

  closeModal(): void {
    this.setInitialQuantities();
    this.activeModal.close();
  }

  setInitialQuantities(): void {
    if (!this.discount) return;
    this.discount.quantitySelected = 0;
    this.discount?.requirements?.scales?.forEach((scale) => {
      scale.products.forEach((prod) => (prod.quantity = 0));
    });
  }

  // hasDiscount(scale): boolean {
  //   return !!scale?.reward?.value;
  //   // return scale.products.every((product) => {
  //   //   return product.price.finalPrice < product.price.listPrice;
  //   // });
  // }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // private getTotalQuantity = (scales): number => {
  //   //TODO es obligatorio que esten todos los productos seleccionados ?
  //   return _.reduce(
  //     scales,
  //     (acc, cur) => {
  //       return acc + cur.products.length;
  //     },
  //     0
  //   );
  // };
}
