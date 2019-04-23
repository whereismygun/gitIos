/**
 * @providesModule FlyItem
 * 自定义条目
 */
'use strict'

import React,{Component} from 'react';
import {
    View,
    StyleSheet,
    TouchableHighlight,
} from 'react-native';

const FlyColors = require('FlyColors');
const FlyDimensions = require('FlyDimensions');
const FlyStyles = require('FlyStyles');
const FlyIconfonts = require('FlyIconfonts');
const FlyImage = require('FlyImage');
const {Text, OneLine} = require('FlyText');

export type IconItem = {
    name: string;
    size: number;
    color: string;
    style: any;
    source: string;
    type: string; // icon, img, 默认icon
};

export type Props = {
    leftIcon: IconItem; // 左侧图标
    text: string; // 左侧文字
    textFlexNum: number; // 左侧文字占比
    view: any; // 左侧的View
    otherText: string; // 右侧文字
    otherTextFlexNum: number; // 右侧文字占比
    otherView: any; //右侧的View
    height: number; // 高度
    onPress: () => Void; //item点击方法，可以点击的会出现箭头
    rightIcon: IconItem; // 右侧图标
    otherIcon: IconItem; // 右侧二图标
    showSegment: boolean; // 显示组内分割线
    style: any;
    key: string;
    fontSize: number;
    arrowIconSize: number;
    hideArrowIcon: boolean;
    otherFontsize:number;
    otherTextColor:number;
};

const ITEM_HEIGHT = 50;

const textAlignVertical = {
  type: 'center',
  height: ITEM_HEIGHT,
  fontSize: FlyDimensions.fontSizeXl,
};

class FlyItem extends Component {
    props : Props;

    static defaultProps = {
      arrowIconSize: 20,
    };

    getHeightStyle() {
      if (this.props.height) {
        return {
          height: this.props.height,
        };
      }
      return {
        height: ITEM_HEIGHT,
      };
    }

    renderIcon(icon, style) {

        let content = null;

        if (icon.type === 'img') {
            content = (
              <FlyImage style={[styles.img, icon.style]} source={icon.source}/>
            );
        } else {
            content = (
              <FlyIconfonts name={icon.name} size={icon.size||25} color={icon.color||FlyColors.baseTextColor}/>
            );
        }

        return (
          <View style={[styles.iconWrapper, this.getHeightStyle(), style]}>
              {content}
          </View>
        );
    }

    renderMain() {
        let props = this.props;

        let _textAlignVertical = {...textAlignVertical};

        let fontStyle;
        if (props.fontSize) {
          _textAlignVertical.fontSize = props.fontSize;
        }
        if (props.height) {
          _textAlignVertical.height = props.height;
        }

        if (props.children) {
          return (
            <View style={styles.textWrapper}>
              {props.children}
            </View>
          );
        } else {

          let title = [];

          let textStyle = null;
          if (props.textFlexNum) {
            textStyle = {
              flex: props.textFlexNum
            };
          }
          if (props.text) {
            title.push(
              <View key={'r_text'} style={[styles.textTextWrapper, textStyle,]}>
                <OneLine  textAlignVertical={_textAlignVertical} style={styles.text}>{props.text}</OneLine>
              </View>
            );
          } else if (props.view) {
            title.push(
              <View key={'r_text'} style={[styles.textTextWrapper, textStyle]}>
                {props.view}
              </View>
            );
          }

          let otherTextStyle = null;
          if (props.otherTextFlexNum) {
            otherTextStyle = {
              flex: props.otherTextFlexNum
            };
          }
          if (props.otherText) {
            title.push(
              <View key={'r_otherView'} style={[styles.otherTextWrapper, otherTextStyle]}>
                <OneLine textAlignVertical={_textAlignVertical} style={[styles.text,{fontSize:props.otherFontsize,color:this.props.otherTextColor}]}>{props.otherText}</OneLine>
              </View>
            );
          } else if (props.otherView) {
            title.push(
              <View key={'r_otherView'} style={[styles.otherTextWrapper, otherTextStyle]}>
                {props.otherView}
              </View>
            );
          }

          return (
            <View style={[styles.textWrapper, this.getHeightStyle()]}>
                {title}
            </View>
          );
        }
    }

    renderView() {
        let props = this.props;

        let leftIcon = (props.leftIcon) ? this.renderIcon(props.leftIcon, styles.leftIcon) : null;
        let rightIcon = (props.rightIcon) ? this.renderIcon(props.rightIcon, styles.rightIcon) : null;
        let otherIcon = (props.otherIcon) ? this.renderIcon(props.otherIcon, styles.otherIcon) : null;

        let showIcon = (props.onPress && !props.hideArrowIcon);

        let arrowIcon = (showIcon) ? (
          <View style={[styles.iconWrapper, this.getHeightStyle(), styles.arrowIcon]}>
            <FlyIconfonts name={'icon-left-arrow-m'} size={props.arrowIconSize} color={FlyColors.baseBorderColor2}/>
          </View>
        ) : null;

        let wrapperWithoutArrow = (showIcon) ? null : styles.wrapperWithoutArrow;

        return (
            <View style={[styles.container, props.style]}>
                <View style={[styles.wrapper, wrapperWithoutArrow, props.showSegment?styles.wrapperSegment:null]}>
                    {leftIcon}
                    {this.renderMain()}
                    {rightIcon}
                    {otherIcon}
                    {arrowIcon}
                </View>
            </View>
        );
    }

    render() {
        let props = this.props;
        if (props.onPress) {
            return (
                <TouchableHighlight onPress={props.onPress} underlayColor={FlyColors.baseBackgroundColor2}>
                    {this.renderView()}
                </TouchableHighlight>
            );
        } else {
            return this.renderView();
        }
    }

}

var styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingLeft: 15,
      backgroundColor: FlyColors.white,
    },
    wrapper: {
      flex: 1,
      flexDirection: 'row',
      paddingRight: 5,
    },
    wrapperWithoutArrow: {
      paddingRight: 15,
    },
    wrapperSegment: {
      borderBottomWidth: 0.5,
      borderBottomColor: FlyColors.baseBorderColor
    },
    borderTop: {
      borderTopWidth: 1,
      borderTopColor: FlyColors.baseBorderColor
    },
    borderBottom: {
      borderBottomWidth: 1,
      borderBottomColor: FlyColors.baseBorderColor
    },
    img: {
      width: 30,
      height: 30,
    },
    iconWrapper: {
      width: 40,
      justifyContent: 'center',
    },
    leftIcon: {
    },
    rightIcon: {
    },
    otherIcon: {
    },
    arrowIcon: {
      width: 25,
    },
    textWrapper: {
      flex: 1,
      flexDirection: 'row',
    },
    textTextWrapper: {
      flex: 1,
      // borderWidth:1
    },
    text: {
      flex: 1,
      color: FlyColors.baseTextColor,
    },

    otherTextWrapper: {
      flex: 1,
      alignItems: 'flex-end',
    }
});

FlyItem.height = ITEM_HEIGHT;
FlyItem.styles = styles;
FlyItem.textAlignVertical = textAlignVertical;

module.exports = FlyItem;
