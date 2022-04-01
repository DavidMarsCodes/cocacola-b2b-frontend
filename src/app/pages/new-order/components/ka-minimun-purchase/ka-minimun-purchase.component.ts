import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/core/models/cart.model';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { Constants } from 'src/app/core/constants/constants';
import { updateMinPurchase } from 'src/app/core/state/actions/cart.actions';

@Component({
  selector: 'app-ka-minimun-purchase',
  templateUrl: './ka-minimun-purchase.component.html',
  styleUrls: ['./ka-minimun-purchase.component.scss'],
})
export class KaMinimunPurchaseComponent implements OnInit, OnDestroy {
  readonly ROOT = 'NEW_ORDER.RIGHT_SIDEBAR.';

  percentAmount;

  cart: Cart;

  user: UserInfo;

  selectedCountry: any;

  private subscriptions = new Subscription();

  constructor(private store: Store<{ user: UserInfo; cart: Cart }>) {
    this.subscriptions.add(
      this.store.select('cart').subscribe((cart) => {
        this.cart = cart;
        this.percentAmount = (this.cart.totalPrice / this.cart.minPurchase) * 100;
      })
    );
    this.subscriptions.add(
      this.store.select('user').subscribe((user) => {
        this.user = user;
        this.selectedCountry = Constants.countries.find((country) => country.key === this.user.countryId);
        if (this.selectedCountry){this.store.dispatch(updateMinPurchase({ minPurchase: this.selectedCountry.minPurchase }))};
      })
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
