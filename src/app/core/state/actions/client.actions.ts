import { createAction, props } from '@ngrx/store';
import { Client, VisitDate } from '../../models/client.model';
import { Order } from '../../models/order.model';
import { Product } from '../../models/product.model';
import { ClientDiscretionaryDiscount } from '../../models/benefit.model';
import { MyCreditModel } from '../../models/my-account.model';

export const updateClient = createAction('[Client] updateClient', props<{ client: Client }>());
export const loadVisitDates = createAction('[Client] loadVisitDates', props<{ visitDates: VisitDate[] }>());
export const loadFrozenVisitDates = createAction('[Client] loadFrozenVisitDates', props<{ frozenVisitDates: VisitDate[] }>());
export const loadOrders = createAction('[Client] loadOrders', props<{ orders: Order[] }>());
export const loadSuggestedProducts = createAction('[Client] loadSuggestedProducts', props<{ suggestedProducts: Product[] }>());
export const loadDiscretionaryDiscount = createAction('[Client] loadDiscretionaryDiscount', props<{ discounts: ClientDiscretionaryDiscount[] }>());
export const loadCredits = createAction('[Client] loadCredits', props<{ credits: MyCreditModel[] }>());
