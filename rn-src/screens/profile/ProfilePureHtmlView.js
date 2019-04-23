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
  ScrollView
} from 'react-native';


import {connect} from 'react-redux';

const FlyStyles = require('FlyStyles');
const FlyHeader = require('FlyHeader');
const FlySysNotice = require('FlySysNotice');

type Props = {
  navigator: Navigator;
  title: string;
  type: string;
  html: string;

};

class ProfilePureHtmlView extends React.Component {
  props : Props;

  constructor(props) {
      super(props);
  }

  render() {
    let leftItem = {
        type: "back",
    };

    let {title, ...props} = this.props;

    return (
      <View style={FlyStyles.container}>
        <FlyHeader leftItem={leftItem} borderBottom={true} title={title} />
        <ScrollView bouncesZoom={true} automaticallyAdjustContentInsets={true}>
          <FlySysNotice webviewHeight={this.props.webviewHeight} {...props} />
        </ScrollView>
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

module.exports = connect(select)(ProfilePureHtmlView);
