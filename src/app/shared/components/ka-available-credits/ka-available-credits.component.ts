import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/core/models/cart.model';
import { MyAccountService } from 'src/app/pages/my-account/services/my-account.service';
import * as CartActions from 'src/app/core/state/actions/cart.actions';
import { Client } from 'src/app/core/models/client.model';

@Component({
  selector: 'app-ka-available-credits',
  templateUrl: './ka-available-credits.component.html',
  styleUrls: ['./ka-available-credits.component.scss'],
  providers: [NgbAccordionConfig],
})
export class KaAvailableCreditsComponent implements OnInit, OnDestroy {
  readonly ROOT = 'NEW_ORDER.RIGHT_SIDEBAR.';
  credits: any;
  cartCredits: any;
  cart: Cart;
  client: Client;
  currentCredits: any = {};

  private subscriptions = new Subscription();

  constructor(config: NgbAccordionConfig, private store: Store<{ cart: Cart; client: Client }>, private myAccountService: MyAccountService) {
    this.subscriptions.add(
      this.store.select('cart').subscribe((cart) => {
        this.cart = cart;
        this.cartCredits = cart.credits;
      })
    );
    this.subscriptions.add(
      this.store.select('client').subscribe((client) => {
        this.client = client;
        this.credits = client.data.credits;
      })
    );
  }

  ngOnInit(): void {
    if (this.cart.orderId) {
      this.myAccountService.getCurrentCartCredits(this.cart.orderId).subscribe(
        (res) => {
          this.cartCredits = res;
          this.store.dispatch(CartActions.updateCartCredits({ credits: this.cartCredits.paymentHandlerResult }));
        },
        (error) => {
          this.store.dispatch(CartActions.updateCartCredits({ credits: [] }));
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
