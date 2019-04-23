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
    ScrollView,
    Image
} from 'react-native';
import {connect} from 'react-redux';
const  FlyColors = require ('FlyColors');
const FlyItem = require ('FlyItem');
const FlyHeader = require  ('FlyHeader');
const FlyDimensions = require('FlyDimensions');
const FlyTextInput = require('FlyTextInput');
const FlyButton = require('FlyButton');
const FlyStyles = require('FlyStyles');
const FlyLabelItem = require('FlyLabelItem');
const FlyBase = require('FlyBase');
const {Text} = require('FlyText');
const FlyTimerButton = require('FlyTimerButton');
const UrlHelper = require('UrlHelper');
const FlyModalBox = require('FlyModalBox');
const FlyLoading = require('FlyLoading');
const SceneUtils = require('SceneUtils');
const Utils = require('Utils');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyEditableScrollView = require('FlyEditableScrollView');
const {resetLoginPassword} = require('../../actions');

const dim  = FlyDimensions.deviceDim;
const {

    saveForget
} = require('../../actions');

type Props = {
    navigator: Navigator;
};

class FlyFindPwd extends Component {
    props : Props;

    constructor(props) {
        super(props);
        (this: any)._goNext = this._goNext.bind(this);
        (this: any).passwordValidate = this.passwordValidate.bind(this);
        this.state={
          password: null,
          repeatPassword:null
        }
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
      if (Utils.isEmpty(this.state.repeatPassword)) {
        Utils.alert('确认密码不得为空');
        return false;
      }
      if (this.state.repeatPassword.length < 8) {
        Utils.alert('确认密码不得少于8位');
        return false;
      }
      if (this.state.password != this.state.repeatPassword) {
        Utils.alert('两次密码输入不一致');
        return false;
      }
      return true;
    }

    _goNext(){
      const {navigator} = this.props;
      if (this.passwordValidate()) {
        let promise = this.props.dispatch(resetLoginPassword(this.props.username,this.state.password,this.state.repeatPassword));
        promise.then((data)=>{
          navigator.popToRoute(this.props.navigator.getCurrentRoutes()[1])
        }).catch((err)=>{
          Utils.alert(err.msg)
        });
      }
    }

    renderPwd(){
      return(
        <View style={styles.inputGroup}>
            <TextInput onChangeText={(text)=>{this.setState({password:text})}}
              style={[styles.textInput1,{fontSize:FlyDimensions.fontSizeXxl}]}
              placeholder="重新设置登录密码"
              textAlign="center"
              clearButtonMode='always'
              keyboardType={"ascii-capable"}
              maxLength={20}/>
        </View>
      )
    }

    renderNewPwd(){
      return(
        <View style={[styles.inputGroup,{marginTop:25}]}>
            <TextInput onChangeText={(text)=>{this.setState({repeatPassword:text})}}
              style={[styles.textInput1,{fontSize:FlyDimensions.fontSizeXxl}]}
              placeholder="再次输入密码"
              textAlign="center"
              clearButtonMode='always'
              keyboardType={"ascii-capable"}
              maxLength={11}/>
        </View>
      )
    }

    render() {
        const labelWidth = 80;
        let leftItem = {
            type:'back'
        };
        // <Text style={styles.pwdDetails}>必须是8-20位数字或字母</Text>
        return (
          <View style={FlyStyles.container}>
            <FlyHeader title='忘记密码' leftItem={leftItem}/>
            <FlyEditableScrollView style={{marginTop:dim.width * 0.15}}  keyboardShouldPersistTaps={true}>
              <View style={{justifyContent:'center',alignItems:'center',marginTop:dim.width * 0.2}}>
                {this.renderPwd()}
                {this.renderNewPwd()}
              </View>
              <View style={styles.btnWrapper}>
                  <FlyButton
                    text='重设'
                    onPress={this._goNext}
                    type='base'
                    style={styles.btn} />
              </View>
              <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:dim.width * 0.5}}>
                <Text>客服热线:&nbsp;&nbsp;</Text>
                <TouchableOpacity onPress={()=>{NativeModuleUtils.phoneCall('400-158-1996')}}>
                  <Text style={{color:FlyColors.baseColor}}>400-158-1996
                  </Text>
                </TouchableOpacity>
              </View>

            </FlyEditableScrollView>
            <FlyLoading ref="loading" text="请稍等..."/>
          </View>
        )
    }
}

var styles = StyleSheet.create({
  inputGroup: {
    flex: 1,
    borderBottomWidth:2,
    borderBottomColor:FlyColors.black,
    width:FlyDimensions.deviceDim.width * 0.7,
  },
  textInput1: {
    height:50,
    marginLeft: 5,
  },
  pwdDetails:{
    fontSize:FlyDimensions.fontSizeLarge,
    marginTop:5,
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

});

function select(store) {
    return {};
}


module.exports = connect(select)(FlyFindPwd);
