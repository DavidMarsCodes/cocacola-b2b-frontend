import { Address } from './address.model';
import { Product } from './product.model';

export interface OrderDetail {
  orderId?: number;
  erpOrderId?: any;
  status?: string;
  orderDeliveryDate?: Date;
  createdTime?: any;
  paymentMethod?: string;
  sourceChannel?: string;
  subTotalAmount?: number;
  discounts?: number;
  shippingPrice?: number;
  taxes?: number;
  totalAmount?: number;
  address?: Address;
  products?: Product[];
}
