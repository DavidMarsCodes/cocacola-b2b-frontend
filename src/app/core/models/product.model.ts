import { ProductPrice } from './product-price.model';

export interface Product {
  cpgId?: string;
  countryId?: string;
  organizationId?: string;
  productId?: string;
  erpProductId?: string;
  name?: string;
  locked?: boolean;
  availability?: boolean;
  brand?: string;
  size?: string;
  package?: string;
  returnability?: string;
  deleted?: string;
  image?: string;
  createdBy?: string;
  createdTime?: string;
  updatedBy?: string;
  updatedTime?: string;
  productGroup?: {
    category: string;
    macroCategory: string;
  };
  productGroupName?: any;
  portfolioPriceId?: number;
  price?: ProductPrice;
  totals?: ProductPrice;
  quantity?: number;
  suggestedProduct?: any;
  deliveryType: string;

  // custom fields
  quantitySelected?: number;
  totalPrice?: number;
  type?: string;
}
