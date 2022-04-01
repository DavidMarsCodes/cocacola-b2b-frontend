import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderDetail } from 'src/app/core/models/order-detail.model';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { Store } from '@ngrx/store';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-ka-my-orders-detail',
  templateUrl: './ka-my-orders-detail.component.html',
  styleUrls: ['./ka-my-orders-detail.component.scss'],
})
export class KaMyOrdersDetailComponent implements OnInit, OnDestroy {
  orderDetail: OrderDetail;
  orderDetailReady = false;
  user: UserInfo;
  private subscriptions = new Subscription();

  constructor(private route: ActivatedRoute, private ordersService: OrdersService, private store: Store<{ user: UserInfo }>) {
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));
    this.subscriptions.add(
      this.route.params.subscribe((params: Params) => {
        this.getOrderDetail(params.orderId);
      })
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getOrderDetail(orderId): void {
    this.ordersService.getOrderDetail(orderId).subscribe(
      (orderDetail) => {
        this.orderDetail = orderDetail;
        this.orderDetailReady = true;
      },
      (error) => {
        this.orderDetailReady = true;
      }
    );
  }
}
