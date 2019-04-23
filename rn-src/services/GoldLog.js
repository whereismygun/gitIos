/**
 *
 *
 * @providesModule GoldLog
 * @flow
 *
 */
'use strict';

import React, { Platform } from "react-native";
import { Dimensions } from 'react-native';

import {
   getSystemVersion,
} from 'fly-react-native-device-info';

import {
  beginLogPageView,
  endLogPageView,
}
from 'fly-react-native-umeng';

const NativeModuleUtils = require('NativeModuleUtils');
const _ = require('lodash');
const Utils = require('Utils');

const dim = Dimensions.get('window');

const Version = "0.0.1";
const GoldLogUrl = "https://stat.007fenqi.com/spmdot.do";

const DownCdnUrlPrefix = "https://down-cdn.007fenqi.com/app/rn/";

const s_goldlog = "goldlog";
const s_plain_obj = "::-plain-::";

const isIOS = (Platform.OS === "ios");
const isAndroid = (Platform.OS === "android");

let dt = null;
let udi = null;
let binfo = null;
let naVer = null;
let osVer = getSystemVersion();

function getValueFromArr(arr, name) {
  let _name,
      _value;
  for (let i = 0; i < arr.length; i++) {
      _name = arr[i][0];
      _value = arr[i][1];
      if (_name === name || (_.startsWith(_name, s_plain_obj) && _value === name)) {
        return encodeURIComponent(_value)
      }
  }
  return null;
}

function arr2param(arr) {
  let name,
      value,
      newArr = [];
  for (let i = 0; i < arr.length; i++) {
      name = arr[i][0];
      value = arr[i][1];
      newArr.push(_.startsWith(name, s_plain_obj) ? value : name + "=" + encodeURIComponent(value));
  }
  return newArr.join("&");
}

function obj2param(obj) {
  let name,
      value,
      newArr = [];
  for (name in obj) {
      obj.hasOwnProperty(name) && (value = "" + obj[name], newArr.push(_.startsWith(name, s_plain_obj) ? value : name + "=" + encodeURIComponent(value)));
  }
  return newArr.join("&");
}

function mkPlainKey() {
  return s_plain_obj + Math.random();
}

function ifAdd(arr, addArr) {
   if (addArr) {
    let param,
        name,
        value;
    for (let i = 0; i < addArr.length; i++) {
        param = addArr[i];
        name = param[0];
        value = param[1];
        value!==undefined && value!==null && arr.push([name, value]);
    }
  }
}


// 参数说明：
// type: 枚举 page, event, error
// title: 页面标题
// size: 页面尺寸
// url: 页面url
// log-type: 1-不在iframe中，0-在iframe中
// version: 打点程序版本号
// appName: app名称
// appChannel: app渠道
//
// spm: 页面标识, eg:[站点 id].[页面 id]
// spm-url: url中页面标识
// nick: 部分cookie信息, [llq_uid;llq_tid;llq_fg]
// ios: 是否ios，0/1
// android: 是否android，0/1
// os-ver: 操作系统版本
//
// dt: DEVICE_TOKEN
// udi: UNIQUE_DEVICE_ID
// [del]tt: TONGDUN_TOKEN
// c-ver: 内容版本号
// a-ver: APP版本号
// na-ver: 当前最新APP版本号
const GoldLog = {
  isInit: false,
  lastPageName: null,
  init: (fn) => {
    if (GoldLog.isInit) {
      fn();
      return;
    }
    let dtPromise = new Promise((resolve) => {
      NativeModuleUtils.getDeviceToken((data) => {
        dt = data;
        resolve();
      });
    });
    let udiPromise = new Promise((resolve) => {
      NativeModuleUtils.getUDID((data) => {
        udi = data;
        resolve();
      });
    });
    let binfoPromise = new Promise((resolve) => {
      NativeModuleUtils.getBundleInfo((bundleInfo) => {
        binfo = bundleInfo;
        let url = DownCdnUrlPrefix + binfo.appName + "/latest.json";
        fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        })
        .then((response) => {
            if (response.status == 200) {
              return Promise.resolve(response)
            }
        })
        .then(response => response.json())
        .then(json => {
          naVer = json?json[Platform.OS]:null;
          resolve();
        });
      });
    });
    Promise
      .all([dtPromise, udiPromise])
      .then(()=>{
        GoldLog.isInit = true;
        fn();
      });
  },
  send: (url, param) => {
    let conn = -1 == url.indexOf("?") ? "?" : "&";
    let paramStr = param ? _.isArray(param) ? arr2param(param) : obj2param(param) : "";
    let newUrl = paramStr ?  url + conn + paramStr : url;
    fetch(newUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
  },
  umeng: (pageName) => {
    if (GoldLog.lastPageName) {
      endLogPageView(GoldLog.lastPageName);
    }
   
    if (pageName) {
      beginLogPageView(pageName);
      GoldLog.lastPageName = pageName;
    }
  },
  sendPV: (param) => {
     GoldLog.init(() => {
      let _param = null;
      _param = [
        [
          "size",
          dim.width+"x"+dim.height
        ],
        [
          "type",
          "page"
        ],
        [
          "version",
          Version
        ],
        [
          "appName",
          binfo?binfo.appName:""
        ],
        [
          "appChannel",
          binfo?binfo.appChannel:""
        ],
        [
          "ios",
          isIOS?1:0
        ],
        [
          "android",
          isAndroid?1:0
        ],
        [
          "os-ver",
          osVer
        ],
        [
          "dt",
          dt?dt:""
        ],
        [
          "udi",
          udi?udi:""
        ],
        [
          "c-ver",
          binfo?binfo.bundleVersion:""
        ],
        [
          "a-ver",
          binfo?binfo.packageVersion:""
        ],
        [
          "na-ver",
          naVer?naVer.v:""
        ]
      ];
      ifAdd(_param, param);
      GoldLog.umeng(getValueFromArr(param, "spm"));
      GoldLog.send(GoldLogUrl, _param);
    });
  }
};

module.exports = GoldLog;
