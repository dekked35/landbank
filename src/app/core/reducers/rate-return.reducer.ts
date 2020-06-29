import { Action, createReducer, on } from '@ngrx/store';

import * as rateRetrunAction from '../actions/rate-return.actions';
export const rateReturnFeatureKey = 'rateReturn';
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

export function reducer(state = initialState, action: rateRetrunAction.Actions) {
  switch (action.type) {
    case rateRetrunAction.ISLOADING:
      return {
        ...state,
        isLoading: action.payload
      }
    case rateRetrunAction.SUCCESS:
      return {
        ...state,
        payload: action.payload
      }
    case rateRetrunAction.FAILURE:
      return {
        ...state,
        error: action.payload
      }
    default: {
      return state;
    }
  }
}
