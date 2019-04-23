/**
 * @providesModule FlyLabelItem
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
const {Text, OneLine} = require('FlyText');
const Utils = require('Utils');
export type Props = {
    text: string; // 左侧文字
    textStyle: any;
    otherText: string; // 右侧文字尾
    otherNote: string; // 右侧文字头
    otherTextStyle: any;
    height: number; // 高度
    showSegment: boolean; // 显示组内分割线
    style: any;
    key: string;
    labelWidth: number; // label的宽度
    onPress: () => Void;
    showArrowIcon: boolean;
    arrowIconSize: number;
    hideArrowIcon: boolean;
    errorMsg:string;
};

const ITEM_HEIGHT = 50;

class FlyLabelItem extends Component {
    props : Props;

    static defaultProps = {
      labelWidth: 100,
      arrowIconSize: 20,
    };

    getHeight() {
      return (this.props.height) ? this.props.height : ITEM_HEIGHT;
    }

    renderView() {
      let props = this.props;

      let content = null;

      let height = this.getHeight();

      let errorContent = null;
      let hasError = false;
      let errorMsg = props.errorMsg;
      if (!Utils.isEmpty(errorMsg)) {
        errorContent = (
          <View style={styles.errorMsgWrapper}>
            <Text style={[{flex:1},styles.errorText]}>
              <FlyIconfonts name='icon-warning' size={20} color={FlyColors.errorTextColor}/>
              &nbsp;&nbsp;&nbsp;&nbsp;
              {errorMsg}
            </Text>
          </View>
        );
        hasError = true;
      }

      if (props.children) {
        content = props.children;
      } else {
        let otherNote;
        if (props.otherNote) {
          otherNote=(<OneLine style={[styles.text, props.otherTextStyle,{color:'blue'},(hasError)?styles.errorText:null]}>{props.otherNote}</OneLine>)
        }
        content = (
          <View style={{flexDirection:'row'}}>
           {otherNote}
            <OneLine style={[styles.text, props.otherTextStyle, (hasError)?styles.errorText:null]}>{props.otherText}</OneLine>
            </View>
        );
      }

      let showIcon = ( props.showArrowIcon || props.onPress && !props.hideArrowIcon);

      let arrowIcon = (showIcon) ? (
        <View style={[styles.iconWrapper, {height: height}]}>
          <FlyIconfonts name={'icon-left-arrow-m'} size={props.arrowIconSize} color={(hasError)?FlyColors.errorTextColor:FlyColors.baseBorderColor2}/>
        </View>
      ) : null;

      let container = (
        <View style={[styles.container, props.style, (hasError)?styles.errorBackground:null]}>
            <View style={[styles.wrapper, props.showSegment?[styles.wrapperSegment,(hasError)?styles.wrapperSegmentError:null]:null]}>
              <View style={styles.inputContentWrapper}>
                <View style={[styles.leftWrapper, {
                    width: props.labelWidth,
                    height: height
                  }]}>
                    <Text style={[styles.text, props.textStyle, (hasError)?styles.errorText:null]}>{props.text}</Text>
                </View>
                <View style={[styles.rightWrapper, {height: height}]}>
                  {content}
                </View>
                {arrowIcon}
              </View>
              {errorContent}
            </View>
        </View>
      );

      return container;
    }

    render() {
        let props = this.props;

        if (props.onPress) {
          return (
            <TouchableHighlight ref={"pressView"} onPress={props.onPress} underlayColor={FlyColors.baseBackgroundColor2}>
              {this.renderView()}
            </TouchableHighlight>
          );
        }

        return this.renderView();
    }

}

var styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      paddingLeft: 15,
      backgroundColor: FlyColors.white,
    },
    wrapper: {
      flex: 1,
      flexDirection: 'column',
      paddingRight: 15,
    },
    wrapperSegment: {
      borderBottomWidth: 0.5,
      borderBottomColor: FlyColors.baseBorderColor
    },
    wrapperSegmentError: {
      borderBottomColor: FlyColors.errorTextColor
    },
    inputContentWrapper: {
      flex: 1,
      flexDirection: 'row',
      marginVertical: 2,
    },
    leftWrapper: {
      width: 100,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    rightWrapper: {
      flex: 1,
      paddingLeft: 10,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    text: {
      color: FlyColors.baseTextColor,
      fontSize: FlyDimensions.fontSizeXl,
    },
    textInput: {
      fontSize: FlyDimensions.fontSizeXxl,
      height: 30,
      flex: 1,
    },
    iconWrapper: {
      width: 15,
      justifyContent: 'center',
    },

    errorMsgWrapper:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      paddingBottom: 10,
    },
    errorText:{
      color: FlyColors.errorTextColor,
    },
    errorBackground: {
      backgroundColor: FlyColors.errorBackground
    }
});

FlyLabelItem.height = ITEM_HEIGHT;
FlyLabelItem.styles = styles;

module.exports = FlyLabelItem;
