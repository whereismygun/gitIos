/**
 *
 *
 * @providesModule FlyDimensions
 * @flow
 *
 */

'use strict';

import React from 'react';
import {
  Dimensions
}
from 'react-native';

const dim = Dimensions.get('window');
const scale = Math.min(dim.width / 375, 1);

const fontSizeBase = 12;
const lineHeightBase = 1.33; // 16/12

function normalize(size: number): number {
  return Math.round(scale * size);
}

function lineHeight(size: number): number {
  return Math.round(lineHeightBase * size);
}

export type Size = {
  width: number;
  height: number;
};

function getImgHeightWithWidth(size: Size, width: number = dim.width): number {
  if (!size || !size.width || !size.height) {
    return 0;
  }
  return size.height * width / size.width;
}

var FlyDimensions = {
  normalize: normalize,
  lineHeight: lineHeight,
  fontSizeBase: normalize(fontSizeBase),
  fontSizeXs: normalize(fontSizeBase * 0.75), // ~9dp
  fontSizeSmall: normalize(fontSizeBase * 0.83), // ~10dp
  fontSizeLarge: normalize(fontSizeBase * 1.16), // ~14dp
  fontSizeXl: normalize(fontSizeBase * 1.33), // ~16dp
  fontSizeXxl: normalize(fontSizeBase * 1.5), // ~18dp
  fontSizeXxxl: normalize(fontSizeBase * 1.67), // ~20dp
  
  fontSizeS0: normalize(12),
  fontSizeH0: normalize(22),
  fontSizeH1: normalize(24),
  fontSizeH2: normalize(26),
  fontSizeH4:normalize(30),
  fontSizeHuge: normalize(35),
  fontSizeH5: normalize(48),

  fontWeightBase: 'normal',
  fontWeightBold: '400',
  fontWeightBolder: '700',

  statusBarHeight: 20,
  navHeight: 50,
  headerHeight: 44,

};


FlyDimensions.deviceDim = dim;
FlyDimensions.getImgHeightWithWidth = getImgHeightWithWidth;

module.exports = FlyDimensions;
