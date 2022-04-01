import { Product } from './../models/product.model';
import * as _ from 'lodash';

export class ProductsCalcs {
  constructor() {}

  static getTotalFinalPrice = (products: Product[]): number => {
    return _.reduce(
      products,
      (acc, cur: Product) => {
        return acc + (parseFloat(cur.totals?.finalPrice) || 0);
      },
      0
    );
  };

  static getTotalListPrice = (products: Product[]): number => {
    return _.reduce(
      products,
      (acc, cur: Product) => {
        return acc + (parseFloat(cur.totals?.listPrice) || 0);
      },
      0
    );
  };

  static getTotalFinalTaxes = (products: Product[]): number => {
    return _.reduce(
      products,
      (acc, cur: Product) => {
        return acc + (parseFloat(cur.totals?.finalTaxes) || 0);
      },
      0
    );
  };

  static getTotalDiscounts = (products: Product[]): number => {
    return _.reduce(
      products,
      (acc, cur: Product) => {
        return acc + (parseFloat(cur.totals?.discounts) || 0);
      },
      0
    );
  };

  static getSubtotalsByGroup = (products: Product[]): any => {
    const productsGrouped = _.groupBy(products, (product) => product?.productGroupName);
    const subtotalsByGroup = _.mapValues(productsGrouped, (productsGroup) => {
      return _.reduce(
        productsGroup,
        (acc, cur: Product) => {
          return acc + (parseFloat(cur.totals?.listPrice) || 0);
        },
        0
      );
    });
    return subtotalsByGroup;
  };

  static getItemFullListPrice = (product: Product): number => {
    const listPrice = parseFloat(product?.price?.listPrice || 0);
    const shipping = parseFloat(product?.price?.shippingPrice || 0);
    const taxes = parseFloat(product?.price?.taxes || 0);
    return listPrice + shipping + taxes;
  };
}
