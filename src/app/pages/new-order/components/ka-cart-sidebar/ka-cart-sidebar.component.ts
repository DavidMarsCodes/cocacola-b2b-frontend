import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/core/models/cart.model';
import { Client } from 'src/app/core/models/client.model';

@Component({
  selector: 'app-ka-cart-sidebar',
  templateUrl: './ka-cart-sidebar.component.html',
  styleUrls: ['./ka-cart-sidebar.component.scss'],
})
export class KaCartSidebarComponent implements OnInit, OnDestroy {
  @Input() step;
  cart: Cart;
  client: Client;
  private subscriptions = new Subscription();
  readonly ROOT = 'NEW_ORDER.RIGHT_SIDEBAR.';
  productType = 'UNIT';
  hasCredits: boolean = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private store: Store<{ cart: Cart; client: Client }>) {
    this.subscriptions.add(this.store.select('cart').subscribe((cart) => (this.cart = cart)));
    this.subscriptions.add(
      this.store.select('client').subscribe((client) => {
        this.client = client;
        if (this.client.data.credits.length > 0) this.hasCredits = true;
      })
    );
  }

  ngOnInit(): void {}

  changeStep(step): void {
    if (!this.cart.minPurchaseReached) return;
    this.router.navigate(['../', step], { relativeTo: this.activatedRoute.parent });
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
