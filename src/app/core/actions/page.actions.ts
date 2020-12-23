import { Action, createAction, props } from '@ngrx/store';

export const PAGE = '[Page] Page Selected'

export class PageAction implements Action {
  readonly type = PAGE
  constructor (public payload) {
    localStorage.setItem('page',payload)
   }

}

export type Actions
= PageAction
