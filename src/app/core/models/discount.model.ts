import { DiscountTypes } from '../enums/discount-types';
import { ProductPrice } from './product-price.model';

export interface Discount {
  discountId?: number;
  name?: string;
  image?: string;
  price?: ProductPrice;
  maxRepetitionAllowed?: number;
  allowUserSelection?: boolean;
  discountType?: DiscountTypes;
  requirements?: any;
  quantitySelected?: number;
  calculationType?: string;
}
