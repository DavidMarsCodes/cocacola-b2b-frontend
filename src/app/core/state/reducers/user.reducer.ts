import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { Constants } from '../../constants/constants';
import { UserInfo } from '../../models/user-info.model';
import * as UserActions from '../actions/user.actions';

const getUserState = createFeatureSelector<UserInfo>('user');

export const getHomeStyle = createSelector(getUserState, (user) => {
  let currentCountry = Constants.countries.find((country) => country.key === user.countryId);
  return currentCountry?.homeStyle;
});

export const isAuthenticated = createSelector(getUserState, (user) => {
  return user && user.jwt && user.userId;
});

export const getUserClients = createSelector(getUserState, (state) => state.clients);
export const getUserUuid = createSelector(getUserState, (state) => state.uuid);

const initialState: UserInfo = {
  uuid: '',
};

export const userReducer = createReducer<UserInfo>(
  initialState,
  on(UserActions.loadUser, (state, props): UserInfo => ({ ...state, ...props.user })),
  on(UserActions.loadJwt, (state, props): UserInfo => ({ ...state, jwt: props.jwt })),
  on(UserActions.loadUuid, (state, props): UserInfo => ({ ...state, uuid: props.uuid }))
);
