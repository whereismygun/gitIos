/**
 *
 *
 * @providesModule Utils
 * @flow
 *
 */

'use strict';

import {
  Platform,
  Alert,
  Navigator
}
from 'react-native';


const moment = require('moment');
const _ = require('lodash');

const Utils = {

  info: (title, msg, cb, btnText) => {
    btnText = btnText || '关闭';
    Alert.alert(
      title,
      msg, [
        {
          text: btnText,
          onPress: () => {
            cb && cb();
          }
        },
        ]
    );
  },

  alert: (msg, cb, btnText) => {
    btnText = btnText || '关闭';
    Alert.alert(
      '提醒',
      msg, [
        {
          text: btnText,
          onPress: () => {
            cb && cb();
          }
        },
        ]
    );
  },

  error: (msg, cb, btnText) => {
    btnText = btnText || '关闭';
    Alert.alert(
      '错误',
      msg, [
        {
          text: btnText,
          onPress: () => {
            cb && cb();
          }
        },
        ]
    );
  },

  confirm: (title, msg, cb, cb2, btnText) => {
    Alert.alert(
      title,
      msg, [
        {
          text: '取消',
          onPress: () => {
            cb2 && cb2();
          }
        },
        {
          text: (btnText || '确认'),
          onPress: () => {
            cb && cb();
          }
        },
        ]
    );
  },

  startWith: (str, prefix) => {
    return _.startsWith(str, prefix);
  },
  endWith: (str, subfix) => {
    return _.endsWith(str, subfix);
  },
  getExtName: (filename) => {
    return filename.replace(/.*\.(.*)/, '$1')
      .replace(/([a-zA-Z0-9]*).*/, '$1');
  },
  dateFormat: (d, format) => {
    var date = d;
    var f = format || "YYYY-MM-DD HH:mm:ss";

    if (!isNaN(d)) {
      date = new Date(d);
    }

    return moment(date)
      .format(f);
  },

  fixPhone: (obj) => {
    if (!Utils.isEmpty(obj)) {
      obj = String(obj)
        .replace(/\D/g, '');
      if (obj.length > 11) {
        obj = obj.substring(obj.length - 11);
      }
      if (Utils.checkMobile(obj)) {
        return obj;
      }
    }
    return null;
  },

  stringToDate: (str, fmt) => {
    if (!fmt) {
      fmt = 'YYYY-MM-DD HH:mm:ss';
    }
    var d = moment(str, fmt);
    return d.toDate();
  },

  /**
   * 深度复制一个对象
   */
  deepClone: function (obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;
    // Handle Date
    if (obj instanceof Date) {
      var copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }
    // Handle Array
    if (obj instanceof Array) {
      var copy = [];
      for (var i = 0, len = obj.length; i < len; ++i) {
        copy[i] = Utils.deepClone(obj[i]);
      }
      return copy;
    }
    // Handle Object
    if (obj instanceof Object) {
      var copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr))
          copy[attr] = Utils.deepClone(obj[attr]);
      }
      return copy;
    }
    return obj;
  },

  dateAdd: (date, strInterval, n) => {
    switch (strInterval) {
    case 's':
      return new Date(Date.parse(date) + (1000 * Number));
    case 'n':
      return new Date(Date.parse(date) + (60000 * Number));
    case 'h':
      return new Date(Date.parse(date) + (3600000 * Number));
    case 'd':
      return new Date(Date.parse(date) + (86400000 * Number));
    case 'w':
      return new Date(Date.parse(date) + ((86400000 * 7) * Number));
    case 'q':
      return new Date(date.getFullYear(), (date.getMonth()) + Number * 3,
        date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()
      );
    case 'm':
      return new Date(date.getFullYear(), (date.getMonth()) + Number, date.getDate(),
        date.getHours(), date.getMinutes(), date.getSeconds());
    case 'y':
      return new Date((date.getFullYear() + Number), date.getMonth(), date.getDate(),
        date.getHours(), date.getMinutes(), date.getSeconds());
    }
  },

  htmlEncode: (str) => {
    var s = "";
    if (str) {
      if (str.length == 0) return "";
      s = str.replace(/&/g, "&amp;");
      s = s.replace(/</g, "&lt;");
      s = s.replace(/>/g, "&gt;");
      s = s.replace(/≤/g, "&le;");
      s = s.replace(/≥/g, "&ge;");
      s = s.replace(/ /g, "&nbsp;");
      s = s.replace(/\'/g, "&#39;");
      s = s.replace(/\"/g, "&quot;");
      s = s.replace(/—/g, "&mdash;");
      s = s.replace(/“/g, "&ldquo;");
      s = s.replace(/”/g, "&rdquo;");
      s = s.replace(/°/g, "&deg;");
      s = s.replace(/\r\n/g, "&lt;br&gt;");
      s = s.replace(/\n/g, "&lt;br&gt;");
    }
    return s;
  },

  htmlDecode: (str, ignoreBr) => {
    var s = "";
    if (str) {
      if (str.length == 0) return "";
      s = str.replace(/&amp;/g, "&");
      s = s.replace(/&lt;/g, "<");
      s = s.replace(/&gt;/g, ">");
      s = s.replace(/&le;/g, "≤");
      s = s.replace(/&ge;/g, "≥");
      s = s.replace(/&nbsp;/g, " ");
      s = s.replace(/&#39;/g, "\'");
      s = s.replace(/&quot;/g, '\"');
      s = s.replace(/&middot;/g, "·");
      s = s.replace(/&mdash;/g, "—");
      s = s.replace(/&ldquo;/g, "“");
      s = s.replace(/&rdquo;/g, "”");
      s = s.replace(/&deg;/g, "°");
      if (!ignoreBr) {
        s = s.replace(/\r\n/g, "<br>");
        s = s.replace(/\n/g, "<br>");
      }
    }
    return s;
  },

  string2Json: (str) => {
    var obj = new Object();

    if (str) {
      str = Utils.htmlDecode(str, true);
      try {
        obj = JSON.parse(str);
      } catch (error) {

      }

    }
    return obj;
  },

  getRequestParam: (url) => {

    var theRequest = new Object();
    var index = url.indexOf("?");
    if (index != -1) {
      var str = url.substr(index + 1);

      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
     //   theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
         let key = strs[i].split("=")[0] 
       if (key === 'shareUrl') {
          theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].substr(9));
        }else{
          theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split(
          "=")[1]);
        }

        }
    }

    return theRequest;
  },

  getUrlWithParams: (url, params) => {
    var paramStr = '';
    if (params) {
      paramStr = Utils.toQueryString(params);
      paramStr = ((url.indexOf('?') > -1) ? '&' : '?') + paramStr;
    }

    return url + paramStr;
  },

  toQueryString: (obj) => {
    return obj ? Object.keys(obj)
      .sort()
      .map(function (key) {
        var val = obj[key];
        if (Array.isArray(val)) {
          return val.sort()
            .map(function (val2) {
              return encodeURIComponent(key) + '=' + encodeURIComponent(
                Utils.NVL(val2, ''));
            })
            .join('&');
        }

        return encodeURIComponent(key) + '=' + encodeURIComponent(Utils.NVL(
          val, ''));
      })
      .join('&') : '';
  },

  // 判断时间是否有效，true-有效期内，false-有效期外或者没有
  // @param date: 上次缓存时间
  // @param diff: 时间s
  checkCacheTime: (date, diff) => {
    if(!date) {
      return false;
    }
    if (!diff) {
      return true;
    }
    let d = (new Date()).getTime() - parseInt(date);
    return (d < diff * 1000);
  },

  isObject: (obj) => {
    return _.isObject(obj);
  },

  isString: (str) => {
    return _.isString(str);
  },

  isNumber: (obj) => {
    return _.isNumber(obj);
  },

  isEmpty: (str) => {
    if (str === undefined || str === null || str === "") {
      return true;
    }
    return false;
  },

  isEmptyArr: (arr) =>{
    if (arr && arr.length > 0 && arr != 'null') {
      return false;
    }
    return true;
  },

  isEmptyObject: (obj) => {
    for (var name in obj) {
      return false;
    }
    return true;
  },

  NVL: function (str, def) {
    if (str === undefined || str === null) {
      return def;
    }
    return str;
  },

  checkID: (str) => {
    if ((/^(\d{18,18}|\d{15,15}|\d{17,17}[x|X])$/)
      .test(str)) {
      return true;
    }
    return false;
  },

  checkMobile: (str) => {
    if ((/^[1][0-9]{10}$/)
      .test(str)) {
      return true;
    }
    return false;
  },

  checkEmail: (str) => {
    if ((/^\s*$|^\w+[\w\.\-\_]+@(\w+\.){1,4}\w+$/)
      .test(str)) {
      return true;
    }
    return false;
  },

  checkUrl: (str) => {
    if (/^http(s)?:\/\//.test(str)) {
      return true;
    }
    return false;
  },

  checkCardNo: (str) => {
    if ((/^\d{14,19}$/)
      .test(str)) {
      return true;
    }
    return false;
  },

  checkVersion: (local, remote) => {
    let localVers = local.split("."),
        remoteVers = remote.split(".");
    let isNew = true;
    for (let i = 0; i < localVers.length; i++) {
        if (localVers[i] < remoteVers[i]) {
            isNew = false;
            break;
        } else if (localVers[i] > remoteVers[i]) {
            isNew = true;
            break;
        }
    }
    return isNew;
  },

  getImgSrc: (htmlstr) => {
    let reg = /<img.+?src=('|")?([^'"]+)('|")?(?:\s+|>)/gim;
    let arr = [];
    let tem = null;
    while (tem = reg.exec(htmlstr)) {
      arr.push(tem[2]);
    }
    return arr;
  },

  htmlDetailFix: (htmlstr) => {
    let rag = /(class="[^"]*")|(class=\'[^\']*\')|(style="[^"]*")|(style=\'[^\']*\')|(height="\d+(px)?")|(width="\d+(px)?")|(<iframe[^>]*><\/iframe>)/gim;
    let tem = null;
    return htmlstr = htmlstr.replace(rag,"");
  },
//每隔4个空格
  trimFour:(s) =>{
    let rag = s.replace(/\s/g, '').replace(/(.{4})/g, "$1 ");
    return rag;
  },

  hideFour:(s) =>{
    let rag = s.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    return rag;
  },


  mapActivityHerf: (href) => {
    let conf = {};
    let m = href.indexOf("?");
    let before = href.substr(0, m);
    let after = href.substr(m + 1);
    let quare = after.indexOf("=");
    let params = after.substr(quare + 1);
    conf.before = before;
    conf.after = after;
    conf.params = params;
    return conf;

  },

  // promise化
  // @param returnValueExpected 是否直接返回值
  // @param ignoreRejectOnError 忽略抛出错误
  // @param reverseCallbacks 翻转成功和是否方法
  promisify: (fn, returnValueExpected, ignoreRejectOnError, reverseCallbacks) => {
    return (...args) => {
      return new Promise((resolve, reject) => {
        let success = function (...args) {
          if (!returnValueExpected) {
            return resolve(args);
          }
        };
        let error = function (err) {
          if (!ignoreRejectOnError) {
            reject(err);
          }
          return false;
        };
        let retValue = fn.call(this, ...args, reverseCallbacks ?
          error : success, reverseCallbacks ? success : error);
        if (returnValueExpected) {
          return resolve(retValue);
        }
      });
    };
  },

};

module.exports = Utils;
