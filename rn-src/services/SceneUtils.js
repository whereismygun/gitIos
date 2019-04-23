/**
 *
 *
 * @providesModule SceneUtils
 * @flow
 *
 */

'use strict';

import React from 'react';
import {
  Platform,
  Alert,
  Navigator,
  StatusBar,
  InteractionManager,
  DeviceEventEmitter
}
from 'react-native';

const env = require('env');
const Utils = require('Utils');
const NativeModuleUtils = require('NativeModuleUtils');
const DefaultStatusBarStyle = 'default';
const LightStatusBarStyle = 'light-content';

// 页面配置信息
const SceneTypeCfg = env.SceneTypeCfg

// 场景和URl的Map
const SceneUrlMap = env.SceneUrlMap;

// Tab
const SKIP_LOGIN_CHECK_TABS = env.SkipLoginCheckTabs;

var _navigator = null;
var _sceneInfo = {};

var SceneUtils = {

  setNavigator: (nav) => _navigator = nav,
  setSceneInfo: (sceneInfo) => _sceneInfo = sceneInfo || {},

  getCurrentRoute: () => {
    var navigator = _navigator;
    if (navigator) {
      var routes = navigator.getCurrentRoutes();
      return routes[routes.length - 1];
    }
    return null;
  },

  setStatusBarStyle: (style, anim) => {

    var current = SceneUtils.getCurrentRoute();

    if (Platform.OS === 'ios' && current) {

      var type = _sceneInfo.type;
      var itemName = _sceneInfo.itemName || 'def';

      // 存储值
      if (current.statusBarStyle) {
        style = style || current.statusBarStyle[itemName];
      }

      // 默认值
      if (type && SceneTypeCfg[type] && SceneTypeCfg[type].StatusBarStyle) {
        style = style || SceneTypeCfg[type].StatusBarStyle[itemName];
      }
      style = style || DefaultStatusBarStyle;
      StatusBar.setBarStyle(style, anim);

      // 保存StatusBar到navigator里面
      var statusBarStyle = current.statusBarStyle || {};
      statusBarStyle[itemName] = style;
      current.statusBarStyle = statusBarStyle;
    }
  },

  // props
  // toTab: 返回后跳转到指定tab
  // isReload: 返回后刷新页面
  gotoLogin: (props) => {

    var navigator = _navigator;

    if (navigator) {
      var current = SceneUtils.getCurrentRoute();
      if (current && current.type === 'LOGIN') {
        return;
      }

      props = props || {};

      if (props.isReload) {

        if (current && current.type === 'TAB_VIEW') {
          navigator.push({
            type: 'LOGIN',
            animType: Navigator.SceneConfigs.FloatFromRight,
            props: props
          });
        } else {
          props.reloadProps = {
            type: current.type,
            props: current.props,
          };
          navigator.replace({
            type: 'LOGIN',
            animType: Navigator.SceneConfigs.FloatFromRight,
            props: props
          });
        }
      } else {
        navigator.push({
          type: 'LOGIN',
          animType: Navigator.SceneConfigs.FloatFromRight,
          props: props
        });
      }

    }
  },

  goBack: () => {
    InteractionManager.runAfterInteractions(() => {
      var navigator = _navigator;
      navigator.pop();
    });

  },

  gotoAuthV1: () => {
    SceneUtils.gotoScene("CREDIT_STEP_ONE_VIEW");
  },

  gotoAuthV2: (selectedIndex) => {
    if (!Utils.isEmpty(selectedIndex)) {
      SceneUtils.gotoScene("CREDIT_STEP_MAIN_VIEW", {
        selectedIndex: selectedIndex
      });
    }else {
      SceneUtils.gotoScene("CREDIT_STEP_MAIN_VIEW", {
        selectedIndex: 0
      });
    }
  },

  gotoHome: () => {
    DeviceEventEmitter.emit(env.ListenerMap['ENTER_TAB_CHANGE'], ['enter']);
  },

  /*
   * 跳转到指定场景
   * type: 场景类型
   * props: 场景属性
   * navType: 路由方式, push(默认), resetTo, replace
   *
   */
  gotoScene: (type, props, navType) => {
   
    // 外部跳转
    if (/^__browser:\/\//.test(type)) {

      let url = type.substring(12);
      NativeModuleUtils.openURL(url);
      return;
    }

    let navigator = _navigator;

    let navParams = {
      type: type,
      props: props,
    };

    // 通过url方式索引
    if (/^http(s)?:\/\//.test(type)) {
    
      navParams = {
        type: 'PROFILE_BROWSER_VIEW',
        props: {
          title: "通通理财",
          uri: type
        }
      };
    } else if (/^__inner:\/\//.test(type)) {
      let url = type.substring(10);
      navParams = {
        type: 'PROFILE_BROWSER_VIEW',
        props: {
          title: "零零期",
          uri: url
        }
      };
    } else if (Utils.startWith(type, '/')) {
     
      if (Utils.startWith(type,'/login')) {
        DeviceEventEmitter.emit(env.ListenerMap['LOGIN_MODAL']);
       }else{
      let urls = type.split("?");
      let newType = SceneUrlMap[urls[0]];
      let newProps = props;
      if (urls[1]) {
        let params = Utils.getRequestParam(type);
        newProps = {
          ...params,
          ...props,
        };
      }

      // 如果是TAB_VIEW::，跳转到tab
      if (Utils.startWith(newType,'TAB_VIEW::')) {
        navigator.popToTop();
        DeviceEventEmitter.emit(env.ListenerMap['ENTER_TAB_CHANGE'], [
          newType.substring(10), newProps]);
        return;
      }

      // 其他是指定页面
      else if (newType) {
        navParams = {
          type: newType,
          props: newProps,
        };
      }
      //
      else {
        navigator.popToTop();
        return;
      }

       }
    }

    if (navParams.type === 'TAB_VIEW' && !navType) {

      navigator.popToTop();
      return;
    }
      
    if (Utils.startWith(navParams.type, 'TAB_VIEW::') && !navType) {
       navigator.popToTop();
      DeviceEventEmitter.emit(env.ListenerMap['ENTER_TAB_CHANGE'], [
        navParams.type.substring(10), navParams.props]);
      return;
    }

    if (navType === 'resetTo') {
      navigator.resetTo(navParams);
    } else if (navType === 'replace') {
      navigator.replace(navParams);
    } else {
      navigator.push(navParams);
    }
  },

  skipLoginCheckTab: (tab) => {
    return SKIP_LOGIN_CHECK_TABS.some(t => t === tab);
  },

};

module.exports = SceneUtils;
