import { Action, createReducer, on } from '@ngrx/store';
import * as implicitCostsAction from '../actions/implicit-costs.actions';

export const implicitCostsFeatureKey = 'implicitCosts';

export const profitFeatureKey = 'profit';
export interface State {
  isLoading: boolean,
  payload: any,
  error: any
}

export const initialState: State = {
  isLoading: true,
  payload: {},
  error: {}
};

export function reducer(state = initialState, action: implicitCostsAction.Actions) {
  switch (action.type) {
    case implicitCostsAction.ISLOADING:
      return {
        ...state,
        isLoading: action.payload
      }
    case implicitCostsAction.SUCCESS:
      return {
        ...state,
        payload: action.payload
      }
    case implicitCostsAction.FAILURE:
      return {
        ...state,
        error: action.payload
      }
    default: {
      return state;
    }
  }
}