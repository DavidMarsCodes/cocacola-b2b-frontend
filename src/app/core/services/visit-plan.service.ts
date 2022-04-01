import { Injectable, OnDestroy } from '@angular/core';
import { Store, reduceState } from '@ngrx/store';
import { Observable, Subscription, throwError } from 'rxjs';
import { BERespModel } from '../models/backend/BE-response.model';
import { Cart } from '../models/cart.model';
import { Client } from '../models/client.model';
import { ApiService } from './api.service';
import { EndpointsCodes } from 'src/app/core/enums/endpoints-codes.enum';
import { ParserUtils } from '../utils/parser-utils';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class VisitPlanService implements OnDestroy {
  client: Client;
  cart: Cart;

  private subscriptions = new Subscription();
  readonly EndpointsCodes = EndpointsCodes;

  constructor(private apiSrv: ApiService, private httpClient: HttpClient, private store: Store<{ client: Client; cart: Cart }>) {
    this.subscriptions.add(this.store.select('client').subscribe((client) => (this.client = client)));
    this.subscriptions.add(this.store.select('cart').subscribe((cart) => (this.cart = cart)));
  }

  getClientVisitPlan(isFrozen: Boolean = false): Observable<BERespModel> {
    const visitPlan = isFrozen ? 'deliveryfrozen' : 'delivery';
    return new Observable((obs) => {
      this.apiSrv.get(`clients/${this.client.clientId}/visitplan?visitType=${visitPlan}`, EndpointsCodes.GET_VISIT_PLAN, {}).subscribe(
        (res) => obs.next(res),
        (err) => obs.error(err),
        () => obs.complete()
      );
    });
  }

  setOperationDate(visitType: string = 'delivery'): Observable<BERespModel> {
    const rqBody = {
      visitType: visitType,
      deliverydate: this.cart.visitDate ? new Date(this.cart.visitDate).toISOString() : '',
    };
    if (visitType === 'deliveryfrozen') rqBody.deliverydate = new Date(this.cart.frozenVisitDate).toISOString();
    return new Observable((obs) => {
      this.apiSrv.post(`clients/${this.client.clientId}/setoperationdates`, EndpointsCodes.SET_OPERATION_DATE, rqBody, {}).subscribe(
        (res) => obs.next(res),
        (err) => obs.error(err),
        () => obs.complete()
      );
    });
  }

  getInvoiceDeadline(): Observable<BERespModel> {
    return new Observable((obs) => {
      this.apiSrv.get(`clients/${this.client.clientId}/invoicedeadline`, EndpointsCodes.GET_VISIT_PLAN, { showError: false }).subscribe(
        (res) => {
          if (res?.data?.deadlineTime) res.data.deadlineTime = ParserUtils.parserDate(res.data);
          obs.next(res);
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
