/**
 *
 *
 * @flow
 *
 */

'use strict';

import React from 'react';
import { Platform } from 'react-native';

import type { Action, ThunkAction } from './types';

const NetworkService = require('NetworkService');

const env = require('env');


function login(username, password,loginParams): ThunkAction {

  return (dispatch, getState) => {

    var otherInfo = {
      device_type: Platform.OS,
      device_token: '',
      unique_device_id: '',
      tongdun_token: '',
      location: {},
      info: {},
      channel:'',
      ...loginParams
    };
    // login提交参数
    var params = {
      username: username,
      password: password,
      source: Platform.OS,
      channel:otherInfo.channel,
      device_type: otherInfo.device_type,
      device_token: otherInfo.device_token,
      info: JSON.stringify(otherInfo.info),
    };

    let conf = {
      url: 'login',
      ignoreLogin: true,
      method: 'POST',
      isForm: true,
      params: params,
    };

    let onSuccess = (data, dispatch) => {
      dispatch({
        type: "LOGIN",
        username,
        // __ifo: data.ifo
      });
      return Promise.resolve(data);
    };

    let onFailure = (error, dispatch) => {
      return Promise.reject(error);
    };

    return dispatch(NetworkService.fetch(conf, onSuccess, onFailure));
  }
}

function registeredAgreement(params):ThunkAction {
       return (dispatch,getState) => {
         let conf = {
           url:'registeredAgreement',
           params:params,
           ignoreLogin:true
         }
         let onSuccess = (data,dispatch) => {
           return Promise.resolve(data)
         }
         let onFailure = (error,dispatch) => {
           return Promise.reject(err)
         }
         return dispatch(NetworkService.fetch(conf, onSuccess, onFailure));
     }

}

function getDelegateInfo():ThunkAction {
     return (dispatch,getState) => {

         let conf = {
           url:'getUserInfo',
         }
         let onSuccess = (data,dispatch) => {
           return Promise.resolve(data)
         }
         let onFailure = (error,dispatch) => {
           return Promise.reject(err)
         }
         return dispatch(NetworkService.fetch(conf, onSuccess, onFailure));
     }

}

function getUserInfo(ignoreLogin): ThunkAction {
  return (dispatch, getState) => {

    let conf = {
      url: 'getUserInfo',
      ignoreLogin: ignoreLogin,
    };

    let onSuccess = (data, dispatch) => {
      dispatch({
        type: "GET_USER_INFO",
        data,
      });
    };

    let onFailure = (error, dispatch) => {
      dispatch({
        type: "GET_USER_INFO",
        data: null,
      });
    };

    return dispatch(NetworkService.fetch(conf, onSuccess, onFailure));
  }
}

function getBinding(ignoreLogin): ThunkAction {
  return (dispatch, getState) => {

    let conf = {
      url: 'getBinding',
      ignoreLogin: ignoreLogin,
    };

    let onSuccess = (data, dispatch) => {
      dispatch({
        type: "GET_BINDING",
        data,
      });
         return Promise.resolve(data)
    };

    let onFailure = (error, dispatch) => {
      dispatch({
        type: "GET_BINDING",
        data: null,
      });
         return Promise.reject(error)

    };

    return dispatch(NetworkService.fetch(conf, onSuccess, onFailure));
  }
}

function setLoginState(isLoggedIn): Action {
  return {
    type: 'SET_LOGIN_STATUS',
    isLoggedIn,
  };
}

function getMsgCount(): ThunkAction {
  return (dispatch, getState) => {

    let conf = {
      url: 'countUnReadMessage',
      ignoreLogin: true,
    };

    let onSuccess = (data, dispatch) => {
      dispatch({
        type: "MSG_COUNT",
        data: data,
      });
    };

    let onFailure = (error, dispatch) => {
      dispatch({
        type: "MSG_COUNT",
        data: 0,
      });
    };

    return dispatch(NetworkService.fetch(conf, onSuccess, onFailure));
  }
}

function selectBankInfo(data):Action{
       return ({type:'SELECT_BANK_INFO',selectInfo:data})
}

function logout() : ThunkAction {

    return(dispatch, getState) => {

        let conf = {
            url: 'logout',
            ignoreLogin: true,
        };

        let onSuccess = (data, dispatch) => {
            dispatch({type: "LOGOUT"});
            return Promise.resolve(data);
        };

        let onFailure = (error, dispatch) => {
            return Promise.reject(error);
        };

        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure));
    }
}


