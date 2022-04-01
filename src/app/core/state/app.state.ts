import { ActionReducer, ActionReducerMap, INIT, MetaReducer } from '@ngrx/store';
import { Cart } from '../models/cart.model';
import { UserInfo } from '../models/user-info.model';
import { userReducer } from './reducers/user.reducer';
import { cartReducer } from './reducers/cart.reducer';
import { userLocalReducer } from './reducers/user-local.reducer';
import { clientReducer } from './reducers/client.reducer';
import { localStorageSync } from 'ngrx-store-localstorage';
import { Client } from '../models/client.model';
import { UserLocal } from '../models/user-local.model';
import * as UserActions from './actions/user.actions';

interface AppState {
  cart: Cart;
  user: UserInfo;
  userLocal: UserLocal;
  client: Client;
}

export const reducers: ActionReducerMap<AppState> = {
  user: userReducer,
  userLocal: userLocalReducer,
  cart: cartReducer,
  client: clientReducer,
};

function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({ keys: ['user', 'cart', 'client', 'userLocal'], rehydrate: true })(reducer);
}

export function logout(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    if (action != null && action.type === UserActions.logout.type) {
      return reducer({ undefined, userLocal: state.userLocal }, { type: INIT });
    }
    return reducer(state, action);
  };
}

export const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer, logout];
