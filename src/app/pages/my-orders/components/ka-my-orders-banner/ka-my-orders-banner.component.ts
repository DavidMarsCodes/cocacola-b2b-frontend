import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Client } from 'src/app/core/models/client.model';
import { Order } from 'src/app/core/models/order.model';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-ka-my-orders-banner',
  templateUrl: './ka-my-orders-banner.component.html',
  styleUrls: ['./ka-my-orders-banner.component.scss'],
})
export class KaMyOrdersBannerComponent implements OnInit {
  @Input() pendingOrders: Order[];
  readonly ROOT = 'MY_ORDERS.ORDER_BANNER.';

  constructor() {}

  ngOnInit(): void {
    this.pendingOrders = this.pendingOrders.slice(0, 3);
  }
}
