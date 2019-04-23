/**
 * @providesModule FlyTextInput
 * 自定义条目
 */
'use strict'
import React, {Component} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';

const FlyColors = require('FlyColors');
const FlyDimensions = require('FlyDimensions');
const FlyStyles = require('FlyStyles');
const FlyIconfonts = require('FlyIconfonts');
const Utils = require('Utils');
const {Text} = require('FlyText');
const FlyImage = require('FlyImage');


export type Props = {
    text: string;
    textColor: string;
    textStyle:any;
    height: number;
    showSegment: boolean;
    style: any;
    labelWidth: number;
    errorMsg:string;
    imgSource:string;

    //以下为textInput属性
    textInputStyle:any;

    defaultValue: string;
    ref: string;
    placeholder: string;
    editable: boolean;
    keyboardType: string;
    onChangeText: any;
    autoFocus:boolean;
    secureTextEntry:boolean;
    maxLength: number;
    multiline:boolean;
    value:string;
    onFocus?:() => Void;
    onBlur?:() => Void;
};

const ITEM_HEIGHT = 50;

class FlyTextInput extends Component {
    props : Props;

    static defaultProps = {
      labelWidth: 100,
    };


    getHeight() {
      return (this.props.height) ? this.props.height : ITEM_HEIGHT;
    }

    focus() {
      if (this.refs && this.refs.textInput) {
        this.refs.textInput.focus();
      }
    }

    blur() {
      if (this.refs && this.refs.textInput) {
        this.refs.textInput.blur();
      }
    }

    render() {

        let {text,textStyle,height,showSegment,style,labelWidth,children,errorMsg,textInputStyle,...props} = this.props;

        let textColor = this.props.textColor ? this.props.textColor : FlyColors.baseTextColor;

        let content = null;

        let realHeight = this.getHeight();

        if (children) {
          content = (
            <View style={styles.rightContentWrapper}>
              {children}
            </View>
          );
        }

        let errorContent = null;
        let hasError = false;
        if (!Utils.isEmpty(errorMsg)) {
          errorContent = (
            <View style={styles.errorMsgWrapper}>
              <Text style={styles.errorText}>
                <FlyIconfonts name='icon-warning' size={15} color={FlyColors.errorTextColor}/>
                &nbsp;&nbsp;&nbsp;&nbsp;
                {errorMsg}
              </Text>
            </View>
          );
          hasError = true;
        }
        let textStyleContainer;
        if (textStyle) {
          textStyleContainer = textStyle;
        }else {
          textStyleContainer = styles.text;
        }

        return (
          <View style={[styles.container, style, (hasError)?styles.errorBackground:null]}>
              <View style={styles.wrapper, showSegment?[styles.wrapperSegment,(hasError)?styles.wrapperSegmentError:null]:null}>
                <View style={styles.inputContentWrapper}>
                  <View style={[styles.leftWrapper, {
                      width: labelWidth,
                      height: realHeight
                    }]}>
                      <Text style={[styles.text,{color:textColor},(hasError)?styles.errorText:null]}>{text}</Text>
                  </View>
                  <TextInput style={[
                      styles.textInput,
                      {
                        height: realHeight,
                      },
                      textInputStyle,
                      (hasError)?styles.errorText:null
                    ]}
                    clearButtonMode={'while-editing'}
                    placeholderTextColor={(hasError)?FlyColors.errorTextColor:FlyColors.placeholderTextColor}
                    {...props}
                    ref={"textInput"}
                  />

                  {content}
                </View>
                {errorContent}
              </View>
          </View>
        );
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
    textInput: {
      fontSize: FlyDimensions.fontSizeXl,
      paddingLeft: 10,
      marginRight: 15,
      borderWidth: 0,
      flex: 1
    },
    text: {
      fontSize: FlyDimensions.fontSizeXl,
    },
    rightContentWrapper: {
    },
    errorMsgWrapper:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      paddingBottom: 10
    },
    errorText:{
      color: FlyColors.errorTextColor,
    },
    errorBackground: {
      backgroundColor: FlyColors.errorBackground
    }
});

module.exports = FlyTextInput;
