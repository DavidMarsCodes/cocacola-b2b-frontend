import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Cart } from '../models/cart.model';
import { Client } from '../models/client.model';
@Injectable()
export class NewOrderGuard implements CanActivate, OnDestroy {
  private subscriptions = new Subscription();
  cart: Cart;
  client: Client;

  constructor(public router: Router, private store: Store<{ cart: Cart; client: Client }>) {
    this.subscriptions.add(this.store.select('cart').subscribe((cart) => (this.cart = cart)));
    this.subscriptions.add(this.store.select('client').subscribe((client) => (this.client = client)));
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const stepId = parseInt(route.params?.stepId);
    if (this.client.hasLockOrder) {
      this.router.navigate(['/main/home']);
      return false;
    }
    const isAllowed = this.isAllowed(stepId);
    if (!isAllowed) this.router.navigate(['/main/nuevo-pedido/1']);
    return isAllowed;
  }

  isAllowed(stepId: number): boolean {
    switch (stepId) {
      case 1:
      case 2:
      case 3:
      case 5:
        return true;
      case 4:
        return !!this.cart.discountProducts?.length;
      case 6:
        return this.cart.orderConfirmed;
      default:
        return false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
