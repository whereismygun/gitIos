/**
 *
 * @providesModule FlyBase
 * @flow
 *
 */
'use strict';
import React,{Component} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  ActivityIndicator,
} from 'react-native';

const {Text} = require('FlyText');

const FlyColors = require('FlyColors');
const FlyStyles = require('FlyStyles');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marginTopView: {
    marginTop: 20,
  },

  marginLoading: {
    marginTop: 15,
    marginBottom:15
  },

  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  emptyTextTitle: {
    fontSize: 15,
    marginBottom: 10,
  },
});

export function LoadingView(): ReactElement {
  return (
    <View style={[styles.container, styles.marginLoading]}>
      <ActivityIndicator size="small" />
    </View>
  );
}

export function FlyEmpty({style, value, ...props}:Object): ReactElement {
  return (
    <View style={[styles.container, styles.marginTopView, styles.emptyContainer]}>
      <Text style={[styles.emptyTextTitle, style]} {...props} >{value}</Text>
    </View>
  );
}

export function SegmentView(key,style): ReactElement {
  return <View style={[FlyStyles.segment,style]} key={key} />;
}

export function BlockView(height): ReactElement {
  if (!height && height !== 0) {
    height = 10;
  }
  return <View style={{height: height}} />;
}
