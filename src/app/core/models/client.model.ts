import { ClientDiscretionaryDiscount } from './benefit.model';
import { MyCreditModel } from './my-account.model';
import { Order } from './order.model';
import { Product } from './product.model';

export interface Client {
  fantasyName?: string;
  clientId?: number;
  rol?: string;
  fiscalId?: string;
  erpClientId?: string;
  street?: string;
  doorNumber?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  blocks?: any[];
  // custom properties
  hasLockOrder: boolean;
  data?: {
    visitDates?: VisitDate[];
    frozenVisitDates?: VisitDate[];
    orders?: Order[];
    suggestedProducts?: Product[];
    discounts?: ClientDiscretionaryDiscount[];
    credits?: MyCreditModel[];
  };
}

export interface VisitDate {
  visitDate?: string;
  visitType?: string;
}
