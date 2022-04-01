import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import * as CartActions from './../actions/cart.actions';
import { ProductsService } from './../../services/products.service';
import { Cart } from '../../models/cart.model';
import { Store } from '@ngrx/store';
import { getCartProducts } from '../reducers/cart.reducer';
import { BERespModel } from '../../models/backend/BE-response.model';
@Injectable({
  providedIn: 'root',
})
export class CartEffects {
  constructor(private actions$: Actions, private productService: ProductsService, private store: Store<{ cart: Cart }>) {}

  getProductsDiscounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CartActions.upsertProduct,
        CartActions.deleteProduct,
        CartActions.upsertMultipleProducts,
        CartActions.deleteAllProducts,
        CartActions.updateAllProducts
      ),
      withLatestFrom(this.store.select(getCartProducts)),
      mergeMap((products) =>
        this.productService.getProductsDiscounts(products[1]).pipe(
          map((res: BERespModel) => {
            return CartActions.loadProductDiscountsSuccess({ data: res.data });
          }),
          catchError((error) => of(CartActions.loadProductDiscountsError({ error })))
        )
      )
    )
  );
}
