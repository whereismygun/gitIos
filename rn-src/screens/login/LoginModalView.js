/**
 *
 * @providesModule LoginModalView
 * @flow
 *
 */
'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Alert,
    TouchableOpacity,
    Navigator,
    TextInput,
    Animated,
    InteractionManager,
    DeviceEventEmitter,
    Easing
} from 'react-native';

import {connect} from 'react-redux';

const Utils = require('Utils');

const FlyStyles = require('FlyStyles');
const FlyColors = require('FlyColors');
const FlyIconfonts = require('FlyIconfonts');
const FlyDimensions = require('FlyDimensions');
const FlyHeader = require('FlyHeader');
const FlyLoading = require('FlyLoading');
const FlyButton = require('FlyButton');
const FlyImage = require('FlyImage');
const FlyRegister = require('./FlyRegister');
const FlyFindPwd = require('./FlyFindPwd');
const env = require('env');
const SceneUtils = require('SceneUtils');
const TimerMixin = require('react-timer-mixin');
const FlyTextInput = require('FlyTextInput');
const {Text} = require('FlyText');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyEditableScrollView = require('FlyEditableScrollView');
const {cancellation} = require('fly-react-naitve-jpush');
const {checkUserRegister,login} = require('../../actions');

type Props = {
    navigator: Navigator;
    type: String; // 'LG_back' 启动返回动画
};

class LoginModalView extends Component {
    props : Props;

    constructor(props) {
        super(props);

        (this: any).keyOpen = this.keyOpen.bind(this);
        (this: any).gotoScene = this.gotoScene.bind(this);
        (this: any).goLogin = this.goLogin.bind(this);
        (this: any).checkBtn = this.checkBtn.bind(this);
        (this: any).keyClose = this.keyClose.bind(this);

        this.unique_device_id='';
        this.otherInfo = {
          device_token: '',
          unique_device_id: '',
          tongdun_token: '',
          location: {},
          channel:'',
        };
        this.state = {
          fadeAnim: new Animated.Value(1),
          LG_textH: 0,
          LG_view: new Animated.Value(0),
          LG_content: new Animated.Value(0),
          LG_phone: null,
          opnePH: false,
          openPA: false,
          LG_pass: null,
          LG_eyes: true,
        };
    }



    componentDidMount() {
        this.initOtherInfo();
        if (this.props.type == 'LG_back') {
        TimerMixin.setTimeout(()=>{
          Animated.timing(
            this.state.LG_view,//初始值
            {
              toValue: FlyDimensions.deviceDim.width,
              duration: 300,
            }//结束值
          ).start();
        }, 100);
      }
      NativeModuleUtils.getUDID((data)=>{
        this.unique_device_id = data;
      });
      this.keyboardWillShow=DeviceEventEmitter.addListener('keyboardWillShow',()=>this.keyOpen());
      this.keyboardWillHide=DeviceEventEmitter.addListener('keyboardWillHide',()=>this.keyClose());
    }

       initOtherInfo() {

      NativeModuleUtils.getBundleInfo(bundleInfo=>{
        this.otherInfo.channel = bundleInfo.appChannel;
        this.otherInfo.info = bundleInfo;
      });
      NativeModuleUtils.getDeviceToken((data) => {
        this.otherInfo.device_token = data;
      });
      NativeModuleUtils.getUDID((data) => {
        this.otherInfo.unique_device_id = data;
      });

      NativeModuleUtils.getLocation((data) => {
        this.otherInfo.location = data;
      });
     
    }

    componentWillUnmount() {
      if (this.keyboardWillShow) {
        this.keyboardWillShow.remove();
      }
      if (this.keyboardWillHide) {
        this.keyboardWillHide.remove();
      }
    }

    gotoScene(type) {
      this.props.gotoScene(type)
    }

    keyOpen() {
        let height = (FlyDimensions.deviceDim.height < 600) ? 70 : 20;
        Animated.timing(
          this.state.fadeAnim, {
            toValue: 0, // 目标值
            duration: 300, // 动画时间
            easing: Easing.linear // 缓动函数
        }).start();
        Animated.timing(
          this.state.LG_content, {
            toValue: -150, // 目标值
            duration: 600, // 动画时间
        }).start();
      this.setState({
        openPH: this.refs.editable.refs.idx_0.isFocused(),
        openPA: this.refs.editable.refs.idx_1.isFocused(),
      })
    }

    keyClose() {
      Animated.timing(
        this.state.LG_content, {
          toValue: 0, // 目标值
          duration: 400, // 动画时间
      }).start();
      Animated.timing(
        this.state.fadeAnim, {
          toValue: 1, // 目标值
          duration: 1000, // 动画时间
          easing: Easing.linear // 缓动函数
      }).start();
      this.setState({
        openPH: this.refs.editable.refs.idx_0.isFocused(),
        openPA: this.refs.editable.refs.idx_1.isFocused(),
      })
    }

    checkBtn() {
      if (Utils.isEmpty(this.state.LG_phone)) {
        return false;
      }
      if (this.state.LG_phone.length < 11) {
        return false;
      }
      if (Utils.isEmpty(this.state.LG_pass)) {
        return false;
      }
      if (this.state.LG_pass.length < 8) {
        return false;
      }
      return true;
    }

    goLogin() {

      if (Utils.checkMobile(this.state.LG_phone)) {
        this.refs.loading.open();
        let promise = this.props.dispatch(checkUserRegister(this.state.LG_phone,this.unique_device_id));
        promise.then((data)=>{
          if(data == true){

            this._login()
          }else{
            this.refs.loading.close();
            Utils.alert('该手机号尚未注册，请于注册后登陆！');
          }
        }).catch((err)=>{
          this.refs.loading.close();
          Utils.alert('登录失败！请重试');
        });
      }else {
        Utils.alert('手机号码格式不正确');
      }
    }

