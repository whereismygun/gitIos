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

const {checkUserRegister} = require('../../actions');


type Props = {
    navigator: Navigator;
    type: String; // 'FPH_back' 启动返回动画
};

class FindPhoneView extends Component {
    props : Props;

    constructor(props) {
        super(props);

        (this: any).gotoScene = this.gotoScene.bind(this);
        (this: any).checkBtn = this.checkBtn.bind(this);
        (this: any).checkPhone = this.checkPhone.bind(this);

        this.unique_device_id='';
        this.lock = true;

        this.state = {
          openPH: false,
          FPH_title: new Animated.Value(0),
          FPH_text: new Animated.Value(0),
          FPH_phone: null,
        };
    }

    componentDidMount() {
      if (this.props.type == 'FPH_back') {
        TimerMixin.setTimeout(()=>{
          Animated.timing(
            this.state.FPH_text,//初始值
            {
              toValue: FlyDimensions.deviceDim.width,
              duration: 300,
            }//结束值
          ).start();
        }, 100);
      }else {
        TimerMixin.setTimeout(()=>{
          Animated.timing(
            this.state.FPH_title,//初始值
            {
              toValue: -FlyDimensions.deviceDim.width,
              duration: 300,
            }//结束值
          ).start();
          Animated.timing(
            this.state.FPH_text,//初始值
            {
              toValue: -FlyDimensions.deviceDim.width,
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
        openPH: this.refs.editable.refs.idx_0.isFocused(),
      })
    }

    keyClose() {
      this.setState({
        openPH: this.refs.editable.refs.idx_0.isFocused(),
      })
    }

    gotoScene(type) {
        Animated.timing(
          this.state.FPH_title,//初始值
          {
            toValue: FlyDimensions.deviceDim.width,
            duration: 0,
          }//结束值
        ).start();
        Animated.timing(
          this.state.FPH_text,//初始值
          {
            toValue: FlyDimensions.deviceDim.width,
            duration: 0,
          }//结束值
        ).start();
        this.props.gotoScene(type,'LG_back')

    }

    checkBtn() {
      if (Utils.isEmpty(this.state.FPH_phone)) {
        return false;
      }
      if (this.state.FPH_phone.length < 11) {
        return false;
      }
      return true;
    }

    checkPhone() {
      if (this.lock) {
        this.lock = false;
        this.refs.loading.open();
        if (Utils.checkMobile(this.state.FPH_phone)) {
          let promise = this.props.dispatch(checkUserRegister(this.state.FPH_phone,this.unique_device_id));
          promise.then((data)=>{
            this.lock = true;
            if(data == true){
              this.props.gotoScene('find-code',null,{forgetPhone: this.state.FPH_phone})
            }else{
              this.refs.loading.close();
              Utils.alert('该手机号尚未注册，请先进行注册!');
            }
          }).catch((err)=>{
            this.lock = true;
            this.refs.loading.close();
            Utils.alert('登录失败！请重试');
          });
        }else {
          this.lock = true;
          this.refs.loading.close();
          Utils.alert('手机号码格式不正确');
        }
      }
    }

    render() {
      let margin = (this.props.type == 'FPH_back') ? (-FlyDimensions.deviceDim.width + 15) : (FlyDimensions.deviceDim.width + 15);
      let marginTitle = (this.props.type == 'FPH_back') ? 15 : (FlyDimensions.deviceDim.width + 15);
      let marginBtn = (this.props.type == 'FPH_back') ? (-FlyDimensions.deviceDim.width + 15) : (FlyDimensions.deviceDim.width -30);
      let phoneColor = (this.state.openPH) ? FlyColors.baseColor : '#DDDDDD';

      return (
        <View style={styles.shareWrapper}>
          <Animated.View style={[{transform:[{translateX:this.state.FPH_title}]},{marginTop: 30,marginLeft: marginTitle,marginRight: 15,flexDirection: 'row',alignItems: 'center',width: FlyDimensions.deviceDim.width - 30}]}>
            <TouchableOpacity style={{flex: 1}} onPress={() => this.gotoScene('login')}>
              <FlyIconfonts name={'icon-right-arrow-m'} size={25} color={FlyColors.baseTextColor4}/>
            </TouchableOpacity>
            <View style={{flex: 8,alignItems: 'center'}}>
              <Text style={{fontSize: FlyDimensions.fontSizeXxl}}>忘记密码</Text>
            </View>
            <View style={{flex: 1}}/>
          </Animated.View>
          <FlyEditableScrollView ref={'editable'} AnimationClose={false} scrollEnabled={false}>
            <Animated.View style={[{transform:[{translateX:this.state.FPH_text}]},{marginTop: 10,marginLeft: margin,marginRight: 15}]}>
              <View style={{marginTop: 35,width: FlyDimensions.deviceDim.width}}>
                <Text style={{fontSize: FlyDimensions.fontSizeH0}}>请输入您的手机号码</Text>
              </View>
              <View style={{width: FlyDimensions.deviceDim.width-30,marginTop: 50,alignItems: 'center',flexDirection: 'row',borderBottomWidth: 1,borderBottomColor: phoneColor,paddingBottom: 10,flex: 1}}>
                <FlyIconfonts name={'icon-invite'} size={20} color={FlyColors.baseTextColor4} style={{marginRight: 10}}/>
                <TextInput
                  style={[{width: FlyDimensions.deviceDim.width - 70,height: 30},(this.state.openPH) ? {fontSize: 24} : null]}
                  placeholder="手机号码"
                  placeholderTextColor={'#CCCCCC'}
                  maxLength={11}
                  clearButtonMode={'while-editing'}
                  keyboardType={'number-pad'}
                  onChangeText={(text) => this.setState({FPH_phone: text})}
                  />
              </View>
              <View style={{alignItems: 'center',marginTop: 50,flex: 1}}>
                <FlyButton text={'下一步'} onPress={() => this.checkPhone()} disabled={!this.checkBtn()} style={[styles.btn,{marginLeft: marginBtn},(!this.checkBtn()) ? {backgroundColor: '#FAC6A7'} : {backgroundColor: FlyColors.baseColor}]}
                  size={'sm'} type={'self'} textColor={FlyColors.white}/>
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

module.exports = connect(select)(FindPhoneView);
