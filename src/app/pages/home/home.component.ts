import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { ProductTypes } from 'src/app/core/enums/product-types';
import { Cart } from 'src/app/core/models/cart.model';
import { Client } from 'src/app/core/models/client.model';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { loadOrders } from 'src/app/core/state/actions/client.actions';
import { getHomeStyle } from 'src/app/core/state/reducers/user.reducer';
import { OrdersService } from '../my-orders/services/orders.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  suggestedProducts: any[] = [];
  clients: Client[];
  selectedClient: Client;
  homeStyle: any;
  customOptions2: OwlOptions;
  private subscriptions = new Subscription();
  readonly ProductTypes = ProductTypes;
  user: any;

  constructor(private store: Store<{ user: UserInfo; client: Client; homeStyle: any; cart: Cart }>, private ordersService: OrdersService) {
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.clients = user.clients)));
    this.subscriptions.add(
      this.store.select('client').subscribe((client) => {
        this.selectedClient = client;
        const sugProd = [...client?.data?.suggestedProducts?.slice(0, 4)];
        this.suggestedProducts = sugProd.map((prod) => ({ ...prod }));
      })
    );
    this.subscriptions.add(this.store.select(getHomeStyle).subscribe((homeStyle) => (this.homeStyle = homeStyle)));
  }

  ngOnInit(): void {
    this.customOptions2 = this.getCutomOptions();
    this.getClientOrders();
  }

  getClientOrders(): void {
    this.ordersService.getClientOrders().subscribe(
      (orders) => {
        /////TODO TEMPORAL CHANGE
        let ordersSpreaded = [];
        orders.forEach((order) => (ordersSpreaded = ordersSpreaded.concat(order.sapOrders)));
        /////
        this.store.dispatch(loadOrders({ orders: ordersSpreaded }));
      },
      (error) => this.store.dispatch(loadOrders({ orders: null }))
    );
  }

  getCutomOptions(): OwlOptions {
    return {
      loop: true,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      dots: false,
      autoplay: false,
      navSpeed: 700,
      margin: 10,
      navText: ['<', '>'],
      responsive: {
        0: {
          items: 2,
        },
        400: {
          items: 2,
        },
        740: {
          items: 2,
        },
        992: {
          items: 2,
        },
      },
      nav: false,
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