    _login() {

      let promise = this.props.dispatch(login(this.state.LG_phone, this.state.LG_pass,this.otherInfo));
      promise.then((data) => {
        this.refs.loading.close();
        DeviceEventEmitter.emit(env.ListenerMap['LOGIN_EVENT']);
        cancellation({phone:this.state.LG_phone},(resopne)=>{});
        this.props.closeModal()
      }).catch((error) => {
        this.refs.loading.close();
        Utils.alert(error.msg || "登录失败，请重试!");
      })
    }

    render() {
      let margin = (this.props.type == 'LG_back') ? -FlyDimensions.deviceDim.width : 0;
      let phoneColor = (this.state.openPH) ? FlyColors.baseColor : '#DDDDDD';
      let passColor = (this.state.openPA) ? FlyColors.baseColor : '#DDDDDD';
      return (
        <Animated.View style={[{transform:[{translateX:this.state.LG_view}]},styles.shareWrapper,{marginLeft: margin}]}>
          <View style={{marginTop: 30,marginLeft: 15,flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => {
                SceneUtils.goBack();
                this.props.closeModal();
              }}>
              <FlyIconfonts name={'icon-cancel'} size={20} color={'#CCCCCC'}/>
            </TouchableOpacity>
            <View style={{flex: 1,alignItems: 'flex-end',marginRight: 15}}>
              <TouchableOpacity onPress={() => this.gotoScene('register-phone')} style={{height: 30,justifyContent: 'center'}}>
                <Text style={{color: FlyColors.baseColor,fontSize: 16}}>三步注册</Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlyEditableScrollView ref={'editable'} AnimationClose={false} scrollEnabled={false}>
            <Animated.View style={{transform:[{translateY:this.state.LG_content}],marginTop:10}}>
              <View style={{alignItems: 'center'}}>
                <Animated.View style={{flex: 1,opacity: this.state.fadeAnim}}>
                  <FlyImage source={'./imgs/login/logo@3x.png'} width={FlyDimensions.deviceDim.width * 0.5}/>
                </Animated.View>
              </View>
              <View style={{marginTop:50}} onLayout={(e) => this.setState({LG_textH: e.nativeEvent.layout.y+e.nativeEvent.layout.height})}>
                <View>
                  <View style={{alignItems: 'center',flexDirection: 'row',borderBottomWidth: 1,borderBottomColor: phoneColor,marginHorizontal: 15,paddingBottom: 10}}>
                    <FlyIconfonts name={'icon-invite'} size={20} color={FlyColors.baseTextColor4} style={{marginRight: 10}}/>
                    <TextInput
                      style={[{width: FlyDimensions.deviceDim.width - 70,height: 30},(this.state.openPH) ? {fontSize: 24} : null]}
                      placeholderTextColor={'#CCCCCC'}
                      maxLength={11}
                      clearButtonMode={'while-editing'}
                      keyboardType={'number-pad'}
                      onChangeText={(text) => this.setState({LG_phone: text})}
                      placeholder="请输入手机号码"/>
                  </View>
                  <View style={{marginTop: 10,alignItems: 'center',flexDirection: 'row',borderBottomWidth: 1,borderBottomColor: passColor,marginHorizontal: 15,paddingBottom: 10}}>
                    <FlyIconfonts name={'icon-lock'} size={20} color={FlyColors.baseTextColor4} style={{marginRight: 10}}/>
                    <TextInput
                      style={{width: FlyDimensions.deviceDim.width - 100,height: 30}}
                      placeholderTextColor={'#CCCCCC'}
                      maxLength={20}
                      clearButtonMode={'while-editing'}
                      secureTextEntry={this.state.LG_eyes}
                      onChangeText={(text) => this.setState({LG_pass: text})}
                      placeholder="请输入登录密码"/>
                    <TouchableOpacity style={{flex: 1,alignItems: 'center',paddingTop: 10}} onPress={() => this.setState({LG_eyes: !this.state.LG_eyes})}>
                      <FlyIconfonts name={(this.state.LG_eyes) ? 'icon-eyes' : 'icon-open-eye'} size={20} color={FlyColors.baseTextColor4}/>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{alignItems: 'center',marginTop: 50,flex: 1}}>
                  <FlyButton text={'登录'} onPress={() => this.goLogin()} disabled={!this.checkBtn()} style={[styles.btn,(!this.checkBtn()) ? {backgroundColor: '#FAC6A7'} : {backgroundColor: FlyColors.baseColor}]} size={'sm'} type={'self'} textColor={FlyColors.white}/>
                </View>
                <View style={{flex: 1,alignItems: 'flex-end',marginTop: 15,marginRight: 20}}>
                  <TouchableOpacity style={{height: 30}} onPress={() => this.gotoScene('find-phone')}>
                    <Text style={{color: '#CCCCCC',fontSize: 15}}>忘记密码?</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </FlyEditableScrollView>
          <FlyLoading ref="loading" modalStyle={FlyStyles.loadingModal} text="加载中..."/>
        </Animated.View>
      )
    }

}

var styles = StyleSheet.create({
  modal: {
    flexDirection: 'column',
    height:FlyDimensions.deviceDim.height,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  modalWrapper: {
    flexDirection: 'row',
  },
  shareWrapper: {
    width: FlyDimensions.deviceDim.width,
    height: FlyDimensions.deviceDim.height,
  },
  btn: {
    width: FlyDimensions.deviceDim.width - 30,
    borderRadius: 25,
    height: 50,
  }
});

function select(store) {
    return {

    };
}

module.exports = connect(select)(LoginModalView);
