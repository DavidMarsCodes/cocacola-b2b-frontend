import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AnyTxtRecord } from 'dns';
import { Subscription } from 'rxjs';
import { Client } from 'src/app/core/models/client.model';
import { OrderDetail } from 'src/app/core/models/order-detail.model';
import { Order } from 'src/app/core/models/order.model';

@Component({
  selector: 'app-ka-my-orders-filter',
  templateUrl: './ka-my-orders-filter.component.html',
  styleUrls: ['./ka-my-orders-filter.component.scss'],
})
export class KaMyOrdersFilterComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  @Input() orderDetail: OrderDetail;
  ordersList: Order[];
  parentOrder: Order;

  readonly ROOT = 'MY_ORDERS.ORDER_FILTER.';

  constructor(private store: Store<{ client: Client }>) {
    this.subscriptions.add(this.store.select('client').subscribe((client) => (this.ordersList = client?.data?.orders)));
  }

  ngOnInit(): void {
    this.parentOrder = this.ordersList?.find((order) => order.orderId == this.orderDetail.orderId);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