function checkUserRegister(phoneNum,device): ThunkAction {

    return (dispatch, getState) => {
        let conf = {
            url: 'checkUserRegister',
            ignoreLogin: true,
            method: 'POST',
            isForm:true,
            params: {
                phone: phoneNum,
                device:device
            }
        };

        let onSuccess = (data, dispatch) => {
            return Promise.resolve(data);
        };

        let onFailure = (error, dispatch) => {
          // alert(error)
            return Promise.reject(error);
        };

        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure));
    }
}


function sendAuthCode(params): ThunkAction {

    return (dispatch, getState) => {
      let conf = {
            url: 'sendAuthCode',
            ignoreLogin: true,
            method: 'POST',
            isForm:true,
            params: {
                phone: params.phone,
                signature:params.signature,
                timestamp:params.timestamp,
            }
        };
        let onSuccess = (data, dispatch) => {
            return Promise.resolve(data);
        };

        let onFailure = (error, dispatch) => {
            return Promise.reject(error);
        };

        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure));
    }
}

function findPasswordCode(phone): ThunkAction {

    return (dispatch, getState) => {
      let conf = {
            url: 'findPasswordCode',
            ignoreLogin: true,
            method: 'POST',
            isForm:true,
            params: {
                loginId: phone,
                source:Platform.OS,
            }
        };
        let onSuccess = (data, dispatch) => {
            return Promise.resolve(data);
        };

        let onFailure = (error, dispatch) => {
            return Promise.reject(error);
        };

        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure));
    }
}

function validateAuthCode(authCode,phone): ThunkAction {

    return (dispatch, getState) => {
      let conf = {
            url: 'validateAuthCode',
            ignoreLogin: true,
            params: {
                authCode: authCode,
                phone:phone,
            }
        };
        let onSuccess = (data, dispatch) => {
            return Promise.resolve(data);
        };

        let onFailure = (error, dispatch) => {
            return Promise.reject(error);
        };

        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure));
    }
}

function resetLoginPassword(loginId,newPassword,newRepassword): ThunkAction {

    return (dispatch, getState) => {
      let conf = {
            url: 'resetLoginPassword',
            ignoreLogin: true,
            method:'POST',
            isForm:true,
            params: {
                loginId:loginId,
                newPassword: newPassword,
                newRepassword:newRepassword,
            }
        };
        let onSuccess = (data, dispatch) => {
            return Promise.resolve(data);
        };

        let onFailure = (error, dispatch) => {
            return Promise.reject(error);
        };

        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure));
    }
}


function setPassword(param,loginParams): ThunkAction {

    return (dispatch, getState) => {

      var otherInfo = {
        device_type: Platform.OS,
        device_token: '',
        unique_device_id: '',
        tongdun_token: '',
        location: {},
        info: {},
        channel:'',
        ...loginParams
      };
      // login提交参数
      var params = {
        phone: param.phone,
        password: param.password,
        rePassword:param.rePassword,
        spreadCode:param.spreadCode,
        source: Platform.OS,
        channel:otherInfo.channel,
        device_type: otherInfo.device_type,
        device_token: otherInfo.device_token,
        info: JSON.stringify(otherInfo.info),
      };

      let conf = {
            url: 'setPassword',
            ignoreLogin: true,
            method:'POST',
            isForm:true,
            params:params,
        };
        let onSuccess = (data, dispatch) => {
            return Promise.resolve(data);
        };

        let onFailure = (error, dispatch) => {
            return Promise.reject(error);
        };

        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure));
    }
}


function checkFetchRequire() : ThunkAction {
    return(dispatch, getState) => {
        let conf = {
            url: 'checkFetchRequire'
        };

        let onSuccess = (data, dispatch) => {
            return dispatch({type: "CHECK_FETCH_REQUIRE", data: data})
        };

        let onFailure = (error, dispatch) => {
            // Utils.error('加载失败，请检查网络连接');
        };

        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure))

    };
}

function isContactsUploadSuccess(data) : Action {
    return ({type: 'IS_CONTACTS_UPLOAD_SUCCESS', isContactsUploadSuccess:data})
};


function findUserStatus(ignoreLogin):ThunkAction{

   return (dispatch,getState) => {
      let conf = {
            url:'findUserStatus', 
            ignoreLogin:ignoreLogin,           
      }
      let onSuccess = (data,dispatch) => {
        
         dispatch({
            type:'GET_USER_STATUS',
            userStatus:data,
         })
        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {
         return Promise.reject(error);
      }
      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
   }

}



module.exports = {
  checkUserRegister,
  registeredAgreement,
  login,
  setLoginState,
  getUserInfo,
  getBinding,
  getMsgCount,
  logout,
  sendAuthCode,
  findPasswordCode,
  validateAuthCode,
  resetLoginPassword,
  setPassword,
  getDelegateInfo,
  selectBankInfo,
  checkFetchRequire,
  isContactsUploadSuccess,
  findUserStatus
};
