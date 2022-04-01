import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/core/models/cart.model';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { cleanCart, updateHasDeliveryFrozenProducts } from 'src/app/core/state/actions/cart.actions';

@Component({
  selector: 'app-s5-confirm',
  templateUrl: './s5-confirm.component.html',
  styleUrls: ['./s5-confirm.component.scss'],
})
export class S5ConfirmComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  readonly ROOT_LANG = 'NEW_ORDER.ORDER_CONFIRMATION.';
  cart: Cart;
  user: UserInfo;

  constructor(private store: Store<{ cart: Cart; user: UserInfo }>) {
    this.subscriptions.add(this.store.select('cart').subscribe((cart) => (this.cart = cart)));
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.store.dispatch(cleanCart());
    this.store.dispatch(updateHasDeliveryFrozenProducts());
  }
}
