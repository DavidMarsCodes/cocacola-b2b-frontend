import { Product } from './product.model';
export interface Cart {
  orderId?: number;
  totalPrice: number;
  subtotalPrice: number;
  totalFinalTaxes: number;
  subtotalsByGroup: object;
  minPurchase?: number;
  minPurchaseReached?: boolean;
  saving: number;
  visitDate: string | Date;
  invoiceDeadline: string | Date;
  isFirstDeliveryDate: boolean;
  backupProducts?: Product[]; // backup just in case parcialOrder service failed
  products: Product[]; // RQ. products selected to send to parcialOrder service
  discountProducts: Product[]; //RQ. products returned from parcialOrder service
  orderConfirmed?: boolean;
  hasDeliveryFrozenProducts?: boolean;
  frozenVisitDate?: string | Date;
  paymentMethod?: string;
  credits?: any;
}
