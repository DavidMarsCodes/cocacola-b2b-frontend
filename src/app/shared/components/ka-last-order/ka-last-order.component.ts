import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { OrderStatus } from 'src/app/core/enums/order-status';
import { Client } from 'src/app/core/models/client.model';
import { Order } from 'src/app/core/models/order.model';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { getHomeStyle } from 'src/app/core/state/reducers/user.reducer';
import { OrdersService } from 'src/app/pages/my-orders/services/orders.service';

@Component({
  selector: 'app-ka-last-order',
  templateUrl: './ka-last-order.component.html',
  styleUrls: ['./ka-last-order.component.scss'],
})
export class KaLastOrderComponent implements OnInit, OnDestroy {
  lastOrder: Order;
  hasLockOrder: boolean;
  user: UserInfo;
  homeStyle: any;
  private subscriptions = new Subscription();

  readonly OrderStatus = OrderStatus;

  okSteps: any;
  returnedOrBlockedSteps: any;
  canceledSteps: any;

  orderSteps: any[];

  constructor(private store: Store<{ user: UserInfo; homeStyle: any; client: Client }>, private ordersService: OrdersService) {
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));
    this.subscriptions.add(this.store.select(getHomeStyle).subscribe((homeStyle) => (this.homeStyle = homeStyle)));
    this.subscriptions.add(
      this.store.select('client').subscribe((client) => {
        let ordersFromB2B = client.data?.orders.filter((m) => m.sourceChannel === 'B2B' || 'YHH6');
        this.lastOrder = ordersFromB2B ? ordersFromB2B[0] : undefined;
        this.hasLockOrder = client.hasLockOrder;
        if (this.lastOrder) this.getOrderSteps();
      })
    );
  }

  ngOnInit(): void {}

  getOrderSteps(): void {
    if (this.lastOrder.status === OrderStatus.CANCELLED) {
      this.orderSteps = this.getCanceledSteps();
    } else {
      this.orderSteps = this.generateOrderSteps();
    }
  }

  generateOrderSteps(): any[] {
    const orderSteps = this.getOrderStepsDefault();
    const orderIndex = orderSteps.findIndex((step) => step.stepKeys.some((stepKey) => stepKey === this.lastOrder.status));
    orderSteps.forEach((step, index) => {
      step.completed = index <= orderIndex;
      step.show = step.stepKeys.some((stepKey) => stepKey === this.lastOrder.status);
    });
    return orderSteps;
  }

  getOrderStepsDefault(): any[] {
    return [
      {
        stepKeys: [OrderStatus.CREATED, OrderStatus.DELIVERED, OrderStatus.FAILED, OrderStatus.REGISTERED],
        completed: true,
        style: 'green',
        icon: 'check',
      },
      {
        stepKeys: [OrderStatus.PREPARING],
        completed: false,
        style: 'green',
        icon: 'check',
      },
      {
        stepKeys: [OrderStatus.TRANSIT],
        completed: false,
        style: 'green',
        icon: 'check',
      },
      {
        stepKeys: [OrderStatus.RETURNED],
        completed: false,
        style: 'red',
        optional: true,
        show: false,
        icon: 'times',
      },
      {
        stepKeys: [OrderStatus.BLOCKED],
        completed: false,
        style: 'red',
        optional: true,
        show: false,
        icon: 'times',
      },
      {
        stepKeys: [OrderStatus.DELIVERED_CLT],
        completed: false,
        style: 'green',
        icon: 'check',
      },
    ];
  }

  getCanceledSteps(): any {
    return [
      {
        stepKeys: [OrderStatus.REGISTERED],
        completed: true,
        style: 'green',
        icon: 'check',
      },
      {
        stepKeys: [OrderStatus.CANCELLED],
        completed: true,
        style: 'red',
        icon: 'times',
      },
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
