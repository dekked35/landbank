import { Action } from '@ngrx/store';

export const ISLOADING = '[Spendings] IsLoading';
export const ISHIDDEN = '[Spendings] IsHidden';
export const FAILURE = '[Spendings] Failure';
export const SUCCESS = '[Spendings] Success';

export class IsLoadingAction implements Action {
  readonly type = ISLOADING
  constructor (public payload) { }
}

export class SuccessAction implements Action {
  readonly type = SUCCESS
  constructor (public payload) {
    localStorage.setItem('spending', JSON.stringify(payload));
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
