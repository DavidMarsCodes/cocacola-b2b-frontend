import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/core/models/cart.model';

@Component({
  selector: 'app-deadline-warn-modal',
  templateUrl: './deadline-warn-modal.component.html',
  styleUrls: ['./deadline-warn-modal.component.scss'],
})
export class DeadlineWarnModalComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  @Input() timeRemaining: number;
  cart: Cart;

  readonly LANG_ROOT = 'NEW_ORDER.ORDER_DETAIL.MODAL_DEADLINE.';

  constructor(public activeModal: NgbActiveModal, private store: Store<{ cart: Cart }>) {
    this.subscriptions.add(this.store.select('cart').subscribe((cart) => (this.cart = cart)));
  }

  ngOnInit(): void {}

  closeModal(): void {
    this.activeModal.close();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
