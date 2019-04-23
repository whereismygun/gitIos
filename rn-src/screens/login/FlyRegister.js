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
    Navigator,
    View,
    TextInput,
    TouchableOpacity,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    ScrollView,
    Image,
    InteractionManager
} from 'react-native';

import {connect} from 'react-redux';
const FlyColors = require('FlyColors');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyItem = require('FlyItem');
const FlyHeader = require('FlyHeader');
const FlyDimensions = require('FlyDimensions');
const FlyTextInput = require('FlyTextInput');
const FlyButton = require('FlyButton');
const FlyStyles = require('FlyStyles');
const FlyLabelItem = require('FlyLabelItem');
const FlyModalBox = require('FlyModalBox');
const FlyBase = require('FlyBase');
const FlyLoading = require('FlyLoading');
const SceneUtils = require('SceneUtils');
const Utils = require('Utils');
const FlyEditableScrollView = require('FlyEditableScrollView');
const {Text} = require('FlyText');
const FlyImage = require('FlyImage');
const {setPassword} = require('../../actions');

const agreeH = './imgs/login/agree.png';
const agreeN = './imgs/login/combinedShape.png';

const {checkUserRegister, validateImgCode, sendAuthCode, saveRegister, validateAuthCode,logout} = require('../../actions');
const dim = FlyDimensions.deviceDim;
type Props = {
    navigator: Navigator;
};

class FlyRegister extends Component {
    props : Props;

    constructor(props) {
        super(props);
        (this: any).renderPwd = this.renderPwd.bind(this);
        (this: any).passwordValidate = this.passwordValidate.bind(this);
        (this: any)._goNext = this._goNext.bind(this);
        this.otherInfo = {
          device_token: '',
          unique_device_id: '',
          location: {},
          channel:'',
        };
        this.state = {
          password:null,
          rePassword:null,
          spreadCode:null,
          agree:true
        }
    }

    componentDidMount() {
      let that = this;
      InteractionManager.runAfterInteractions(() => {
        that.initOtherInfo();
      });
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


    passwordValidate() {
      if (Utils.isEmpty(this.state.password)) {
        Utils.alert('密码不得为空');
        return false;
      }
      if (this.state.password.length < 8) {
        Utils.alert('密码不得少于8位');
        return false;
      }
      if (!(/^([a-z]|[A-Z]|[0-9]|\.|\_|\$|\@){8,20}$/).test(this.state.password)) {
        Utils.alert('新密码格式错误：请填写8到20位数字或字母');
        return false;
      }
      if (Utils.isEmpty(this.state.rePassword)) {
        Utils.alert('确认密码不得为空');
        return false;
      }
      if (this.state.rePassword.length < 8) {
        Utils.alert('确认密码不得少于8位');
        return false;
      }
      if (this.state.password != this.state.rePassword) {
        Utils.alert('两次密码输入不一致');
        return false;
      }
      return true;
    }

    _goNext(){
      if (this.passwordValidate()) {
        this.refs.loading.open();
        let params = {
          phone:this.props.username,
        	password:this.state.password,
        	rePassword:this.state.rePassword,
        	spreadCode:this.state.spreadCode
        };
        const {navigator} = this.props;
        let promise = this.props.dispatch(setPassword(params,this.otherInfo));
        promise.then((data)=>{
          this.refs.loading.close();
          navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
        }).catch((err)=>{
          this.refs.loading.close();
          Utils.alert(err.msg);
        });
      }
    }

    renderPwd(){
      return(
        <View style={styles.inputGroup}>
            <TextInput onChangeText={(text)=>{this.setState({password:text})}}
              style={[styles.textInput1,{fontSize:FlyDimensions.fontSizeXxl}]}
              placeholder="请设置登录密码"
              textAlign="center"
              clearButtonMode='always'
              keyboardType={"ascii-capable"}
              maxLength={20}/>
        </View>
      )
    }


    renderNewPwd(){
      return(
        <View style={[styles.inputGroup,{marginTop:dim.width * 0.02}]}>
            <TextInput onChangeText={(text)=>{this.setState({rePassword:text})}}
              style={[styles.textInput1,{fontSize:FlyDimensions.fontSizeXxl}]}
              placeholder="请再次输入密码"
              textAlign="center"
              clearButtonMode='always'
              keyboardType={"ascii-capable"}
              maxLength={20}/>
        </View>
      )
    }

    renderInviate(){
      return(
        <View style={[styles.inputGroup,{marginTop:dim.width * 0.08}]}>
            <TextInput onChangeText={(text)=>{this.setState({spreadCode:text})}}
              style={[styles.textInput1,{fontSize:FlyDimensions.fontSizeXxl}]}
              placeholder="邀请码或对方手机号码(选填)"
              textAlign="center"
              clearButtonMode='always'/>
        </View>
      )
    }



    render() {
      const labelWidth = 80;
      let leftItem = {
          type: 'back'
      };
      let agree = this.state.agree;
      let agreeImg = agree == true ? agreeH : agreeN;

      return (
          <View style={FlyStyles.container}>
              <FlyHeader leftItem={leftItem} borderBottom={true} title="设置登录密码" backgroundColor={FlyColors.white}/>

              <FlyEditableScrollView keyboardShouldPersistTaps={true}>
                <View style={{justifyContent:'center',alignItems:'center',marginTop:dim.width * 0.3}}>
                  {this.renderPwd()}
                  <Text style={styles.pwdDetails}>必须是8-20位数字或字母</Text>
                  {this.renderNewPwd()}
                  {this.renderInviate()}
                </View>
                <View style={styles.btnWrapper}>
                    <FlyButton
                      text='注册'
                      onPress={this._goNext}
                      type='base'
                      disabled={!this.state.agree}
                      style={styles.btn} />
                </View>
                <TouchableOpacity style={styles.agree} onPress={()=>{this.setState({agree:!agree})}}>
                  <FlyImage source={agreeImg} width={15}/>
                  <Text style={styles.agreeTitle}>注册并同意通通理网站注册协议
                  </Text>
                </TouchableOpacity>
              </FlyEditableScrollView>

              <FlyLoading ref="loading" modalStyle={FlyStyles.loadingModal} text="加载中..."/>
          </View>
      )
    }
}

var styles = StyleSheet.create({
  inputGroup: {
    flex: 1,
    borderBottomWidth:2,
    borderBottomColor:FlyColors.black,
    width:FlyDimensions.deviceDim.width * 0.7
  },
  textInput1: {
    height:50,
    marginLeft: 5,
  },
  pwdDetails:{
    fontSize:FlyDimensions.fontSizeBase,
    marginTop:5,
    color:'#666666',
    marginLeft:- dim.width * 0.32
  },
  btnWrapper: {
    marginTop: dim.width * 0.18,
    alignItems:'center'
  },
  btn: {
    width: FlyDimensions.deviceDim.width * 0.5,
    borderRadius:30,
    height:44
  },
  agree:{
    justifyContent:'center',
    flexDirection:'row',
    // marginLeft:dim.width * 0.2,
    marginTop:10,
    height:40,
    alignItems:'center'
  },
  agreeTitle:{
    fontSize:FlyDimensions.fontSizeBase,
    marginLeft:5
  }

});

function select(store) {
    return {};
}

module.exports = connect(select)(FlyRegister);
