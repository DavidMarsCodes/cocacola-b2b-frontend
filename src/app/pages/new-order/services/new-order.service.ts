import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { EndpointsCodes } from 'src/app/core/enums/endpoints-codes.enum';
import { BERespModel } from 'src/app/core/models/backend/BE-response.model';
import { Cart } from 'src/app/core/models/cart.model';
import { Client } from 'src/app/core/models/client.model';
import { ApiService } from 'src/app/core/services/api.service';
import { confirmOrder } from 'src/app/core/state/actions/cart.actions';
import { ProductsCalcs } from 'src/app/core/utils/products-calcs';

@Injectable({
  providedIn: 'root',
})
export class NewOrderService {
  stepNumber$ = new Subject<number>();
  client: Client;
  cart: Cart;
  orderId: number;
  readonly EndpointsCodes = EndpointsCodes;

  constructor(private apiSrv: ApiService, private store: Store<{ client: Client; cart: Cart }>, private gtmService: GoogleTagManagerService) {
    this.store.select('client').subscribe((client) => (this.client = client));
    this.store.select('cart').subscribe((cart) => (this.cart = cart));
  }

  createOrder(): Observable<BERespModel> {
    return new Observable((obs) => {
      this.apiSrv
        .post(`clients/${this.client.clientId}/order/${this.cart.orderId}`, EndpointsCodes.POST_ORDER, { paymentMethod: this.cart.paymentMethod }, {})
        .subscribe(
          (res) => {
            this.gtmService.pushTag({ event: 'createOrderConfirm', order: this.parseGTMdata(this.cart) });
            this.store.dispatch(confirmOrder());
            obs.next(res);
          },
          (err) => obs.error(err),
          () => obs.complete()
        );
    });
  }

  private parseGTMdata(cart: Cart): any {
    const products = cart.discountProducts.map((prod) => {
      return {
        productId: prod.productId,
        erpProductId: parseInt(prod.erpProductId) || '',
        name: prod.name,
        quantity: prod.quantity,
        category: prod.productGroup?.category,
        finalPrice: prod.price.finalPrice,
        listPrice: ProductsCalcs.getItemFullListPrice(prod),
      };
    });

    let parsedData = {
      orderId: cart.orderId,
      paymentMethod: cart.paymentMethod,
      date: moment().format('DD/MM/YYYY hh:mm'),
      deliveryDate: moment(new Date(cart.visitDate).toISOString().replace('Z', '')).format('DD/MM/YYYY'),
      totalPrice: cart.totalPrice,
      products,
    };
    if (cart.hasDeliveryFrozenProducts) {
      parsedData['frozenDeliveryDate'] = moment(new Date(cart.frozenVisitDate).toISOString().replace('Z', '')).format('DD/MM/YYYY');
    }
    return parsedData;
  }
}
