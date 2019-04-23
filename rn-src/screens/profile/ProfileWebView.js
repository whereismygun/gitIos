/**
 *
 *
 * @flow
 *
 */
'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Navigator,
  View,
  ScrollView,
  WebView
} from 'react-native';


import {connect} from 'react-redux';

const FlyStyles = require('FlyStyles');
const FlyHeader = require('FlyHeader');
const Utils = require('Utils');
// const FlySysNotice = require('FlySysNotice');

type Props = {
  navigator: Navigator;
  title: string;
  type: string;
  html: string;
};

class ProfileWebView extends React.Component {
  props : Props;

  constructor(props) {
      super(props);
  }

  render() {
    let leftItem = {
        type: "back",
    };
    return (
      <View style={FlyStyles.container}>
        <FlyHeader leftItem={leftItem} borderBottom={true} title={this.props.title} />
        <WebView
          style={{padding:15}}
          source={{html:Utils.htmlDecode(this.props.html)}}
          />
      </View>
    );
  }
}

var styles = StyleSheet.create({

});

function select(store) {
  return {

  };
}

module.exports = connect(select)(ProfileWebView);
