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
const FlyTimerButton = require('FlyTimerButton');
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

const {findPasswordCode,validateAuthCode} = require('../../actions');


type Props = {
    navigator: Navigator;
    type: String; // 'FC_back' 启动返回动画
};

class FindCodeView extends Component {
    props : Props;

    constructor(props) {
        super(props);

        (this: any).gotoScene = this.gotoScene.bind(this);
        (this: any).gainCode = this.gainCode.bind(this);
        (this: any).verifyCode = this.verifyCode.bind(this);

        this.lock = true;

        this.state = {
          openPH: false,
          FC_text: new Animated.Value(0),
          FC_code: null,
          getCode: true,
        };
    }

    componentDidMount() {
      if (this.props.type == 'FC_back') {
        TimerMixin.setTimeout(()=>{
          Animated.timing(
            this.state.FC_text,//初始值
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
            this.state.FC_text,//初始值
            {
              toValue: -FlyDimensions.deviceDim.width,
              duration: 300,
            }//结束值
          ).start();
        }, 100);
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
      let promise = this.props.dispatch(findPasswordCode(this.props.forgetPhone));
      promise.then((data) => {
        this.refs.timer.start(true);
      }).catch((err) => {
        Utils.alert(err.msg || '请重新获取验证码')
      });
    }

    gotoScene(type) {
        Animated.timing(
          this.state.FC_text,//初始值
          {
            toValue: FlyDimensions.deviceDim.width,
            duration: 0,
          }//结束值
        ).start();
        this.props.gotoScene(type,'FPH_back')
    }

    verifyCode() {
      if (this.lock) {
        this.lock = false;
        this.refs.loading.open()
        let promise = this.props.dispatch(validateAuthCode(this.state.FC_code,this.props.forgetPhone));
        promise.then((data) => {
          this.lock = true;
          this.refs.loading.close()
          this.props.gotoScene('find-pass')
        }).catch((err) => {
          this.lock = true;
          this.refs.loading.close()
          Utils.alert(err.msg || '服务器繁忙')
        })
      }
    }

    render() {
      let margin = (this.props.type == 'FC_back') ? (-FlyDimensions.deviceDim.width + 15) : (FlyDimensions.deviceDim.width + 15);
      let marginBtn = (this.props.type == 'FC_back') ? (-FlyDimensions.deviceDim.width + 15) : (FlyDimensions.deviceDim.width -30);
      let phoneColor = (this.state.openPH) ? FlyColors.baseColor : '#DDDDDD';

      return (
        <View style={styles.shareWrapper}>
          <View style={{marginTop: 30,marginLeft: 15,marginRight: 15,flexDirection: 'row',alignItems: 'center',width: FlyDimensions.deviceDim.width - 30}}>
            <TouchableOpacity style={{flex: 1}} onPress={() => this.gotoScene('find-phone')}>
              <FlyIconfonts name={'icon-right-arrow-m'} size={25} color={FlyColors.baseTextColor4}/>
            </TouchableOpacity>
            <View style={{flex: 8,alignItems: 'center'}}>
              <Text style={{fontSize: FlyDimensions.fontSizeXxl}}>忘记密码</Text>
            </View>
            <View style={{flex: 1}}/>
          </View>
          <FlyEditableScrollView ref={'editable'} AnimationClose={false} scrollEnabled={false}>
            <Animated.View style={[{transform:[{translateX:this.state.FC_text}]},{marginTop: 10,marginLeft: margin,marginRight: 15}]}>
              <View style={{marginTop: 35,width: FlyDimensions.deviceDim.width - 30}}>
                <Text style={{fontSize: FlyDimensions.fontSizeH0}}>请输入您收到的验证码</Text>
              </View>
              <View style={{flexDirection: 'row',flex: 1,marginTop: 50,width: FlyDimensions.deviceDim.width-30}}>
                <View style={{flexDirection: 'row',borderBottomWidth: 1,borderBottomColor: phoneColor,paddingBottom: 2,flex: 1}}>
                  <FlyIconfonts name={'icon-msg'} size={20} color={FlyColors.baseTextColor4} style={{marginRight: 10,marginTop: 8,height: 30}}/>
                  <TextInput
                    style={{width: FlyDimensions.deviceDim.width - 150,height: 30}}
                    placeholderTextColor={'#CCCCCC'}
                    maxLength={6}
                    clearButtonMode={'while-editing'}
                    keyboardType={'number-pad'}
                    onChangeText={(text) => this.setState({FC_code: text})}
                    placeholder="验证码"/>
                </View>
                <FlyTimerButton onPressStart={() => {
                    this.gainCode();
                    this.setState({getCode: true})
                  }} onPressCancel={() => this.setState({getCode: false})} ref={'timer'} text={'发送验证码'}
                  size={'xl'} type={'self'} textColor={(this.state.getCode) ? '#006CB1' : FlyColors.white} style={[styles.timerBtn,(this.state.getCode) ? {backgroundColor: '#EEEEEE'} : {backgroundColor: FlyColors.baseColor}]}/>
              </View>
              <View style={{alignItems: 'center',marginTop: 50,flex: 1}}>
                <FlyButton text={'下一步'} disabled={Utils.isEmpty(this.state.FC_code)} onPress={() => this.verifyCode()} style={[styles.btn,{marginLeft: marginBtn},(Utils.isEmpty(this.state.FC_code) ? {backgroundColor: '#FAC6A7'} : {backgroundColor: FlyColors.baseColor})]} size={'sm'} type={'self'} textColor={FlyColors.white}/>
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

module.exports = connect(select)(FindCodeView);
