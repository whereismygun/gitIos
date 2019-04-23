/**
 *
 * @providesModule FlySysNotice
 * @flow
 *
 */
'use strict';

import React, {Component} from 'react';
import ReactNative, {
  StyleSheet,
  Navigator,
  View,
  InteractionManager,
} from 'react-native';

const {connect} = require('react-redux');

const FlyStyles = require('FlyStyles');
const FlyDimensions = require('FlyDimensions');
const FlyColors = require('FlyColors');
const FlyWebView = require('FlyWebView');
const FlyBase = require('FlyBase');
const Utils = require('Utils');

const {
  loadProfileSysNotice,
} = require('../../actions');

type Props = {
  type: string; // 后台html代码类型
  html: string; // html代码
  sysNoticeList: Object;
  webviewStyle?: string;
  webviewHeight?: number;
  maxHeight?: number;
};

class FlySysNotice extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let that = this;
    InteractionManager.runAfterInteractions(()=>{
      if (that.props.type) {
        that.props.dispatch(loadProfileSysNotice(that.props.type));
      }
    });
  }

  getWebviewStyle() {
    return "";
  }

  render() {

    let {sysNoticeList, type, html, webviewStyle, ...props} = this.props;
    let sysNoticeHtml = null;
    if (html) {
      sysNoticeHtml = html;
    } else if (type) {
      sysNoticeHtml = sysNoticeList[type];
    }

    webviewStyle = webviewStyle || this.getWebviewStyle();

    if (Utils.isEmpty(sysNoticeHtml)) {
      return FlyBase.LoadingView();
    }
    return (
      <View style={styles.container}>
        <FlyWebView html={sysNoticeHtml} webviewStyle={webviewStyle} {...props} />
      </View>
    );

  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function select(store, props) {
  return {
    sysNoticeList: store.profile.sysNoticeList,
  };
}

module.exports = connect(select)(FlySysNotice);
