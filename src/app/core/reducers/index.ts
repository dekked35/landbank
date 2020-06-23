import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../../environments/environment';
import * as fromPage from './page.reducer';
import * as fromArea from './area.reducer';
import * as fromProduct from './product.reducer';
import * as fromSpendings from './spendings.reducer';
import * as fromImplicitCosts from './implicit-costs.reducer';
import * as fromProfit from './profit.reducer';
import * as fromRateReturn from './rate-return.reducer';

export interface CoreState {
  page: fromPage.State;
  area: fromArea.State;
  product: fromProduct.State;
  spendings: fromSpendings.State;
  implicitCosts: fromImplicitCosts.State;
  profit: fromProfit.State;
  rateReturn: fromRateReturn.State;
}

export const coreReducers: ActionReducerMap<CoreState> = {
  page: fromPage.reducer,
  area: fromArea.reducer,
  product: fromProduct.reducer,
  spendings: fromSpendings.reducer,
  implicitCosts: fromImplicitCosts.reducer,
  profit: fromProfit.reducer,
  rateReturn: fromRateReturn.reducer
};


export const metaReducers: MetaReducer<CoreState>[] = !environment.production ? [] : [];

export const getPage = (state: CoreState) => state.page

export const getArea = (state: CoreState) => state.area

export const getProduct = (state: CoreState) => state.product

export const getImplicitCosts = (state: CoreState) => state.implicitCosts

export const getSpendings = (state: CoreState) => state.spendings

export const getProfit = (state: CoreState) => state.profit

export const getRateReturn = (state: CoreState) => state.rateReturn

