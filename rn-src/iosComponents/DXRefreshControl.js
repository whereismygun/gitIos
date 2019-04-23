/**
 * @providesModule DXRefreshControl
 * @flow
 */
'use strict';

import React from 'react';

import ReactNative, {
  findNodeHandle,
  DeviceEventEmitter,
  NativeModules
} from 'react-native';

/**
 * A pull down to refresh control like the one in Apple's iOS6 Mail App.
 */

var DROP_VIEW_DID_BEGIN_REFRESHING_EVENT = 'dropViewDidBeginRefreshing';

var callbacks = {};

var subscription = DeviceEventEmitter.addListener(
  DROP_VIEW_DID_BEGIN_REFRESHING_EVENT,
  (reactTag) => callbacks[reactTag]()
);
// subscription.remove();

var DXRNRefreshControl = {
  configureCustom(node, config, callback) {
    var nodeHandle = findNodeHandle(node) || 1;
    NativeModules.DXRefreshControl.configureCustom(nodeHandle, config, (error) => {
      if (!error) {
        callbacks[nodeHandle] = callback;
      }
    });
  },

  endRefreshing(node) {
    var nodeHandle = findNodeHandle(node) || 1;
    NativeModules.DXRefreshControl.endRefreshing(nodeHandle);
  },

  beginRefreshing(node) {
    var nodeHandle = findNodeHandle(node) || 1;
    NativeModules.DXRefreshControl.beginRefreshing(nodeHandle);
  }
};

module.exports = DXRNRefreshControl;
