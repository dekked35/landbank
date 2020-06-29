import { Action, createReducer, on } from '@ngrx/store';
import * as productAction from '../actions/product.actions';

export const productFeatureKey = 'product';

export interface State {
  isLoading: boolean
  payload: any;
  triggerRooms: boolean;
  error: any;
}

export const initialState: State = {
  isLoading: true,
  payload: { competitor: { products: []}, user : { products: []}},
  triggerRooms: false, // use for hotel
  error: {}
};

export function reducer(state = initialState, action: productAction.Actions) {
  switch (action.type) {
    case productAction.ISLOADING:
      return {
        ...state,
        isLoading: action.payload
      }
    case productAction.SUCCESS:
      return {
        ...state,
        payload: action.payload
      }
    case productAction.FAILURE:
      return {
        ...state,
        error: action.payload
      }
    case productAction.TRIGGERROOM:
      return {
        ...state,
        triggerRooms: action.payload
      }
    default: {
      return state;
    }
  }
}
