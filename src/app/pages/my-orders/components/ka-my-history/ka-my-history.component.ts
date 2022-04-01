import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { OrderStatus } from 'src/app/core/enums/order-status';
import { Order } from 'src/app/core/models/order.model';
import { ValidationUtils } from 'src/app/core/utils/validation-utils';

@Component({
  selector: 'app-ka-my-history',
  templateUrl: './ka-my-history.component.html',
  styleUrls: ['./ka-my-history.component.scss'],
})
export class KaMyHistoryComponent implements OnInit {
  @Input() orders: Order[];
  @Input() hasNewOrders: boolean;

  readonly OrderStatus = OrderStatus;
  readonly ROOT = 'MY_ORDERS.MY_HISTORY.';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {}

  visualMonth(): void {}

  isErrorStatus(status): boolean {
    return status === OrderStatus.BLOCKED || status === OrderStatus.RETURNED || status === OrderStatus.CANCELLED;
  }

  goOrderDetail(order): void {
    if (!order.orderId) return;
    this.router.navigate(['../detalles/' + order.orderId], { relativeTo: this.activatedRoute.parent });
  }
}
