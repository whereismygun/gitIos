/**
 *
 *
 * @providesModule FlyApp
 * @flow
 *
 */

'use strict';

import React from 'react';
import {
  StyleSheet,
  View ,
  DeviceEventEmitter,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated
} from 'react-native';

const { connect } = require('react-redux');
const Utils = require('Utils');
const FlyModalBox = require('FlyModalBox');
const FlyDimensions = require('FlyDimensions');
const FlyImage = require('FlyImage');
const {Text} = require('FlyText');
const FlyEditableScrollView = require('FlyEditableScrollView');
const FlyColors = require('FlyColors');
const FlyIconfonts = require('FlyIconfonts');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyTimerButton = require('FlyTimerButton');
const TimerMixin = require('react-timer-mixin');
const env = require('env');
const FlyGuideModal = require('FlyGuideModal');
const FlyButton = require('FlyButton');
const FlyNavigator = require("./screens/base/FlyNavigator");
const LoginModalView = require('./screens/login/LoginModalView');
//
const FindPhoneView = require('./screens/login/FindPhoneView');
const FindCodeView = require('./screens/login/FindCodeView');
const FindPassView = require('./screens/login/FindPassView');

const RegisterPhoneView = require('./screens/login/RegisterPhoneView');
const RegisterCodeView = require('./screens/login/RegisterCodeView');
const RegisterPassView = require('./screens/login/RegisterPassView');
const RegisterCompleteView = require('./screens/login/RegisterCompleteView');
const GuideItem = [{Top: FlyDimensions.deviceDim.height * 0.2,imgUrl: './imgs/guide/guide1.png'},{Top: FlyDimensions.deviceDim.height * 0.45,imgUrl: './imgs/guide/guide2.png'},{Bottom: 15,imgTop: true,imgUrl: './imgs/guide/guide3.png'}]

const SceneUtils = require('SceneUtils');


var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    modal: {
      flexDirection: 'column',
      height:FlyDimensions.deviceDim.height,
      backgroundColor: 'rgba(0,0,0,0)',
    },
    modalWrapper: {
      flexDirection: 'row',
    },
    shareWrapper: {
      flex: 1,
      flexDirection: 'column',
    },
    btn: {
      width: FlyDimensions.deviceDim.width - 30,
      borderRadius: 25,
      height: 50,
      backgroundColor: FlyColors.baseColor
    }
});

var App = React.createClass({


    getInitialState: function() {
      return {
        type: 'login',
        skipType: null,
        forgetPhone: null,
        registerPhone: null,
        registerPass: null,
      };
    },

    componentDidMount: function () {
      // 启动app,第一次会注册第三方
      NativeModuleUtils.initNativeModules();
      SceneUtils.setStatusBarStyle('default');
      SceneUtils.gotoScene('TAB_VIEW::enter');
      this.loginModal = DeviceEventEmitter.addListener(env.ListenerMap['LOGIN_MODAL'], () => {
        this.setState({
          forgetPhone: null,
          registerPhone: null,
          registerPass: null,
          type: 'login',
          skipType: null,
        })
        this.refs.loginModalBox.open();
      });
      this.guideModal = DeviceEventEmitter.addListener(env.ListenerMap['GUIDE_MODAL'], () => {
        this.refs.guideModalBox.open();
      });
    },

    componentWillUnmount: function () {
      // 关闭app
      NativeModuleUtils.removeNativeModules();
      if (this.loginModal) {
        this.loginModal.remove();
      }
    },


    render: function () {
      if (!this.props.isLoggedIn) {
        //TODO没处理
      }
      return (
          <View style={styles.container}>
              <FlyNavigator />
              {this.ModalView()}
              {this.guideView()}
          </View>
      )
    },

    guideView: function () {
      return (
        <FlyModalBox style={styles.modal} swipeToClose={false} backdropColor={'white'} backdropOpacity={0.1} position={"top"} ref={"guideModalBox"}>
          <FlyGuideModal content={GuideItem} closeGuide={this.closeGuide}/>
        </FlyModalBox>
      )
    },

    ModalView: function () {
      return (
        <FlyModalBox style={styles.modal} swipeToClose={false}  modalStyle={styles.modalWrapper} backdropColor={'white'} backdropOpacity={0.95} position={"top"} ref={"loginModalBox"}>
          <FlyImage source={'./imgs/login/Rectangle@3x.png'} style={{flex:1}} width={FlyDimensions.deviceDim.width}>
            {this.contentView(this.state.type)}
          </FlyImage>
        </FlyModalBox>
      )
    },

    gotoScene: function (type,skipType,parms) {
      this.setState({
        type: type,
        skipType: skipType
      })
      if (parms && parms.forgetPhone) {
        this.setState({
          forgetPhone: parms.forgetPhone
        })
      }
      if (parms && parms.registerPhone) {
        this.setState({
          registerPhone: parms.registerPhone
        })
      }
      if (parms && parms.registerPass) {
        this.setState({
          registerPass: parms.registerPass
        })
      }
    },

    closeModal: function () {
      this.refs.loginModalBox.close()
    },

    closeGuide: function () {
      this.refs.guideModalBox.close()
    },

    findPhoneView: function () {
      return (
        <FindPhoneView navigator={this.props.navigator} type={this.state.skipType} gotoScene={this.gotoScene}/>
      )
    },

    findCodeView: function () {
      return (
        <FindCodeView navigator={this.props.navigator} forgetPhone={this.state.forgetPhone} type={this.state.skipType} gotoScene={this.gotoScene}/>
      )
    },

    findPassView: function () {
      return (
        <FindPassView navigator={this.props.navigator} forgetPhone={this.state.forgetPhone} type={this.state.skipType} gotoScene={this.gotoScene}/>
      )
    },

    registerPhoneView: function () {
      return (
        <RegisterPhoneView navigator={this.props.navigator} type={this.state.skipType} gotoScene={this.gotoScene}/>
      )
    },

    registerCodeView: function () {
      return (
        <RegisterCodeView navigator={this.props.navigator} registerPhone={this.state.registerPhone} type={this.state.skipType} gotoScene={this.gotoScene}/>
      )
    },

    registerPassView: function () {
      return (
        <RegisterPassView navigator={this.props.navigator} registerPhone={this.state.registerPhone} type={this.state.skipType} gotoScene={this.gotoScene}/>
      )
    },

    registerCompleteView: function () {
      return (
        <RegisterCompleteView navigator={this.props.navigator} registerPhone={this.state.registerPhone} registerPass={this.state.registerPass} closeModal={this.closeModal} type={this.state.skipType} gotoScene={this.gotoScene}/>
      )
    },

    contentView: function (type) {
      switch (type) {
        case 'login':
          return this.loginView();
          break;
        case 'find-phone':
          return this.findPhoneView();
          break;
        case 'find-code':
          return this.findCodeView();
          break;
        case 'find-pass':
          return this.findPassView();
          break;
        case 'register-phone':
          return this.registerPhoneView();
          break;
        case 'register-code':
          return this.registerCodeView();
          break;
        case 'register-pass':
          return this.registerPassView();
          break;
        case 'register-complete':
          return this.registerCompleteView();
          break;
      }
    },

    loginView: function () {
      return (
        <LoginModalView navigator={this.props.navigator} closeModal={this.closeModal} type={this.state.skipType} gotoScene={this.gotoScene}/>
      )
    }

});

function select(store) {
    return {
        isLoggedIn: store.user.isLoggedIn,
    };
}



module.exports = connect(select)(App);
