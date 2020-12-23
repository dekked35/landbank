import { Action } from '@ngrx/store';


export const ISLOADING = '[Product] IsLoading';
export const ISHIDDEN = '[Product] IsHidden';
export const FAILURE = '[Product] Failure';
export const SUCCESS = '[Product] Success';
export const TRIGGERROOM = '[Product] Trigger Room';

export class IsLoadingAction implements Action {
  readonly type = ISLOADING
  constructor (public payload) { }
}

export class SuccessAction implements Action {
  readonly type = SUCCESS
  constructor (public payload) {
    localStorage.setItem('product', JSON.stringify(payload));
  }
}

export class TriggerRoomAction implements Action {
  readonly type = TRIGGERROOM
  constructor (public payload) { }
}

export class FailureAction implements Action {
  readonly type = FAILURE
  constructor (public payload) {}
}

export type Actions
= IsLoadingAction |
SuccessAction |
FailureAction |
TriggerRoomAction
