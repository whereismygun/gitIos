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
function getStatData(): ThunkAction {

     return(dispatch,getState) => {

        let conf = {
            url:'queryStatData',
            ignoreLogin:true,
        };
        let onSuccess = (data, dispatch) => {

          dispatch({
            type:'LOADED_ENTER_GET_STAT_DATA',
            statData:data,
          })
            return Promise.resolve(data);
        };
        let onFailure = (error, dispatch) => {
            return Promise.reject(error);
        };

       return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
     }

}

function getListNewp():ThunkAction {
     return (dispatch,getState) => {

     let conf = {
      url:'listNewp',
      ignoreLogin:true
     }
     let onSuccess =(data,dispatch) => {

        dispatch({
          type:'LOADED_ENTER_GET_LIST_NEW_P',
          listdata:data.items[0]
        })

        return Promise.resolve(data);
     }
     let onFailure =(error,dispatch) => {

        return Promise.reject(error);
     }

     return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));

     }



}


function cheackUserIsnew():ThunkAction {

    return (dispatch,getState) => {

     let conf ={
          url:'checkUserNew',
          ignoreLogin:true
     }

     let onSuccess = (data,dispatch) => {
     dispatch({
        type:'LOADED_ENTER_CHECK_USER_IS_NEW',
        isNewPerson:data
     });

        return  Promise.resolve(data);

     }
     let onFailure = (error,dispatch) => {

       return Promise.reject(error);
     }

      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));

    }


}

function loadEnterViewPagerImgs(): ThunkAction {
   return (dispatch,getState) => {
    let params = {
       type:'phone'
    }

      let conf = {
        url:'queryEarnBanners',
        params:params,
        ignoreLogin:true
      }
      let onSuccess = (data,dispatch) => {
           let datalist = data.items
           return dispatch({
             type:'LOADED_ENTER_VIEW_PAGER_IMGS',
             list:datalist
           })

        return Promise.resolve(data);
      }
      let onFailure = (error,dispatch) => {

          return Promise.reject(error);
      }
      return dispatch(NetworkService.fetch(conf,onSuccess,onFailure));
   };
}



module.exports = {
  checkPayPassword,
  getStatData,
  loadEnterViewPagerImgs,
  cheackUserIsnew,
  getListNewp,
};
