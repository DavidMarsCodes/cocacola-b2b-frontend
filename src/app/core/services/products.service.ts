import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import * as _ from 'lodash';
import { Observable, throwError } from 'rxjs';
import { EndpointsCodes } from 'src/app/core/enums/endpoints-codes.enum';
import { Cart } from 'src/app/core/models/cart.model';
import { ProductFilter } from 'src/app/core/models/product-filter.model';
import { environment } from 'src/environments/environment';
import { DiscountTypes } from '../enums/discount-types';
import { DiscountCalculationType } from '../enums/discount-calculation-type';
import { BERespModel } from '../models/backend/BE-response.model';
import { Client } from '../models/client.model';
import { UserInfo } from '../models/user-info.model';
import { ProductsCalcs } from '../utils/products-calcs';
import { ApiService } from './api.service';
import { Product } from '../models/product.model';
import { DefaultImages } from '../enums/default-images';
import { MyAccountService } from 'src/app/pages/my-account/services/my-account.service';
import * as CartActions from 'src/app/core/state/actions/cart.actions';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  client: Client;
  cart: Cart;
  user: UserInfo;
  credits: any = {};
  imgHost = environment.IMG_S3_HOST;

  constructor(
    private store: Store<{ client: Client; cart: Cart; user: UserInfo }>,
    private apiSrv: ApiService,
    private myAccountService: MyAccountService,
    private gtmService: GoogleTagManagerService
  ) {
    this.store.select('client').subscribe((client) => (this.client = client));
    this.store.select('cart').subscribe((cart) => (this.cart = cart));
    this.store.select('user').subscribe((user) => (this.user = user));
  }

  getSuggestedProducts(offset: number = 0, ngxSpinner: boolean, filtered = false, showError = false): Observable<BERespModel> {
    const queryParams = this.generateQueryParams({ limit: 24, offset });

    return new Observable((obs) => {
      this.apiSrv
        .get(`clients/${this.client.clientId}/suggestedproducts${queryParams}`, EndpointsCodes.GET_SUGGESTED_PROD, {
          ngxSpinner,
          showError,
        })
        .subscribe(
          (res: BERespModel) => {
            if (!res.data) {
              throwError({});
              return;
            }
            res.data = res.data.map((product) => {
              return {
                ...product,
                image: `${this.imgHost}${product.image || DefaultImages.PRODUCT}`,
                quantitySelected: product.suggestedProduct?.quantity || product.quantity,
                price: {
                  ...product.price,
                  finalPrice: parseFloat(product.price?.finalPrice),
                  listPrice: ProductsCalcs.getItemFullListPrice(product),
                },
              };
            });
            if (filtered) {
              res.data = res.data.filter((product) => product.availability && !product.locked);
            }
            obs.next(res);
          },
          (err) => obs.error(err),
          () => obs.complete()
        );
    });
  }

  getProductPacks(offset: number = 0, ngxSpinner: boolean): Observable<any> {
    const paramsObj = {
      limit: 24,
      offset,
    };
    const queryParams = this.generateQueryParams(paramsObj);

    return new Observable((obs) => {
      this.apiSrv
        .get(`clients/${this.client.clientId}/discounts${queryParams}`, EndpointsCodes.GET_DISCOUNTS_PROD, { ngxSpinner: false, customSpinner: true })
        .subscribe(
          (res: BERespModel) => {
            res.data = res.data.map((discount) => {
              const discountType = this.generateDiscountType(discount);
              return {
                ...discount,
                discountType,
                image: `${this.imgHost}${discount.image || DefaultImages.DISCOUNT}`,
                quantitySelected: 1,
                requirements: this.parseGetProductsPackResp(discountType, discount.requirements, discount.calculationType),
              };
            });
            obs.next(res);
          },
          (err) => obs.error(err),
          () => obs.complete()
        );
    });
  }

  private generateDiscountType(discount): DiscountTypes {
    if (discount.discountType !== DiscountTypes.SCALE) return discount.discountType;
    return discount.requirements?.productId ? DiscountTypes.UNIT_SCALE : DiscountTypes.PACK_SCALE;
  }

  private parseGetProductsPackResp(discountType, requirements, calculationType): any {
    const addsMinScalesUnit = () => {
      let fakeMinScaleUnit;
      const firstScaleUnit = { ...requirements.scales[0] };
      if (firstScaleUnit.min != 1) {
        fakeMinScaleUnit = { price: [], min: 1, max: firstScaleUnit.min - 1, reward: 0 };
        fakeMinScaleUnit.price = { ...firstScaleUnit.price, finalPrice: firstScaleUnit.price.listPrice };
      }
      return fakeMinScaleUnit ? [fakeMinScaleUnit, ...requirements.scales] : requirements.scales;
    };

    const addsMinScalesPack = () => {
      let fakeMinScale;
      const firstScale = { ...requirements.scales[0] };
      if (firstScale.min != 1) {
        fakeMinScale = { products: [], min: 1, max: firstScale.min - 1, reward: 0 };
        fakeMinScale.products = firstScale.products.map((product) => {
          return { ...product, price: { ...product.price, finalPrice: product.price.listPrice } };
        });
      }
      return fakeMinScale ? [fakeMinScale, ...requirements.scales] : requirements.scales;
    };

    let factor;
    switch (discountType) {
      case DiscountTypes.CLOSED:
        requirements.forEach((product) => {
          product.price.listPrice = ProductsCalcs.getItemFullListPrice(product);
        });
        return requirements;
      case DiscountTypes.OPEN:
        requirements[0].products.forEach((product) => {
          product.price.listPrice = ProductsCalcs.getItemFullListPrice(product);
        });
        return requirements;
      case DiscountTypes.UNIT_SCALE:
        factor = DiscountCalculationType.AMOUNT === calculationType ? 1 : 100;
        requirements.scales = _.sortBy(requirements.scales, [(scale) => scale.min]);
        requirements.scales.forEach((product) => {
          product.reward.value = parseFloat((product.reward.value * factor).toFixed(1));
          product.price.listPrice = ProductsCalcs.getItemFullListPrice(product);
        });

        requirements.scales = addsMinScalesUnit();

        return requirements;
      case DiscountTypes.PACK_SCALE:
        factor = DiscountCalculationType.AMOUNT === calculationType ? 1 : 100;
        requirements.scales = _.sortBy(requirements.scales, [(scale) => scale.min]);
        requirements.scales.forEach((scale) => {
          scale.reward.value = parseFloat((scale.reward.value * factor).toFixed(1));
          scale.products.forEach((product) => {
            product.price.listPrice = ProductsCalcs.getItemFullListPrice(product);
          });
        });

        requirements.scales = addsMinScalesPack();

        return requirements;
      default:
        return requirements;
    }
  }

  getPortfolioByClient(offset: number = 0, ngxSpinner: boolean, filters?: ProductFilter): Observable<BERespModel> {
    const paramsObj = {
      limit: 24,
      offset,
      ...filters,
    };
    const queryParams = this.generateQueryParams(paramsObj);

    return new Observable((obs) => {
      this.apiSrv.get(`clients/${this.client.clientId}/portfolio${queryParams}`, EndpointsCodes.GET_PORTFOLIO_PROD, { ngxSpinner }).subscribe(
        (res: BERespModel) => {
          res.data = res.data.map((product) => {
            return {
              ...product,
              image: `${this.imgHost}${product.image || DefaultImages.PRODUCT}`,
              quantitySelected: 1,
              price: {
                ...product.price,
                finalPrice: parseFloat(product.price?.finalPrice),
                listPrice: ProductsCalcs.getItemFullListPrice(product),
              },
            };
          });
          obs.next(res);
        },
        (err) => obs.error(err),
        () => obs.complete()
      );
    });
  }

  getPortfolioFilters(filters?: ProductFilter): Observable<BERespModel> {
    const queryParams = this.generateQueryParams({ ...filters });

    return new Observable((obs) => {
      this.apiSrv.get(`clients/${this.client.clientId}/filter/portfolio${queryParams}`, EndpointsCodes.GET_PORTFOLIO_FILTERS, {}).subscribe(
        (res) => {
          res.data.categories = res.data?.categories?.sort();
          res.data.packages = res.data?.packages?.sort();
          res.data.brands = res.data?.brands?.sort();
          res.data.sizes = this.orderProductSizes(res.data.sizes);
          obs.next(res);
        },
        (err) => obs.error(err),
        () => obs.complete()
      );
    });
  }

  getProductsDiscounts(products: any[]): Observable<any> {
    return new Observable((obs) => {
      const partialOrderRQItems = products.map((product) => ({
        productId: product.productId,
        quantity: product.quantity,
        portfolioPriceId: product.portfolioPriceId,
      }));
      const partialOrderRQ = {
        items: partialOrderRQItems,
        orderId: this.cart.orderId,
      };

      this.apiSrv.post(`clients/${this.client.clientId}/order`, EndpointsCodes.POST_PARTIAL_ORDER, partialOrderRQ, {}).subscribe(
        (res: BERespModel) => {
          if (!this.cart.orderId) this.gtmService.pushTag({ event: 'createOrder' });
          res?.data?.calculatedItems.forEach((product) => {
            const listPrice = parseFloat(product?.totals?.listPrice || 0);
            const shipping = parseFloat(product?.totals?.shippingPrice || 0);
            product.totals.listPrice = listPrice + shipping;
          });
          const productsInserted = this.getProductsInserted([...products]);
          if (productsInserted?.length) {
            this.gtmService.pushTag({ event: 'addProducts', productType: this.getProductType(productsInserted), products: productsInserted });
          }

          if (this.cart.orderId && this.client.data.credits.length > 0) {
            this.myAccountService.getCurrentCartCredits(res.data.orderId).subscribe(
              (resp) => {
                this.credits = resp;
                this.store.dispatch(CartActions.updateCartCredits({ credits: this.credits.paymentHandlerResult }));
              },
              (error) => {
                this.store.dispatch(CartActions.updateCartCredits({ credits: [] }));
              }
            );
          }
          obs.next(res);
        },
        (err) => obs.error(err),
        () => obs.complete()
      );
    });
  }

  private getProductsInserted(serviceProducts: Product[]): Product[] {
    const backupProducts = this.cart.backupProducts;
    const diffProducts = serviceProducts.map((srvProduct) => {
      const prevProduct = backupProducts.find((bkpProd) => srvProduct.productId === bkpProd.productId);
      if (!prevProduct) return srvProduct; //if the product doesn't exist, it means is a new product
      return { ...srvProduct, quantity: srvProduct.quantity - prevProduct.quantity };
    });
    return diffProducts.filter((diffProd) => diffProd.quantity > 0);
  }

  private getProductType(productsInserted: Product[]): string {
    if (!productsInserted[0].suggestedProduct) return 'DISCOUNT_PRODUCTS';
    return productsInserted[0].suggestedProduct.isSuggested ? 'SUGGESTED_PRODUCTS' : 'PORTFOLIO_PRODUCTS';
  }

  private orderProductSizes(sizes: string[]): string[] {
    if (!sizes) return sizes;
    let mlProducts = sizes.filter((size) => parseFloat(size.split(' ')[0]) > 100);
    let lProducts = sizes.filter((size) => parseFloat(size.split(' ')[0]) < 100);
    mlProducts = mlProducts?.sort(compareSizes);
    lProducts = lProducts?.sort(compareSizes);

    function compareSizes(sizeA, sizeB): number {
      const numA = parseFloat(sizeA.split(' ')[0]);
      const numB = parseFloat(sizeB.split(' ')[0]);
      if (numA < numB) return -1;
      if (numA > numB) return 1;
      return 0;
    }
    return [...mlProducts, ...lProducts];
  }

  private generateQueryParams(params: object): string {
    let queryParams = '?';
    for (const param in params) {
      if (params.hasOwnProperty(param) && (params[param] || params[param] === 0 || params[param] === false)) {
        const value = params[param];
        queryParams += param + '=' + value + '&';
      }
    }
    return queryParams;
  }
}
