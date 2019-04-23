/**
 * @providesModule FlyBottomButton
 * @flow
 * 按钮
 */

'use strict';
import React, {
  Component
}
from 'react';
import {
  TouchableOpacity, View, StyleSheet
}
from 'react-native';
const FlyColors = require('FlyColors');
const FlyDimensions = require('FlyDimensions');
const {
  Text
} = require("FlyText");

export type Props = {
  text: string;
  disabled ? : boolean; //是否可点击，true时不触发点击事件，按钮为灰色
  onPress ? : () => void;
  style ? : any;
};

const BUTTON_HEIGHT = 50;

class FlyBottomButton extends Component {

  props: Props;

  getStyle(props) {
    let s = {
      backgroundColor: FlyColors.baseColor
    };
    if (props.disabled) {
      s.backgroundColor = FlyColors.baseTextColor2;
    }

    return s;
  }

  getTextStyle(props) {
    let s = {
      color: FlyColors.white
    };

    if (props.disabled) {
      s.color = FlyColors.white;
    }

    return s;
  }

  renderText(props) {
    return (
      <View>
        <Text style={[styles.text, this.getTextStyle(props)]}>
          {props.text}
        </Text>
      </View>
    );
  }

  renderBtn(props, style) {
    if (props.disabled) {
      return (
        <View style={[style, this.getStyle(props)]}>
          {this.renderText(props)}
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          underlayColor={FlyColors.baseBackgroundColor2}
          style={[style, this.getStyle(props)]}
          onPress={props.onPress}>
            {this.renderText(props)}
        </TouchableOpacity>
      );
    }
  }

  renderView(props) {
    if (props.children) {
      let textBtn = null;
      if (props.text) {
        textBtn = this.renderBtn(props, styles.textWrapper);
      }
      return (
        <View style={styles.combine}>
          <View style={styles.otherTextWrapper}>
            {props.children}
          </View>
          {textBtn}
        </View>
      );
    } else {
      return this.renderBtn(props, styles.onlyText);
    }
  }

  render() {
    let props = this.props;
    return (
      <View style={[styles.container, props.style]}>
        {this.renderView(props)}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: FlyDimensions.deviceDim.width,
    borderColor: FlyColors.baseBorderColor,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,

  },
  combine: {
    flex: 1,
    flexDirection: 'row',
  },
  onlyText: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: BUTTON_HEIGHT,
  },
  otherTextWrapper: {
    flex: 6,
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: FlyColors.white,
    height: BUTTON_HEIGHT,
  },
  textWrapper: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
    height: BUTTON_HEIGHT,
  },
  text: {
    fontSize: FlyDimensions.fontSizeXxl,
    fontWeight: FlyDimensions.fontWeightBolder,
  }
});

FlyBottomButton.height = BUTTON_HEIGHT;
FlyBottomButton.styles = styles;

module.exports = FlyBottomButton;
