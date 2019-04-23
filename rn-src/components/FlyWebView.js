/**
 * @providesModule FlyWebView
 * @flow
 */
'use strict';

import React, {
  Component
}
from 'react';
import {
  View,
  StyleSheet,
  WebView,
}
from 'react-native';

const FlyDimensions = require('FlyDimensions');
const Utils = require('Utils');

type State = {
  height: number;
};

type Props = {
  html: string;
  webviewStyle ? : string;
  webviewHeight ? : number;
  emptyHtml ? : string;
  maxHeight ? : number;
  getLoadingStatus ? : boolean;
}

const dim = FlyDimensions.deviceDim;
const DefaultEmptyHtml = "<p style='margin: 20px;'>加载中...</p>";

class FlyWebView extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      webviewHeight: props.webviewHeight || 0
    };
    (this: any)
    .onWebViewNavigationStateChange = this.onWebViewNavigationStateChange.bind(
      this);
  }

  onWebViewNavigationStateChange(navState) {
    if (!Utils.isEmpty(navState.title)) {
      let height = Number(navState.title);
      if (this.props.maxHeight) {
        height = Math.min(height, this.props.maxHeight);
      }
      this.setState({
        webviewHeight: height
      });
    }

    if (this.props.getLoadingStatus) {
      this.props.getLoadingStatus(navState.loading);
    }
  }


  render() {

    let htmlContent = Utils.NVL(this.props.html, this.props.emptyHtml ||
      DefaultEmptyHtml);

    let fontSize = FlyDimensions.fontSizeLarge;

    let html = '<!DOCTYPE html><html>' +
      '<head>' +
      '<meta http-equiv="Content-type" content="text/html; charset=utf-8" />' +
      '<meta content="m.007fenqi.com" name="author"/>' +
      '<meta content="yes" name="apple-mobile-web-app-capable"/>' +
      '<meta content="yes" name="apple-touch-fullscreen"/>' +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />' +
      '<meta http-equiv="Expires" content="-1"/>' +
      '<meta http-equiv="Cache-Control" content="no-cache">' +
      '<meta http-equiv="Pragma" content="no-cache">'
      // + '<link rel="stylesheet" href="https://m.007fenqi.com/app/app.css" type="text/css"/>'
      + '<style type="text/css">' +
      'html, body, p, img, embed, iframe, div {' +
      'position:relative;width:100%;margin:0;padding:0;line-height:1;box-sizing:border-box;display:block;font-size:' +
      fontSize + 'px;' + '}' + Utils.NVL(this.props.webviewStyle, '') +
     '#height-wrapper {' +
         'padding: 0;' +
         'margin: 0;' +
     '}' +
      '</style>' +
      '<script type="text/javascript">' +
      // 'function()'
      'function onLoadFn() {' +
     //
     'var wrapper = document.createElement("div");' +
      'wrapper.id = "height-wrapper";' +   
      'while (document.body.firstChild) {' +  
        'wrapper.appendChild(document.body.firstChild);' +  
     '}' +
     'document.body.appendChild(wrapper);' +
     'var i = 0;' +
     'function updateHeight() { ' +
       ' document.title = wrapper.clientHeight;' +
        'window.location.hash = ++i;'  +
      '}' +
     'updateHeight(); ' +
     ' window.addEventListener("load", function() {  ' +
         'updateHeight();'  +
         'setTimeout(updateHeight,500);'  +
      '});'  +
      'window.addEventListener("resize", updateHeight);' +   
    //  ' +
    //
      // 'window.location.hash = "1";document.title = document.height || document.body.clientHeight;' +
      '}' +
      '</script>' +
      '</head>' +
      '<body onload="onLoadFn()">' +
      Utils.htmlDecode(
        htmlContent) +
      '</body></html>';

    let propHeight = Utils.NVL(this.props.webviewHeight, this.state.webviewHeight);

    return (
      <WebView
        style={[styles.webview, {height:propHeight}, this.props.style]}
        javaScriptEnabled={true}
        scrollEnabled={false}
        source={{html:html}}
        automaticallyAdjustContentInsets={true}
        scalesPageToFit={false}
        onNavigationStateChange={this.onWebViewNavigationStateChange}
        />
    );
  }
}


var styles = StyleSheet.create({
  webview: {
    flex: 1,
    // width:FlyDimensions.deviceDim.width
  },
});

module.exports = FlyWebView;
