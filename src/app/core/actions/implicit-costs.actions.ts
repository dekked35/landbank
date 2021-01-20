import { Action } from '@ngrx/store';

export const ISLOADING = '[ImplicitCosts] IsLoading';
export const ISHIDDEN = '[ImplicitCosts] IsHidden';
export const FAILURE = '[ImplicitCosts] Failure';
export const SUCCESS = '[ImplicitCosts] Success';

export class IsLoadingAction implements Action {
  readonly type = ISLOADING
  constructor (public payload) { }
}

export class SuccessAction implements Action {
  readonly type = SUCCESS
  constructor (public payload) {
    localStorage.setItem('implicit', JSON.stringify(payload));
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
