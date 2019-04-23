/**
 *
 *
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
} from 'react-native';

import {connect} from 'react-redux';

const Utils = require('Utils');

const FlyStyles = require('FlyStyles');
const FlyColors = require('FlyColors');
const FlyIconfonts = require('FlyIconfonts');
const FlyDimensions = require('FlyDimensions');
const FlyHeader = require('FlyHeader');
const FlyLoading = require('FlyLoading');
const FlyTimerButton = require('FlyTimerButton');
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

const {setPassword} = require('../../actions');

type Props = {
    navigator: Navigator;
    type: String; // 'RPA_back' 启动返回动画
};

class RegisterPassView extends Component {
    props : Props;

    constructor(props) {
        super(props);

        (this: any).gotoScene = this.gotoScene.bind(this);
        (this: any).checkBtn = this.checkBtn.bind(this);
        (this: any).setPassword = this.setPassword.bind(this);
        (this: any).passwordValidate = this.passwordValidate.bind(this);

        this.lock = true;

        this.state = {
          fadeAnim: new Animated.Value(0),
          fadeAnim1: new Animated.Value(0),
          third: false,
          newpass: false,
          oldpass: false,
          RPA_text: new Animated.Value(0),
          RPA_pass: null,
          RPA_verifyPass: null,
          spreadCode:null,

        };

        this.otherInfo = {
          device_token: '',
          unique_device_id: '',
          location: {},
          channel:'',
        };

    }

     initOtherInfo() {
      NativeModuleUtils.getBundleInfo(bundleInfo=>{
        this.otherInfo.channel = bundleInfo.appChannel;
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


    componentDidMount() {

      this.initOtherInfo();
      if (this.props.type == 'RPA_back') {
        TimerMixin.setTimeout(()=>{
          Animated.timing(
            this.state.fadeAnim1,//初始值
            {
              toValue: -20,
              duration: 200,
            }//结束值
          ).start();
          Animated.timing(
            this.state.RPA_text,//初始值
            {
              toValue: FlyDimensions.deviceDim.width,
              duration: 300,
            }//结束值
          ).start();
        }, 100);
      }else {
        TimerMixin.setTimeout(()=>{
          Animated.timing(
            this.state.fadeAnim,//初始值
            {
              toValue: 20,
              duration: 300,
            }//结束值
          ).start();
          Animated.timing(
            this.state.RPA_text,//初始值
            {
              toValue: -FlyDimensions.deviceDim.width,
              duration: 300,
            }//结束值
          ).start();
        }, 100);
        TimerMixin.setTimeout(() => {
          this.setState({
            third: true,
          })
        },400)
      }
      this.keyboardWillShow=DeviceEventEmitter.addListener('keyboardWillShow',()=>this.keyOpen());
      this.keyboardWillHide=DeviceEventEmitter.addListener('keyboardWillHide',()=>this.keyClose());
    }

    componentWillUnmount() {
      if (this.keyboardWillShow) {
        this.keyboardWillShow.remove();
      }
      if (this.keyboardWillHide) {
        this.keyboardWillHide.remove();
      }
    }

    keyOpen() {
      this.setState({
        newpass: this.refs.editable.refs.idx_0.isFocused(),
        oldpass: this.refs.editable.refs.idx_1.isFocused(),
      })
    }

    keyClose() {
      this.setState({
        newpass: this.refs.editable.refs.idx_0.isFocused(),
        oldpass: this.refs.editable.refs.idx_1.isFocused(),
      })
    }

    gotoScene(type,skipType) {
        Animated.timing(
          this.state.RPA_text,//初始值
          {
            toValue: FlyDimensions.deviceDim.width,
            duration: 0,
          }//结束值
        ).start();
        this.props.gotoScene(type,skipType)
    }

    checkBtn() {
      
      if (Utils.isEmpty(this.state.RPA_pass)) {
        return false;
      }
      if (this.state.RPA_pass.length < 8) {
        return false;
      }
      if (Utils.isEmpty(this.state.RPA_verifyPass)) {
        return false;
      }
      if (this.state.RPA_verifyPass.length < 8) {
        return false;
      }
      return true;
    }

    passwordValidate() {
      if (!(/^([a-z]|[A-Z]|[0-9]|\.|\_|\$|\@){8,20}$/).test(this.state.RPA_pass)) {
        Utils.alert('新密码格式错误：请填写8到20位数字或字母');
        return false;
      }
      if (this.state.RPA_pass != this.state.RPA_verifyPass) {
        Utils.alert('两次密码输入不一致');
        return false;
      }
      return true;
    }

    setPassword() {
      if (this.lock) {
        this.lock = false;
        if (this.passwordValidate()) {
          this.refs.loading.open();
          let parms = {
            phone:this.props.registerPhone,
          	password:this.state.RPA_pass,
          	rePassword:this.state.RPA_verifyPass,
          	spreadCode:this.state.spreadCode
          }
          let promise = this.props.dispatch(setPassword(parms,this.otherInfo));
          promise.then((data) => {
            this.lock = true;
            this.refs.loading.close();
            this.props.gotoScene('register-complete',null,{registerPass: this.state.RPA_pass})
          }).catch((error) => {
            this.lock = true;
            this.refs.loading.close();
            Utils.alert(error.msg)
          })
        }else {
          this.lock = true;
        }
      }
    }

    render() {
      let margin = (this.props.type == 'RPA_back') ? (-FlyDimensions.deviceDim.width + 15) : (FlyDimensions.deviceDim.width + 15);
      let marginBtn = (this.props.type == 'RPA_back') ? (-FlyDimensions.deviceDim.width + 15) : (FlyDimensions.deviceDim.width -30);

      let newColor = (this.state.newpass) ? FlyColors.baseColor : '#DDDDDD';
      let oldColor = (this.state.oldpass) ? FlyColors.baseColor : '#DDDDDD';
      return (
        <View style={styles.shareWrapper}>
          <View style={{marginTop: 30,marginLeft: 15,marginRight: 15,flexDirection: 'row',alignItems: 'center',width: FlyDimensions.deviceDim.width - 30}}>
            <TouchableOpacity style={{flex: 1}} onPress={() => this.gotoScene('register-code','RC_back')}>
              <FlyIconfonts name={'icon-right-arrow-m'} size={25} color={FlyColors.baseTextColor4}/>
            </TouchableOpacity>
            <View style={{flex: 9,alignItems: 'center',justifyContent: 'flex-end',flexDirection: 'row'}}>
              <FlyImage source={'./imgs/login/Oval2.png'} resizeMode={'stretch'} style={{width: 30,height: 30,justifyContent: 'center',alignItems: 'center'}}>
                <Text style={{backgroundColor: 'rgba(0,0,0,0)',fontSize: FlyDimensions.fontSizeXxxl,color: FlyColors.white,fontWeight: 'bold'}}>1</Text>
              </FlyImage>
              <View style={{height: 5,backgroundColor: FlyColors.baseColor,width: 20}}>
              </View>
              <FlyImage source={'./imgs/login/Oval2.png'} resizeMode={'stretch'} style={{width: 30,height: 30,justifyContent: 'center',alignItems: 'center'}}>
                <Text style={{backgroundColor: 'rgba(0,0,0,0)',fontSize: FlyDimensions.fontSizeXxxl,color: FlyColors.white,fontWeight: 'bold'}}>2</Text>
              </FlyImage>
              <View style={{height: 5,backgroundColor: FlyColors.baseColor,width: 20}}>
                {(this.props.type == 'RPA_back') ? null : (
                  <Animated.View style={{backgroundColor:'#CCCCCC',height:5,transform:[{translateX:this.state.fadeAnim}]}}>
                  </Animated.View>
                )}
              </View>
              <View style={{height: 5,backgroundColor: '#CCCCCC',width: 20,marginLeft: 30}}>
                {(this.props.type == 'RPA_back') ? (
                  <Animated.View style={{backgroundColor:FlyColors.baseColor,height:5,transform:[{translateX:this.state.fadeAnim1}]}}>
                  </Animated.View>
                ) : null}
              </View>
              <View style={{width: 90,height: 30,borderRadius: 15,backgroundColor: '#CCCCCC',justifyContent: 'center',alignItems: 'center'}}>
                <Text style={{fontSize: FlyDimensions.fontSizeXxl,color: FlyColors.white,fontWeight: 'bold'}}>1888红包</Text>
              </View>
              {(this.state.third || this.props.type == 'RPA_back') ? (
                <FlyImage source={'./imgs/login/Oval2.png'} resizeMode={'stretch'} style={{width: 30,height: 30,justifyContent: 'center',alignItems: 'center',position: 'absolute',right: 110}}>
                  <Text style={{backgroundColor: 'rgba(0,0,0,0)',fontSize: FlyDimensions.fontSizeXxxl,color: FlyColors.white,fontWeight: 'bold'}}>3</Text>
                </FlyImage>
              ) : (
                <View style={{width: 30,height: 30,borderRadius: 15,backgroundColor: '#CCCCCC',justifyContent: 'center',alignItems: 'center',position: 'absolute',right: 110}}>
                  <Text style={{backgroundColor: 'rgba(0,0,0,0)',fontSize: FlyDimensions.fontSizeXxxl,color: FlyColors.white,fontWeight: 'bold'}}>3</Text>
                </View>
              )}
            </View>
          </View>
          <FlyEditableScrollView ref={'editable'} AnimationClose={false} scrollEnabled={false}>
            <Animated.View style={[{transform:[{translateX:this.state.RPA_text}]},{marginTop: 10,marginLeft: margin,marginRight: 15}]}>
              <View style={{marginTop: 35,width: FlyDimensions.deviceDim.width}}>
                <Text style={{fontSize: FlyDimensions.fontSizeH0}}>请设置您的登录密码</Text>
              </View>
              <View style={{width: FlyDimensions.deviceDim.width-30,marginTop: 50,alignItems: 'center',flexDirection: 'row',borderBottomWidth: 1,borderBottomColor: newColor,paddingBottom: 10,flex: 1}}>
                <FlyIconfonts name={'icon-lock'} size={20} color={FlyColors.baseTextColor4} style={{marginRight: 10}}/>
                <TextInput
                  style={{width: FlyDimensions.deviceDim.width - 70,height: 30}}
                  placeholderTextColor={'#CCCCCC'}
                  maxLength={20}
                  keyboardType={'ascii-capable'}
                  clearButtonMode={'while-editing'}
                  onChangeText={(text) => this.setState({RPA_pass: text})}
                  placeholder="请输入8-20位登录密码"/>
              </View>
              <View style={{width: FlyDimensions.deviceDim.width-30,marginTop: 10,alignItems: 'center',flexDirection: 'row',borderBottomWidth: 1,borderBottomColor: oldColor,paddingBottom: 10,flex: 1}}>
                <FlyIconfonts name={'icon-lock-repeat'} size={20} color={FlyColors.baseTextColor4} style={{marginRight: 10}}/>
                <TextInput
                  style={{width: FlyDimensions.deviceDim.width - 70,height: 30}}
                  placeholderTextColor={'#CCCCCC'}
                  maxLength={20}
                  keyboardType={'ascii-capable'}
                  clearButtonMode={'while-editing'}
                  onChangeText={(text) => this.setState({RPA_verifyPass: text})}
                  placeholder="请再次输入登录密码"/>
              </View>
              <View style={{width: FlyDimensions.deviceDim.width-30,marginTop: 10,alignItems: 'center',flexDirection: 'row',borderBottomWidth: 1,borderBottomColor: oldColor,paddingBottom: 10,flex: 1}}>
                <FlyIconfonts name={'icon-invite'} size={20} color={FlyColors.baseTextColor4} style={{marginRight: 10}}/>
                <TextInput
                  style={{width: FlyDimensions.deviceDim.width - 70,height: 30}}
                  placeholderTextColor={'#CCCCCC'}
                  maxLength={20}
                  keyboardType={'ascii-capable'}
                  clearButtonMode={'while-editing'}
                  onChangeText={(text) => this.setState({spreadCode: text})}
                  placeholder="邀请码或对方手机号码(选填)"/>
              </View>
              <View style={{alignItems: 'center',marginTop: 50,flex: 1}}>
                <FlyButton text={'完成'} disabled={!this.checkBtn()} onPress={() => this.setPassword()} style={[styles.btn,{marginLeft: marginBtn},(!this.checkBtn()) ? {backgroundColor: '#FAC6A7'} : {backgroundColor: FlyColors.baseColor}]} size={'sm'} type={'self'} textColor={FlyColors.white}/>
              </View>
            </Animated.View>
          </FlyEditableScrollView>
          <FlyLoading ref="loading" modalStyle={FlyStyles.loadingModal} text="加载中..."/>
        </View>
      )
    }

}

var styles = StyleSheet.create({
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

function select(store) {
    return {

    };
}

module.exports = connect(select)(RegisterPassView);
