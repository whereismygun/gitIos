/**
 *
 *
 * @providesModule FlyStyles
 * @flow
 *
 */

'use strict';

import React from 'react';
import { StyleSheet } from 'react-native';

var FlyColors = require('FlyColors');
var FlyDimensions = require('FlyDimensions');

const styleEnv = {
  fontFamily: undefined,
  iconFontFamily: 'iconfont'
};

const dim = FlyDimensions.deviceDim;

var FlyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FlyColors.white,
  },

  headerContent: {
    flexDirection: 'row',
  },

  bottomNavHeight: {
    marginBottom: FlyDimensions.navHeight-1,
  },

  bottomBorder: {
    borderBottomWidth: 0.5,
    borderColor: FlyColors.baseBorderColor,
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    fontFamily: styleEnv.fontFamily,
    fontSize: FlyDimensions.fontSizeBase,
    lineHeight: FlyDimensions.lineHeight(FlyDimensions.fontSizeBase),
    color: FlyColors.baseTextColor
  },

  segment: {
    height: 10,
    backgroundColor: FlyColors.baseBackgroundColor,
    borderColor: FlyColors.baseBorderColor,
  },

  loadingModal: {
    width: 110,
    height: 110,
    marginLeft: (dim.width-110)/2,
    marginTop: (dim.height-110)/2,
    borderRadius: 15,
    overflow: 'hidden'
  },

  modalHalf: {
    flexDirection: 'row',
    height: Math.floor(dim.height * 3 / 4),
  },

  modalHalfWrapper: {
    flex:1,
    flexDirection: 'column',
  },

  modalHalfMain: {
    flex: 1
  }
});

FlyStyles.DEFAULT_IMAGE = "Base_Empty_Icon";

module.exports = FlyStyles;
