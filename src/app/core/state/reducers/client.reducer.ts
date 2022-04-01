import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { Client } from '../../models/client.model';
import * as ClientActions from '../actions/client.actions';

const initialState: Client = {
  fantasyName: '',
  clientId: 0,
  erpClientId: '0',
  fiscalId: '0',
  rol: '',
  hasLockOrder: false,
  data: {
    visitDates: [],
    frozenVisitDates: [],
    orders: [],
    suggestedProducts: [],
    discounts: [],
    credits: [],
  },
};

export const clientReducer = createReducer<Client>(
  initialState,
  on(ClientActions.updateClient, (state, props): Client => ({ ...state, ...props.client })),
  on(ClientActions.loadVisitDates, (state, props): Client => ({ ...state, data: { ...state.data, visitDates: props.visitDates } })),
  on(ClientActions.loadFrozenVisitDates, (state, props): Client => ({ ...state, data: { ...state.data, frozenVisitDates: props.frozenVisitDates } })),
  on(ClientActions.loadOrders, (state, props): Client => ({ ...state, data: { ...state.data, orders: props.orders } })),
  on(ClientActions.loadSuggestedProducts, (state, props): Client => ({ ...state, data: { ...state.data, suggestedProducts: props.suggestedProducts } })),
  on(ClientActions.loadDiscretionaryDiscount, (state, props): Client => ({ ...state, data: { ...state.data, discounts: props.discounts } })),
  on(ClientActions.loadCredits, (state, props): Client => ({ ...state, data: { ...state.data, credits: props.credits } }))
);

//custom selectors
export const getClientFeatureState = createFeatureSelector<Client>('client');

export const getClientVisitDates = createSelector(getClientFeatureState, (state) => state.data?.visitDates);
export const getClientFrozenVisitDates = createSelector(getClientFeatureState, (state) => state.data?.frozenVisitDates);
