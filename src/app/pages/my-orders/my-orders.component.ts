import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { getUserClients } from 'src/app/core/state/reducers/user.reducer';
import { Client } from 'src/app/core/models/client.model';
import { OrdersService } from './services/orders.service';
import { Order } from 'src/app/core/models/order.model';
import { OrderStatus } from 'src/app/core/enums/order-status';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { loadOrders, updateClient } from 'src/app/core/state/actions/client.actions';
import { ValidationUtils } from 'src/app/core/utils/validation-utils';
import { SelectClientService } from 'src/app/core/services/select-client.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss'],
})
export class MyOrdersComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  userClients: Client[];
  selectedClient: Client;
  orders: Order[] = [];
  ordersSrvComplete = false;
  hasNewOrders: boolean;
  pendingOrders: Order[] = [];
  user: UserInfo;
  readonly OrderStatus = OrderStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<{ user: UserInfo; client: Client }>,
    private ordersService: OrdersService
  ) {
    this.subscriptions.add(this.store.select(getUserClients).subscribe((clients) => (this.userClients = clients)));
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));
    this.subscriptions.add(
      this.route.params.subscribe((params: Params) => {
        if (params) {
          const clientParam = this.userClients.find((client) => client.clientId == params.clientId);
          if (clientParam) {
            this.store.dispatch(updateClient({ client: clientParam }));
            this.getClientOrders();
          }
        }
      })
    );
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.store.select('client').subscribe((client) => {
        if (!this.user.uuid) {
          this.router.navigate(['/main/mis-pedidos/' + client.clientId]);
        } else {
          this.router.navigate(['/mcc/mis-pedidos/' + client.clientId]);
        }
      })
    );
    this.getClientOrders();
  }

  getClientOrders(): void {
    this.ordersService.getClientOrders().subscribe(
      (orders) => {
        this.orders = orders;
        this.orders = this.orders.filter((o) => ValidationUtils.isDateExceedsByUnits(o.deliveryDate, 'months', 2));
        this.getPendingOrders();
        this.ordersSrvComplete = true;
        this.store.dispatch(loadOrders({ orders: orders }));
      },
      (error) => {
        this.orders = [];
        this.ordersSrvComplete = true;
        this.store.dispatch(loadOrders({ orders: null }));
      }
    );
  }

  getPendingOrders(): void {
    const pendingStatus = [
      OrderStatus.CREATED,
      OrderStatus.DELIVERED,
      OrderStatus.FAILED,
      OrderStatus.REGISTERED,
      OrderStatus.PREPARING,
      OrderStatus.TRANSIT,
      OrderStatus.PARTIAL_DELIVERY,
      OrderStatus.ORDER_NOT_PROCESSED,
    ];
    const newOrderStatus = [OrderStatus.CREATED, OrderStatus.DELIVERED, OrderStatus.FAILED, OrderStatus.REGISTERED];

    /////TODO TEMPORAL CHANGE
    let ordersSpreaded = [];
    this.orders.forEach((order) => (ordersSpreaded = ordersSpreaded.concat(order.sapOrders)));
    /////

    this.hasNewOrders = ordersSpreaded.some((order) => newOrderStatus.some((status) => status === order.status));

    this.pendingOrders = ordersSpreaded.filter((order) => pendingStatus.some((status) => status === order.status));

    this.pendingOrders = this.pendingOrders.filter((m) => m.sourceChannel === 'B2B' || m.sourceChannel === 'YHH6').slice(0, 3);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
