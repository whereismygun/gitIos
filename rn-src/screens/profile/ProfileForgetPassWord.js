/**
*
*
* @flow
*
*/
'use strict';

import React from 'react';

import ReactNative, {
  StyleSheet,
  Navigator,
  View,
  ScrollView,
  ListView,
  TouchableOpacity,
  InteractionManager,
  DeviceEventEmitter,
  NativeAppEventEmitter,
} from 'react-native';
import {
Hidekeyboard,
Showkeyboard,
Encryption,
}from 'fly-react-native-ps-keyboard'


import {connect} from 'react-redux';


const FlyTimerButton =require('FlyTimerButton')
const FlyColors = require('FlyColors');
const FlyStyles = require('FlyStyles');
const FlyDimensions = require('FlyDimensions');
const FlyHeader = require('FlyHeader');
const FlyImage = require('FlyImage');
const {Text} = require('FlyText');
const env = require('env');
const dim  = FlyDimensions.deviceDim;
const SceneUtils = require('SceneUtils');
const {getBinding,sitePayPass,sendPaySmsCode,getPasswordFactor,forgetPasswordVerification,vailPayPass} = require('../../actions');
const Filters = require('Filters');
const FlyBottomButton = require('FlyBottomButton');
const Utils = require('Utils');
const FlyLoading = require('FlyLoading');
const NativeModuleUtils = require('NativeModuleUtils');
const FlyTextInput = require('FlyTextInput');
const sina = './imgs/myAssets/sina.png'
type Props = {
  navigator: Navigator;
  buildingInfo:Object;
};

class ProfileForgetPassWord extends React.Component {
  props : Props;
  constructor(props) {
    super(props);
    

    this.state={
       name:null,
       msgCode:null,
       phone:null,
       idcard:null,
    };

    
  }


accIdValidate(){

  
  let promise = this.props.dispatch(sendPaySmsCode());
  this.refs.timer.start(true);
  promise.then((data) => {
  }).catch((err) => {
    Utils.error(err.msg);
  });
}

  render() {
    let leftItem = {
      type: "back",
    };

     let labelWidth = 80;
    let name = '';
     let userName
     if(!Utils.isEmpty(this.props.userInfo)){
       name = this.props.userInfo.phone
       userName = this.props.userInfo.name
    }

  
    return(
      <View style={FlyStyles.container}>
        <FlyHeader
          title="忘记交易密码"
          borderBottom={true}
          leftItem={leftItem}/>
         <View style={{flex:1,backgroundColor:FlyColors.baseBackgroundColor}}>
             <View style={{marginTop:-10,backgroundColor:'white'}}>
               <FlyTextInput text="姓名:" style={{backgroundColor:'white'}} labelWidth={labelWidth} showSegment={true} placeholder={userName+'(请输入完整姓名)'}
                                 onChangeText={(text) => this.setState({name: text})} /> 
                         <FlyTextInput text="身份证:" style={{backgroundColor:'white',marginTop:40}} labelWidth={labelWidth} showSegment={true} placeholder='请输入身份证号码'
                  onChangeText={(text) => this.setState({idcard: text})} /> 
                <FlyTextInput text="手机号:" style={{backgroundColor:'white',marginTop:40}} defaultValue={name} labelWidth={labelWidth} showSegment={true} placeholder='请输入手机号码'
                  onChangeText={(text) => this.setState({phone: text})} /> 
                   <FlyTextInput text="验证码" labelWidth={labelWidth} placeholder="请填写短信验证码"
                   keyboardType="numeric" maxLength={6} style={{height:dim.height*0.08,marginTop:40,backgroundColor:'white'}} showSegment={true} onChangeText={(text) => this.setState({msgCode: text})}>
                 <FlyTimerButton ref="timer" startSelf={true} countdown={60} text="获取验证码" style={{height:dim.height*0.07,marginTop:3,width:dim.width*0.3}} type={'gray'} size={'xl'} onPress={()=>{this.accIdValidate()}}/>
                </FlyTextInput>

                
              </View>
            
             <TouchableOpacity style={{alignSelf:'center',alignItems:'center',width:dim.width*0.9,height:45,justifyContent:'center',marginTop:50,backgroundColor:FlyColors.baseColor}} onPress={()=>this.doSubmit()}>
                 <Text style={{fontSize:FlyDimensions.fontSizeXl,color:'white'}}>完成验证</Text>
             </TouchableOpacity>
         </View>  
        
    </View>
    );
  }

    checkAutoCode(){
    if(Utils.isEmpty(this.state.msgCode)){
        Utils.alert('请填写短信验证码');
        return false;
    }
    return true;
  }
    checkCardInfo() {
    if (Utils.isEmpty(this.state.name)) {
        Utils.alert("姓名输入有误!");
        return false;
    }
    if (!Utils.checkID(this.state.idcard)) {
        Utils.alert("身份证号码输入有误!");
        return false;
    }
    return true;
}
  doSubmit(){
      if(this.checkAutoCode()&& this.checkCardInfo()){
         let params = {
          name:this.state.name,
          identityNo:this.state.idcard,
          code:this.state.msgCode,
          isReset:true,
         }
        let promise = this.props.dispatch(forgetPasswordVerification(params))

        promise.then((data) => {
          if (data) {
           let info={
                  title:'忘记密码',
                  des:'验证成功',
                  status:true,
                  Top_Title:'设置新交易密码',
                  onPress_frist:()=>{
                    SceneUtils.gotoScene('RESET_PAY_PASS_WORD_VIEW',params,'replace')
                  },
                }
                SceneUtils.gotoScene('FINANCING_STATUS',info,'replace') 
          }
        }).catch((err) => {
         Utils.alert(err.msg);
        })
      }

   }


}

var styles = StyleSheet.create({

  desTitle:{
    color:FlyColors.baseColor,
    fontSize:FlyDimensions.fontSizeXxl
  },
  Container:{
   backgroundColor:FlyColors.baseBackgroundColor,
   flex:1
  },
  passWord:{
    marginTop:100,
    backgroundColor:'white',
    width:dim.width*0.8,
    height:50,
    justifyContent:'center'
  }


});

function select(store) {
  return {
    userInfo:store.user.userInfo,
  };
}

module.exports = connect(select)(ProfileForgetPassWord);
