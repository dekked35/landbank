import { Action, createReducer, on } from '@ngrx/store';

import * as areaAction from '../actions/area.actions';

export const areaFeatureKey = 'area';

export class area {
  totalArea: number
  fenceLength: number
  sellArea: number
  roadSize: number
  greenArea: number
}

export interface State {
  isLoading: boolean
  payload: area;
  error: any;
}

export const initialState: State = {
  isLoading: true,
  payload: {
    totalArea: 0.0,
    fenceLength: 0.0,
    sellArea: 0.0,
    roadSize: 0.0,
    greenArea: 0.0
  },
  error: {}
};


export function reducer(state = initialState, action: areaAction.Actions) {
  switch (action.type) {
    case areaAction.ISLOADING:
        return {
            ...state,
            isLoading: action.payload
    }
    case areaAction.SUCCESS:
      return {
          ...state,
          payload: action.payload
    }
    case areaAction.FAILURE:
      return {
          ...state,
          error: action.payload
    }
    default: {
      return state;
    }
  }
}
