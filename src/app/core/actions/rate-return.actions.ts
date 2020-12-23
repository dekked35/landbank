import { Action } from '@ngrx/store';

export const ISLOADING = '[RateReturn] IsLoading';
export const ISHIDDEN = '[RateReturn] IsHidden';
export const FAILURE = '[RateReturn] Failure';
export const SUCCESS = '[RateReturn] Success';

export class IsLoadingAction implements Action {
  readonly type = ISLOADING
  constructor (public payload) { }
}

export class SuccessAction implements Action {
  readonly type = SUCCESS
  constructor (public payload) {
    localStorage.setItem('rateReturn', JSON.stringify(payload));
  }
}

export class FailureAction implements Action {
  readonly type = FAILURE
  constructor (public payload) {}
}

export type Actions
= IsLoadingAction |
SuccessAction |
FailureAction
