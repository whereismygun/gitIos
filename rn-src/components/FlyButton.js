/**
 * @providesModule FlyButton
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

export type BtnSize = '' | 'lg' | 'sm' | 'xs';
export type BtnType = 'defalut' | 'base' | 'primary' | 'success' | 'info' |
  'warning' | 'danger' | 'link' | 'self';

export type Props = {
  text: string;
  disabled ? : boolean; //是否可点击，true时不触发点击事件，按钮为灰色
  onPress ? : () => void;
  wrapperStyle ? : any;
  style ? : any;
  size ? : BtnSize; // 按钮大小
  type ? : BtnType; // 按钮类型
  textColor ? : string; //按钮字体颜色
};

const DEFAULT_SIZE = {
  width: 80,
  height: 50
};

class FlyButton extends Component {

  props: Props;

  static defaultProps = {
    disabled: false,
    size: '',
    type: 'defalut'
  };

  getSize(size) {
    let s = {
      ...DEFAULT_SIZE
    };

    switch (size) {
    case 'lg':
      s.height = s.height * 1.3;
      break;
    case 'xl':
      s.height = s.height * 1;
      break;
    case 'sm':
      s.height = s.height * 0.8;
      break;
    case 'xs':
      delete s.height;
      s.padding = 3;
      break;
    default:
    }
    return s;
  }

  getStyle(props) {
    let size = this.getSize(props.size);
    let s = {
      ...size,
      borderWidth: 0,
      borderRadius: 0
    };

    switch (props.type) {
    case 'base':
      s = {
        ...s,
        backgroundColor: FlyColors.btnBaseBg,
        borderColor: FlyColors.btnBaseBorder
      };
      break;
    case 'primary':
      s = {
        ...s,
        backgroundColor: FlyColors.btnPrimaryBg,
        borderColor: FlyColors.btnPrimaryBorder
      };
      break;
    case 'success':
      s = {
        ...s,
        backgroundColor: FlyColors.btnSuccessBg,
        borderColor: FlyColors.btnSuccessBorder
      };
      break;
    case 'gray':
      s = {
        ...s,
        backgroundColor: 'white',
        borderColor: 'white',
      };
      break;
    case 'green':
      s = {
        ...s,
        backgroundColor: 'white',
        borderColor: 'white',
      };
      break;
    case 'info':
      s = {
        ...s,
        backgroundColor: FlyColors.btnInfoBg,
        borderColor: FlyColors.btnInfoBorder
      };
      break;
    case 'warning':
      s = {
        ...s,
        backgroundColor: FlyColors.btnWarningBg,
        borderColor: FlyColors.btnWarningBorder
      };
      break;
    case 'danger':
      s = {
        ...s,
        backgroundColor: FlyColors.btnDangerBg,
        borderColor: FlyColors.btnDangerBorder
      };
      break;
    case 'link':
      s = {
        ...s,
        backgroundColor: FlyColors.btnLinkBg,
        borderWidth: 0
      };
      break;
    case 'ttl':
      s = {
        ...s,
        backgroundColor: FlyColors.btnLinkBgTtl,
        borderWidth: 0
      };
      break;
    default:
      s = {
        ...s,
        backgroundColor: FlyColors.btnDefaultBg,
        borderColor: FlyColors.btnDefaultBorder
      };
      break;
    }

    if (props.disabled) {
      // s.opacity = 0.55,
      s.backgroundColor = '#CCCCCC';
    }

    return s;
  }

  getTextStyle(props) {
    let s = {};

    switch (props.size) {
    case 'lg':
      s.fontSize = FlyDimensions.fontSizeH1;
      break;
    case 'sm':
      s.fontSize = FlyDimensions.fontSizeXxl;
      break;
    case 'xs':
      s.fontSize = FlyDimensions.fontSizeBase;
      break;
    case 'xl':
      s.fontSize = FlyDimensions.fontSizeXl;
      break;
    default:
      s.fontSize = FlyDimensions.fontSizeXxl;
    }

    switch (props.type) {
    case 'base':
      s = {
        ...s,
        color: FlyColors.btnBaseColor
      };
      break;
    case 'primary':
      s = {
        ...s,
        color: FlyColors.btnPrimaryColor
      };
      break;
    case 'success':
      s = {
        ...s,
        color: FlyColors.btnSuccessColor
      };
      break;
    case 'info':
      s = {
        ...s,
        color: FlyColors.btnInfoColor
      };
      break;
    case 'warning':
      s = {
        ...s,
        color: FlyColors.btnWarningColor
      };
      break;
    case 'danger':
      s = {
        ...s,
        color: FlyColors.btnDangerColor
      };
      break;
    case 'gray':
      s = {
        ...s,
        color: FlyColors.baseColor
      };
      break;
    case 'green':
      s = {
        ...s,
        color: '#006AB4'
      };
      break;
    case 'link':
      s = {
        ...s,
        color: FlyColors.btnLinkColor,
        textDecorationLine: 'underline'
      };
      break;
      case 'ttl':
        s = {
          ...s,
          color: FlyColors.baseColor,
          // textDecorationLine: 'underline'
        };
        break;
    case 'self':
      s = {
        ...s,
        color: props.textColor
      };
      break;
    default:
      s = {
        ...s,
        color: FlyColors.btnDefaultColor
      };
      break;
    }

    if (props.disabled) {
      if (props.type === 'link') {
        s.color = FlyColors.btnLinkDisabledColor;
      }
      if (props.type == 'gray' || props.type == 'green') {
        s.color = '#CCCCCC';
      }
    }

    return s;
  }

  renderView(props) {

    return (
      <View style={[styles.container, this.getStyle(props), props.style]}>
        <Text style={[this.getTextStyle(props)]}>
          {props.text}
        </Text>
      </View>
    );
  }

  render() {
    let props = this.props;

    if (props.disabled) {
      return (
        <View style={[styles.wrapper,props.wrapperStyle]}>
          {this.renderView(props)}
        </View>
      );
    } else {
      return (
        <TouchableOpacity onPress={props.onPress} style={[styles.wrapper,props.wrapperStyle]}>
          {this.renderView(props)}
        </TouchableOpacity>
      );
    }
  }
}

var styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',

  },

  wrapper: {
    borderRadius: 0,
  }
});

module.exports = FlyButton;
