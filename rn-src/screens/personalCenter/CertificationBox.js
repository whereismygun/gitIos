/**
*
* @providesModule CertificationBox
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
const FlyModalBox = require('FlyModalBox');
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
const closeImg = './imgs/login/close.png';
const bankImge = './imgs/financing/bindBankCard.png';
const certification = './imgs/financing/certification.png'

const bindBank_bt = './imgs/certification/bindBank_bt.png';
const bindBank = './imgs/certification/bindBank.png';
const bindID_bt = './imgs/certification/bindID_bt.png';
const bindID = './imgs/certification/bindID.png';
const ocr = './imgs/certification/ocr.png';
const ocr_bt = './imgs/certification/ocr_bt.png';



type Props = {
  navigator: Navigator;
  isBank:String;
};



class CertificationBox extends React.Component {
  props : Props;

  constructor(props) {
    super(props);
        
  }

  renderBindBank(){

      let params = {
         title:'绑定银行卡',
         step:1
     }

    return(
           <FlyModalBox numberPostion={10} ref={'bindbank'} style={styles.ModuleStyle}>
               <FlyImage source={bindBank} width={dim.width*0.8}/>
               <TouchableOpacity onPress={()=>{
                this.refs.bindbank.close()
                SceneUtils.gotoScene('CERTIFICATION_PROCESS_VIEW',params)}}>
                <FlyImage source={bindBank_bt} width={dim.width*0.45} style={{marginTop:-dim.height*0.03}}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeStyle} onPress={()=>{this.refs.bindbank.close()}}>
                   <FlyImage source={closeImg} width={dim.width*0.02}/>
               </TouchableOpacity>
          </FlyModalBox>      
          )

  }

  renderBindID(){
   
     let params = {
         title:'民泰银行实名认证',
         step:0
     }

    return (
          <FlyModalBox ref={'bindid'} style={styles.ModuleStyle}>
              <FlyImage source={bindID} width={dim.width*0.7}/>
               <TouchableOpacity onPress={()=>{
                this.refs.bindid.close()
                SceneUtils.gotoScene('CERTIFICATION_PROCESS_VIEW',params)}}>
                  <FlyImage source={bindID_bt} width={dim.width*0.4} style={{marginTop:-dim.height*0.03}}/>
               </TouchableOpacity>
               <TouchableOpacity style={styles.closeStyle} onPress={()=>{this.refs.bindid.close()}}>
                 <FlyImage source={closeImg} width={dim.width*0.02}/>
               </TouchableOpacity>
          </FlyModalBox>       
      )

  }

  renderOCR(){

    return (
          <FlyModalBox ref={'bindOCR'} style={styles.ModuleStyle}>
            <FlyImage style={{alignItems:'center'}} source={ocr} height={dim.height*0.45}>
                <TouchableOpacity onPress={()=>{
                  this.refs.bindOCR.close()
                  SceneUtils.gotoScene('PERSONAL_ID_READER')}} style={styles.Certification_bt}>
                   <Text style={{color:'white',fontSize:FlyDimensions.fontSizeXl}}>去认证</Text>
                </TouchableOpacity>
            </FlyImage>
          </FlyModalBox>       
      )


  }

  ModuleOpen(){
    if (this.props.isBank) {
      this.refs.bindbank.open();
    } else if(this.props.isID){
       this.refs.bindid.open();
    }else{
       this.refs.bindOCR.open();     
    }
  }

  render(){
   if (this.props.isBank) {
        return this.renderBindBank()
    } else if (this.props.isID){
      return this.renderBindID()
    } else{
       return this.renderOCR()    
   }

   }
}

var styles = StyleSheet.create({

  ModuleStyle:{
   width:dim.width*0.8,
   height:dim.height*0.4,
   borderRadius:10,
   alignItems:'center',
   backgroundColor:'transparent'
  },
   closeStyle:{
    left:0,
    top:-30,
    position:'absolute',
    padding:8,
    backgroundColor:'white',
    borderRadius:16
   },
   Certification_bt:{
    paddingTop:10,
    paddingBottom:10,
    width:dim.width*0.7,
    alignItems:'center',
    marginTop:dim.height*0.38,
    backgroundColor:FlyColors.baseColor
   }


});

function select(store) {
  return {
    userInfo:store.user.userInfo,
  };
}

module.exports = CertificationBox;
