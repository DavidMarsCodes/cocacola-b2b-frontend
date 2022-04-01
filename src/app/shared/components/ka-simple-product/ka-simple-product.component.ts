import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Product } from 'src/app/core/models/product.model';
import { Store } from '@ngrx/store';
import { getHomeStyle } from 'src/app/core/state/reducers/user.reducer';
import { upsertProduct } from 'src/app/core/state/actions/cart.actions';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { ValidationUtils } from 'src/app/core/utils/validation-utils';
import { DefaultImages } from 'src/app/core/enums/default-images';

@Component({
  selector: 'app-ka-simple-product',
  templateUrl: './ka-simple-product.component.html',
  styleUrls: ['./ka-simple-product.component.scss'],
})
export class KaSimpleProductComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  @Input() product: Product;
  @Input() page: string;
  homeStyle: number;

  notFoundImg = environment.IMG_S3_HOST + DefaultImages.PRODUCT;

  unavailable = false;

  constructor(private store: Store<{ homeStyle: number }>) {
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
    this.store.dispatch(upsertProduct({ product: cartProduct }));
  }

  onImgError(): void {
    this.product.image = this.notFoundImg;
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
