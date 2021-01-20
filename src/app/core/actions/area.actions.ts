import { Action } from '@ngrx/store';

export const ISLOADING = '[Area] IsLoading';
export const ISHIDDEN = '[Area] IsHidden';
export const FAILURE = '[Area] Failure';
export const SUCCESS = '[Area] Success';

export class IsLoadingAction implements Action {
  readonly type = ISLOADING
  constructor (public payload) { }
}

export class SuccessAction implements Action {
  readonly type = SUCCESS
  constructor (public payload) {
    localStorage.setItem('area', JSON.stringify(payload));
  }
}

export class FailureAction implements Action {
  readonly type = FAILURE
  constructor (public payload) { }
}

export type Actions
= IsLoadingAction |
SuccessAction |
FailureAction
