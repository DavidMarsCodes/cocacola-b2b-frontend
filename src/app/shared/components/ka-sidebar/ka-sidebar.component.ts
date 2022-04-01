import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/core/models/cart.model';
import { Client } from 'src/app/core/models/client.model';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { logout } from 'src/app/core/state/actions/user.actions';
import * as UserActions from 'src/app/core/state/actions/user.actions';
import { ParserUtils } from 'src/app/core/utils/parser-utils';

@Component({
  selector: 'app-ka-sidebar',
  templateUrl: './ka-sidebar.component.html',
  styleUrls: ['./ka-sidebar.component.scss'],
})
export class KaSidebarComponent implements OnInit, OnDestroy {
  @Input() isMobile = false;
  sidebarOptions: any[] = [];
  isNewOrderSelected = false;

  client: Client;
  cart: Cart;
  user: UserInfo;

  private subscriptions = new Subscription();

  readonly ParserUtils = ParserUtils;

  constructor(private router: Router, private store: Store<{ user: UserInfo; client: Client; cart: Cart }>) {
    this.subscriptions.add(
      this.store.select('client').subscribe((client) => {
        this.client = client;
        this.sidebarOptions.forEach((opt) => {
          if (opt.icon === 'shopping-cart') opt.disabled = this.client.hasLockOrder;
        });
      })
    );
    this.subscriptions.add(this.store.select('cart').subscribe((cart) => (this.cart = cart)));
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));
  }

  ngOnInit(): void {
    this.sidebarOptions = this.generateOptions();
    this.updateNavOptions(this.router.url.split('/')[2]);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.urlAfterRedirects.split('/')[2];
        this.updateNavOptions(currentRoute);
      }
    });
  }

  updateNavOptions(currentRoute): void {
    this.isNewOrderSelected = currentRoute === 'nuevo-pedido';
    this.sidebarOptions.forEach((opt) => {
      opt.active = opt.routerLink.split('/')[0] === currentRoute;
    });
  }

  generateOptions(): any[] {
    return [
      {
        active: false,
        routerLink: 'home',
        icon: 'home',
        langKey: 'START',
        disabled: false,
        show: true,
      },
      {
        active: false,
        routerLink: 'mi-perfil',
        icon: 'users',
        langKey: 'MY_PROFILE',
        disabled: false,
        show: true,
      },
      {
        active: false,
        routerLink: 'mis-pedidos/:clientId',
        icon: 'bucket',
        langKey: `MY_ORDERS_${this.isMobile ? 'MOBILE' : 'DESKTOP'}`,
        disabled: false,
        show: true,
      },
      {
        active: false,
        routerLink: 'nuevo-pedido/1',
        icon: 'shopping-cart',
        langKey: `NEW_ORDER_${this.isMobile ? 'MOBILE' : 'DESKTOP'}`,
        disabled: this.client.hasLockOrder,
        show: true,
      },
      {
        active: false,
        routerLink: 'mis-promociones',
        icon: 'discount-2',
        langKey: 'MY_BENEFITS',
        disabled: false,
        show: this.user.countryId === 'CL' ? true : false,
      },
      {
        active: false,
        routerLink: 'mi-saldo',
        icon: 'wallet',
        langKey: 'MY_WALLET',
        disabled: false,
        show: this.user.countryId !== 'AR',
      },
    ];
  }

  optionSelected(optSelected): void {
    if (optSelected.disabled) return;
    this.sidebarOptions.forEach((opt) => {
      opt.active = opt.langKey === optSelected.langKey;
    });
    this.isNewOrderSelected = optSelected.langKey === 'NEW_ORDER';
    this.router.navigate(['/main/' + optSelected.routerLink.replace(':clientId', this.client.clientId)]);
  }

  isDeadlineToday(): boolean {
    return moment(this.cart.invoiceDeadline).format('YYYYMMDD') === moment().format('YYYYMMDD');
  }

  isFirstDeliveryDate(): boolean {
    const visitDateIndex = this.client.data.visitDates.findIndex((date) => {
      return moment(date.visitDate).isSame(moment(this.cart.visitDate));
    });
    return visitDateIndex === 0;
  }

  signOut(): void {
    this.store.dispatch(logout());
    this.store.dispatch(UserActions.loadUuid({ uuid: '' }));
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
