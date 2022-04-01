import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { EndpointsCodes } from 'src/app/core/enums/endpoints-codes.enum';
import { BERespModel } from 'src/app/core/models/backend/BE-response.model';
import { Cart } from 'src/app/core/models/cart.model';
import { Client } from 'src/app/core/models/client.model';
import { MyCreditModel } from 'src/app/core/models/my-account.model';
import { ApiService } from 'src/app/core/services/api.service';
import { __spreadArray } from 'tslib';

@Injectable({
  providedIn: 'root',
})
export class MyAccountService implements OnDestroy {
  client: Client;
  cart: Cart;
  orderId: any;

  private subscriptions = new Subscription();
  readonly EndpointsCodes = EndpointsCodes;

  constructor(private apiSrv: ApiService, private httpClient: HttpClient, private store: Store<{ client: Client; cart: Cart }>) {
    this.subscriptions.add(this.store.select('client').subscribe((client) => (this.client = client)));
    this.subscriptions.add(this.store.select('cart').subscribe((cart) => (this.cart = cart)));
  }

  getAvailableCredits(): Observable<MyCreditModel[]> {
    return new Observable((obs) => {
      this.apiSrv.get(`clients/${this.client.clientId}/credits?offset=0&limit=100`, EndpointsCodes.GET_CREDITS, {}).subscribe(
        (res: BERespModel) => {
          obs.next(res.data);
        },
        (err) => obs.error(err),
        () => obs.complete()
      );
    });
  }

  getCurrentCartCredits(orderId?: any): Observable<BERespModel> {
    this.orderId = orderId ? orderId : this.cart.orderId;
    return new Observable((obs) => {
      this.apiSrv
        .put(`clients/${this.client.clientId}/order/${this.orderId}?offset=0&limit=100`, EndpointsCodes.PUT_ORDER_CREDITS, { orderId: this.cart.orderId }, {})
        .subscribe(
          (res: BERespModel) => {
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
