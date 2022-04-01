import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { EndpointsCodes } from 'src/app/core/enums/endpoints-codes.enum';
import { Client } from 'src/app/core/models/client.model';
import { OrderDetail } from 'src/app/core/models/order-detail.model';
import { Order } from 'src/app/core/models/order.model';
import { ApiService } from 'src/app/core/services/api.service';
@Injectable({
  providedIn: 'root',
})
export class OrdersService implements OnDestroy {
  client: Client;
  private subscriptions = new Subscription();
  readonly EndpointsCodes = EndpointsCodes;

  constructor(private apiSrv: ApiService, private store: Store<{ client: Client }>) {
    this.subscriptions.add(this.store.select('client').subscribe((client) => (this.client = client)));
  }

  getClientOrders(): Observable<Order[]> {
    return new Observable((obs) => {
      this.apiSrv.get(`clients/${this.client.clientId}/order?limit=1000`, EndpointsCodes.GET_ORDERS_HISTORY, {}).subscribe(
        (res) => {
          const ordersGrouped = _.groupBy(res.data, (order) => order.orderId);
          const ordersParsed = [];

          _.mapValues(ordersGrouped, (orders) => {
            if (orders.length === 1) {
              //push single orders
              ordersParsed.push(orders[0]);
            } else if (orders.every((order) => !order.orderId)) {
              //push orders without orderId
              ordersParsed.push(...orders);
            } else {
              // array of orders
              const b2bOrder = orders.find((order) => order.origin === 'B2B');
              if (b2bOrder) {
                b2bOrder['sapOrders'] = [...orders.filter((order) => order.origin !== 'B2B')];
                ordersParsed.push(b2bOrder);
              } else {
                ordersParsed.push(...orders);
              }
            }
          });
          const orderedOrders = _.orderBy(ordersParsed, ['orderDate'], ['desc']);
          orderedOrders.forEach((order) => {
            order.status = order.status?.toUpperCase(); //TODO remove later
            if (!order.sapOrders) order.sapOrders = [{ ...order }]; //TODO remove later. TEMPORAL CHANGE
          });
          obs.next(orderedOrders);
        },
        (err) => obs.error(err),
        () => obs.complete()
      );
    });
  }

  getOrderDetail(orderId): Observable<OrderDetail> {
    return new Observable((obs) => {
      this.apiSrv.get(`clients/${this.client.clientId}/order/${orderId}`, EndpointsCodes.GET_ORDER_DETAIL, { showError: false }).subscribe(
        (res) => {
          res.data = { ...res?.data, orderId };
          res.data.status = res.data.status?.toUpperCase(); //TODO remove later
          res.data?.products.forEach((product) => {
            const listPrice = parseFloat(product?.totals?.listPrice || 0);
            const shipping = parseFloat(product?.totals?.shippingPrice || 0);
            product.totals.listPrice = listPrice + shipping;
          });
          obs.next(res.data);
        },
        (err) => obs.error(err),
        () => obs.complete()
      );
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
