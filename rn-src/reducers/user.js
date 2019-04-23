/**
 *
 *
 * @flow
 *
 */

'use strict';

import type { Action } from '../actions/types';

export type State = {
  username: ?string;
  isLoggedIn: boolean;
  userInfo: Object;
  buildingInfo:Object;
  msgCount: number;
  checkFetchRequireInfo: Object;
  otherInfo: Object; //app_name,device_type,device_token,unique_device_id,tongdun_token,location,info
  isContactsUploadSuccess: boolean;
  selectBankInfo:Object;
  status:Object;

};

const initialState = {
  username: null,
  isLoggedIn: false,
  userInfo: null,
  msgCount: 0,
  checkFetchRequireInfo: {},
  otherInfo: null,
  __ifo: null,
  isContactsUploadSuccess: false,
  selectBankInfo:null,
  status:null,

};

function user(state: State = initialState, action: Action): State {

  if (action.type === 'LOGIN') {
    return {
      ...state,
      ...initialState,
      username: action.username,
      otherInfo: action.otherInfo,
      __ifo: action.__ifo,
      isLoggedIn: true,
      selectBankInfo:action.selectInfo,
      status:action.userStatus,
    };
  } else if (action.type === 'LOGOUT') {
    return {
      ...state,
      isLoggedIn: false,
      userInfo: null,
      buildingInfo:null,
      msgCount: 0,
      checkFetchRequireInfo: {},
      isContactsUploadSuccess: false,
      selectBankInfo:null,
      status:null,
    };
  } else if (action.type === 'SET_LOGIN_STATUS') {
    return {...state, isLoggedIn: action.isLoggedIn};
  } else if (action.type === 'GET_USER_INFO') {
    return {...state, userInfo: action.data};
  } else if (action.type === 'GET_BINDING') {
    return {...state, buildingInfo: action.data.items};
  } else if (action.type === 'MSG_COUNT') {
    return {...state, msgCount: action.data};
  } else if (action.type === 'CHECK_FETCH_REQUIRE') {
    return {...state, checkFetchRequireInfo: action.data};
  }else if (action.type === 'IS_CONTACTS_UPLOAD_SUCCESS') {
    return {...state, isContactsUploadSuccess: action.isContactsUploadSuccess};
  }else if (action.type === 'SELECT_BANK_INFO'){
    return {...state,selectBankInfo:action.selectInfo};
  }else if (action.type === 'GET_USER_STATUS')
    return {...state,userStatus:action.userStatus}

  return state;
}

module.exports = user;
