import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Cart } from 'src/app/core/models/cart.model';
import { cleanCart } from 'src/app/core/state/actions/cart.actions';
import { Client } from 'src/app/core/models/client.model';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/core/services/user.service';
import { EndpointsCodes } from '../../core/enums/endpoints-codes.enum';
import { ApiService } from '../../core/services/api.service';
import * as UserActions from 'src/app/core/state/actions/user.actions';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { SelectClientService } from 'src/app/core/services/select-client.service';

@Component({
  selector: 'app-isolated-new-order',
  templateUrl: './isolated-new-order.component.html',
  styleUrls: ['./isolated-new-order.component.scss'],
})
export class IsolatedNewOrderComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription();
  subStep: string;
  cart: Cart;
  client: Client;
  user: UserInfo;
  translateReady = false;
  userId: string;
  pageLoaded: boolean = false;
  readonly ROOT = 'NEW_ORDER.';

  constructor(
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private apiSrv: ApiService,
    private userService: UserService,
    private store: Store<{ cart: Cart; client: Client; user: UserInfo }>,
    private gtmService: GoogleTagManagerService,
    private selectClientService: SelectClientService
  ) {
    this.subscriptions.add(
      this.route.queryParams.subscribe((params) => {
        this.subStep = params?.grupo;
        this.userId = params?.user;
      })
    );
    this.subscriptions.add(this.store.select('cart').subscribe((cart) => (this.cart = cart)));
    this.subscriptions.add(this.store.select('client').subscribe((client) => (this.client = client)));
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));
  }

  ngOnInit(): void {
    if (!this.user.userId) {
      this.getUser(this.userId).subscribe((res) => {
        this.translateService.use('CL').subscribe((res) => (this.translateReady = true));
        this.login(res.data);
      });
    } else {
      this.translateService.use(this.user.countryId).subscribe((res) => (this.translateReady = true));
      this.pageLoaded = true;
    }

    const subscribe: Subscription = this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      //this.preventNavigation(event);
    });
    this.subscriptions.add(subscribe);
  }

  login(userSession): void {
    this.store.dispatch(UserActions.loadJwt({ jwt: userSession.IdToken }));
    this.store.dispatch(UserActions.loadUuid({ uuid: userSession.id }));
    this.userService.getUserInfo(userSession.username).subscribe((res) => {
      this.store.dispatch(UserActions.loadUser({ user: res.data }));
      this.pushLoginEvent('login', res);
      this.selectClientService.selectClient(userSession.clientId);
      this.pageLoaded = true;
    });
  }

  private pushLoginEvent(event, res): void {
    this.gtmService.pushTag({
      event,
      user: { ...res.data, jwt: '', clients: [] },
      client: res.data?.clients[0],
    });
  }

  getUser(user: string): any {
    return new Observable((obs) => {
      this.apiSrv.get(`login?user=${user}`, EndpointsCodes.AWS_LOGIN, { customUrl: this.apiSrv.BASE_URLS.serverUrlIntegrations }).subscribe(
        (res) => obs.next(res),
        (err) => obs.error(err),
        () => obs.complete()
      );
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(cleanCart());
    this.subscriptions.unsubscribe();
  }
}
