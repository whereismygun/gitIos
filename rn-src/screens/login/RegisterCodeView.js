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
const {getMD5str} = require('fly-react-native-app-info');
const {sendAuthCode,validateAuthCode} = require('../../actions');

type Props = {
    navigator: Navigator;
    type: String; // 'RC_back' 启动返回动画
};

class RegisterCodeView extends Component {
    props : Props;

    constructor(props) {
        super(props);

        (this: any).gotoScene = this.gotoScene.bind(this);
        (this: any).gainCode = this.gainCode.bind(this);
        (this: any).verifyCode = this.verifyCode.bind(this);

        this.lock = true;

        this.state = {
          fadeAnim: new Animated.Value(0),
          fadeAnim1: new Animated.Value(0),
          second: false,
          openPH: false,
          RC_text: new Animated.Value(0),
          RC_code: null,
          getCode: true,
        };
    }

    componentDidMount() {
      if (this.props.type == 'RC_back') {
        TimerMixin.setTimeout(()=>{
          Animated.timing(
            this.state.fadeAnim1,//初始值
            {
              toValue: -20,
              duration: 200,
            }//结束值
          ).start();
          Animated.timing(
            this.state.RC_text,//初始值
            {
              toValue: FlyDimensions.deviceDim.width,
              duration: 300,
            }//结束值
          ).start();
        }, 100);
      }else {
        InteractionManager.runAfterInteractions(() => {
          this.gainCode();
        });
        TimerMixin.setTimeout(()=>{
          Animated.timing(
            this.state.fadeAnim,//初始值
            {
              toValue: 20,
              duration: 300,
            }//结束值
          ).start();
          Animated.timing(
            this.state.RC_text,//初始值
            {
              toValue: -FlyDimensions.deviceDim.width,
              duration: 300,
            }//结束值
          ).start();
        }, 100);
        TimerMixin.setTimeout(() => {
          this.setState({
            second: true,
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
        openPH: this.refs.editable.refs.idx_0.isFocused(),
      })
    }

    keyClose() {
      this.setState({
        openPH: this.refs.editable.refs.idx_0.isFocused(),
      })
    }

    gainCode() {
      this.refs.timer.start(true);
      var timestamp3 = new Date().getTime();
      let secret = env.CodeEncryption;
      let md5_str =this.props.registerPhone+timestamp3+secret;
      getMD5str({md5_str:md5_str},(respone)=>{
        let params = {
                phone: this.props.registerPhone,
                signature:respone,
                timestamp:timestamp3,
        }
       let promise = this.props.dispatch(sendAuthCode(params));
      promise.then((data) => {
      }).catch((err) => {
        Utils.alert(err.msg || '请重新获取验证码')
      });
      })
   
    }

    gotoScene(type) {
        Animated.timing(
          this.state.RC_text,//初始值
          {
            toValue: FlyDimensions.deviceDim.width,
            duration: 0,
          }//结束值
        ).start();
        this.props.gotoScene(type,'RPH_back',)
    }

    verifyCode() {
      if (this.lock) {
        this.lock = false;
        this.refs.loading.open();
        let promise = this.props.dispatch(validateAuthCode(this.state.RC_code,this.props.registerPhone));
        promise.then((data) => {
          this.lock = true;
          this.refs.loading.close();
          this.props.gotoScene('register-pass',null)
        }).catch((error) => {
          this.lock = true;
          this.refs.loading.close();
          Utils.alert(error.msg || '服务器繁忙')
        })
      }
    }

    render() {
      let margin = (this.props.type == 'RC_back') ? (-FlyDimensions.deviceDim.width + 15) : (FlyDimensions.deviceDim.width + 15);
      let marginBtn = (this.props.type == 'RC_back') ? (-FlyDimensions.deviceDim.width + 15) : (FlyDimensions.deviceDim.width -30);
      let phoneColor = (this.state.openPH) ? FlyColors.baseColor : '#DDDDDD';

      return (
        <View style={styles.shareWrapper}>
          <View style={{marginTop: 30,marginLeft: 15,marginRight: 15,flexDirection: 'row',alignItems: 'center',width: FlyDimensions.deviceDim.width - 30}}>
            <TouchableOpacity style={{flex: 1}} onPress={() => this.gotoScene('register-phone')}>
              <FlyIconfonts name={'icon-right-arrow-m'} size={25} color={FlyColors.baseTextColor4}/>
            </TouchableOpacity>
            <View style={{flex: 9,alignItems: 'center',justifyContent: 'flex-end',flexDirection: 'row'}}>
              <FlyImage source={'./imgs/login/Oval2.png'} resizeMode={'stretch'} style={{width: 30,height: 30,justifyContent: 'center',alignItems: 'center'}}>
                <Text style={{backgroundColor: 'rgba(0,0,0,0)',fontSize: FlyDimensions.fontSizeXxxl,color: FlyColors.white,fontWeight: 'bold'}}>1</Text>
              </FlyImage>
              <View style={{height: 5,backgroundColor: FlyColors.baseColor,width: 20}}>
                {(this.props.type == 'RC_back') ? null : (
                  <Animated.View style={{backgroundColor:'#CCCCCC',height:5,transform:[{translateX:this.state.fadeAnim}]}}>
                  </Animated.View>
                )}
              </View>
              <View style={{height: 5,backgroundColor: '#CCCCCC',width: 20,marginLeft: 30}}>
                {(this.props.type == 'RC_back') ? (
                  <Animated.View style={{backgroundColor:FlyColors.baseColor,height:5,transform:[{translateX:this.state.fadeAnim1}]}}>
                  </Animated.View>
                ) : null}
              </View>
              <View style={{width: 30,height: 30,borderRadius: 15,backgroundColor: '#CCCCCC',justifyContent: 'center',alignItems: 'center'}}>
                <Text style={{backgroundColor: 'rgba(0,0,0,0)',fontSize: FlyDimensions.fontSizeXxxl,color: FlyColors.white,fontWeight: 'bold'}}>3</Text>
              </View>
              <View style={{height: 5,backgroundColor: '#CCCCCC',width: 20}}>
              </View>
              <View style={{width: 90,height: 30,borderRadius: 15,backgroundColor: '#CCCCCC',justifyContent: 'center',alignItems: 'center'}}>
                <Text style={{fontSize: FlyDimensions.fontSizeXxl,color: FlyColors.white,fontWeight: 'bold'}}>1888红包</Text>
              </View>
              {(this.state.second || this.props.type == 'RC_back') ? (
                <FlyImage source={'./imgs/login/Oval2.png'} resizeMode={'stretch'} style={{width: 30,height: 30,justifyContent: 'center',alignItems: 'center',position: 'absolute',right: 160}}>
                  <Text style={{backgroundColor: 'rgba(0,0,0,0)',fontSize: FlyDimensions.fontSizeXxxl,color: FlyColors.white,fontWeight: 'bold'}}>2</Text>
                </FlyImage>
              ) : (
                <View style={{width: 30,height: 30,borderRadius: 15,backgroundColor: '#CCCCCC',justifyContent: 'center',alignItems: 'center',position: 'absolute',right: 160}}>
                  <Text style={{backgroundColor: 'rgba(0,0,0,0)',fontSize: FlyDimensions.fontSizeXxxl,color: FlyColors.white,fontWeight: 'bold'}}>2</Text>
                </View>
              )}
            </View>
          </View>
          <FlyEditableScrollView ref={'editable'} AnimationClose={false} scrollEnabled={false}>
            <Animated.View style={[{transform:[{translateX:this.state.RC_text}]},{marginTop: 10,marginLeft: margin,marginRight: 15}]}>
              <View style={{marginTop: 35,width: FlyDimensions.deviceDim.width}}>
                <Text style={{fontSize: FlyDimensions.fontSizeH0}}>请输入您收到的验证码</Text>
              </View>
              <View style={{flexDirection: 'row',flex: 1,marginTop: 50,width: FlyDimensions.deviceDim.width-30}}>
                <View style={{flexDirection: 'row',borderBottomWidth: 1,borderBottomColor: phoneColor,paddingBottom: 2,flex: 1}}>
                  <FlyIconfonts name={'icon-msg'} size={20} color={FlyColors.baseTextColor4} style={{marginRight: 10,marginTop: 8,height: 30}}/>
                  <TextInput
                    style={{width: FlyDimensions.deviceDim.width - 150,height: 30}}
                    placeholder="验证码"
                    placeholderTextColor={'#CCCCCC'}
                    clearButtonMode={'while-editing'}
                    keyboardType={'number-pad'}
                    maxLength={6}
                    onChangeText={(text) => this.setState({RC_code: text})}/>
                </View>
                <FlyTimerButton onPressStart={() => {
                    this.gainCode();
                    this.setState({getCode: true})
                  }} onPressCancel={() => this.setState({getCode: false})} ref={'timer'} text={'59秒'}
                  size={'xl'} type={'self'} textColor={(this.state.getCode) ? '#006CB1' : FlyColors.white} style={[styles.timerBtn,(this.state.getCode) ? {backgroundColor: '#EEEEEE'} : {backgroundColor: FlyColors.baseColor}]}/>
              </View>
              <View style={{alignItems: 'center',marginTop: 50,flex: 1}}>
                <FlyButton text={'下一步'} disabled={Utils.isEmpty(this.state.RC_code)} onPress={() => this.verifyCode()} style={[styles.btn,{marginLeft: marginBtn},(Utils.isEmpty(this.state.RC_code) ? {backgroundColor: '#FAC6A7'} : {backgroundColor: FlyColors.baseColor})]} size={'sm'} type={'self'} textColor={FlyColors.white}/>
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
  },
  timerBtn: {
    borderRadius: 3,
    height: 41,
    width: 80,
    marginLeft: 2
  },
});

function select(store) {
    return {

    };
}

module.exports = connect(select)(RegisterCodeView);
