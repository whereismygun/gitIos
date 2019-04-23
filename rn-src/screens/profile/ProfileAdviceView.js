/**
 *
 *
 * @flow
 *
 */
'use strict';
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Navigator,
  View,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';


import {connect} from 'react-redux';

const Filters = require('Filters');
const FlyColors = require('FlyColors');
const FlyStyles = require('FlyStyles');
const FlyDimensions = require('FlyDimensions');
const FlyTextInput = require('FlyTextInput');
const FlyHeader = require('FlyHeader');
const FlyImage = require('FlyImage');
const FlyBase = require('FlyBase');
const FlyItem = require('FlyItem');
const {Text} = require('FlyText');
const FlySysNotice = require('FlySysNotice');
const FlyBottomButton = require('FlyBottomButton');
const SceneUtils = require('SceneUtils');
const Utils = require('Utils');
const FlyEditableScrollView = require('FlyEditableScrollView');

var {
  doSaveUserSuggestion,
} = require('../../actions');

type Props = {
  navigator: Navigator;
};

class ProfileAdviceView extends React.Component {
  props : Props;

  constructor(props) {
      super(props);
      (this: any).textChange = this.textChange.bind(this);
      (this: any).onPressBuy = this.onPressBuy.bind(this);
      this.state = {
        count: 0,
        content: "",
        title: "",
      }
  }

  componentDidMount() {

  }

  onPressBuy() {
    if (this.state.content.length !== 0) {

    let promise = this.props.dispatch(doSaveUserSuggestion(Filters.isEmoji(this.state.content)));
     promise.then((data)=>{
      Utils.info('提交成功',"感谢您的意见,我们会及时跟进解决",()=>SceneUtils.goBack());

     }).catch((err)=>{
       Utils.alert(err.msg||'网络繁忙请稍后重试');
     });

    }else {
      Utils.alert('请输入您的反馈内容!');
    }
  }

  textChange(text) {
    this.setState({
      count: text.length,
      content: text,
    });
  }

  _renderTextInput() {
    return (
      <View style={{backgroundColor:'white'}}>
        <View style={styles.borderBottom}>
          <View style={styles.titleStyle}>
            <Text>反馈内容</Text>
          </View>
          <View style={styles.textView}>
            <TextInput
              placeholder = {'请详细描述您的问题或者建议,我们将及时跟进解决'}
              style={styles.textInput}
              onChangeText = {(text) => this.textChange(text)}
              maxLength = {100}
              multiline = {true}
            />
            <Text style={styles.count}>{this.state.count}/100</Text>
          </View>
        </View>

       </View>
    );
  }


  render() {
    let leftItem = {
        type: "back",
    };
    return (
      <View style={{flex:1,backgroundColor:FlyColors.baseBackgroundColor}}>

        <FlyHeader leftItem={leftItem} title={"意见反馈"} borderBottom={true} backgroundColor='white'/>

        <FlyEditableScrollView alwaysBounceVertical = {false}>
          {this._renderTextInput()}
        </FlyEditableScrollView>
        <FlyBottomButton text={'提交'} onPress={() => this.onPressBuy()}>
        </FlyBottomButton>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    paddingBottom: FlyBottomButton.height,

  },
  white: {
    borderColor: FlyColors.baseBackgroundColor,
    height:FlyDimensions.deviceDim.height * 0.2
  },
  borderBottom: {
    borderBottomWidth: 10,
    borderColor: FlyColors.baseBackgroundColor,
  },
  count: {
    flex: 1,
    textAlign: 'right',
    marginRight: 10,
  },
  textView: {
    padding: 10,
    borderTopWidth: 0.5,
    borderColor: FlyColors.baseBackgroundColor,
  },
  titleStyle: {
    borderColor: FlyColors.baseBackgroundColor,
    borderTopWidth: 10,
    padding: 10,
  },
  textInput: {
    height: 100,
    fontSize: FlyDimensions.fontSizeLarge,
  },
});

function select(store) {
  return {
    isLoggedIn: store.user.isLoggedIn,
  };
}

module.exports = connect(select)(ProfileAdviceView);
