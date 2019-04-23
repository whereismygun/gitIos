/**
 *
 *
 * @flow
 *
 */
'use strict';
import React, {Component} from 'react';
import ReactNative, {
  StyleSheet,
  View,
  ListView,
  Animated,
  Navigator,
  TouchableOpacity,
  InteractionManager,
  DeviceEventEmitter,

  TextInput,
  ScrollView
} from 'react-native';
import {connect} from 'react-redux';

const SceneUtils = require('SceneUtils');
const Filters = require('Filters');
const FlyBottomButton = require('FlyBottomButton');
const Utils = require('Utils');
const FlyLoading = require('FlyLoading');
const CertificationBox = require("CertificationBox");
const NativeModuleUtils = require('NativeModuleUtils');
const FlyEditableScrollView = require('FlyEditableScrollView')
const FlyLabelItem = require('FlyLabelItem')
const FlyColors = require('FlyColors');
const FlyStyles = require('FlyStyles');
const FlyDimensions = require('FlyDimensions');
const FlyHeader = require('FlyHeader');
const FlyImage = require('FlyImage');
const FlyButton = require('FlyButton');
const FlyItem = require('FlyItem');
const {Text} = require('FlyText');
const FlyBase = require('FlyBase')
const FlyTextInput = require('FlyTextInput');
const env = require('env');

const dim  = FlyDimensions.deviceDim;
const agreeH = './imgs/login/agree.png';
const agreeN = './imgs/login/combinedShape.png';
const complete = './imgs/certification/select.png'
const bankImge = './imgs/financing/bindBankCard.png';
const copy = './imgs/certification/copy.png'


class MTAuthentication extends React.Component {
  props : Props;
  constructor(props) {
    super(props);



    this.state={

       agree:true,
       name:null,
       idcard:null,
       bankNo:null,
       phone:null,
       bankCode:null,
    }     
  }


    componentDidMount() {

    let that = this ;

    InteractionManager.runAfterInteractions(() => {
      that.bankName = DeviceEventEmitter.addListener(env.ListenerMap['CHOOSE_BANK_NAME'],(data)=>{
        that.setState({
          bankName:data.bankName,
          bankCode:data.id
          });
      });
    });
  }


  render(){
    let back = {
        type: 'back',
         onPress:()=>{
              SceneUtils.goBack()
            }
        };    return (
        <View style={{flex:1,backgroundColor:FlyColors.baseBackgroundColor}}>
            <FlyHeader borderBottom={true} title={"民泰银行实名认证"} leftItem={back} backgroundColor={FlyColors.white} />
                {this.renderContent()}
              <FlyLoading ref="loading" text='请稍等,信息提交中...'/>
         </View>   
        )
   }


   renderContent(){

       let otherTextStyle,bankName;
        bankName = this.state.bankName ? this.state.bankName : '点击获取开户行';
       if (Utils.isEmpty(this.state.bankName)) {
         otherTextStyle = {color: FlyColors.placeholderTextColor};
       }
       bankImge = <FlyImage source={complete} width={10} /> 
   	return(
             <FlyEditableScrollView>
                <View>
                  <FlyTextInput labelWidth={80}
                     text={'真实姓名:'}
                     textStyle={{fontSize:10}}
                     placeholder={'请输入真实姓名'}
                     placeholderTextColor={FlyColors.placeholderTextColor}
                     height={55}
                     style={{width:dim.width,height:55}}
                     onChangeText={(text) => this.setState({name: text})}/> 
                       <FlyTextInput labelWidth={80}
                     text={'身份证号:'}
                     textStyle={{fontSize:10}}
                     placeholder={'请输入身份证号'}
                     placeholderTextColor={FlyColors.placeholderTextColor}
                     height={55}
                     style={{width:dim.width,height:55}}
                     onChangeText={(text) => this.setState({idcard: text})}/> 

                  <FlyTextInput labelWidth={80}
                     text={'银行卡号:'}
                     textStyle={{fontSize:10}}
                     placeholder={'请输入本人储蓄卡'}
                     placeholderTextColor={FlyColors.placeholderTextColor}
                     height={55}
                     style={{width:dim.width,height:55,marginTop:15}}
                     onChangeText={(text) => this.setState({bankNo: text})}/> 
                  <FlyTextInput labelWidth={80}
                     text={'手机号码:'}
                     textStyle={{fontSize:10}}
                     placeholder={'请输入银行预留手机号'}
                     placeholderTextColor={FlyColors.placeholderTextColor}
                     height={60}
                     style={{width:dim.width,height:60}}
                     showSegment={true}
                     onChangeText={(text) => this.setState({phone: text})}/>
                   <View style={{marginLeft:20,width:dim.width*0.85,height:0.5,backgroundColor:'rgba(216,216,216,1)'}}/>
                    <FlyLabelItem labelWidth={80} text="开户行:" otherTextStyle={otherTextStyle} otherText={bankName}
                           hideArrowIcon={false} showSegment={true} onPress={()=>{this._chooseBank()}}>
                    </FlyLabelItem>    
                 </View> 
                 {this.renderClickBt()}               
          </FlyEditableScrollView>
   		)
   }


    _chooseBank(){
       let bankCode = this.state.bankCode;
       SceneUtils.gotoScene('PROFILE_CHOOSE_BANK_NAME',{bankCode:bankCode});
    }

     renderClickBt(){
     let allow ;
     let agreeImg = this.state.agree == true ? agreeH : agreeN;
      if (this.state.step == 1) {
        allow = (
            <View style={[styles.agree]} >
             <TouchableOpacity onPress={()=>{this.setState({agree:!this.state.agree})}} activeOpacity={1}>
                <FlyImage source={agreeImg} width={15}/>
             </TouchableOpacity>
             <TouchableOpacity style={{flexDirection:"row"}} onPress={()=>{SceneUtils.gotoScene('PERSONAL_MT_AGREEMENT')}}>
                <Text style={styles.agreeTitle}>同意</Text>
                <Text style={[styles.agreeTitle,{color:FlyColors.baseColor}]}>《三方存管协议》</Text>
             </TouchableOpacity>
          </View>
          )
      }
     return(
          <View>
            <View style={{alignItems:'center',marginTop:50}}>
              <FlyButton
                 text='下一步'
                 onPress={this._submit}
                 disabled={!this._checkNext()}
                 type='base'
                 style={styles.btn} />
            </View>
            {allow}
            <View style={{alignItems:'center',marginTop:25,marginLeft:16,marginRight:16}}>
              <FlyImage source={copy} width={dim.width*0.9}/>
            </View>
          </View>
      )
   }

   _checkNext(){
   
     if (!this.state.name) {
     
     	return false;
     }
     if (!Utils.checkID(this.state.idcard)) {

        return false;
     }
     if (!Utils.checkCardNo(this.state.bankNo)) {
        
        return false;
     }

     if (!Utils.checkMobile(this.state.phone)) {
        return false;
     }
     if (!this.state.bankCode) {
     	return false;
     }
     if (!this.state.agree) {
     	return false;
     }
   return true;
  }


}


var styles = StyleSheet.create({
  btn: {
    width: FlyDimensions.deviceDim.width * 0.9,
    height:45
  },

});

function select(store) {
  return {
    
  };
}


module.exports = connect(select)(MTAuthentication);