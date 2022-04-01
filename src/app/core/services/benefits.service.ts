import { Injectable, OnDestroy } from '@angular/core';
import { Store, reduceState } from '@ngrx/store';
import { Observable, Subscription, throwError } from 'rxjs';
import { BERespModel } from '../models/backend/BE-response.model';
import { Client } from '../models/client.model';
import { ApiService } from './api.service';
import { EndpointsCodes } from 'src/app/core/enums/endpoints-codes.enum';
@Injectable({
  providedIn: 'root',
})
export class DiscretionaryDiscountService implements OnDestroy {
  client: Client;

  private subscriptions = new Subscription();
  readonly EndpointsCodes = EndpointsCodes;

  constructor(private apiSrv: ApiService, private store: Store<{ client: Client }>) {
    this.subscriptions.add(this.store.select('client').subscribe((client) => (this.client = client)));
  }

  getBenefitsClient(): Observable<BERespModel> {
    return new Observable((obs) => {
      this.apiSrv
        .get(`clients/${this.client.clientId}/discounts/discretionary?cutoffDays=30&limit=40&offset=0`, EndpointsCodes.GET_DISCRETIONARY_DISCOUNT, {})
        .subscribe(
          (res) => obs.next(res),
          (err) => obs.error(err),
          () => obs.complete()
        );
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
