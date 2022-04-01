import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Product } from 'src/app/core/models/product.model';
import { upsertProduct } from 'src/app/core/state/actions/cart.actions';
import { environment } from 'src/environments/environment';
import { ValidationUtils } from 'src/app/core/utils/validation-utils';
import { DefaultImages } from 'src/app/core/enums/default-images';

@Component({
  selector: 'app-ka-suggested-on-cart',
  templateUrl: './ka-suggested-on-cart.component.html',
  styleUrls: ['./ka-suggested-on-cart.component.scss'],
})
export class KaSuggestedOnCartComponent implements OnInit {
  @Input() product: Product;

  notFoundImg = environment.IMG_S3_HOST + DefaultImages.PRODUCT;

  constructor(private store: Store<{ homeStyle: number }>) {}

  ngOnInit(): void {}

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
    const cartProduct = { ...product }; //copy of the selected product
    this.store.dispatch(upsertProduct({ product: cartProduct }));
  }

  validQuantLength(event): void {
    const validKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (validKeys.some((validKey) => validKey === event.key)) return;
    if (this.product.quantitySelected > 99 || !/^[0-9]$/.test(event.key)) event.preventDefault();
  }

  onQuantityPaste(event): void {
    ValidationUtils.validRegexOnPaste(/^[0-9]+$/, event);
  }

  isInteger(quantity: number): boolean {
    return Number.isInteger(quantity);
  }

  onImgError(): void {
    this.product.image = this.notFoundImg;
  }
}
