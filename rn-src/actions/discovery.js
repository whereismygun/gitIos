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

function activityBanner(limit,offset): ThunkAction {
    return (dispatch, getState) => {

        let conf = {
            url: 'activityBanner',
            params:{
              limit:limit,
              offset:offset
            }
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

function listSysNotice(): ThunkAction {
    return (dispatch, getState) => {
        let conf = {
            url: 'listSysNotice',
            ignoreLogin:true
        };

        let onSuccess = (data, dispatch) => {

            let list = data.items;
            return dispatch({
              type: "LOADED_NOTICE_INFO",
              list: list
          })
        };

        let onFailure = (err, dispatch) => {

        };
        return dispatch(NetworkService.fetch(conf, onSuccess, onFailure));
    };
}


module.exports = {
  checkPayPassword,
  activityBanner,
  listSysNotice
};
