import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { DiscountTypes } from 'src/app/core/enums/discount-types';
import { Cart } from 'src/app/core/models/cart.model';
import { Discount } from 'src/app/core/models/discount.model';
import { ProductPrice } from 'src/app/core/models/product-price.model';
import { Product } from 'src/app/core/models/product.model';
import { upsertMultipleProducts, upsertProduct } from 'src/app/core/state/actions/cart.actions';
import { ValidationUtils } from 'src/app/core/utils/validation-utils';
import { environment } from 'src/environments/environment';
import { ScalePackModalComponent } from './../../../pages/new-order/modals/scale-pack-modal/scale-pack-modal.component';
import { DefaultImages } from 'src/app/core/enums/default-images';
import { DiscountCalculationType } from 'src/app/core/enums/discount-calculation-type';
import { OpenPackModalComponent } from './../../../pages/new-order/modals/open-pack-modal/open-pack-modal.component';

@Component({
  selector: 'app-discount-product-card',
  templateUrl: './discount-product-card.component.html',
  styleUrls: ['./discount-product-card.component.scss'],
})
export class DiscountProductCardComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  @Input() discount?: Discount;
  @Input() style: string;
  homeStyle: any;
  notFoundImg = environment.IMG_S3_HOST + DefaultImages.DISCOUNT;
  readonly DiscountTypes = DiscountTypes;
  currentScale: DiscountScale;
  currentScaleLabel: string;
  nextScale: DiscountScale;
  prevScale: DiscountScale;
  isCurrentScaleLast: boolean;

  constructor(private store: Store<{ cart: Cart }>, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.updateScale();
  }

  addProduct(): void {
    this.discount.quantitySelected++;
    this.updateScale();
  }

  removeProduct(): void {
    if (this.discount.quantitySelected > 1) {
      this.discount.quantitySelected--;
      this.updateScale();
    }
  }

  getTotalListPriceCC(): number {
    return _.reduce(
      this.discount.requirements,
      (acc, cur: Product) => {
        return acc + cur.quantity * cur.price.listPrice;
      },
      0
    );
  }

  getTotalFinalPriceCC(): number {
    return _.reduce(
      this.discount.requirements,
      (acc, cur: Product) => {
        return acc + cur.quantity * cur.price.finalPrice;
      },
      0
    );
  }

  updateScale(): any {
    if (!this.isQuantitySelectedValid()) return;
    this.currentScale = this.discount.requirements?.scales?.find((scale) => {
      return this.discount.quantitySelected >= scale.min && this.discount.quantitySelected <= scale.max;
    });
    if (this.currentScale) this.getScaleLabel();
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
      this.currentScaleLabel = this.discount.calculationType === DiscountCalculationType.AMOUNT ? 'DISCOUNT_LABEL_UNIT_2' : 'DISCOUNT_LABEL_UNIT';
    } else {
      this.currentScaleLabel = 'PRE_DISCOUNT';
    }
  }

  getScaleDiscountPrice(): number {
    const maxScaleDisc = this.discount.requirements?.scales[this.discount.requirements?.scales?.length - 1].max;
    if (this.discount.quantitySelected <= maxScaleDisc) {
      return this.discount.quantitySelected * this.currentScale.price.finalPrice;
    } else {
      const discountPrice = maxScaleDisc * this.currentScale.price.finalPrice;
      const normalPrice = (this.discount.quantitySelected - maxScaleDisc) * this.discount.requirements.price.listPrice;
      return discountPrice + normalPrice;
    }
  }

  addProductToCart(discount: Discount): void {
    switch (discount.discountType) {
      case DiscountTypes.CLOSED:
        if (!this.isQuantitySelectedValid()) return;
        this.handleClosedDiscount();
        break;
      case DiscountTypes.UNIT_SCALE:
      case DiscountTypes.SCALE_AMOUNT:
        if (!this.isQuantitySelectedValid()) return;
        this.handleUnitScaleOrAmountScaleDiscount();
        break;
      case DiscountTypes.PACK_SCALE:
        this.handlePackScaleDiscount();
        break;
      case DiscountTypes.OPEN:
        this.handleOpenPackDiscount();
        break;
      default:
        break;
    }
  }

  handleClosedDiscount(): void {
    const productsPack = [];
    this.discount.requirements?.forEach((product) => {
      productsPack.push({ ...product, quantitySelected: product.quantity * this.discount.quantitySelected });
    });
    this.store.dispatch(upsertMultipleProducts({ products: productsPack }));
  }

  handleUnitScaleOrAmountScaleDiscount(): void {
    const cartProduct = {
      ...this.discount.requirements,
      ...this.currentScale,
      quantitySelected: this.discount.quantitySelected,
    };
    this.store.dispatch(upsertProduct({ product: cartProduct }));
  }

  handleOpenPackDiscount(): void {
    const openPackModal = this.modalService.open(OpenPackModalComponent, { windowClass: 'ngbmodal-centered', size: 'lg' });
    openPackModal.componentInstance.discount = this.discount;
    openPackModal.result.then(
      (confirm) => {},
      (rejected) => {}
    );
  }

  handlePackScaleDiscount(): void {
    const scalePackModal = this.modalService.open(ScalePackModalComponent, { windowClass: 'ngbmodal-centered', size: 'lg' });
    scalePackModal.componentInstance.discount = this.discount;
    scalePackModal.result.then(
      (confirm) => {},
      (rejected) => {}
    );
  }

  validQuantLength(event): void {
    const validKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (validKeys.some((validKey) => validKey === event.key)) return;
    if (this.discount.quantitySelected > 99 || !/^[0-9]$/.test(event.key)) event.preventDefault();
  }

  onQuantityPaste(event): void {
    ValidationUtils.validRegexOnPaste(/^[0-9]+$/, event);
  }

  isQuantitySelectedValid(): boolean {
    return this.discount.quantitySelected && this.discount.quantitySelected > 0 && this.isInteger(this.discount.quantitySelected);
  }

  isInteger(quantity: number): boolean {
    return Number.isInteger(quantity);
  }

  onImgError(): void {
    this.discount.image = this.notFoundImg;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

interface DiscountScale {
  min: number;
  max: number;
  price: ProductPrice;
  reward?: any;
}
