import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { Cart } from 'src/app/core/models/cart.model';
import { Client } from 'src/app/core/models/client.model';
import { takeUntil } from 'rxjs/operators';
import { UserInfo } from 'src/app/core/models/user-info.model';

@Component({
  selector: 'app-ka-delivery-details',
  templateUrl: './ka-delivery-details.component.html',
  styleUrls: ['./ka-delivery-details.component.scss'],
})
export class KaDeliveryDetailsComponent implements OnInit, OnDestroy {
  @Input() step;
  cart: Cart;
  client: Client;
  private user: UserInfo;
  showFrozenDates: boolean;
  private subscriptions = new Subscription();
  readonly ROOT_LANG = 'NEW_ORDER.ORDER_DETAIL.';

  constructor(private store: Store<{ cart: Cart; client: Client; user: UserInfo }>) {
    this.subscriptions.add(this.store.select('cart').subscribe((cart) => (this.cart = cart)));
    this.subscriptions.add(this.store.select('client').subscribe((client) => (this.client = client)));
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));
  }

  ngOnInit(): void {
    this.showFrozenDates = this.frozenDates();
  }

  frozenDates(): boolean {
    return this.user.countryId === 'CL' && this.cart.hasDeliveryFrozenProducts;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
