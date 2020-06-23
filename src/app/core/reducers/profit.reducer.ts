import { Action, createReducer, on } from '@ngrx/store';

import * as profitAction from '../actions/profit.actions';
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

export function reducer(state = initialState, action: profitAction.Actions) {
  switch (action.type) {
    case profitAction.ISLOADING:
      return {
        ...state,
        isLoading: action.payload
      }
    case profitAction.SUCCESS:
      return {
        ...state,
        payload: action.payload
      }
    case profitAction.FAILURE:
      return {
        ...state,
        error: action.payload
      }
    default: {
      return state;
    }
  }
}
