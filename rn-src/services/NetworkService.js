/**
 *
 *
 * @providesModule NetworkService
 * @flow
 *
 */
'use strict';

import React from 'react';
import { StyleSheet, Navigator , DeviceEventEmitter} from 'react-native';

const UrlHelper = require('UrlHelper');
const Utils = require('Utils');
const env = require('env');
const SceneUtils = require('SceneUtils');

export type RequestConf = {
  url: string;        // url
  trueUrl: string;    // 真实url
  external: boolean;  // 是否外边url
  params?: Object;    // 参数
  method?: string;    // 请求方法
  isForm?: boolean;   // 是否form方式
  ignoreLogin?: boolean;    // 是否忽略登录
};

const DEFAULT_REQUEST_CONF = {
  url: "",
  trueUrl: null,
  external: false,
  params: null,
  method: "GET",
  isForm: false,
  ignoreLogin: false,
};

var NetworkService = {
  fetch: function (conf: RequestConf, onSuccess, onFailure) {

    if (!conf) {
      conf = {};
    }

    conf = {...DEFAULT_REQUEST_CONF, ...conf};

    // let url = UrlHelper.getUrl(conf.url);
    let url = conf.trueUrl ? conf.trueUrl : UrlHelper.getUrl(conf.url);
    let method = (conf.method || 'GET').toUpperCase();

    let options = {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }

    };

    // 对于Form方式
    if (method === 'POST') {
      if (conf.isForm) {
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        if (conf.params) {
          options.body = Utils.toQueryString(conf.params);
        }
      } else {
        if (conf.params) {
          options.body = JSON.stringify(conf.params);
        }
      }
    } else if (method === 'GET') {
      if (conf.params) {
        url = Utils.getUrlWithParams(url, conf.params);
      }
    }

    return dispatch => {

      function status(response) {

        if (response.status >= 200 && response.status < 300) {
          return Promise.resolve(response)
        } else {
          return Promise.reject({
            code: response.status,
            msg: response.statusText,
          })
        }
      }

      function setLoginState(json) {
        if (!conf.ignoreLogin && json) {
          if (json.code === 401 || !json.login) {
            // 未登录
            dispatch({
              type: "SET_LOGIN_STATUS",
              isLoggedIn: false,
            });
          } else {
            // 登录
            dispatch({
              type: "SET_LOGIN_STATUS",
              isLoggedIn: true,
            });
          }
        }
      }

      return fetch(url, options)
        .then(status)
        .then(response => response.json())
        .then(json => {

          // 如果是真实url，不进行处理
          if (conf.external) {
            if (onSuccess) {
              return onSuccess(json, dispatch);
            }
            return;
          }

          // login state
          setLoginState(json);

          // 是否忽略登录
          if (!conf.ignoreLogin && json && (json.code === 401 || !json.login)) {
            DeviceEventEmitter.emit(env.ListenerMap['LOGIN_MODAL']);
            return Promise.reject(json);
          } else if (json && json.code === 200) {
       //     console.log("请求网络成功：");
        //    console.log(url);
         //   console.log(options);
         //   console.log(json);
            if (onSuccess) {
              return onSuccess(json.data, dispatch);
            }
          } else {
            return Promise.reject(json);
          }
        })
        .catch(error => {
      //    console.log("请求网络失败：");
       //   console.log(url);
        //  console.log(options);
        //  console.log(error);
          if (onFailure) {
            return onFailure(error, dispatch);
          }
        });
    }
  }
};

module.exports = NetworkService;
