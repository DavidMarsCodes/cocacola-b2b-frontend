import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AlertWarmModalComponent } from 'src/app/pages/new-order/modals/alert-warm-modal/alert-warm-modal.component';
import { Cart } from '../models/cart.model';

export interface ICancelOrderGuard {
  canDeactivate: (_: any, currentRoute: ActivatedRouteSnapshot, nextState: RouterStateSnapshot, router: Router) => boolean;
}

@Injectable()
export class CancelOrderGuard implements CanDeactivate<ICancelOrderGuard> {
  cart: Cart;
  private subscriptions = new Subscription();

  constructor(private modalService: NgbModal, private store: Store<{ cart: Cart }>) {
    this.subscriptions.add(this.store.select('cart').subscribe((cart) => (this.cart = cart)));
  }

  async canDeactivate(_, currentRoute, nextState, router) {
    const stepId = parseInt(currentRoute.params.stepId);
    if (this.cart.products.length > 0) {
      if (stepId > 1 && router.url.indexOf('nuevo-pedido') === -1 && router.url !== '/' && stepId !== 6) {
        const result: boolean = await this.modalService.open(AlertWarmModalComponent, { windowClass: 'ngbmodal-centered' }).result.then((r) => r);
        return result;
      }
    }
    return true;
  }
}
