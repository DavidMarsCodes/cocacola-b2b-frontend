import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { Cart } from '../../models/cart.model';
import { Product } from '../../models/product.model';
import * as CartActions from '../actions/cart.actions';
import { ProductsCalcs } from './../../utils/products-calcs';

const getCartFeatureState = createFeatureSelector<Cart>('cart');

export const getCartTotalPrice = createSelector(getCartFeatureState, (state) => state.totalPrice);
export const getCartVisitDate = createSelector(getCartFeatureState, (state) => state.visitDate);
export const getCartFrozenVisitDate = createSelector(getCartFeatureState, (state) => state.frozenVisitDate);
export const getCartInvoiceDeadline = createSelector(getCartFeatureState, (state) => state.invoiceDeadline);
export const getCartProducts = createSelector(getCartFeatureState, (state) => state.products);
export const getCartProductsDisc = createSelector(getCartFeatureState, (state) => state.discountProducts);

const initialState: Cart = {
  // orderId: '',
  totalPrice: 0,
  subtotalPrice: 0,
  totalFinalTaxes: 0,
  subtotalsByGroup: {},
  minPurchase: 0,
  minPurchaseReached: false,
  saving: 0,
  visitDate: '',
  invoiceDeadline: '',
  isFirstDeliveryDate: false,
  backupProducts: [],
  products: [],
  discountProducts: [],
  orderConfirmed: false,
  hasDeliveryFrozenProducts: false,
  paymentMethod: '',
  credits: [],
};

export const cartReducer = createReducer<Cart>(
  initialState,
  on(CartActions.upsertProduct, (state, props): Cart => {
    const newProdArray = handleUpsertProducts(state, [props.product]);
    return { ...state, products: newProdArray };
  }),
  on(CartActions.upsertMultipleProducts, (state, props): Cart => {
    const newProdArray = handleUpsertProducts(state, props.products);
    return { ...state, products: newProdArray };
  }),
  on(CartActions.deleteProduct, (state, product): Cart => {
    const newProdArray = state.products.filter((prod) => prod.productId !== product.product.productId);
    return { ...state, products: newProdArray };
  }),
  on(CartActions.deleteAllProducts, (state): Cart => ({ ...state, backupProducts: [], products: [] })),
  on(CartActions.updateAllProducts, (state, prop): Cart => ({ ...state, products: prop.products })),
  on(CartActions.loadProductDiscountsSuccess, (state, prop): Cart => updateCartValues(state, prop.data)),
  on(CartActions.loadProductDiscountsError, (state, prop): any => ({ ...state, products: state.backupProducts })),
  on(CartActions.updateMinPurchase, (state, prop): Cart => ({ ...state, minPurchase: prop.minPurchase })),
  on(CartActions.updateMinPurchaseReached, (state, prop): Cart => ({ ...state, minPurchaseReached: prop.minPurchaseReached })),
  on(CartActions.updateVisitDate, (state, date): Cart => ({ ...state, visitDate: date.date })),
  on(CartActions.updateFrozenVisitDate, (state, date): Cart => ({ ...state, frozenVisitDate: date.date })),
  on(CartActions.updateInvoiceDeadline, (state, prop): Cart => ({ ...state, invoiceDeadline: prop.invoiceDeadline })),
  on(CartActions.confirmOrder, (state, prop): Cart => ({ ...state, orderConfirmed: true })),
  on(
    CartActions.cleanCart,
    (state): Cart => ({ ...initialState, visitDate: state.visitDate, invoiceDeadline: state.invoiceDeadline, minPurchase: state.minPurchase })
  ),
  on(CartActions.updateHasDeliveryFrozenProducts, (state): Cart => {
    const hasFrozenProducts = state.products.find((prod) => prod.deliveryType === 'deliveryfrozen') ? true : false;
    return { ...state, hasDeliveryFrozenProducts: hasFrozenProducts };
  }),
  on(CartActions.upsertpaymentMethod, (state, prop): Cart => ({ ...state, paymentMethod: prop.paymentMethod })),
  on(CartActions.updateCartCredits, (state, prop): Cart => ({ ...state, credits: prop.credits }))
);

const handleUpsertProducts = (state, products: Product[]) => {
  let newProdArray = [...state.products];
  products.forEach((product) => {
    const isAlreadyInCart = newProdArray.find((prod) => prod.productId === product.productId);
    if (isAlreadyInCart) {
      newProdArray = newProdArray.map((prod) => {
        const quantity = prod.productId === product.productId ? product.quantitySelected + prod.quantity : prod.quantity;
        return { ...prod, quantity };
      });
    } else {
      newProdArray = [...newProdArray, parseProduct(product)];
    }
  });
  return newProdArray;
};

// parseProduct before createParcialOrder
const parseProduct = (product: Product, quantity?: number) => {
  return {
    productId: product.productId,
    quantity: quantity | product.quantitySelected,
    name: product.name,
    productGroupName: product.productGroupName,
    price: {
      listPrice: parseFloat(product.price?.listPrice as any) | 0,
      finalPrice: parseFloat(product.price?.finalPrice as any) | 0,
      shippingPrice: parseFloat(product.price?.shippingPrice as any) | 0,
      taxes: parseFloat(product.price?.taxes as any) | 0,
      others: parseFloat(product.price?.others as any) | 0,
      discounts: parseFloat(product.price?.discounts as any) | 0,
    },
    portfolioPriceId: product?.portfolioPriceId | product?.price?.portfolioPriceId,
    suggestedProduct: product.suggestedProduct,
    deliveryType: product.deliveryType,
  };
};

//updates cart state after createParcialOrder
const updateCartValues = (state: Cart, data) => {
  const subtotalPrice = ProductsCalcs.getTotalListPrice(data.calculatedItems);
  const totalFinalTaxes = ProductsCalcs.getTotalFinalTaxes(data.calculatedItems);
  const saving = ProductsCalcs.getTotalDiscounts(data.calculatedItems);
  const totalPrice = ProductsCalcs.getTotalFinalPrice(data.calculatedItems);

  return {
    ...state,
    orderId: data.orderId,
    totalPrice,
    subtotalPrice,
    totalFinalTaxes,
    backupProducts: state.products,
    subtotalsByGroup: ProductsCalcs.getSubtotalsByGroup(data.calculatedItems),
    minPurchase: state.minPurchase,
    minPurchaseReached: totalPrice >= state.minPurchase,
    saving,
    discountProducts: [...data.calculatedItems]?.reverse(),
    paymentMethod: state.paymentMethod,
    credits: state.credits,
  };
};
