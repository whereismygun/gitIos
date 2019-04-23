/**
 *
 *
 * @providesModule FlyErrorPlacehoderComponent
 * @flow
 *
 */
'use strict';
import React,{Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'

const FlyButton = require('FlyButton');

const {Text} = require('FlyText');
const FlyColors = require('FlyColors');
const FlyDimensions = require('FlyDimensions');

const ErrorPlaceholder = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    desc: React.PropTypes.string,
    onPress: React.PropTypes.func,
  },

  render() {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorWrapper}>
          <Text style={styles.errorTextTitle}>
            {this.props.title}
          </Text>
          <FlyButton size={"sm"} type={"base"} onPress={this.props.onPress} text={this.props.desc} />
        </View>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
  },
  errorWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  errorTextTitle: {
    marginBottom: 20,
    fontSize: FlyDimensions.fontSizeXl
  },
});

module.exports = ErrorPlaceholder;
