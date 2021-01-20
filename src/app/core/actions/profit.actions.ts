import { Action } from '@ngrx/store';

export const ISLOADING = '[Profit] IsLoading';
export const ISHIDDEN = '[Profit] IsHidden';
export const FAILURE = '[Profit] Failure';
export const SUCCESS = '[Profit] Success';

export class IsLoadingAction implements Action {
  readonly type = ISLOADING
  constructor (public payload) { }
}

export class SuccessAction implements Action {
  readonly type = SUCCESS
  constructor (public payload) {
    localStorage.setItem('profit', JSON.stringify(payload));
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
