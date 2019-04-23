/**
 *
 * @providesModule FlyText
 * @flow
 */

'use strict';

import React, {Component} from 'react';
import ReactNative, {
    Dimensions,
    StyleSheet,
    Animated,
} from 'react-native';

import FlyColors from 'FlyColors';
import FlyDimensions from 'FlyDimensions';
import env from 'env';
import Filters from 'Filters';


export type TextAlignVertical = {
  type: "top" | "bottom" | "center";
  height: number;
  fontSize: number;
};

function textAlignVerticalStyle(conf: TextAlignVertical) {
  if (conf == null) {
    return null;
  }
  var {type, height, fontSize} = conf;
  var margin = Math.max(height - fontSize, 0);
  var styles = {
    height: height,
    fontSize: fontSize,
  };
  switch (type) {
    case "top":
      styles.paddingBottom = Math.floor(margin-1);
      break;
    case "bottom":
      styles.paddingTop = Math.floor(margin-1);
      break;
    case "center":
      styles.paddingTop = Math.floor(margin/2);
      break;
    default:
  }
  return styles;
}

export function Text({style, transform, textAlignVertical, ...props}: Object): ReactElement {
  if (transform) {
    return <Animated.Text allowFontScaling={false} style={[styles.font, textAlignVerticalStyle(textAlignVertical), transform, style]} {...props} />;
  }
  return <ReactNative.Text allowFontScaling={false}  style={[styles.font, textAlignVerticalStyle(textAlignVertical), style]} {...props} />;
}

export function Heading1({style, transform, ...props}: Object): ReactElement {
  if (transform) {
    return <Animated.Text allowFontScaling={false} style={[styles.font, styles.h1, transform, style]} {...props} />;
  }
  return <ReactNative.Text allowFontScaling={false} style={[styles.font, styles.h1, style]} {...props} />;
}

export function Paragraph({style, transform, ...props}: Object): ReactElement {
  if (transform) {
    return <Animated.Text allowFontScaling={false} style={[styles.font, styles.p, transform, style]} {...props} />;
  }
  return <ReactNative.Text allowFontScaling={false} style={[styles.font, styles.p, style]} {...props} />;
}

export function OneLine({style, transform, textAlignVertical, ...props}: Object): ReactElement {
  if (transform) {
    return <ReactNative.Text allowFontScaling={false} style={[styles.font, textAlignVerticalStyle(textAlignVertical), transform, style]} numberOfLines={1} {...props} />;
  }
  return <ReactNative.Text allowFontScaling={false} style={[styles.font, textAlignVerticalStyle(textAlignVertical), style]} numberOfLines={1} {...props} />;
}

const styles = StyleSheet.create({
  font: {
    fontFamily: env.fontFamily,
    color: FlyColors.baseTextColor,
  },
  h1: {
    fontSize: FlyDimensions.normalize(24),
    lineHeight: FlyDimensions.normalize(27),
    color: FlyColors.baseTextColor,
    fontWeight: FlyDimensions.fontWeightBold,
    letterSpacing: -1,
  },
  p: {
    fontSize: FlyDimensions.normalize(15),
    lineHeight: FlyDimensions.normalize(23),
    color: FlyColors.baseTextColor,
  },
});
