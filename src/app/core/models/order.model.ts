export interface Order {
  orderId?: any;
  clientId: number;
  cpgId: string;
  countryId: string;
  organizationId: string;
  erpOrderId: string;
  deliveryDate: string;
  orderDate: string;
  origin: string;
  status: string;
  orderHistoryID: string;
  amount: string;
  sourceChannel: string;
  documentType: string;
  transportData: string;
  paymentMethodID?: any;

  //mock params
  reason?: string;
  sapOrders?: any[];
}
