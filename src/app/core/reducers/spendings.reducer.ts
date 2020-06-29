import { Action, createReducer, on } from '@ngrx/store';
import * as spendingsAction from '../actions/spendings.actions'

export const spendingsFeatureKey = 'spendings';

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

export function reducer(state = initialState, action: spendingsAction.Actions) {
  switch (action.type) {
    case spendingsAction.ISLOADING:
      return {
        ...state,
        isLoading: action.payload
      }
    case spendingsAction.SUCCESS:
      return {
        ...state,
        payload: action.payload
      }
    case spendingsAction.FAILURE:
      return {
        ...state,
        error: action.payload
      }
    default: {
      return state;
    }
  }
}
