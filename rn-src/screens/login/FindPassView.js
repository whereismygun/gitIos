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
const dim = FlyDimensions.deviceDim
const {resetLoginPassword} = require('../../actions');

type Props = {
    navigator: Navigator;
    type: String; // 'FPA_back' 启动返回动画
};

class FindPassView extends Component {
    props : Props;

    constructor(props) {
        super(props);

        (this: any).gotoScene = this.gotoScene.bind(this);
        (this: any).checkBtn = this.checkBtn.bind(this);
        (this: any).setPassword = this.setPassword.bind(this);
        (this: any).passwordValidate = this.passwordValidate.bind(this);

        this.lock = true;

        this.state = {
          newpass: false,
          oldpass: false,
          FPA_text: new Animated.Value(0),
          FPA_pass: null,
          FPA_verifyPass: null,
        };
    }

    componentDidMount() {
      TimerMixin.setTimeout(()=>{
        Animated.timing(
          this.state.FPA_text,//初始值
          {
            toValue: -FlyDimensions.deviceDim.width,
            duration: 300,
          }//结束值
        ).start();
      }, 100);
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

    gotoScene(type) {
        Animated.timing(
          this.state.FPA_text,//初始值
          {
            toValue: FlyDimensions.deviceDim.width,
            duration: 0,
          }//结束值
        ).start();
        this.props.gotoScene(type,'FC_back')
    }

    checkBtn() {
      if (Utils.isEmpty(this.state.FPA_pass)) {
        return false;
      }
      if (this.state.FPA_pass.length < 8) {
        return false;
      }
      if (Utils.isEmpty(this.state.FPA_verifyPass)) {
        return false;
      }
      if (this.state.FPA_verifyPass.length < 8) {
        return false;
      }
      return true;
    }

    passwordValidate() {
      if (!(/^([a-z]|[A-Z]|[0-9]|\.|\_|\$|\@){8,20}$/).test(this.state.FPA_pass)) {
        Utils.alert('新密码格式错误：请填写8到20位数字或字母');
        return false;
      }
      if (this.state.FPA_pass != this.state.FPA_verifyPass) {
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
          let promise = this.props.dispatch(resetLoginPassword(this.props.forgetPhone,this.state.FPA_pass,this.state.FPA_verifyPass));
          promise.then((data) => {
            this.lock = true;
            this.refs.loading.close();
            this.gotoScene('login')
          }).catch((err) => {
            this.lock = true;
            this.refs.loading.close();
            Utils.alert(err.msg)
          })
        }else {
          this.lock = true;
        }
      }
    }

    render() {
      let newColor = (this.state.newpass) ? FlyColors.baseColor : '#DDDDDD';
      let oldColor = (this.state.oldpass) ? FlyColors.baseColor : '#DDDDDD';
      return (
        <View style={styles.shareWrapper}>
          <View style={{marginTop: 30,marginLeft: 15,marginRight: 15,flexDirection: 'row',alignItems: 'center',width: FlyDimensions.deviceDim.width - 30}}>
            <TouchableOpacity style={{flex: 1}} onPress={() => this.gotoScene('find-code')}>
              <FlyIconfonts name={'icon-right-arrow-m'} size={25} color={FlyColors.baseTextColor4}/>
            </TouchableOpacity>
            <View style={{flex: 8,alignItems: 'center'}}>
              <Text style={{fontSize: FlyDimensions.fontSizeH0}}>忘记密码</Text>
            </View>
            <View style={{flex: 1}}/>
          </View>
          <FlyEditableScrollView ref={'editable'} AnimationClose={false} scrollEnabled={false}>
            <Animated.View style={[{transform:[{translateX:this.state.FPA_text}]},{marginTop: 10,marginLeft: FlyDimensions.deviceDim.width + 15,marginRight: 15}]}>
              <View style={{marginTop: 35,width: FlyDimensions.deviceDim.width-30}}>
                <Text style={{fontSize: FlyDimensions.fontSizeH1}}>重设您的登录密码</Text>
              </View>
              <View style={{width: FlyDimensions.deviceDim.width-30,marginTop: 50,alignItems: 'center',flexDirection: 'row',borderBottomWidth: 1,borderBottomColor: newColor,paddingBottom: 10,flex: 1}}>
                <FlyIconfonts name={'icon-lock'} size={20} color={FlyColors.baseTextColor4} style={{marginRight: 10}}/>
                <TextInput
                  style={{width: FlyDimensions.deviceDim.width - 70,height: 30}}
                  placeholderTextColor={'#CCCCCC'}
                  maxLength={20}
                  keyboardType={'ascii-capable'}
                  clearButtonMode={'while-editing'}
                  onChangeText={(text) => this.setState({FPA_pass: text})}
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
                  onChangeText={(text) => this.setState({FPA_verifyPass: text})}
                  placeholder="请再次输入登录密码"/>
              </View>
              <View style={{alignItems: 'center',marginTop: 50,flex: 1}}>
                <FlyButton text={'完成'} disabled={!this.checkBtn()}  onPress={() => this.setPassword()} style={[styles.btn,{marginLeft: FlyDimensions.deviceDim.width - 30},(!this.checkBtn()) ? {backgroundColor: '#FAC6A7'} : {backgroundColor: FlyColors.baseColor}]} size={'sm'} type={'self'} textColor={FlyColors.white}/>
              </View>
              </Animated.View>
              <View style={{flexDirection:'row',justifyContent:'center',marginTop:dim.height*0.45}}>
                 <Text>客服热线: </Text>
                 <Text style={{color:FlyColors.baseColor}}>400-158-1996</Text>
               </View>
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
  }
});

function select(store) {
    return {

    };
}

module.exports = connect(select)(FindPassView);
