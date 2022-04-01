import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/core/models/cart.model';
import { Client } from 'src/app/core/models/client.model';
import * as moment from 'moment';
import { ModalsService } from 'src/app/core/services/modals.service';
import { UserInfo } from 'src/app/core/models/user-info.model';

@Component({
  selector: 'app-exp-timer-warn',
  templateUrl: './exp-timer-warn.component.html',
  styleUrls: ['./exp-timer-warn.component.scss'],
})
export class ExpTimerWarnComponent implements OnInit, OnDestroy {
  cart: Cart;
  client: Client;
  user: UserInfo;
  private subscriptions = new Subscription();
  @Input() small;
  timeRemaining: any;
  frozenTimeRemaining: any;
  timeRemainingInterval;
  isFirstDeliveryDateFlag: boolean;
  isChileanUser: boolean;
  readonly ROOT = 'NEW_ORDER.RIGHT_SIDEBAR.';

  constructor(private store: Store<{ cart: Cart; client: Client; user: UserInfo }>, private modalService: ModalsService) {
    this.subscriptions.add(this.store.select('cart').subscribe((cart) => (this.cart = cart)));
    this.subscriptions.add(this.store.select('client').subscribe((client) => (this.client = client)));
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));
  }

  ngOnInit(): void {
    this.timeRemainingInterval = setInterval(() => {
      this.getTimeRemaining(this.cart.invoiceDeadline);
    }, 1000);
    this.isChileanUser = this.user.countryId === 'CL';
  }

  getTimeRemaining(invoiceDeadline: any): any {
    if (!this.isFirstDeliveryDate()) return;
    const total = new Date(invoiceDeadline).getTime() - new Date().getTime();
    let seconds = Math.floor((total / 1000) % 60);
    let minutes = Math.floor((total / 1000 / 60) % 60);
    let hours = Math.floor(total / (1000 * 60 * 60));

    if (total < 0) return;

    this.timeRemaining = {
      hours,
      minutes: minutes < 10 ? '0' + minutes : minutes,
      seconds: seconds < 10 ? '0' + seconds : seconds,
    };
  }

  editDateModal(type: string) {
    this.modalService.openEditFrozenDeliveryDate(type, true, this.cart.frozenVisitDate);
  }

  isFirstDeliveryDate(): boolean {
    const visitDateIndex = this.client.data.visitDates.findIndex((date) => {
      return moment(date.visitDate).isSame(moment(this.cart.visitDate));
    });
    return visitDateIndex === 0;
  }

  ngOnDestroy(): void {
    clearInterval(this.timeRemainingInterval);
    this.subscriptions.unsubscribe();
  }
}
