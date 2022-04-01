export interface RQCreateOrder {
  orderDeliveryDate?: string; // ISO 8601 yyyy-MM-dd'T'HH?:mm?:ss.SSSZ;
  erpOrderId?: string;
  status?: string;
  items?: RQCreateOrderProduct[];
}

export interface RQCreateOrderProduct {
  productId?: string;
  quantity?: number;
  listPrice?: number;
  finalPrice?: number;
  taxes?: number;
  discounts?: number;
  others?: number;
}
