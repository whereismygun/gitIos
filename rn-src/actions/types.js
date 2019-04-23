/**
 *
 *
 * @flow
 *
 */

'use strict';

export type Action =


  //TTL

  //profile

  { type:'MSG_INFO_COUNT',data:number}
  | { type:'LOADED_ENTER_CHECK_USER_IS_NEW',newUser:boolean}
  | { type:'LOADED_ENTER_GET_STAT_DATA',statData:Object}
  | { tyoe:'LOADED_ENTER_GET_LIST_NEW_P',listdata:Object}
  // login
  |  { type: 'LOGIN', username: string, otherInfo: Object, __ifo: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOGIN_STATUS', isLoggedIn: boolean }
  | { type: 'GET_USER_INFO', data: Object }
  | { type: 'GET_BINDING', data: Object }
  | { type: 'MSG_COUNT', data: number }


  | { type: 'SWITCH_TAB', tab: string, tabProps: Object }
  | { type: 'SKIP_INTRO' }


;


export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
