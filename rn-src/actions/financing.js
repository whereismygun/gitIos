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

var Utils = require('Utils');
var NetworkService = require('NetworkService');

function checkPayPassword(): ThunkAction {
    return (dispatch, getState) => {

        let conf = {
            url: 'isPayPasswordSet',
        };

        let onSuccess = (data, dispatch) => {
            return Promise.resolve(data);
        };

        let onFailure = (error, dispatch) => {
            return Promise.reject(error)
        };

        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure))

    };
}

// 查询理财产品
function borrowUnderlyNewList():ThunkAction{
  return (dispatch,getState) => {
    let conf = {
      url:'borrowUnderlyNew',
      ignoreLogin:true,
    };

    let onSuccess = (data,dispatch) => {
      let items = data.items;
      return dispatch({type: "BORROW_UNDERLY_NEW_LIST",items});
    };

    let onFailure = (error,dispatch) => {

    };
    return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
  };
}

// 往期标的 —— 已还款
function getInvestPurchase():ThunkAction{
  return (dispatch,getState) => {
    let conf = {
      url:'listInvestPurchase',
      ignoreLogin: true
    };
    let onSuccess = (data,dispatch) => {
      let items = data.items;
      return dispatch({type: "INVEST_PURCHASE_LIST",items});
    };
    let onFailure = (error,dispatch) => {
    };
    return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
  };
}

// 往期标的 —— 还款中
function getReceivePurchase():ThunkAction{
  return (dispatch,getState) => {
    let conf = {
      url:'listReceivePurchase',
      ignoreLogin: true
    };
    let onSuccess = (data,dispatch) => {
      let items = data.items;
      return dispatch({type: "RECEIVE_PURCHASE_LIST",items});
            // return Promise.resolve(data);
    };
    let onFailure = (error,dispatch) => {
      // return Promise.reject(error);
    };
    return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
  };
}

// 查询单个理财标信息
function checkBasicInfo(brId,ignoreLogin):ThunkAction{
  return (dispatch,getState) => {
    let conf = {
      url:'basicInfo',
      params:{
        brId:brId,
      },
      ignoreLogin:ignoreLogin
    };
    let onSuccess = (data,dispatch) => {
      return Promise.resolve(data);
    };
    let onFailure = (error,dispatch) => {
      return Promise.reject(error);
    };
    return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
  };
}


// 项目简介
function getMaterial(brId):ThunkAction{
  return (dispatch,getState) => {
    let conf = {
      url:'materialRelative',
      params:{
        brId:brId,
      },
      ignoreLogin:true
    };
    let onSuccess = (data,dispatch) => {
      return Promise.resolve(data);
    };
    let onFailure = (error,dispatch) => {
      return Promise.reject(error);
    };
    return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
  };
}

// 本息保障协议  && 投资协议
function getXieYi(params,ignoreLogin):ThunkAction{
  return (dispatch,getState) => {
    let conf = {
      url:'getXieYi',
      params:params,
      ignoreLogin:ignoreLogin,
    };
    let onSuccess = (data,dispatch) => {
      return Promise.resolve(data);
    };
    let onFailure = (error,dispatch) => {
      return Promise.reject(error);
    };
    return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
  };
}

// 还款计划
function getListSchedule(brId):ThunkAction{
  return (dispatch,getState) => {
    let conf = {
      url:'listSchedule',
      params:{
        brId:brId,
      }
    };
    let onSuccess = (data,dispatch) => {
      return Promise.resolve(data);
    };
    let onFailure = (error,dispatch) => {
      return Promise.reject(error);
    };
    return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
  };
}

// 收益计算器
function calculateProfit(id,amount){
  return (dispatch,getState) => {
    let conf = {
      url:'calculateProfit',
      ignoreLogin:true,
      params:{
        brId:id,
        amount:amount
      }
    };
    let onSuccess = (data,dispatch) => {
      return Promise.resolve(data);
    };
    let onFailure = (error,dispatch) => {
      return Promise.reject(error);
    };
    return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
  }
}


function queryUserInvestmentByUnderlyId(id,limit,offset):ThunkAction{
  return (dispatch,getState) => {
  let conf = {
    url:'queryUserInvestmentByUnderlyId',
    ignoreLogin:true,
    params:{
      brId:id,
      limit:limit,  //limit
      offset:offset       //offset
    }
  };
  let onSuccess = (data,dispatch) => {
    return Promise.resolve(data);
  };
  let onFailure = (error,dispatch) => {
    return Promise.reject(error);
  };
  return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
  };
}

// 购买标的页面
//查询用户可买标的最大额度,剩余可买额度
function queryUserRemainAmount(id):ThunkAction{
  return (dispatch,getState) => {
  let conf = {
    url:'queryUserRemainAmount',
    params:{
      brId: id
    }
  };
  let onSuccess = (data,dispatch) => {
    return Promise.resolve(data);
  };
  let onFailure = (error,dispatch) => {
    return Promise.reject(error);
  };
  return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
  };
}

function getBrUndlyUserBonusList(params):ThunkAction{

  return (dispatch,getState) => {

    let conf = {
      url:'getBrUndlyUserBonusList',
      params:params
    }

  let onSuccess = (data,dispatch) => {
    return Promise.resolve(data);
  };
  let onFailure = (error,dispatch) => {
    return Promise.reject(error);
  };
  return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
};

}

// 输入购买金额实时查询返券面额
function getBrUndlyUserCouponList(params):ThunkAction{
  return (dispatch,getState) => {
    let conf = {
      url:'getBrUndlyUserCouponList',
      // ignoreLogin:true,
      // method:'POST',
      // isForm: true,
      params:params
    };
    let onSuccess = (data,dispatch) => {
      return Promise.resolve(data);
    };
    let onFailure = (error,dispatch) => {
      return Promise.reject(error);
    };
    return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
  };
}

function buyTender(params):ThunkAction{
  return (dispatch,getState) => {
    let conf = {
      url:'buyTender',
      method:'POST',
      isForm: true,
      params:params
    };
    let onSuccess = (data,dispatch) => {
      return Promise.resolve(data);
    };
    let onFailure = (error,dispatch) => {
      return Promise.reject(error);
    };
    return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
  };
}

  
module.exports = {
  checkPayPassword,
  borrowUnderlyNewList,
  getInvestPurchase,
  getReceivePurchase,
  checkBasicInfo,
  getMaterial,
  getXieYi,
  getListSchedule,
  getBrUndlyUserCouponList,
  getBrUndlyUserBonusList,
  queryUserInvestmentByUnderlyId,
  queryUserRemainAmount,
  calculateProfit,
  buyTender
};
